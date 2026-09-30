import { ReactNode, useState } from "react";
import {
    BlockControls,
    InnerBlocks,
    InspectorControls,
    store as blockEditorStore,
    useBlockProps,
    useInnerBlocksProps,
} from "@wordpress/block-editor";
import { BlockEditProps, registerBlockType } from "@wordpress/blocks";
import { useDispatch, useRegistry, useSelect } from "@wordpress/data";

import metadata from "./block.json";
import {
    PanelBody,
    ToolbarDropdownMenu,
    __experimentalUnitControl as UnitControl,
} from "@wordpress/components";
import {
    tableRowAfter,
    tableRowBefore,
    tableRowDelete,
    table as tableIcon,
} from "@wordpress/icons";
import { __ } from "@wordpress/i18n";
import {
    ColorControl,
    BorderControl,
    BorderRadiusControl,
} from "@tableberg/components";
import blockIcon from "@tableberg/shared/icons/tableberg";
import LockedControl from "../../components/LockedControl";
import { UpsellEnhancedModal } from "../../components/UpsellModal";
import { isProAvailable } from "../../pro-status";
import { ColorControlProps } from "../../hooks";
import { Border, Corners } from "../../attributes";
import { deleteRow, insertRow } from "../table/table-ops";
import { withMoveLock } from "../move-lock";

const EMPTY_BORDER: Border = { top: "", right: "", bottom: "", left: "" };

const EMPTY_CORNERS: Corners = {
    topLeft: "",
    topRight: "",
    bottomRight: "",
    bottomLeft: "",
};

export interface RowBlockAttrs {
    height?: string;
    // Pro-owned: declared in the schema for preservation while pro is inactive.
    // Free never writes it.
    backgroundColor?: string;
    textColor?: string;
    border?: Border;
}

/** Everything pro's row colour controls need. */
export interface RowBackgroundContext {
    rowBackgroundColorControl: ColorControlProps;
    rowTextColorControl: ColorControlProps;
}

/** Where a row sits, for entries that only make sense elsewhere. */
export interface RowGridPosition {
    rowIndex: number;
    rowCount: number;
    /** A merged cell ties rows together, so moves are off the table. */
    hasMergedCells: boolean;
}

/** Toolbar entries pro adds to the row's "Edit row" menu. */
export interface RowToolbarControl {
    icon: unknown;
    title: string;
    /** Left out when it returns false, e.g. "move up" on the first row. */
    isAvailable?: (position: RowGridPosition) => boolean;
    onClick: (context: {
        registry: any;
        tableClientId: string;
        rowIndex: number;
    }) => void;
}

/**
 * The row's own "Edit row" menu: the same dropdown the cell has, with only
 * the entries that act on a row. Rows carry no mover of their own (moving is
 * a pro feature, see the block's lock), so this is where a row is added,
 * removed or moved from.
 */
function RowTableToolbar({
    clientId,
    // Injected by the pro plugin; empty when pro is not installed.
    proToolbarControls = [],
}: {
    clientId: string;
    proToolbarControls?: RowToolbarControl[];
}) {
    const registry = useRegistry() as any;
    const isPro = isProAvailable();
    const [showUpsell, setShowUpsell] = useState<
        "duplicate-row-col" | null
    >(null);

    const position = useSelect(
        select => {
            const be = select(blockEditorStore) as any;
            const tableClientId = be.getBlockRootClientId(clientId);

            if (!tableClientId) {
                return null;
            }

            const rows = (be.getBlock(tableClientId)?.innerBlocks ?? []).filter(
                (b: any) => b.name === "tableberg/row"
            );

            return {
                tableClientId,
                rowIndex: be.getBlockIndex(clientId),
                rowCount: rows.length,
                hasMergedCells: rows.some((rowBlock: any) =>
                    (rowBlock.innerBlocks ?? []).some(
                        (cellBlock: any) =>
                            (cellBlock.attributes?.span?.rowSpan ?? 1) > 1 ||
                            (cellBlock.attributes?.span?.colSpan ?? 1) > 1
                    )
                ),
            };
        },
        [clientId]
    );

    if (!position) {
        return null;
    }

    const { tableClientId, rowIndex } = position;

    const controls = [
        {
            icon: tableRowBefore,
            title: __("Insert row above", "tableberg"),
            onClick: () => insertRow(registry, tableClientId, rowIndex),
        },
        {
            icon: tableRowAfter,
            title: __("Insert row below", "tableberg"),
            onClick: () => insertRow(registry, tableClientId, rowIndex + 1),
        },
        {
            icon: tableRowDelete,
            title: __("Delete row", "tableberg"),
            onClick: () => deleteRow(registry, tableClientId, rowIndex),
        },
        // Duplicating and moving a row are pro features: pro supplies these
        // entries and free only resolves the row's position for them.
        ...proToolbarControls
            .filter(control =>
                control.isAvailable ? control.isAvailable(position) : true
            )
            .map(control => ({
                icon: control.icon as any,
                title: control.title,
                onClick: () =>
                    control.onClick({ registry, tableClientId, rowIndex }),
            })),
        ...(proToolbarControls.length === 0 && !isPro
            ? [
                  {
                      icon: tableRowAfter,
                      title: __("Duplicate row (Pro)", "tableberg"),
                      onClick: () => setShowUpsell("duplicate-row-col"),
                  },
              ]
            : []),
    ];

    return (
        <>
            <BlockControls group="block">
                <ToolbarDropdownMenu
                    icon={tableIcon}
                    label={__("Edit row", "tableberg")}
                    controls={controls}
                />
            </BlockControls>
            {showUpsell && (
                <UpsellEnhancedModal
                    onClose={() => setShowUpsell(null)}
                    selected={showUpsell}
                />
            )}
        </>
    );
}

/** Everything pro's row border and corner controls need. */
export interface RowBorderContext {
    rowBorderControlProps: {
        label: string;
        value: Border;
        hasValue: () => boolean;
        onChange: (newBorder: Border) => void;
        onDeselect: () => void;
    };
    rowRadiusControlProps: {
        label: string;
        value: Corners;
        hasValue: () => boolean;
        onChange: (newRadius: Corners) => void;
        onDeselect: () => void;
    };
}

function RowEdit({
    clientId,
    attributes,
    setAttributes,
    isSelected,
    // Injected by the pro plugin; undefined when pro is not installed. A
    // render function rather than a plain node: claiming priority over a
    // bulk-applied colour (even/odd, etc.) already sitting on this row's
    // cells needs the block registry, which pro's editor.BlockEdit HOC
    // can't reach from outside the tree.
    ProRowBackgroundContent,
    // Injected by the pro plugin; undefined when pro is not installed. A
    // render function like the background one: the row's corners are the
    // corners of its outermost cells, so rounding them needs the block
    // registry, which pro's editor.BlockEdit HOC can't reach from outside
    // the tree.
    ProRowBorderContent,
    // Injected by the pro plugin; empty when pro is not installed.
    rowProToolbarControls,
}: BlockEditProps<RowBlockAttrs> & {
    ProRowBackgroundContent?: (ctx: RowBackgroundContext) => ReactNode;
    ProRowBorderContent?: (ctx: RowBorderContext) => ReactNode;
    rowProToolbarControls?: RowToolbarControl[];
}) {
    const registry = useRegistry() as any;
    const { updateBlockAttributes } = useDispatch(blockEditorStore) as any;

    // The schema keeps pro-owned values while pro is inactive, but the free
    // editor must not preview behavior the frontend is currently gating out.
    const proExtensionActive = Boolean(
        ProRowBackgroundContent || ProRowBorderContent
    );
    const border = proExtensionActive
        ? (attributes.border ?? EMPTY_BORDER)
        : EMPTY_BORDER;
    const blockProps = useBlockProps({
        style: {
            height: attributes.height || undefined,
            backgroundColor: proExtensionActive
                ? attributes.backgroundColor || undefined
                : undefined,
            // Inherited by everything in the row's cells that has no colour
            // of its own, the way the core Column block does it.
            color: proExtensionActive
                ? attributes.textColor || undefined
                : undefined,
            borderTop: border.top || undefined,
            borderRight: border.right || undefined,
            borderBottom: border.bottom || undefined,
            borderLeft: border.left || undefined,
        },
    });
    const innerBlocksProps = useInnerBlocksProps(blockProps, {
        allowedBlocks: ["tableberg/cell"],
        renderAppender: false,
    });

    // A colour already bulk-applied to this row's own cells (even/odd, a
    // column colour, or an older individual choice) would otherwise sit on
    // top of the row's own background and hide it, since each cell paints
    // its own background over the row's. Claiming a colour for the row
    // clears it back off those cells so the row's colour actually shows.
    const clearCellBackgrounds = () => {
        const be = registry.select(blockEditorStore);
        const cellIds: string[] = (be.getBlock(clientId)?.innerBlocks ?? [])
            .filter((b: any) => b.name === "tableberg/cell")
            .map((b: any) => b.clientId);

        registry.batch(() => {
            cellIds.forEach(id => {
                const currentStyles = be.getBlockAttributes(id)?.styles ?? {};
                const { backgroundColor: _legacy, ...styles } = currentStyles;
                updateBlockAttributes(id, {
                    backgroundColor: null,
                    styles,
                });
            });
        });
    };

    const rowBackgroundContext: RowBackgroundContext = {
        rowBackgroundColorControl: {
            label: __("Row Background Color", "tableberg"),
            value: attributes.backgroundColor ?? "",
            onChange: (value: string) => {
                setAttributes({ backgroundColor: value || undefined });
                if (value) {
                    clearCellBackgrounds();
                }
            },
            onDeselect: () => setAttributes({ backgroundColor: undefined }),
        },
        rowTextColorControl: {
            label: __("Row Text Color", "tableberg"),
            value: attributes.textColor ?? "",
            onChange: (value: string) =>
                setAttributes({ textColor: value || undefined }),
            onDeselect: () => setAttributes({ textColor: undefined }),
        },
    };

    // A row has no corners of its own to round: a `border-radius` on a
    // `<tr>` does nothing under border-collapse. What reads as a rounded row
    // is its first cell rounded on the left and its last cell on the right,
    // so the control resolves and writes those cells' own corners.
    const rowCellIds = (): string[] =>
        (registry.select(blockEditorStore).getBlock(clientId)?.innerBlocks ??
            [])
            .filter((b: any) => b.name === "tableberg/cell")
            .map((b: any) => b.clientId);

    const readRowRadius = (): Corners => {
        const be = registry.select(blockEditorStore);
        const ids = rowCellIds();

        if (ids.length === 0) {
            return EMPTY_CORNERS;
        }

        const cornersOf = (id: string): Corners =>
            (be.getBlockAttributes(id)?.styles?.borderRadius ??
                EMPTY_CORNERS) as Corners;
        const first = cornersOf(ids[0]);
        const last = cornersOf(ids[ids.length - 1]);

        return {
            topLeft: first.topLeft ?? "",
            topRight: last.topRight ?? "",
            bottomRight: last.bottomRight ?? "",
            bottomLeft: first.bottomLeft ?? "",
        };
    };

    const applyRowRadius = (newRadius: Corners) => {
        const be = registry.select(blockEditorStore);
        const ids = rowCellIds();
        const total = ids.length;

        registry.batch(() => {
            ids.forEach((id, index) => {
                const styles = be.getBlockAttributes(id)?.styles ?? {};
                const isFirst = index === 0;
                const isLast = index === total - 1;

                updateBlockAttributes(id, {
                    styles: {
                        ...styles,
                        borderRadius: {
                            topLeft: isFirst ? newRadius.topLeft : "",
                            topRight: isLast ? newRadius.topRight : "",
                            bottomRight: isLast ? newRadius.bottomRight : "",
                            bottomLeft: isFirst ? newRadius.bottomLeft : "",
                        },
                    },
                });
            });
        });
    };

    const rowRadius = proExtensionActive ? readRowRadius() : EMPTY_CORNERS;

    const rowBorderContext: RowBorderContext = {
        rowBorderControlProps: {
            label: __("Row Border", "tableberg"),
            value: border,
            hasValue: () =>
                !!border.top || !!border.right || !!border.bottom || !!border.left,
            onChange: (newBorder: Border) =>
                setAttributes({ border: newBorder }),
            onDeselect: () => setAttributes({ border: undefined }),
        },
        rowRadiusControlProps: {
            label: __("Row Border Radius", "tableberg"),
            value: rowRadius,
            hasValue: () =>
                !!rowRadius.topLeft ||
                !!rowRadius.topRight ||
                !!rowRadius.bottomRight ||
                !!rowRadius.bottomLeft,
            onChange: (newRadius: Corners) => applyRowRadius(newRadius),
            onDeselect: () => applyRowRadius(EMPTY_CORNERS),
        },
    };

    return (
        <>
            {isSelected && (
                <>
                    <RowTableToolbar
                        clientId={clientId}
                        proToolbarControls={rowProToolbarControls}
                    />
                    <InspectorControls>
                        <PanelBody title={__("Row Settings", "tableberg")}>
                            <UnitControl
                                label={__("Row Height", "tableberg")}
                                value={attributes.height ?? ""}
                                onChange={(height?: string) =>
                                    setAttributes({
                                        height: height || undefined,
                                    })
                                }
                            />
                        </PanelBody>
                    </InspectorControls>
                    {/*
                     * The colour control renders a ToolsPanel item, so it
                     * only shows up inside a ToolsPanel. The editor's own
                     * "Color" group is one; a plain PanelBody is not.
                     */}
                    <InspectorControls group="color">
                        {ProRowBackgroundContent ? (
                            ProRowBackgroundContent(rowBackgroundContext)
                        ) : (
                            <>
                                <LockedControl isEnhanced selected="row-bg">
                                    <ColorControl
                                        label={__(
                                            "Row Background Color",
                                            "tableberg"
                                        )}
                                        value=""
                                        onChange={() => null}
                                        onDeselect={() => null}
                                    />
                                </LockedControl>
                                <LockedControl isEnhanced selected="row-text">
                                    <ColorControl
                                        label={__(
                                            "Row Text Color",
                                            "tableberg"
                                        )}
                                        value=""
                                        onChange={() => null}
                                        onDeselect={() => null}
                                    />
                                </LockedControl>
                            </>
                        )}
                    </InspectorControls>
                    {/*
                     * BorderControl renders a ToolsPanelItem too, so it
                     * only shows up inside a ToolsPanel. WordPress's own
                     * "Border" group (Styles tab) is one, same as "color".
                     */}
                    <InspectorControls group="border">
                        {ProRowBorderContent ? (
                            ProRowBorderContent(rowBorderContext)
                        ) : (
                            <>
                                <LockedControl isEnhanced selected="row-border">
                                    <BorderControl
                                        label={__("Row Border", "tableberg")}
                                        value={EMPTY_BORDER}
                                        hasValue={() => false}
                                        onChange={() => null}
                                        onDeselect={() => null}
                                    />
                                </LockedControl>
                                <LockedControl
                                    isEnhanced
                                    selected="row-border-radius"
                                >
                                    <BorderRadiusControl
                                        label={__(
                                            "Row Border Radius",
                                            "tableberg"
                                        )}
                                        value={EMPTY_CORNERS}
                                        hasValue={() => false}
                                        onChange={() => null}
                                        onDeselect={() => null}
                                    />
                                </LockedControl>
                            </>
                        )}
                    </InspectorControls>
                </>
            )}
            <tr {...innerBlocksProps} />
        </>
    );
}

export function registerNativeRowBlock() {
    registerBlockType(metadata.name, {
        ...(metadata as any),
        attributes: withMoveLock(metadata.attributes as any),
        icon: blockIcon,
        edit: RowEdit,
        save: () => <InnerBlocks.Content />,
    });
}

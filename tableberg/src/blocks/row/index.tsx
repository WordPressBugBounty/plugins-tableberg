import { ReactNode } from "react";
import {
    InnerBlocks,
    InspectorControls,
    store as blockEditorStore,
    useBlockProps,
    useInnerBlocksProps,
} from "@wordpress/block-editor";
import { BlockEditProps, registerBlockType } from "@wordpress/blocks";
import { useDispatch, useRegistry } from "@wordpress/data";

import metadata from "./block.json";
import {
    PanelBody,
    __experimentalUnitControl as UnitControl,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { ColorControl, BorderControl } from "@tableberg/components";
import blockIcon from "@tableberg/shared/icons/tableberg";
import LockedControl from "../../components/LockedControl";
import { ColorControlProps } from "../../hooks";
import { Border } from "../../attributes";

const EMPTY_BORDER: Border = { top: "", right: "", bottom: "", left: "" };

export interface RowBlockAttrs {
    height?: string;
    // Pro-owned: declared in the schema for preservation while pro is inactive.
    // Free never writes it.
    backgroundColor?: string;
    border?: Border;
}

/** Everything pro's row background colour control needs. */
export interface RowBackgroundContext {
    rowBackgroundColorControl: ColorControlProps;
}

/** Everything pro's row border control needs. */
export interface RowBorderContext {
    rowBorderControlProps: {
        label: string;
        value: Border;
        hasValue: () => boolean;
        onChange: (newBorder: Border) => void;
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
    // plain node (unlike background) — the row's own border only ever
    // competes with adjacent borders through the browser's own
    // border-collapse resolution, so there's no store state to clear.
    ProRowBorderControl,
}: BlockEditProps<RowBlockAttrs> & {
    ProRowBackgroundContent?: (ctx: RowBackgroundContext) => ReactNode;
    ProRowBorderControl?: ReactNode;
}) {
    const registry = useRegistry() as any;
    const { updateBlockAttributes } = useDispatch(blockEditorStore) as any;
    // The schema keeps pro-owned values while pro is inactive, but the free
    // editor must not preview behavior the frontend is currently gating out.
    const proExtensionActive = Boolean(
        ProRowBackgroundContent || ProRowBorderControl
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
    };

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
    };

    return (
        <>
            {isSelected && (
                <>
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
                            <LockedControl isEnhanced selected="row-bg">
                                <ColorControl
                                    label={__("Row Background Color", "tableberg")}
                                    value=""
                                    onChange={() => null}
                                    onDeselect={() => null}
                                />
                            </LockedControl>
                        )}
                    </InspectorControls>
                    {/*
                     * BorderControl renders a ToolsPanelItem too, so it
                     * only shows up inside a ToolsPanel. WordPress's own
                     * "Border" group (Styles tab) is one, same as "color".
                     */}
                    <InspectorControls group="border">
                        {ProRowBorderControl ?? (
                            <LockedControl isEnhanced selected="row-border">
                                <BorderControl
                                    label={__("Row Border", "tableberg")}
                                    value={EMPTY_BORDER}
                                    hasValue={() => false}
                                    onChange={() => null}
                                    onDeselect={() => null}
                                />
                            </LockedControl>
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
        icon: blockIcon,
        edit: RowEdit,
        save: () => <InnerBlocks.Content />,
    });
}

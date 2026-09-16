import { CSSProperties, ReactNode, useState } from "react";
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
import {
    PanelBody,
    SelectControl,
    ToggleControl,
    ToolbarDropdownMenu,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import {
    table as tableIcon,
    tableColumnAfter,
    tableColumnBefore,
    tableColumnDelete,
    tableRowAfter,
    tableRowBefore,
    tableRowDelete,
} from "@wordpress/icons";
import blockIcon from "@tableberg/shared/icons/tableberg";

import metadata from "./block.json";
import {
    ColorControl,
    BorderControl,
    SpacingControlSingle,
} from "@tableberg/components";
import LockedControl from "../../components/LockedControl";
import { UpsellEnhancedModal } from "../../components/UpsellModal";

import { useTableStore } from "../../store";
import { isProAvailable } from "../../pro-status";
import {
    deleteColumn,
    deleteRow,
    getCellContext,
    insertColumn,
    insertRow,
    mergeCells,
    splitCell,
} from "../table/table-ops";
import { cellColumn, GridRow } from "../table/grid-model";
import { CellDimensionsControls } from "./dimensions";
import {
    CellColumnBackgroundControls,
    ColumnBackgroundContext,
} from "./row-column-background";
import {
    CellColumnBorderControls,
    ColumnBorderContext,
} from "./column-border";

import {
    Border,
    CellKey,
    getCellKey,
    RibbonConfig,
    Span,
    TableCellStylesType,
    TableConfig,
} from "../../attributes";

const EMPTY_BORDER: Border = { top: "", right: "", bottom: "", left: "" };

export interface CellBlockAttrs {
    span?: Span;
    styles?: Partial<TableCellStylesType>;
    ribbon?: RibbonConfig;
    className?: string;
}

const ELEMENT_BLOCKS = [
    "tableberg/text",
    "tableberg/button",
    "tableberg/image",
    "tableberg/list",
    "tableberg/styled-list",
    "tableberg/icon",
    "tableberg/star-rating",
    "tableberg/custom-html",
];

/**
 * Whether this cell sits in the header or footer row, derived from the cell's
 * position in the block tree + the table config provided via block context.
 */
function useRowType(
    clientId: string,
    tableConfig: TableConfig | undefined
): "header" | "footer" | "body" {
    return useSelect(
        select => {
            if (!tableConfig?.headerEnabled && !tableConfig?.footerEnabled) {
                return "body";
            }

            const be = select(blockEditorStore) as any;
            const rowClientId = be.getBlockRootClientId(clientId);
            if (!rowClientId) {
                return "body";
            }
            const tableClientId = be.getBlockRootClientId(rowClientId);
            const rowIndex = be.getBlockIndex(rowClientId);
            const rowCount = be.getBlockCount(tableClientId);

            if (tableConfig.headerEnabled && rowIndex === 0) {
                return "header";
            }
            if (tableConfig.footerEnabled && rowIndex === rowCount - 1) {
                return "footer";
            }
            return "body";
        },
        [clientId, tableConfig?.headerEnabled, tableConfig?.footerEnabled]
    );
}

type RowBackgroundStyleKey =
    | "headerBackgroundColor"
    | "footerBackgroundColor"
    | "evenRowBackgroundColor"
    | "oddRowBackgroundColor";

/**
 * Which of the table's row-position background defaults applies to this
 * cell: header/footer rows take their own colour, other rows alternate
 * even/odd by position among the data rows — header/footer don't consume a
 * slot in that count, matching `TableRenderer.php`'s equivalent resolution.
 */
function useRowBackgroundStyleKey(
    clientId: string,
    tableConfig: TableConfig | undefined
): RowBackgroundStyleKey {
    return useSelect(
        select => {
            const be = select(blockEditorStore) as any;
            const rowClientId = be.getBlockRootClientId(clientId);
            if (!rowClientId) {
                return "oddRowBackgroundColor";
            }
            const tableClientId = be.getBlockRootClientId(rowClientId);
            const rowIndex = be.getBlockIndex(rowClientId);
            const rowCount = be.getBlockCount(tableClientId);

            if (tableConfig?.headerEnabled && rowIndex === 0) {
                return "headerBackgroundColor";
            }
            if (tableConfig?.footerEnabled && rowIndex === rowCount - 1) {
                return "footerBackgroundColor";
            }

            const dataRowPosition = tableConfig?.headerEnabled
                ? rowIndex - 1
                : rowIndex;

            return dataRowPosition % 2 === 0
                ? "oddRowBackgroundColor"
                : "evenRowBackgroundColor";
        },
        [clientId, tableConfig?.headerEnabled, tableConfig?.footerEnabled]
    );
}

/** Shape of the entries the pro plugin adds to this menu. */
export interface CellToolbarControl {
    icon: unknown;
    title: string;
    onClick: (context: {
        registry: unknown;
        tableClientId: string;
        rowIndex: number;
        column: number;
    }) => void;
}

function CellTableToolbar({
    clientId,
    hasSpan,
    // Injected by the pro plugin; empty when pro is not installed.
    proToolbarControls = [],
}: {
    clientId: string;
    hasSpan: boolean;
    proToolbarControls?: CellToolbarControl[];
}) {
    const registry = useRegistry() as any;
    const isPro = isProAvailable();
    const [showDuplicateUpsell, setShowDuplicateUpsell] = useState(false);

    // Cells for a merge: the modifier-click marquee (works across rows) or
    // the native sibling multi-select (same-row shift selection).
    const marqueeCellIds = useTableStore(state => state.nativeSelectedCells);
    const setNativeSelectedCells = useTableStore(
        state => state.setNativeSelectedCells
    );
    const nativeMultiSelectIds = useSelect(select => {
        const be = select(blockEditorStore) as any;
        const ids: string[] = be.getMultiSelectedBlockClientIds();
        return ids.filter(
            id => be.getBlockName(id) === "tableberg/cell"
        );
    }, []);
    const selectedCellIds =
        marqueeCellIds.length > 1 ? marqueeCellIds : nativeMultiSelectIds;

    const withContext = (
        fn: (
            ctx: NonNullable<ReturnType<typeof getCellContext>>
        ) => void
    ) => () => {
        const ctx = getCellContext(registry, clientId);
        if (ctx && ctx.column !== null) {
            fn(ctx);
        }
    };

    const controls = [
        {
            icon: tableRowBefore,
            title: __("Insert row above", "tableberg"),
            onClick: withContext(ctx =>
                insertRow(registry, ctx.tableClientId, ctx.rowIndex)
            ),
        },
        {
            icon: tableRowAfter,
            title: __("Insert row below", "tableberg"),
            onClick: withContext(ctx =>
                insertRow(registry, ctx.tableClientId, ctx.rowIndex + 1)
            ),
        },
        {
            icon: tableRowDelete,
            title: __("Delete row", "tableberg"),
            onClick: withContext(ctx =>
                deleteRow(registry, ctx.tableClientId, ctx.rowIndex)
            ),
        },
        {
            icon: tableColumnBefore,
            title: __("Insert column before", "tableberg"),
            onClick: withContext(ctx =>
                insertColumn(registry, ctx.tableClientId, ctx.column!)
            ),
        },
        {
            icon: tableColumnAfter,
            title: __("Insert column after", "tableberg"),
            onClick: withContext(ctx => {
                const cell = ctx.rows
                    .flat()
                    .find(c => c.id === clientId);
                insertColumn(
                    registry,
                    ctx.tableClientId,
                    ctx.column! + (cell?.colSpan ?? 1)
                );
            }),
        },
        {
            icon: tableColumnDelete,
            title: __("Delete column", "tableberg"),
            onClick: withContext(ctx =>
                deleteColumn(registry, ctx.tableClientId, ctx.column!)
            ),
        },
        // Duplicate row/column and the ribbon are pro features: pro supplies
        // these entries and free only resolves the grid position for them.
        // Without pro they are replaced by upsell entries below.
        ...proToolbarControls.map(control => ({
            icon: control.icon as any,
            title: control.title,
            onClick: withContext(ctx =>
                control.onClick({
                    registry,
                    tableClientId: ctx.tableClientId,
                    rowIndex: ctx.rowIndex,
                    column: ctx.column!,
                })
            ),
        })),
        ...(proToolbarControls.length === 0 && !isPro
            ? [
                  {
                      icon: tableRowAfter,
                      title: __("Duplicate row (Pro)", "tableberg"),
                      onClick: () => setShowDuplicateUpsell(true),
                  },
                  {
                      icon: tableColumnAfter,
                      title: __("Duplicate column (Pro)", "tableberg"),
                      onClick: () => setShowDuplicateUpsell(true),
                  },
              ]
            : []),
        ...(selectedCellIds.length > 1
            ? [
                  {
                      icon: tableIcon,
                      title: __("Merge cells", "tableberg"),
                      onClick: withContext(ctx => {
                          const merged = mergeCells(
                              registry,
                              ctx.tableClientId,
                              selectedCellIds
                          );
                          if (merged) {
                              setNativeSelectedCells([]);
                          }
                      }),
                  },
              ]
            : []),
        ...(hasSpan
            ? [
                  {
                      icon: tableIcon,
                      title: __("Split cell", "tableberg"),
                      onClick: withContext(ctx =>
                          splitCell(registry, ctx.tableClientId, clientId)
                      ),
                  },
              ]
            : []),
    ];

    return (
        <>
            <BlockControls group="block">
                <ToolbarDropdownMenu
                    icon={tableIcon}
                    label={__("Edit table", "tableberg")}
                    controls={controls}
                />
            </BlockControls>
            {showDuplicateUpsell && (
                <UpsellEnhancedModal
                    onClose={() => setShowDuplicateUpsell(false)}
                    selected="duplicate-row-col"
                />
            )}
        </>
    );
}

// Per-cell style overrides (the table-wide defaults live on the table
// block's sidebar; these win over them for this one cell).
function CellInspectorControls({
    attributes,
    setAttributes,
    defaultElementGap,
    // Controls injected by the pro plugin; null when pro is not installed.
    CellBackgroundControl = null,
    CellRibbonPanel = null,
    CellBorderControl = null,
    CellEmptyControl = null,
}: Pick<BlockEditProps<CellBlockAttrs>, "attributes" | "setAttributes"> & {
    defaultElementGap?: string;
    CellBackgroundControl?: ReactNode;
    CellRibbonPanel?: ReactNode;
    CellBorderControl?: ReactNode;
    CellEmptyControl?: ReactNode;
}) {
    const styles = attributes.styles ?? {};
    const update = (patch: Partial<TableCellStylesType>) =>
        setAttributes({ styles: { ...styles, ...patch } });

    const ribbon = attributes.ribbon;

    const isPro = isProAvailable();

    const alignmentOptions = [
        { label: __("Default", "tableberg"), value: "" },
        { label: __("Top", "tableberg"), value: "top" },
        { label: __("Middle", "tableberg"), value: "middle" },
        { label: __("Bottom", "tableberg"), value: "bottom" },
    ];

    return (
        <>
            {/*
             * The colour control renders a ToolsPanel item, so it only shows
             * up inside a ToolsPanel. The editor's own "Color" group is one;
             * a plain PanelBody is not, and the control silently renders
             * nothing there.
             */}
            <InspectorControls group="color">
                {/*
                 * A background on one cell is a pro feature: pro hands the
                 * real control down as a prop. Free has no implementation of
                 * its own, so without pro the dead placeholder below is all
                 * there is.
                 */}
                {CellBackgroundControl && CellBackgroundControl}
                {!CellBackgroundControl && !isPro && (
                    <LockedControl isEnhanced selected="cell-bg">
                        <ColorControl
                            label={__("Background Color", "tableberg")}
                            value=""
                            onChange={() => null}
                            onDeselect={() => null}
                        />
                    </LockedControl>
                )}
            </InspectorControls>

            {/*
             * A border on one cell is a pro feature: pro hands the real
             * control down as a prop. Free has no implementation of its
             * own, so without pro the dead placeholder below is all there
             * is. Same "Border" group (Styles tab) the row/column border
             * controls use.
             */}
            <InspectorControls group="border">
                {CellBorderControl && CellBorderControl}
                {!CellBorderControl && !isPro && (
                    <LockedControl isEnhanced selected="cell-border">
                        <BorderControl
                            label={__("Border", "tableberg")}
                            value={EMPTY_BORDER}
                            hasValue={() => false}
                            onChange={() => null}
                            onDeselect={() => null}
                        />
                    </LockedControl>
                )}
            </InspectorControls>

            <InspectorControls>
                <PanelBody title={__("Cell Settings", "tableberg")}>
                <SpacingControlSingle
                    label={__("Block Spacing", "tableberg")}
                    value={
                        styles.elementGap ??
                        defaultElementGap ??
                        "var(--wp--preset--spacing--20)"
                    }
                    onChange={elementGap => update({ elementGap })}
                    style={{ marginBottom: "24px" }}
                />
                {isPro ? (
                    <SelectControl
                        label={__("Vertical Alignment", "tableberg")}
                        value={(styles.verticalAlign as string) ?? ""}
                        options={alignmentOptions}
                        onChange={verticalAlign =>
                            update({
                                verticalAlign: (verticalAlign ||
                                    undefined) as TableCellStylesType["verticalAlign"],
                            })
                        }
                    />
                ) : (
                    <LockedControl isEnhanced selected="cell-bg">
                        <SelectControl
                            label={__("Vertical Alignment", "tableberg")}
                            value=""
                            options={alignmentOptions}
                            onChange={() => null}
                        />
                    </LockedControl>
                )}
                {/*
                 * Emptying a cell (keeping its background/border but
                 * leaving its content out on the frontend only) is a pro
                 * feature: pro hands the toggle down. Free has no
                 * implementation of its own.
                 */}
                {CellEmptyControl}
                {!CellEmptyControl && !isPro && (
                    <LockedControl isEnhanced selected="cell-empty">
                        <ToggleControl
                            checked={false}
                            label={__("Empty Cell", "tableberg")}
                            onChange={() => null}
                        />
                    </LockedControl>
                )}
            </PanelBody>
            {/*
             * The ribbon is a pro feature: pro hands the whole panel down.
             * Free has no ribbon implementation of its own.
             */}
            {CellRibbonPanel}
            {!CellRibbonPanel && !isPro && (
                <PanelBody title={__("Ribbon", "tableberg")}>
                    <LockedControl isEnhanced selected="ribbon">
                        <ToggleControl
                            checked={false}
                            label={__("Enable Ribbon", "tableberg")}
                            onChange={() => null}
                        />
                    </LockedControl>
                </PanelBody>
            )}
            </InspectorControls>
        </>
    );
}

function CellEdit(
    props: BlockEditProps<CellBlockAttrs> & {
        context?: Record<string, unknown>;
        // Injected by the pro plugin's editor.BlockEdit wrapper.
        CellBackgroundControl?: ReactNode;
        CellRibbonPanel?: ReactNode;
        CellRibbonOverlay?: ReactNode;
        CellBorderControl?: ReactNode;
        CellEmptyControl?: ReactNode;
        CellEmptyBadge?: ReactNode;
        cellStyles?: CSSProperties;
        cellProToolbarControls?: CellToolbarControl[];
        ProColumnBackgroundContent?: (
            ctx: ColumnBackgroundContext
        ) => ReactNode;
        ProColumnBorderContent?: (ctx: ColumnBorderContext) => ReactNode;
    }
) {
    const { attributes, clientId, context, isSelected } = props;
    const proExtensionActive = props.cellStyles !== undefined;
    const tableConfig = context?.["tableberg/tableConfig"] as
        | TableConfig
        | undefined;

    // Modifier-click marquee: Cmd/Ctrl+click toggles cells into a cross-row
    // selection for merging; a plain click anywhere clears it.
    const marqueeCellIds = useTableStore(state => state.nativeSelectedCells);
    const setNativeSelectedCells = useTableStore(
        state => state.setNativeSelectedCells
    );
    const { selectBlock } = useDispatch(blockEditorStore) as any;
    const isInMarquee = marqueeCellIds.includes(clientId);

    const onCellMouseDown = (event: React.MouseEvent) => {
        if (event.metaKey || event.ctrlKey || event.shiftKey) {
            // Capture-phase: keep Gutenberg's own modifier multi-select from
            // hijacking the marquee.
            event.preventDefault();
            event.stopPropagation();
            event.nativeEvent.stopImmediatePropagation?.();

            const next = isInMarquee
                ? marqueeCellIds.filter(id => id !== clientId)
                : [...marqueeCellIds, clientId];
            setNativeSelectedCells(next);
            // Keep a cell block selected so the merge toolbar is reachable.
            selectBlock(clientId);
            return;
        }

        if (marqueeCellIds.length > 0) {
            setNativeSelectedCells([]);
        }
    };
    const cellDefaults = context?.["tableberg/cellDefaults"] as
        | { styles: TableCellStylesType }
        | undefined;
    // A pro attribute of the parent row block, read via context since a
    // cell has no direct reference to its row. Only relevant here to know
    // whether to skip the table-wide default below.
    const rowBackgroundColor = proExtensionActive
        ? (context?.["tableberg/rowBackgroundColor"] as string | undefined)
        : undefined;

    const rowType = useRowType(clientId, tableConfig);
    const Tag = rowType === "body" ? "td" : "th";
    const rowBackgroundStyleKey = useRowBackgroundStyleKey(
        clientId,
        tableConfig
    );

    // Minimal cell styling for the editor MVP: defaults cascade + per-cell
    // overrides. Full parity (borders, radius, orientation) lands in Phase 4.
    const defaults = cellDefaults?.styles;
    const styles = attributes.styles;
    const cellStyle: CSSProperties = {
        paddingTop: styles?.padding?.top ?? defaults?.padding?.top,
        paddingRight: styles?.padding?.right ?? defaults?.padding?.right,
        paddingBottom: styles?.padding?.bottom ?? defaults?.padding?.bottom,
        paddingLeft: styles?.padding?.left ?? defaults?.padding?.left,
        // The per-cell background is a pro attribute pro renders through
        // `cellStyles` below; free only knows the table-wide defaults. Skip
        // all of them when the row has its own colour — a cell painting a
        // table default over itself would otherwise always hide the
        // `<tr>`'s. A cell/column colour (below, via `cellStyles`) still
        // wins over either one, applied after this. Header/footer/even/odd
        // take priority over the plain common default when set.
        backgroundColor: rowBackgroundColor
            ? undefined
            : (defaults?.[rowBackgroundStyleKey] ||
              defaults?.backgroundColor ||
              undefined),
        // A cell's own vertical alignment is pro (the frontend only applies it
        // through pro's licensed filter), so without pro show the table default.
        verticalAlign:
            ((isProAvailable() ? styles?.verticalAlign : undefined) as
                | CSSProperties["verticalAlign"]
                | undefined) ??
            (defaults?.verticalAlign as CSSProperties["verticalAlign"]),
        // The per-cell/column border is a pro attribute pro renders through
        // `cellStyles` below; free only knows the table-wide default.
        borderTop: defaults?.border?.top || undefined,
        borderRight: defaults?.border?.right || undefined,
        borderBottom: defaults?.border?.bottom || undefined,
        borderLeft: defaults?.border?.left || undefined,
        // Per-cell radius only; the table-level radius is clipped on the
        // wrapper (border-radius on collapsed cells is ignored by browsers).
        borderTopLeftRadius: styles?.borderRadius?.topLeft,
        borderTopRightRadius: styles?.borderRadius?.topRight,
        borderBottomRightRadius: styles?.borderRadius?.bottomRight,
        borderBottomLeftRadius: styles?.borderRadius?.bottomLeft,
    };

    // Elements layout inside the cell (orientation / gap / wrap), same
    // cascade: per-cell override wins over the table-wide defaults. Applied
    // to an inner wrapper — flex directly on the td would break the table
    // row layout (display: table-cell is lost).
    const orientation =
        styles?.orientation ??
        (proExtensionActive ? defaults?.orientation : undefined);
    const elementGap = styles?.elementGap ?? defaults?.elementGap;
    const wrap =
        styles?.wrap ?? (proExtensionActive ? defaults?.wrap : undefined);
    const contentStyle: CSSProperties = {
        display: "flex",
        flexDirection: orientation === "horizontal" ? "row" : "column",
        gap: elementGap || undefined,
    };
    if (orientation === "horizontal") {
        contentStyle.alignItems = "center";
        contentStyle.flexWrap = wrap === "nowrap" ? "nowrap" : "wrap";
    }

    if (isInMarquee) {
        cellStyle.boxShadow =
            "inset 0 0 0 2px var(--wp-admin-theme-color, #3858e9)";
    }

    Object.assign(cellStyle, props.cellStyles ?? {});

    const blockProps = useBlockProps({ style: cellStyle });
    const innerBlocksProps = useInnerBlocksProps(
        {
            className: "tableberg-cell-content",
            style: contentStyle,
        },
        {
            allowedBlocks: ELEMENT_BLOCKS,
            template: [["tableberg/text", {}]],
        }
    );

    // Sticky first column (pro): the first cell block of each row sticks to
    // the left while the canvas scrolls horizontally.
    const stickyFirstCol =
        proExtensionActive && !!tableConfig?.stickyFirstCol;
    const isFirstColCell = useSelect(
        select => {
            if (!stickyFirstCol) {
                return false;
            }
            const be = select(blockEditorStore) as any;
            return be.getBlockIndex(clientId) === 0;
        },
        [clientId, stickyFirstCol]
    );
    if (isFirstColCell) {
        cellStyle.position = "sticky";
        cellStyle.left = 0;
        cellStyle.zIndex = 1;
        if (!cellStyle.backgroundColor) {
            cellStyle.backgroundColor = "#fff";
        }
    }

    const hasSpan =
        (attributes.span?.rowSpan ?? 1) > 1 ||
        (attributes.span?.colSpan ?? 1) > 1;

    return (
        <>
            {isSelected && (
                <CellTableToolbar
                    clientId={clientId}
                    hasSpan={hasSpan}
                    proToolbarControls={props.cellProToolbarControls}
                />
            )}
            {isSelected && (
                <CellInspectorControls
                    attributes={attributes}
                    setAttributes={props.setAttributes}
                    defaultElementGap={defaults?.elementGap}
                    CellBackgroundControl={props.CellBackgroundControl}
                    CellRibbonPanel={props.CellRibbonPanel}
                    CellBorderControl={props.CellBorderControl}
                    CellEmptyControl={props.CellEmptyControl}
                />
            )}
            {isSelected && <CellDimensionsControls clientId={clientId} />}
            {isSelected && (
                <CellColumnBackgroundControls
                    clientId={clientId}
                    cellDefaultsBackgroundColor={
                        defaults?.backgroundColor ?? ""
                    }
                    ProColumnBackgroundContent={
                        props.ProColumnBackgroundContent
                    }
                />
            )}
            {isSelected && (
                <CellColumnBorderControls
                    clientId={clientId}
                    cellDefaultsBorder={defaults?.border ?? EMPTY_BORDER}
                    ProColumnBorderContent={props.ProColumnBorderContent}
                />
            )}

            <Tag
                {...blockProps}
                rowSpan={attributes.span?.rowSpan}
                colSpan={attributes.span?.colSpan}
                onMouseDownCapture={onCellMouseDown}
                style={(blockProps as { style?: CSSProperties }).style}
            >
                <div {...innerBlocksProps} />
                {props.CellRibbonOverlay}
                {props.CellEmptyBadge}
            </Tag>
        </>
    );
}

export function registerNativeCellBlock() {
    registerBlockType(metadata.name, {
        ...(metadata as any),
        icon: blockIcon,
        edit: CellEdit,
        save: () => <InnerBlocks.Content />,
    });
}

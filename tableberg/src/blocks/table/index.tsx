import { CSSProperties, useEffect, useState } from "react";
import {
    InnerBlocks,
    store as blockEditorStore,
    useBlockProps,
    useInnerBlocksProps,
} from "@wordpress/block-editor";
import {
    BlockConfiguration as BlockConfig,
    BlockEditProps,
    registerBlockType,
} from "@wordpress/blocks";
import {
    dispatch as dataDispatch,
    select as dataSelect,
    useDispatch,
    useSelect,
} from "@wordpress/data";
import { Button, Placeholder, TextControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import blockIcon from "@tableberg/shared/icons/tableberg";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import metadata from "./block.json";
import exampleImage from "../../example.png";
import transforms from "../../transforms";
import TablebergControls from "./controls";
import { TableCaption } from "../../components/TableCaption";
import { SearchInput } from "../../components/SearchInput";
import { PaginationNavigation } from "../../components/PaginationNavigation";
import { getPagedRowIndices } from "../../pagination";
import { PrimaryTable } from "../../preview/table";
import {
    TableStoreProvider,
    useTableStore,
    useTableStoreApi,
} from "../../store";
import {
    attrDefaults,
    TablebergBlockAttrs as BlockAttrs,
} from "../../attributes";
import { blocksToV3Content } from "../../migrate/blocks-to-attrs";
import {
    buildRowBlocksFromV3,
    isV3OrOlder,
    toV4Attrs,
} from "../../migrate/v3-to-v4";
import { buildOccupancy, GridRow } from "./grid-model";

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            gcTime: 24 * 60 * 60 * 1000,
            staleTime: Infinity,
            refetchOnWindowFocus: false,
        },
    },
});

const zeroCssValuePattern = /^0(?:\.0+)?(?:[a-z%]+)?$/i;

function hasNonZeroCssValue(value?: string) {
    const trimmed = value?.trim() || "";
    return !!trimmed && !zeroCssValuePattern.test(trimmed);
}

/**
 * Native-blocks table editor (Phase 2 MVP). The table is a dynamic block;
 * rows/cells/elements are real InnerBlocks. Table-level inspector controls
 * reach parity in Phase 4.
 */

function buildEmptyTableAttrs(rows: number, cols: number): Partial<BlockAttrs> {
    const cells: Record<string, { elements: unknown[] }> = {};
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            cells[`${r},${c}`] = {
                elements: [
                    {
                        name: "text",
                        attributes: {},
                    },
                ],
            };
        }
    }

    return {
        version: 3,
        // Full defaults, like the core/table transform does — controls
        // destructure pagination/search/responsive and crash on a bare table.
        table: {
            ...attrDefaults.table,
            rows,
            cols,
            headerEnabled: false,
            footerEnabled: false,
        },
        cells,
    } as unknown as Partial<BlockAttrs>;
}

function NativeTableCreator({
    onCreate,
}: {
    onCreate: (rows: number, cols: number) => void;
}) {
    const [rows, setRows] = useState("4");
    const [cols, setCols] = useState("4");

    return (
        <Placeholder
            icon={blockIcon}
            label={__("Tableberg Table (native)", "tableberg")}
            instructions={__(
                "Choose the table size to get started.",
                "tableberg"
            )}
        >
            <div
                style={{ display: "flex", gap: "8px", alignItems: "flex-end" }}
            >
                <TextControl
                    label={__("Rows", "tableberg")}
                    type="number"
                    min={1}
                    value={rows}
                    onChange={setRows}
                />
                <TextControl
                    label={__("Columns", "tableberg")}
                    type="number"
                    min={1}
                    value={cols}
                    onChange={setCols}
                />
                <Button
                    variant="primary"
                    onClick={() => {
                        const r = Math.max(1, parseInt(rows, 10) || 0);
                        const c = Math.max(1, parseInt(cols, 10) || 0);
                        onCreate(r, c);
                    }}
                >
                    {__("Create Table", "tableberg")}
                </Button>
            </div>
        </Placeholder>
    );
}

function NativeTableEdit(
    props: BlockEditProps<BlockAttrs> & Record<string, unknown>
) {
    const { attributes, setAttributes, clientId } = props;
    const { replaceInnerBlocks } = useDispatch(blockEditorStore) as any;

    // Anything the pro plugin injected through `editor.BlockEdit` (e.g. a
    // future ProSortingControl) is passed on to the sidebar. Mirrors the
    // element bridge's forwarding for cell elements.
    const proProps = Object.fromEntries(
        Object.entries(props).filter(([key]) => key.startsWith("Pro"))
    );
    const proExtensionActive = Boolean(props.ProStickyHeaderControl);

    const hasRowBlocks = useSelect(
        select => (select(blockEditorStore) as any).getBlockCount(clientId) > 0,
        [clientId]
    );

    const needsConversion =
        isV3OrOlder(attributes) && (attributes.table?.rows ?? 0) > 0;

    // Safety net: any v3 content that reaches the editor unconverted (REST
    // filter missed it, direct paste, the creator below) is materialized into
    // real blocks here. The primary path is the PHP REST migration.
    useEffect(() => {
        if (!needsConversion) {
            return;
        }

        const rowBlocks = buildRowBlocksFromV3(attributes);
        setAttributes(toV4Attrs(attributes) as Partial<BlockAttrs>);
        replaceInnerBlocks(clientId, rowBlocks, false);
    }, [needsConversion]);

    const tableConfig = attributes.table;
    const tableWidth = (tableConfig?.tableWidth || "auto").trim();
    const innerBorderType = proExtensionActive
        ? tableConfig?.innerBorderType || ""
        : "";
    const innerBorderCss = useSelect(
        select => {
            if (innerBorderType !== "row" && innerBorderType !== "col") {
                return "";
            }

            const be = select(blockEditorStore) as any;
            const rows: GridRow[] = (be.getBlock(clientId)?.innerBlocks ?? [])
                .filter((block: any) => block.name === "tableberg/row")
                .map((rowBlock: any) =>
                    rowBlock.innerBlocks
                        .filter((block: any) => block.name === "tableberg/cell")
                        .map((cellBlock: any) => ({
                            id: cellBlock.clientId,
                            rowSpan: cellBlock.attributes?.span?.rowSpan ?? 1,
                            colSpan: cellBlock.attributes?.span?.colSpan ?? 1,
                        }))
                );
            const occupancy = buildOccupancy(rows);
            const excluded: Record<
                "top" | "right" | "bottom" | "left",
                string[]
            > = {
                top: [],
                right: [],
                bottom: [],
                left: [],
            };

            rows.forEach(row => {
                row.forEach(cell => {
                    const position = occupancy.anchors.get(cell.id);
                    if (!position) {
                        return;
                    }
                    const selector = `#block-${cell.id}`;

                    if (innerBorderType === "row") {
                        excluded.left.push(selector);
                        excluded.right.push(selector);
                        if (position.row === 0) {
                            excluded.top.push(selector);
                        }
                        if (position.row + cell.rowSpan >= rows.length) {
                            excluded.bottom.push(selector);
                        }
                    } else {
                        excluded.top.push(selector);
                        excluded.bottom.push(selector);
                        if (position.col === 0) {
                            excluded.left.push(selector);
                        }
                        if (position.col + cell.colSpan >= occupancy.cols) {
                            excluded.right.push(selector);
                        }
                    }
                });
            });

            return (Object.keys(excluded) as Array<keyof typeof excluded>)
                .filter(side => excluded[side].length > 0)
                .map(
                    side =>
                        `${excluded[side].join(",")} { border-${side}: none !important; }`
                )
                .join("\n");
        },
        [clientId, innerBorderType]
    );

    // ----- Preview overlay -----------------------------------------------
    // Sorting/search/responsive previews render through the existing
    // (store-driven) PrimaryTable as a read-only overlay. A snapshot of the
    // block tree is pushed into the store when a preview activates.
    const storeApi = useTableStoreApi();

    // Row/column counts come from the block tree. The store keeps "live"
    // counts over the ones in the attributes (see withLiveCounts), so without
    // this they only refreshed during a preview, and a newly created table
    // kept 0/0: no "Equal width columns" toggle and no column widths.
    const liveCounts = useSelect(
        select => {
            const be = select(blockEditorStore) as any;
            const rows: GridRow[] = (be.getBlock(clientId)?.innerBlocks ?? [])
                .filter((block: any) => block.name === "tableberg/row")
                .map((rowBlock: any) =>
                    rowBlock.innerBlocks
                        .filter((block: any) => block.name === "tableberg/cell")
                        .map((cellBlock: any) => ({
                            id: cellBlock.clientId,
                            rowSpan: cellBlock.attributes?.span?.rowSpan ?? 1,
                            colSpan: cellBlock.attributes?.span?.colSpan ?? 1,
                        }))
                );
            // A string keeps the selector's result stable between renders.
            return `${rows.length},${rows.length ? buildOccupancy(rows).cols : 0}`;
        },
        [clientId]
    );

    useEffect(() => {
        const [rows, cols] = liveCounts.split(",").map(Number);
        const table = storeApi.getState().table;
        if (rows > 0 && (table.rows !== rows || table.cols !== cols)) {
            storeApi.setState({ table: { ...table, rows, cols } });
        }
    }, [liveCounts, storeApi]);

    const sortPreviewMode = useTableStore(state => state.sortPreviewMode);
    const searchTerm = useTableStore(state => state.searchTerm);
    const setSearchTerm = useTableStore(state => state.setSearchTerm);

    // The search config toggle now lives in pro (attributes-only, no store
    // access), so free clears a stale live search term here instead of in
    // setSearchConfig when the pro control disables search mid-preview.
    const searchEnabled =
        proExtensionActive && !!attributes.table?.search?.enabled;
    useEffect(() => {
        if (!searchEnabled && searchTerm) {
            setSearchTerm("");
        }
    }, [searchEnabled]);

    const responsivePreviewDevice = useSelect(select => {
        const rawDeviceType =
            (select("core/editor") as any)?.getDeviceType?.() ||
            (
                select("core/edit-site") as any
            )?.__experimentalGetPreviewDeviceType?.() ||
            (
                select("core/edit-post") as any
            )?.__experimentalGetPreviewDeviceType?.();

        return (rawDeviceType || "Desktop").toLowerCase();
    }, []);
    const hasResponsivePreview =
        responsivePreviewDevice !== "desktop" &&
        !!(
            tableConfig?.responsive as
                | Record<string, { enabled?: boolean }>
                | undefined
        )?.[responsivePreviewDevice]?.enabled;

    const previewActive =
        !needsConversion &&
        (sortPreviewMode || !!searchTerm.trim() || hasResponsivePreview);

    // The overlay may only render AFTER the snapshot landed in the store —
    // rendering PrimaryTable against an empty cells map crashes the block.
    const [previewReady, setPreviewReady] = useState(false);
    useEffect(() => {
        if (!previewActive) {
            setPreviewReady(false);
            return;
        }

        const be = dataSelect(blockEditorStore) as any;
        const rowBlocks = be.getBlock(clientId)?.innerBlocks ?? [];
        const content = blocksToV3Content(rowBlocks);

        storeApi.setState({
            cells: content.cells,
            rows: content.rows,
            table: {
                ...storeApi.getState().table,
                rows: content.rowsCount,
                cols: content.colsCount,
            },
        });
        setPreviewReady(true);
    }, [previewActive, clientId, storeApi]);

    // ----------------------------------------------------------------------

    const blockProps = useBlockProps({
        className: `wp-block-tableberg tableberg-native-editor${
            tableWidth === "wide"
                ? " alignwide"
                : tableWidth === "full"
                  ? " alignfull"
                  : ""
        }${
            proExtensionActive && tableConfig?.stickyHeader
                ? " tableberg-native-sticky-header"
                : ""
        }`,
    });

    const innerBlocksProps = useInnerBlocksProps(
        {},
        {
            allowedBlocks: ["tableberg/row"],
            renderAppender: false,
        }
    );

    // ----- Pagination on the editable canvas ------------------------------
    // The navigation drives store.currentPage; rows outside the current page
    // are hidden with CSS so the blocks stay mounted and editable.
    const currentPage = useTableStore(state => state.currentPage);
    const paginationConfig = tableConfig?.pagination;
    const paginationWanted = proExtensionActive && !!paginationConfig?.enabled;

    const paginationInfo = useSelect(
        select => {
            if (!paginationWanted) {
                return { rowCount: 0, hasRowSpans: false };
            }
            const be = select(blockEditorStore) as any;
            const rowBlocks = be.getBlock(clientId)?.innerBlocks ?? [];
            let hasRowSpans = false;
            for (const rowBlock of rowBlocks) {
                for (const cellBlock of rowBlock.innerBlocks ?? []) {
                    if ((cellBlock.attributes?.span?.rowSpan ?? 1) > 1) {
                        hasRowSpans = true;
                        break;
                    }
                }
                if (hasRowSpans) {
                    break;
                }
            }
            return { rowCount: rowBlocks.length, hasRowSpans };
        },
        [clientId, paginationWanted]
    );

    // Row-spanning cells break row paging — same guard as the frontend.
    const paginationActive = paginationWanted && !paginationInfo.hasRowSpans;

    let paginationCss = "";
    let dataRowCount = 0;
    if (paginationActive) {
        const headerOn = !!tableConfig?.headerEnabled;
        const footerOn = !!tableConfig?.footerEnabled;
        dataRowCount =
            paginationInfo.rowCount - (headerOn ? 1 : 0) - (footerOn ? 1 : 0);

        const visible = new Set(
            getPagedRowIndices(
                paginationInfo.rowCount,
                Math.max(1, paginationConfig?.pageSize ?? 10),
                currentPage,
                headerOn,
                footerOn
            )
        );
        const hidden: number[] = [];
        for (let i = 0; i < paginationInfo.rowCount; i++) {
            if (!visible.has(i)) {
                hidden.push(i);
            }
        }
        paginationCss = hidden
            .map(
                i =>
                    `#block-${clientId} table > tbody > tr:nth-child(${
                        i + 1
                    }) { display: none; }`
            )
            .join("\n");
    }
    // ----------------------------------------------------------------------

    if (!hasRowBlocks && !needsConversion) {
        return (
            <figure {...blockProps}>
                <NativeTableCreator
                    onCreate={(rows, cols) => {
                        const v3 = buildEmptyTableAttrs(rows, cols);
                        const rowBlocks = buildRowBlocksFromV3(v3);
                        setAttributes(toV4Attrs(v3) as Partial<BlockAttrs>);
                        replaceInnerBlocks(clientId, rowBlocks, false);
                    }}
                />
            </figure>
        );
    }

    const horizontalCellSpacing =
        tableConfig?.cellSpacing?.horizontal?.trim() || "0";
    const verticalCellSpacing =
        tableConfig?.cellSpacing?.vertical?.trim() || "0";
    const hasCellSpacing =
        (horizontalCellSpacing !== "0" && horizontalCellSpacing !== "") ||
        (verticalCellSpacing !== "0" && verticalCellSpacing !== "");

    const radius = attributes.cellDefaults?.styles?.borderRadius;
    const hasTableRadius = !!(
        hasNonZeroCssValue(radius?.topLeft) ||
        hasNonZeroCssValue(radius?.topRight) ||
        hasNonZeroCssValue(radius?.bottomRight) ||
        hasNonZeroCssValue(radius?.bottomLeft)
    );
    const outerBorder = {
        top: tableConfig?.tableBorder?.top,
        right: tableConfig?.tableBorder?.right,
        bottom: tableConfig?.tableBorder?.bottom,
        left: tableConfig?.tableBorder?.left,
    };

    const tableStyle: CSSProperties = {
        borderCollapse: hasCellSpacing ? "separate" : "collapse",
        borderSpacing: hasCellSpacing
            ? `${horizontalCellSpacing} ${verticalCellSpacing}`
            : undefined,
        width: "100%",
        borderTop: hasTableRadius
            ? undefined
            : tableConfig?.tableBorder?.top || undefined,
        borderRight: hasTableRadius
            ? undefined
            : tableConfig?.tableBorder?.right || undefined,
        borderBottom: hasTableRadius
            ? undefined
            : tableConfig?.tableBorder?.bottom || undefined,
        borderLeft: hasTableRadius
            ? undefined
            : tableConfig?.tableBorder?.left || undefined,
    };

    // Column widths, mirroring what TableRenderer puts on each cell: equal
    // shares when "Equal width columns" is on, otherwise the per-column
    // widths. Applied through a colgroup rather than per cell so the cells
    // stay free of a table-wide subscription.
    const columnCount = tableConfig?.cols ?? 0;
    const columnWidths: (string | undefined)[] | null =
        columnCount > 0
            ? tableConfig?.fixedColumnWidths
                ? Array.from(
                      { length: columnCount },
                      () => `${100 / columnCount}%`
                  )
                : Array.from(
                      { length: columnCount },
                      (_, index) => attributes.columns?.[index]?.width
                  )
            : null;

    const spacing: CSSProperties = {};
    const margin = tableConfig?.margin;
    const padding = tableConfig?.padding;
    if (margin?.top) spacing.marginTop = margin.top;
    if (margin?.right) spacing.marginRight = margin.right;
    if (margin?.bottom) spacing.marginBottom = margin.bottom;
    if (margin?.left) spacing.marginLeft = margin.left;
    if (padding?.top) spacing.paddingTop = padding.top;
    if (padding?.right) spacing.paddingRight = padding.right;
    if (padding?.bottom) spacing.paddingBottom = padding.bottom;
    if (padding?.left) spacing.paddingLeft = padding.left;

    // The rounded wrapper owns only the explicit table border. Cell borders
    // stay on cells so they do not create a second, unintended outer border.
    const radiusWrapperStyle: CSSProperties | undefined = hasTableRadius
        ? {
              borderTopLeftRadius: radius?.topLeft,
              borderTopRightRadius: radius?.topRight,
              borderBottomRightRadius: radius?.bottomRight,
              borderBottomLeftRadius: radius?.bottomLeft,
              borderTop: outerBorder.top || undefined,
              borderRight: outerBorder.right || undefined,
              borderBottom: outerBorder.bottom || undefined,
              borderLeft: outerBorder.left || undefined,
              boxSizing: "border-box",
              overflow: "hidden",
          }
        : undefined;

    if (previewActive && previewReady) {
        // Read-only preview: PrimaryTable brings the search input, sort
        // banner, pagination navigation and responsive modes with it.
        return (
            <figure
                {...blockProps}
                style={{
                    ...((blockProps as { style?: CSSProperties }).style || {}),
                    ...spacing,
                }}
            >
                <PrimaryTable />
                <TableCaption isSelected={props.isSelected} />
                <TablebergControls {...proProps} />
            </figure>
        );
    }

    return (
        <figure
            {...blockProps}
            style={{
                ...((blockProps as { style?: CSSProperties }).style || {}),
                ...spacing,
            }}
        >
            <SearchInput />
            {paginationActive && paginationCss && (
                <style>{paginationCss}</style>
            )}
            {innerBorderCss && <style>{innerBorderCss}</style>}
            <div style={radiusWrapperStyle}>
                <div className="tableberg-native-table-scroll">
                    <table className="tableberg-table" style={tableStyle}>
                        {columnWidths && (
                            <colgroup>
                                {columnWidths.map((width, index) => (
                                    <col
                                        key={index}
                                        style={width ? { width } : undefined}
                                    />
                                ))}
                            </colgroup>
                        )}
                        <tbody {...innerBlocksProps} />
                    </table>
                </div>
            </div>
            {paginationActive && (
                <PaginationNavigation filteredRowCount={dataRowCount} />
            )}
            <TableCaption isSelected={props.isSelected} />
            <TablebergControls {...proProps} />
        </figure>
    );
}

/**
 * The store powers the (reused) inspector controls sidebar in native mode:
 * it mirrors table-level attrs both ways but never syncs cell/row content
 * (that lives in the block tree).
 */
function NativeTableEditWithProviders(props: BlockEditProps<BlockAttrs>) {
    if (props.attributes.isExample) {
        return (
            <img
                src={exampleImage}
                style={{ maxWidth: "100%" }}
                alt="Tableberg table"
            />
        );
    }

    return (
        <TableStoreProvider
            clientId={props.clientId}
            attributes={props.attributes}
            setAttributes={props.setAttributes}
            contentSyncDisabled
        >
            <QueryClientProvider client={queryClient}>
                <NativeTableEdit {...props} />
            </QueryClientProvider>
        </TableStoreProvider>
    );
}

function nativeSave() {
    return <InnerBlocks.Content />;
}

/**
 * The v3 (faux era) saved markup: a <table> shim wrapping null-saving shim
 * blocks. Matching it here lets any v3 markup that bypasses the PHP REST
 * migration (patterns, reusable blocks, cross-post paste) migrate natively.
 */
const deprecatedV3 = {
    attributes: metadata.attributes,
    supports: metadata.supports,
    isEligible(attrs: Partial<BlockAttrs>) {
        return isV3OrOlder(attrs);
    },
    save() {
        const blockProps = useBlockProps.save();
        const innerBlocksProps = useInnerBlocksProps.save(blockProps);
        return <table {...innerBlocksProps} />;
    },
    migrate(attrs: Partial<BlockAttrs>) {
        return [toV4Attrs(attrs), buildRowBlocksFromV3(attrs)];
    },
};

export function registerNativeTableBlock() {
    registerBlockType(metadata.name, {
        title: metadata.title,
        icon: blockIcon,
        category: metadata.category,
        attributes:
            metadata.attributes as BlockConfig<BlockAttrs>["attributes"],
        providesContext: {
            "tableberg/tableConfig": "table",
            "tableberg/cellDefaults": "cellDefaults",
        } as any,
        transforms,
        edit: NativeTableEditWithProviders,
        save: nativeSave,
        deprecated: [deprecatedV3],
    } as any);
}

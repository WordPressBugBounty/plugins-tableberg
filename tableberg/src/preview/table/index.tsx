import { useMemo, CSSProperties } from "react";
import classNames from "classnames";
import { useSelect } from "@wordpress/data";
import { useTableStore } from "../../store";
import { Cell } from "../cell";
import { SortPreviewBanner } from "../../components/SortPreviewBanner";
import { PaginationNavigation } from "../../components/PaginationNavigation";
import { SearchInput } from "../../components/SearchInput";
import { isProAvailable } from "../../pro-status";
import {
    CellKey,
    ResponsiveBreakpoint,
    Span,
    attrDefaults,
    getCellKey,
} from "../../attributes";
import { sortRowsByColumn } from "../../sorting";
import { filterRowsBySearch } from "../../search";
import { getElementTextContent } from "../../elements";

const tableConfigDefaults = attrDefaults.table;

type PreviewDevice = "desktop" | "tablet" | "mobile";

type ResponsivePreviewStore = {
    getDeviceType?: () => string;
    __experimentalGetPreviewDeviceType?: () => string;
};

type PreviewCellRef = {
    coords: CellKey;
    span: Span;
    key: string;
};

type LegacyResponsiveBreakpoint = Partial<ResponsiveBreakpoint> & {
    direction?: "row" | "col";
    headerAsCol?: boolean;
};

const zeroWidthBorderPattern = /^0(?:\.0+)?(?:[a-z%]+)?$/i;

function hasNonZeroCssValue(value?: string) {
    const trimmed = value?.trim() || "";
    return !!trimmed && !zeroWidthBorderPattern.test(trimmed);
}

function hasVisibleBorder(border: string) {
    const trimmedBorder = border.trim();

    if (!trimmedBorder) {
        return false;
    }

    const [width = "", style = ""] = trimmedBorder.split(/\s+/, 3);

    if (width === "none" || width === "hidden") {
        return false;
    }

    if (zeroWidthBorderPattern.test(width)) {
        return false;
    }

    if (style === "none" || style === "hidden") {
        return false;
    }

    return true;
}

function normalizeResponsiveBreakpoint(
    breakpoint: LegacyResponsiveBreakpoint | null | undefined,
    fallback: ResponsiveBreakpoint
): ResponsiveBreakpoint {
    const normalized = {
        ...fallback,
        ...(breakpoint || {}),
    } as ResponsiveBreakpoint;

    normalized.transpose =
        typeof breakpoint?.transpose === "boolean"
            ? breakpoint.transpose
            : breakpoint?.direction === "row";

    normalized.repeatFirstCol =
        typeof breakpoint?.repeatFirstCol === "boolean"
            ? breakpoint.repeatFirstCol
            : !!breakpoint?.headerAsCol;

    return normalized;
}

function buildResponsivePreviewRows(
    baseRows: PreviewCellRef[][],
    maxItemsPerRow: number,
    transformRowsToCols: boolean,
    repeatFirstColumn: boolean
): PreviewCellRef[][] {
    if (baseRows.length === 0) {
        return [];
    }

    const maxCols = baseRows.reduce((max, row) => Math.max(max, row.length), 0);

    if (maxCols === 0) {
        return [];
    }

    const matrix: Array<Array<PreviewCellRef | null>> = baseRows.map(row => {
        const padded = row.map(cell => cell as PreviewCellRef | null);
        while (padded.length < maxCols) {
            padded.push(null);
        }
        return padded;
    });

    const sourceRows: Array<Array<PreviewCellRef | null>> = transformRowsToCols
        ? Array.from({ length: maxCols }, (_, row) =>
              matrix.map(column => column[row] || null)
          )
        : matrix;

    const sourceCols = sourceRows[0]?.length || 0;
    if (sourceCols === 0) {
        return [];
    }

    const effectiveMax = repeatFirstColumn
        ? Math.max(2, maxItemsPerRow)
        : Math.max(1, maxItemsPerRow);

    const outputRows: PreviewCellRef[][] = [];

    if (!repeatFirstColumn) {
        const groups = Math.ceil(sourceCols / effectiveMax);

        for (let group = 0; group < groups; group++) {
            const start = group * effectiveMax;
            const end = Math.min(start + effectiveMax, sourceCols);

            for (let row = 0; row < sourceRows.length; row++) {
                const cells = sourceRows[row]
                    .slice(start, end)
                    .filter((cell): cell is PreviewCellRef => cell !== null);

                if (cells.length > 0) {
                    outputRows.push(cells);
                }
            }
        }

        return outputRows;
    }

    const firstColumn = 0;
    const dataChunkSize = Math.max(1, effectiveMax - 1);
    const groups =
        sourceCols <= 1 ? 1 : Math.ceil((sourceCols - 1) / dataChunkSize);

    for (let group = 0; group < groups; group++) {
        const start = 1 + group * dataChunkSize;
        const end = Math.min(start + dataChunkSize, sourceCols);

        for (let row = 0; row < sourceRows.length; row++) {
            const firstCell = sourceRows[row][firstColumn];
            const dataCells = sourceRows[row]
                .slice(start, end)
                .filter((cell): cell is PreviewCellRef => cell !== null);

            const rowCells: PreviewCellRef[] = [];

            if (firstCell) {
                if (group === 0) {
                    rowCells.push(firstCell);
                } else {
                    rowCells.push({
                        ...firstCell,
                        key: `${firstCell.key}-repeat-${group}`,
                        span: { rowSpan: 1, colSpan: 1 },
                    });
                }
            }

            rowCells.push(...dataCells);

            if (rowCells.length > 0) {
                outputRows.push(rowCells);
            }
        }
    }

    return outputRows;
}

function getPreviewDeviceType(
    rawDeviceType: string | undefined
): PreviewDevice {
    const normalized = (rawDeviceType || "desktop").toLowerCase();

    if (normalized === "tablet") {
        return "tablet";
    }

    if (normalized === "mobile") {
        return "mobile";
    }

    return "desktop";
}

export const PrimaryTable = () => {
    const isPro = isProAvailable();
    const tableConfig = useTableStore(state => state.table);
    const cells = useTableStore(state => state.cells);
    const columns = useTableStore(state => state.columns);
    const getCellSpan = useTableStore(state => state.getCellSpan);
    const tableBorderRadius = useTableStore(
        state => state.cellDefaults.styles.borderRadius
    );
    const sortPreviewMode = useTableStore(state => state.sortPreviewMode);
    const previewSortColumn = useTableStore(state => state.previewSortColumn);
    const previewSortOrder = useTableStore(state => state.previewSortOrder);

    const currentPage = useTableStore(state => state.currentPage);
    const setCurrentPage = useTableStore(state => state.setCurrentPage);
    const paginationConfig = useTableStore(state => state.table.pagination!);

    const searchTerm = useTableStore(state => state.searchTerm);
    const searchConfig = useTableStore(state => state.table.search);

    const previewDevice = useSelect(select => {
        const editorStore = select("core/editor") as ResponsivePreviewStore;
        const siteEditorStore = select(
            "core/edit-site"
        ) as ResponsivePreviewStore;
        const postEditorStore = select(
            "core/edit-post"
        ) as ResponsivePreviewStore;

        const rawDeviceType =
            editorStore?.getDeviceType?.() ||
            siteEditorStore?.__experimentalGetPreviewDeviceType?.() ||
            postEditorStore?.__experimentalGetPreviewDeviceType?.();

        return getPreviewDeviceType(rawDeviceType);
    }, []);

    const { rows: totalRows, cols: totalCols } = tableConfig;
    const paginationEnabled = isPro && paginationConfig.enabled;
    const searchEnabled = isPro && (searchConfig?.enabled || false);
    const tableAlignment = tableConfig.tableAlignment || "left";
    const tableWidthValue = (tableConfig.tableWidth || "auto").trim();
    const customTableWidthAllowed =
        tableWidthValue !== "auto" &&
        tableWidthValue !== "wide" &&
        tableWidthValue !== "full";
    const tableWidth = customTableWidthAllowed ? tableWidthValue : "100%";
    const wrapperAlignmentClass = customTableWidthAllowed
        ? `justify-table-${tableAlignment}`
        : "";
    const defaultCellSpacing = tableConfigDefaults.cellSpacing!!;
    const cellSpacing = tableConfig.cellSpacing || defaultCellSpacing;
    const defaultTableBorder = tableConfigDefaults.tableBorder!!;
    const tableBorder = tableConfig.tableBorder || defaultTableBorder;
    const hasTableBorderTop = hasVisibleBorder(tableBorder.top);
    const hasTableBorderRight = hasVisibleBorder(tableBorder.right);
    const hasTableBorderBottom = hasVisibleBorder(tableBorder.bottom);
    const hasTableBorderLeft = hasVisibleBorder(tableBorder.left);
    const horizontalCellSpacing =
        cellSpacing.horizontal || defaultCellSpacing.horizontal;
    const verticalCellSpacing =
        cellSpacing.vertical || defaultCellSpacing.vertical;
    const isHorizontalSpacingZero = horizontalCellSpacing === "0";
    const isVerticalSpacingZero = verticalCellSpacing === "0";
    const hasCellSpacing = !isHorizontalSpacingZero || !isVerticalSpacingZero;
    const tableClassName = [
        "wp-block-tableberg",
        hasTableBorderTop ? "tableberg-has-table-border-top" : "",
        hasTableBorderRight ? "tableberg-has-table-border-right" : "",
        hasTableBorderBottom ? "tableberg-has-table-border-bottom" : "",
        hasTableBorderLeft ? "tableberg-has-table-border-left" : "",
        hasCellSpacing ? "tableberg-has-cell-spacing" : "",
        hasCellSpacing && isHorizontalSpacingZero
            ? "tableberg-cell-spacing-horizontal-zero"
            : "",
        hasCellSpacing && isVerticalSpacingZero
            ? "tableberg-cell-spacing-vertical-zero"
            : "",
    ]
        .filter(Boolean)
        .join(" ");

    const activeResponsiveBreakpoint: ResponsiveBreakpoint | null =
        previewDevice === "desktop"
            ? null
            : normalizeResponsiveBreakpoint(
                  tableConfig.responsive?.[
                      previewDevice
                  ] as LegacyResponsiveBreakpoint,
                  tableConfigDefaults.responsive![previewDevice]
              );

    const hasResponsivePreview =
        !!activeResponsiveBreakpoint?.enabled &&
        !!activeResponsiveBreakpoint?.mode;

    const responsivePreviewClassName = !hasResponsivePreview
        ? ""
        : activeResponsiveBreakpoint?.mode === "scroll"
          ? "tableberg-scroll-x"
          : "";

    const editorResponsiveStackCount = hasResponsivePreview
        ? Math.max(1, activeResponsiveBreakpoint?.stackCount || 1)
        : 1;

    const wrapperClassName = classNames(
        "tableberg-table-wrapper",
        wrapperAlignmentClass,
        responsivePreviewClassName
    );

    const filteredRowIndices = useMemo(() => {
        if (!searchEnabled || !searchTerm.trim()) {
            return Array.from({ length: totalRows }, (_, i) => i);
        }

        return filterRowsBySearch(
            cells,
            totalRows,
            totalCols,
            tableConfig,
            searchTerm
        );
    }, [searchEnabled, searchTerm, cells, totalRows, totalCols, tableConfig]);

    const sortedRowIndices = useMemo(() => {
        if (!isPro || !sortPreviewMode || previewSortColumn === null) {
            return filteredRowIndices;
        }

        const sortType = columns[previewSortColumn]?.sortable || "text";

        if (searchEnabled && searchTerm.trim()) {
            const { headerEnabled, footerEnabled } = tableConfig;
            const headerRow = headerEnabled ? 0 : -1;
            const footerRow = footerEnabled ? totalRows - 1 : -1;

            const dataRows = filteredRowIndices.filter(
                idx => idx !== headerRow && idx !== footerRow
            );

            const rowsWithValues = dataRows.map(rowIdx => {
                const elements =
                    cells[`${rowIdx},${previewSortColumn}`]?.elements || [];
                const rawValue =
                    elements.length > 0
                        ? getElementTextContent(elements[0])
                        : "";

                let parsedValue: string | number | Date;
                switch (sortType) {
                    case "number": {
                        const cleaned = rawValue.replace(/[^0-9.-]/g, "");
                        const num = parseFloat(cleaned);
                        parsedValue = isNaN(num) ? 0 : num;
                        break;
                    }
                    case "date": {
                        const date = new Date(rawValue);
                        parsedValue = isNaN(date.getTime())
                            ? new Date(0)
                            : date;
                        break;
                    }
                    case "text":
                    default:
                        parsedValue = rawValue.toLowerCase();
                }

                return { index: rowIdx, value: parsedValue };
            });

            rowsWithValues.sort(({ value: a }, { value: b }) => {
                let result: number;
                if (typeof a === "number" && typeof b === "number") {
                    result = a - b;
                } else if (a instanceof Date && b instanceof Date) {
                    result = a.getTime() - b.getTime();
                } else {
                    result = String(a).localeCompare(String(b));
                }
                return previewSortOrder === "asc" ? result : -result;
            });

            const result: number[] = [];
            if (headerEnabled && filteredRowIndices.includes(0)) {
                result.push(0);
            }
            for (const { index } of rowsWithValues) {
                result.push(index);
            }
            if (footerEnabled && filteredRowIndices.includes(totalRows - 1)) {
                result.push(totalRows - 1);
            }

            return result;
        }

        return sortRowsByColumn(
            cells,
            totalRows,
            tableConfig,
            previewSortColumn,
            sortType,
            previewSortOrder
        );
    }, [
        sortPreviewMode,
        previewSortColumn,
        previewSortOrder,
        filteredRowIndices,
        cells,
        columns,
        tableConfig,
        totalRows,
        searchEnabled,
        searchTerm,
        isPro,
    ]);

    const rowOrder = useMemo(() => {
        let rows = sortedRowIndices;

        if (paginationEnabled) {
            const { headerEnabled, footerEnabled } = tableConfig;

            const headerRow = headerEnabled ? 0 : -1;
            const footerRow = footerEnabled ? totalRows - 1 : -1;

            const dataRowsInOrder = rows.filter(
                idx => idx !== headerRow && idx !== footerRow
            );

            const { pageSize } = paginationConfig;
            const startIdx = currentPage * pageSize;
            const endIdx = Math.min(
                startIdx + pageSize,
                dataRowsInOrder.length
            );

            const maxPage = Math.max(
                0,
                Math.ceil(dataRowsInOrder.length / pageSize) - 1
            );
            if (currentPage > maxPage && maxPage >= 0) {
                setCurrentPage(maxPage);
            }

            const pagedRows: number[] = [];

            if (headerEnabled && rows.includes(0)) {
                pagedRows.push(0);
            }

            for (let i = startIdx; i < endIdx; i++) {
                pagedRows.push(dataRowsInOrder[i]);
            }

            if (footerEnabled && rows.includes(totalRows - 1)) {
                pagedRows.push(totalRows - 1);
            }

            rows = pagedRows;
        }

        return rows;
    }, [
        sortedRowIndices,
        paginationEnabled,
        currentPage,
        paginationConfig.pageSize,
        tableConfig,
        totalRows,
        setCurrentPage,
    ]);

    const getOccupiedCellsForRow = (actualRow: number) => {
        if (sortPreviewMode || paginationEnabled) {
            return new Set<number>();
        }

        const occupied = new Set<number>();
        for (const [key, cell] of Object.entries(cells)) {
            const span = cell.span;
            if (!span) {
                continue;
            }

            const [cellRow, cellCol] = key.split(",").map(Number);
            if (cellRow <= actualRow && cellRow + span.rowSpan > actualRow) {
                for (let cs = 0; cs < span.colSpan; cs++) {
                    if (cellRow !== actualRow) {
                        occupied.add(cellCol + cs);
                    }
                }
            }
        }
        return occupied;
    };

    const tableRows: JSX.Element[] = [];
    const baseRowsForResponsivePreview: PreviewCellRef[][] = [];
    for (const actualRow of rowOrder) {
        const rowCells: JSX.Element[] = [];
        const rowCellsForPreview: PreviewCellRef[] = [];
        const occupiedCols = getOccupiedCellsForRow(actualRow);

        for (let col = 0; col < totalCols; col++) {
            if (occupiedCols.has(col)) {
                continue;
            }

            const cellKey = `${actualRow},${col}`;
            const span = getCellSpan(cellKey as CellKey);

            if (!sortPreviewMode && !paginationEnabled) {
                for (let cs = 1; cs < span.colSpan; cs++) {
                    occupiedCols.add(col + cs);
                }
            }

            rowCellsForPreview.push({
                coords: getCellKey(actualRow, col),
                span,
                key: cellKey,
            });

            rowCells.push(
                <Cell
                    key={cellKey}
                    span={span}
                    cellCoords={cellKey as CellKey}
                />
            );
        }

        baseRowsForResponsivePreview.push(rowCellsForPreview);
        tableRows.push(<tr key={actualRow}>{rowCells}</tr>);
    }

    let renderedRows = tableRows;

    if (hasResponsivePreview && activeResponsiveBreakpoint?.mode === "stack") {
        const previewRows = buildResponsivePreviewRows(
            baseRowsForResponsivePreview,
            editorResponsiveStackCount,
            activeResponsiveBreakpoint.transpose,
            activeResponsiveBreakpoint.repeatFirstCol
        );

        renderedRows = previewRows.map((previewRow, rowIndex) => (
            <tr key={`responsive-preview-row-${rowIndex}`}>
                {previewRow.map((cell, cellIndex) => (
                    <Cell
                        key={`${cell.key}-${rowIndex}-${cellIndex}`}
                        span={{ rowSpan: 1, colSpan: 1 }}
                        cellCoords={cell.coords}
                    />
                ))}
            </tr>
        ));
    }

    // The rounded wrapper owns only the explicit table border. Cell borders
    // stay on cells so they do not create a second, unintended outer border.
    const hasTableRadius = !!(
        hasNonZeroCssValue(tableBorderRadius?.topLeft) ||
        hasNonZeroCssValue(tableBorderRadius?.topRight) ||
        hasNonZeroCssValue(tableBorderRadius?.bottomRight) ||
        hasNonZeroCssValue(tableBorderRadius?.bottomLeft)
    );
    const tableRadiusWrapperStyle: CSSProperties | undefined = hasTableRadius
        ? {
              borderTopLeftRadius: tableBorderRadius?.topLeft,
              borderTopRightRadius: tableBorderRadius?.topRight,
              borderBottomRightRadius: tableBorderRadius?.bottomRight,
              borderBottomLeftRadius: tableBorderRadius?.bottomLeft,
              borderTop: tableBorder.top || undefined,
              borderRight: tableBorder.right || undefined,
              borderBottom: tableBorder.bottom || undefined,
              borderLeft: tableBorder.left || undefined,
              boxSizing: "border-box",
              overflow: "hidden",
          }
        : undefined;

    return (
        <div className={wrapperClassName} style={tableRadiusWrapperStyle}>
            <SearchInput />
            <SortPreviewBanner />
            <table
                className={tableClassName}
                data-tableberg-editor-preview={
                    hasResponsivePreview ? previewDevice : undefined
                }
                style={{
                    borderCollapse: hasCellSpacing ? "separate" : "collapse",
                    borderSpacing: hasCellSpacing
                        ? `${horizontalCellSpacing} ${verticalCellSpacing}`
                        : undefined,
                    width: tableWidth,
                    ...(customTableWidthAllowed
                        ? {
                              maxWidth: tableWidth,
                          }
                        : {}),
                    borderTop: hasTableRadius
                        ? undefined
                        : tableBorder.top || undefined,
                    borderRight: hasTableRadius
                        ? undefined
                        : tableBorder.right || undefined,
                    borderBottom: hasTableRadius
                        ? undefined
                        : tableBorder.bottom || undefined,
                    borderLeft: hasTableRadius
                        ? undefined
                        : tableBorder.left || undefined,
                }}
            >
                <tbody>{renderedRows}</tbody>
            </table>
            <PaginationNavigation filteredRowCount={sortedRowIndices.length} />
        </div>
    );
};

import {
    Cell,
    CellElement,
    CellKey,
    ColumnConfigs,
    getCellKey,
    SortableType,
    TableConfig,
} from "./attributes";
import { getElementTextContent } from "./elements";

export type SortOrder = "asc" | "desc";

function getCellElements(
    cells: Record<CellKey, Cell>,
    row: number,
    col: number
): CellElement[] {
    return cells[getCellKey(row, col)]?.elements || [];
}

export function tableHasMergedCells(cells: Record<CellKey, Cell>): boolean {
    return Object.values(cells).some(cell => {
        const rowSpan = cell.span?.rowSpan || 1;
        const colSpan = cell.span?.colSpan || 1;
        return rowSpan > 1 || colSpan > 1;
    });
}

export function columnHasMultipleElements(
    column: number,
    cells: Record<CellKey, Cell>
): boolean {
    return Object.entries(cells).some(([key, cell]) => {
        const [, col] = key.split(",").map(Number);
        return col === column && (cell.elements?.length || 0) > 1;
    });
}

export function isColumnSortable(
    column: number,
    cells: Record<CellKey, Cell>
): boolean {
    if (tableHasMergedCells(cells)) {
        return false;
    }

    if (columnHasMultipleElements(column, cells)) {
        return false;
    }

    return true;
}

export function sortRowsByColumn(
    cells: Record<CellKey, Cell>,
    totalRows: number,
    table: TableConfig,
    column: number,
    sortType: SortableType,
    order: SortOrder
): number[] {
    const { headerEnabled, footerEnabled } = table;

    const headerRow = headerEnabled ? 0 : -1;
    const footerRow = footerEnabled ? totalRows - 1 : -1;

    const sortableRows: Array<{
        index: number;
        value: string | number | Date;
    }> = [];

    for (let row = 0; row < totalRows; row++) {
        if (row === headerRow || row === footerRow) {
            continue;
        }

        const cellElements = getCellElements(cells, row, column);

        let rawValue = "";
        if (cellElements.length > 0) {
            rawValue = getElementTextContent(cellElements[0]);
        }

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
                parsedValue = isNaN(date.getTime()) ? new Date(0) : date;
                break;
            }
            case "text":
            default:
                parsedValue = rawValue.toLowerCase();
        }

        sortableRows.push({ index: row, value: parsedValue });
    }

    sortableRows.sort(({ value: a }, { value: b }) => {
        let result: number;

        if (typeof a === "number" && typeof b === "number") {
            result = a - b;
        } else if (a instanceof Date && b instanceof Date) {
            result = a.getTime() - b.getTime();
        } else {
            result = String(a).localeCompare(String(b));
        }

        return order === "asc" ? result : -result;
    });

    const result: number[] = [];

    if (headerEnabled) {
        result.push(0);
    }

    for (const { index } of sortableRows) {
        result.push(index);
    }

    if (footerEnabled) {
        result.push(totalRows - 1);
    }

    return result;
}

export function hasSortableColumns(columns: ColumnConfigs): boolean {
    return columns.some(config => !!config?.sortable);
}

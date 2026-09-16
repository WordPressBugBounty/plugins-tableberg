import {
    Cell,
    CellElement,
    CellKey,
    ColumnConfigs,
    getCellKey,
    parseCellKey,
    RowConfigs,
    Span,
    TableConfig,
} from "./attributes";

type Coord = [number, number];

interface TableUpdateResult {
    table: TableConfig;
    rows: RowConfigs;
    columns: ColumnConfigs;
    cells: Record<CellKey, Cell>;
}

function cloneValue<T>(value: T): T {
    return JSON.parse(JSON.stringify(value)) as T;
}

function getSpan(cell?: Cell): Span {
    return cell?.span || { rowSpan: 1, colSpan: 1 };
}

function getSpanMap(cells: Record<CellKey, Cell>): Map<string, Span> {
    const map = new Map<string, Span>();

    Object.entries(cells).forEach(([key, cell]) => {
        map.set(key, getSpan(cell));
    });

    return map;
}

function shiftRecordForInsert<T>(
    record: Array<T | null | undefined>,
    fromIndex: number
): Array<T | null | undefined> {
    const next: Array<T | null | undefined> = [];

    Object.entries(record).forEach(([key, value]) => {
        if (value === null || value === undefined) {
            return;
        }

        const index = Number(key);
        const nextIndex = index >= fromIndex ? index + 1 : index;
        next[nextIndex] = value;
    });

    return next;
}

function shiftRecordForDelete<T>(
    record: Array<T | null | undefined>,
    removedIndex: number
): Array<T | null | undefined> {
    const next: Array<T | null | undefined> = [];

    Object.entries(record).forEach(([key, value]) => {
        if (value === null || value === undefined) {
            return;
        }

        const index = Number(key);

        if (index === removedIndex) {
            return;
        }

        const nextIndex = index > removedIndex ? index - 1 : index;
        next[nextIndex] = value;
    });

    return next;
}

function remapRecord<T>(
    record: Array<T | null | undefined>,
    mapIndex: (index: number) => number
): Array<T | null | undefined> {
    const next: Array<T | null | undefined> = [];

    Object.entries(record).forEach(([key, value]) => {
        if (value === null || value === undefined) {
            return;
        }

        const index = Number(key);
        next[mapIndex(index)] = value;
    });

    return next;
}

function normalizeInsertRowIndex(table: TableConfig, rowIndex: number): number {
    if (rowIndex <= 0) {
        return 0;
    }

    if (rowIndex >= table.rows) {
        return table.rows;
    }

    return rowIndex;
}

function normalizeInsertColumnIndex(
    table: TableConfig,
    colIndex: number
): number {
    if (colIndex <= 0) {
        return 0;
    }

    if (colIndex >= table.cols) {
        return table.cols;
    }

    return colIndex;
}

function normalizeDeleteRowIndex(table: TableConfig, rowIndex: number): number {
    if (rowIndex <= 0) {
        return 0;
    }

    if (rowIndex >= table.rows - 1) {
        return table.rows - 1;
    }

    return rowIndex;
}

function normalizeDeleteColumnIndex(
    table: TableConfig,
    colIndex: number
): number {
    if (colIndex <= 0) {
        return 0;
    }

    if (colIndex >= table.cols - 1) {
        return table.cols - 1;
    }

    return colIndex;
}

export function hasMergedCells(cells: Record<CellKey, Cell>): boolean {
    return Object.values(cells).some(cell => {
        const span = getSpan(cell);
        return span.rowSpan > 1 || span.colSpan > 1;
    });
}

export function insertRowAt(
    table: TableConfig,
    rows: RowConfigs,
    columns: ColumnConfigs,
    cells: Record<CellKey, Cell>,
    rowIndex: number,
    defaultElement?: CellElement
): TableUpdateResult {
    const insertAt = normalizeInsertRowIndex(table, rowIndex);
    const skippedColumns = new Set<number>();
    const nextCells: Record<CellKey, Cell> = {};

    Object.entries(cells).forEach(([key, cell]) => {
        const [row, col] = parseCellKey(key);
        const span = getSpan(cell);
        const nextCell = cloneValue(cell);

        if (row < insertAt && row + span.rowSpan > insertAt) {
            nextCell.span = {
                rowSpan: span.rowSpan + 1,
                colSpan: span.colSpan,
            };

            for (let c = col; c < col + span.colSpan; c++) {
                skippedColumns.add(c);
            }

            nextCells[getCellKey(row, col)] = nextCell;
            return;
        }

        if (row >= insertAt) {
            nextCells[getCellKey(row + 1, col)] = nextCell;
            return;
        }

        nextCells[getCellKey(row, col)] = nextCell;
    });

    for (let col = 0; col < table.cols; col++) {
        if (!skippedColumns.has(col)) {
            const key = getCellKey(insertAt, col);
            nextCells[key] = defaultElement
                ? { elements: [cloneValue(defaultElement)] }
                : {};
        }
    }

    return {
        table: {
            ...table,
            rows: table.rows + 1,
        },
        rows: shiftRecordForInsert(rows, insertAt),
        columns: columns.slice(),
        cells: nextCells,
    };
}

export function insertColumnAt(
    table: TableConfig,
    rows: RowConfigs,
    columns: ColumnConfigs,
    cells: Record<CellKey, Cell>,
    colIndex: number,
    defaultElement?: CellElement
): TableUpdateResult {
    const insertAt = normalizeInsertColumnIndex(table, colIndex);
    const skippedRows = new Set<number>();
    const nextCells: Record<CellKey, Cell> = {};

    Object.entries(cells).forEach(([key, cell]) => {
        const [row, col] = parseCellKey(key);
        const span = getSpan(cell);
        const nextCell = cloneValue(cell);

        if (col < insertAt && col + span.colSpan > insertAt) {
            nextCell.span = {
                rowSpan: span.rowSpan,
                colSpan: span.colSpan + 1,
            };

            for (let r = row; r < row + span.rowSpan; r++) {
                skippedRows.add(r);
            }

            nextCells[getCellKey(row, col)] = nextCell;
            return;
        }

        if (col >= insertAt) {
            nextCells[getCellKey(row, col + 1)] = nextCell;
            return;
        }

        nextCells[getCellKey(row, col)] = nextCell;
    });

    for (let row = 0; row < table.rows; row++) {
        if (!skippedRows.has(row)) {
            const key = getCellKey(row, insertAt);
            nextCells[key] = defaultElement
                ? { elements: [cloneValue(defaultElement)] }
                : {};
        }
    }

    return {
        table: {
            ...table,
            cols: table.cols + 1,
        },
        rows: rows.slice(),
        columns: shiftRecordForInsert(columns, insertAt),
        cells: nextCells,
    };
}

export function deleteRowAt(
    table: TableConfig,
    rows: RowConfigs,
    columns: ColumnConfigs,
    cells: Record<CellKey, Cell>,
    rowIndex: number
): TableUpdateResult {
    const deleteAt = normalizeDeleteRowIndex(table, rowIndex);
    const spanMap = getSpanMap(cells);
    const nextCells: Record<CellKey, Cell> = {};

    Object.entries(cells).forEach(([key, cell]) => {
        const [row, col] = parseCellKey(key);
        const span = spanMap.get(key) || { rowSpan: 1, colSpan: 1 };
        const nextCell = cloneValue(cell);

        if (row === deleteAt) {
            if (span.rowSpan > 1) {
                nextCell.span = {
                    rowSpan: span.rowSpan - 1,
                    colSpan: span.colSpan,
                };
                nextCells[getCellKey(row, col)] = nextCell;
            }
            return;
        }

        if (row > deleteAt) {
            nextCells[getCellKey(row - 1, col)] = nextCell;
            return;
        }

        if (row < deleteAt && row + span.rowSpan > deleteAt) {
            nextCell.span = {
                rowSpan: span.rowSpan - 1,
                colSpan: span.colSpan,
            };
            nextCells[getCellKey(row, col)] = nextCell;
            return;
        }

        nextCells[getCellKey(row, col)] = nextCell;
    });

    return {
        table: {
            ...table,
            rows: table.rows - 1,
        },
        rows: shiftRecordForDelete(rows, deleteAt),
        columns: columns.slice(),
        cells: nextCells,
    };
}

export function deleteColumnAt(
    table: TableConfig,
    rows: RowConfigs,
    columns: ColumnConfigs,
    cells: Record<CellKey, Cell>,
    colIndex: number
): TableUpdateResult {
    const deleteAt = normalizeDeleteColumnIndex(table, colIndex);
    const spanMap = getSpanMap(cells);
    const nextCells: Record<CellKey, Cell> = {};

    Object.entries(cells).forEach(([key, cell]) => {
        const [row, col] = parseCellKey(key);
        const span = spanMap.get(key) || { rowSpan: 1, colSpan: 1 };
        const nextCell = cloneValue(cell);

        if (col === deleteAt) {
            if (span.colSpan > 1) {
                nextCell.span = {
                    rowSpan: span.rowSpan,
                    colSpan: span.colSpan - 1,
                };
                nextCells[getCellKey(row, col)] = nextCell;
            }
            return;
        }

        if (col > deleteAt) {
            nextCells[getCellKey(row, col - 1)] = nextCell;
            return;
        }

        if (col < deleteAt && col + span.colSpan > deleteAt) {
            nextCell.span = {
                rowSpan: span.rowSpan,
                colSpan: span.colSpan - 1,
            };
            nextCells[getCellKey(row, col)] = nextCell;
            return;
        }

        nextCells[getCellKey(row, col)] = nextCell;
    });

    return {
        table: {
            ...table,
            cols: table.cols - 1,
        },
        rows: rows.slice(),
        columns: shiftRecordForDelete(columns, deleteAt),
        cells: nextCells,
    };
}

export function duplicateRowAt(
    table: TableConfig,
    rows: RowConfigs,
    columns: ColumnConfigs,
    cells: Record<CellKey, Cell>,
    rowIndex: number
): TableUpdateResult {
    const sourceRow = normalizeDeleteRowIndex(table, rowIndex);
    const inserted = insertRowAt(table, rows, columns, cells, sourceRow + 1);
    const targetRow = sourceRow + 1;
    const nextCells = { ...inserted.cells };

    for (let col = 0; col < inserted.table.cols; col++) {
        const sourceCell = cells[getCellKey(sourceRow, col)];
        const targetKey = getCellKey(targetRow, col);

        if (!sourceCell) {
            nextCells[targetKey] = {
                ...nextCells[targetKey],
                elements: [],
            };
            continue;
        }

        nextCells[targetKey] = cloneValue(sourceCell);
    }

    const nextRows = inserted.rows.slice();
    if (rows[sourceRow]) {
        nextRows[targetRow] = cloneValue(rows[sourceRow]);
    }

    return {
        ...inserted,
        rows: nextRows,
        cells: nextCells,
    };
}

export function duplicateColumnAt(
    table: TableConfig,
    rows: RowConfigs,
    columns: ColumnConfigs,
    cells: Record<CellKey, Cell>,
    colIndex: number
): TableUpdateResult {
    const sourceCol = normalizeDeleteColumnIndex(table, colIndex);
    const inserted = insertColumnAt(table, rows, columns, cells, sourceCol + 1);
    const targetCol = sourceCol + 1;
    const nextCells = { ...inserted.cells };

    for (let row = 0; row < inserted.table.rows; row++) {
        const sourceCell = cells[getCellKey(row, sourceCol)];
        const targetKey = getCellKey(row, targetCol);

        if (!sourceCell) {
            nextCells[targetKey] = {
                ...nextCells[targetKey],
                elements: [],
            };
            continue;
        }

        nextCells[targetKey] = cloneValue(sourceCell);
    }

    const nextColumns = inserted.columns.slice();
    if (columns[sourceCol]) {
        nextColumns[targetCol] = cloneValue(columns[sourceCol]);
    }

    return {
        ...inserted,
        columns: nextColumns,
        cells: nextCells,
    };
}

export function moveRowTo(
    table: TableConfig,
    rows: RowConfigs,
    columns: ColumnConfigs,
    cells: Record<CellKey, Cell>,
    subjectRow: number,
    targetRow: number
): TableUpdateResult {
    const from = normalizeDeleteRowIndex(table, subjectRow);
    const to = normalizeDeleteRowIndex(table, targetRow);

    if (from === to) {
        return { table, rows, columns, cells };
    }

    const mapRow = (row: number): number => {
        if (row === from) return to;
        if (from < to && row > from && row <= to) return row - 1;
        if (from > to && row >= to && row < from) return row + 1;
        return row;
    };

    const nextCells: Record<CellKey, Cell> = {};

    Object.entries(cells).forEach(([key, cell]) => {
        const [row, col] = parseCellKey(key);
        nextCells[getCellKey(mapRow(row), col)] = cloneValue(cell);
    });

    return {
        table: { ...table },
        rows: remapRecord(rows, mapRow),
        columns: columns.slice(),
        cells: nextCells,
    };
}

export function moveColumnTo(
    table: TableConfig,
    rows: RowConfigs,
    columns: ColumnConfigs,
    cells: Record<CellKey, Cell>,
    subjectCol: number,
    targetCol: number
): TableUpdateResult {
    const from = normalizeDeleteColumnIndex(table, subjectCol);
    const to = normalizeDeleteColumnIndex(table, targetCol);

    if (from === to) {
        return { table, rows, columns, cells };
    }

    const mapCol = (col: number): number => {
        if (col === from) return to;
        if (from < to && col > from && col <= to) return col - 1;
        if (from > to && col >= to && col < from) return col + 1;
        return col;
    };

    const nextCells: Record<CellKey, Cell> = {};

    Object.entries(cells).forEach(([key, cell]) => {
        const [row, col] = parseCellKey(key);
        nextCells[getCellKey(row, mapCol(col))] = cloneValue(cell);
    });

    return {
        table: { ...table },
        rows: rows.slice(),
        columns: remapRecord(columns, mapCol),
        cells: nextCells,
    };
}

/**
 * Pure, WP-free structural model for the native table's span-aware
 * operations. The block tree is reduced to anchors-only rows; every plan
 * function returns instructions for the dispatcher in table-ops.ts.
 *
 * Positions: row = row-block index, col = visual grid column. A cell with
 * rowSpan/colSpan occupies a rectangle anchored at its position; covered
 * positions hold no cell.
 */

export interface GridCell {
    id: string;
    rowSpan: number;
    colSpan: number;
}

export type GridRow = GridCell[];

export interface CellPosition {
    row: number;
    col: number;
}

export interface Occupancy {
    /** occupancy[row][col] = id of the cell covering that position. */
    matrix: string[][];
    /** Anchor position for each cell id. */
    anchors: Map<string, CellPosition>;
    cols: number;
}

export function buildOccupancy(rows: GridRow[]): Occupancy {
    const matrix: string[][] = rows.map(() => []);
    const anchors = new Map<string, CellPosition>();
    let cols = 0;

    rows.forEach((row, r) => {
        let c = 0;
        for (const cell of row) {
            while (matrix[r][c] !== undefined) {
                c++;
            }

            anchors.set(cell.id, { row: r, col: c });

            for (let dr = 0; dr < cell.rowSpan; dr++) {
                for (let dc = 0; dc < cell.colSpan; dc++) {
                    if (matrix[r + dr]) {
                        matrix[r + dr][c + dc] = cell.id;
                    }
                }
            }

            c += cell.colSpan;
            if (c > cols) {
                cols = c;
            }
        }

        // Trailing covered positions widen the grid too.
        while (matrix[r][c] !== undefined) {
            c++;
            if (c > cols) {
                cols = c;
            }
        }
    });

    return { matrix, anchors, cols };
}

export interface InsertRowPlan {
    /** Cells whose rowSpan grows by one (they cross the insertion line). */
    growSpans: string[];
    /** Number of fresh cells the new row block needs. */
    newCellCount: number;
}

/**
 * Plan inserting a row so the new row sits at `index` (0..rows.length).
 * A span crosses the line when its anchor row < index and it extends to
 * index or beyond.
 */
export function planInsertRow(rows: GridRow[], index: number): InsertRowPlan {
    const { anchors, cols } = buildOccupancy(rows);

    const growSpans: string[] = [];
    let coveredCols = 0;

    for (const row of rows) {
        for (const cell of row) {
            const pos = anchors.get(cell.id)!;
            if (pos.row < index && pos.row + cell.rowSpan > index) {
                growSpans.push(cell.id);
                coveredCols += cell.colSpan;
            }
        }
    }

    return { growSpans, newCellCount: Math.max(0, cols - coveredCols) };
}

export interface DeleteRowPlan {
    /** Cells whose rowSpan shrinks by one (they cross the deleted row). */
    shrinkSpans: string[];
    /**
     * Cells anchored IN the deleted row that span further down: they must be
     * re-anchored into the next row. `insertIndex` is the cell-array index in
     * the next row block where the replacement belongs.
     */
    reanchor: Array<{
        id: string;
        insertIndex: number;
        rowSpan: number;
        colSpan: number;
    }>;
}

export function planDeleteRow(rows: GridRow[], index: number): DeleteRowPlan {
    const { matrix, anchors } = buildOccupancy(rows);

    const shrinkSpans: string[] = [];
    const reanchor: DeleteRowPlan["reanchor"] = [];

    for (const row of rows) {
        for (const cell of row) {
            const pos = anchors.get(cell.id)!;
            const crosses =
                pos.row < index && pos.row + cell.rowSpan > index;
            if (crosses) {
                shrinkSpans.push(cell.id);
            }
        }
    }

    const nextRow = rows[index + 1];
    if (nextRow) {
        for (const cell of rows[index]) {
            const pos = anchors.get(cell.id)!;
            if (cell.rowSpan <= 1) {
                continue;
            }

            // Where in the next row's cell array does this column fall?
            // Count next-row anchors whose column is left of ours.
            let insertIndex = 0;
            for (const nextCell of nextRow) {
                const nextPos = anchors.get(nextCell.id)!;
                if (nextPos.col < pos.col) {
                    insertIndex++;
                }
            }

            reanchor.push({
                id: cell.id,
                insertIndex,
                rowSpan: cell.rowSpan - 1,
                colSpan: cell.colSpan,
            });
        }
    }

    return { shrinkSpans, reanchor };
}

export type ColumnRowAction =
    | { type: "insert"; rowIndex: number; insertIndex: number }
    | { type: "grow"; rowIndex: number; id: string }
    | { type: "skip"; rowIndex: number };

/**
 * Plan inserting a column so the new column sits at grid column `index`
 * (0..cols). Per row: insert a fresh cell before the anchor at/after the
 * position, or grow a span that crosses the line, or skip rows covered by a
 * multi-row span already grown at its anchor row.
 */
export function planInsertColumn(
    rows: GridRow[],
    index: number
): ColumnRowAction[] {
    const { matrix, anchors, cols } = buildOccupancy(rows);
    const actions: ColumnRowAction[] = [];
    const grown = new Set<string>();

    rows.forEach((row, r) => {
        // Inserting at the far edges never splits a span.
        if (index < cols) {
            const coveringId = matrix[r][index];
            if (coveringId !== undefined) {
                const pos = anchors.get(coveringId)!;
                // The line between index-1 and index runs through this cell
                // when its anchor starts left of index.
                if (pos.col < index) {
                    if (pos.row === r) {
                        actions.push({ type: "grow", rowIndex: r, id: coveringId });
                        grown.add(coveringId);
                    } else {
                        // Covered by a span anchored in an earlier row.
                        actions.push({ type: "skip", rowIndex: r });
                    }
                    return;
                }
            }
        }

        // Fresh cell: its array position = number of anchors in this row
        // whose column is left of the target column.
        let insertIndex = 0;
        for (const cell of row) {
            const pos = anchors.get(cell.id)!;
            if (pos.col < index) {
                insertIndex++;
            }
        }

        actions.push({ type: "insert", rowIndex: r, insertIndex });
    });

    return actions;
}

export type DeleteColumnRowAction =
    | { type: "remove"; rowIndex: number; id: string }
    | { type: "shrink"; rowIndex: number; id: string }
    | { type: "skip"; rowIndex: number };

/** Plan deleting grid column `index`. */
export function planDeleteColumn(
    rows: GridRow[],
    index: number
): DeleteColumnRowAction[] {
    const { matrix, anchors } = buildOccupancy(rows);
    const actions: DeleteColumnRowAction[] = [];
    const handled = new Set<string>();

    rows.forEach((row, r) => {
        const id = matrix[r][index];
        if (id === undefined) {
            actions.push({ type: "skip", rowIndex: r });
            return;
        }

        const pos = anchors.get(id)!;
        if (pos.row !== r) {
            // Covered by a span anchored above; handled at its anchor row.
            actions.push({ type: "skip", rowIndex: r });
            return;
        }

        if (handled.has(id)) {
            actions.push({ type: "skip", rowIndex: r });
            return;
        }
        handled.add(id);

        const cell = findCell(rows, id)!;
        if (cell.colSpan > 1) {
            actions.push({ type: "shrink", rowIndex: r, id });
        } else {
            actions.push({ type: "remove", rowIndex: r, id });
        }
    });

    return actions;
}

export interface MergePlan {
    anchorId: string;
    rowSpan: number;
    colSpan: number;
    absorbedIds: string[];
}

/**
 * Plan merging the given cells. Valid only when the cells' combined
 * rectangles exactly tile a rectangle. Returns null when invalid.
 */
export function planMerge(rows: GridRow[], ids: string[]): MergePlan | null {
    if (ids.length < 2) {
        return null;
    }

    const { anchors } = buildOccupancy(rows);

    let minRow = Infinity;
    let minCol = Infinity;
    let maxRow = -1;
    let maxCol = -1;
    let area = 0;

    for (const id of ids) {
        const pos = anchors.get(id);
        const cell = findCell(rows, id);
        if (!pos || !cell) {
            return null;
        }

        minRow = Math.min(minRow, pos.row);
        minCol = Math.min(minCol, pos.col);
        maxRow = Math.max(maxRow, pos.row + cell.rowSpan - 1);
        maxCol = Math.max(maxCol, pos.col + cell.colSpan - 1);
        area += cell.rowSpan * cell.colSpan;
    }

    const rectArea = (maxRow - minRow + 1) * (maxCol - minCol + 1);
    if (area !== rectArea) {
        return null;
    }

    // The anchor is the top-left cell; it must sit exactly at the rect corner.
    let anchorId: string | null = null;
    for (const id of ids) {
        const pos = anchors.get(id)!;
        if (pos.row === minRow && pos.col === minCol) {
            anchorId = id;
            break;
        }
    }
    if (!anchorId) {
        return null;
    }

    return {
        anchorId,
        rowSpan: maxRow - minRow + 1,
        colSpan: maxCol - minCol + 1,
        absorbedIds: ids.filter(id => id !== anchorId),
    };
}

export interface SplitPlan {
    /** Fresh 1x1 cells to insert: per row, the cell-array insertion index. */
    inserts: Array<{ rowIndex: number; insertIndex: number; count: number }>;
}

/** Plan splitting a merged cell back into 1x1 cells. */
export function planSplit(rows: GridRow[], id: string): SplitPlan | null {
    const { anchors } = buildOccupancy(rows);
    const pos = anchors.get(id);
    const cell = findCell(rows, id);
    if (!pos || !cell || (cell.rowSpan === 1 && cell.colSpan === 1)) {
        return null;
    }

    const inserts: SplitPlan["inserts"] = [];

    for (let dr = 0; dr < cell.rowSpan; dr++) {
        const r = pos.row + dr;
        const row = rows[r];
        if (!row) {
            continue;
        }

        // In the anchor's own row the anchor keeps the first position, so
        // colSpan-1 fresh cells go right after it. In covered rows all
        // colSpan positions need fresh cells.
        const count = dr === 0 ? cell.colSpan - 1 : cell.colSpan;
        if (count === 0) {
            continue;
        }

        let insertIndex = 0;
        for (const rowCell of row) {
            const rowPos = anchors.get(rowCell.id)!;
            if (
                rowPos.col < pos.col ||
                (dr === 0 && rowCell.id === id)
            ) {
                insertIndex++;
            }
        }

        inserts.push({ rowIndex: r, insertIndex, count });
    }

    return { inserts };
}

export function findCell(rows: GridRow[], id: string): GridCell | null {
    for (const row of rows) {
        for (const cell of row) {
            if (cell.id === id) {
                return cell;
            }
        }
    }
    return null;
}

/** Grid column of a cell (for toolbar labels / column ops entry points). */
export function cellColumn(rows: GridRow[], id: string): number | null {
    const { anchors } = buildOccupancy(rows);
    return anchors.get(id)?.col ?? null;
}

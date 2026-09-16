import { Cell, CellKey, parseCellKey } from "./attributes";
import { TableState } from "./store";

function getSpan(cells: Record<CellKey, Cell>, coord: CellKey) {
    return (
        cells[coord]?.span || {
            rowSpan: 1,
            colSpan: 1,
        }
    );
}

export function areAllMergeable(
    coords: Array<CellKey>,
    cells: Record<CellKey, Cell>
): boolean {
    if (coords.length < 2) return false;

    const occupiedGrid = new Set<string>();
    for (const coord of coords) {
        const [r, c] = parseCellKey(coord);
        const span = getSpan(cells, coord);
        for (let rs = 0; rs < span.rowSpan; rs++) {
            for (let cs = 0; cs < span.colSpan; cs++) {
                occupiedGrid.add(`${r + rs},${c + cs}`);
            }
        }
    }

    let minRow = Infinity,
        maxRow = -Infinity;
    let minCol = Infinity,
        maxCol = -Infinity;

    for (const key of occupiedGrid) {
        const [r, c] = key.split(",").map(Number);
        minRow = Math.min(minRow, r);
        maxRow = Math.max(maxRow, r);
        minCol = Math.min(minCol, c);
        maxCol = Math.max(maxCol, c);
    }

    for (let r = minRow; r <= maxRow; r++) {
        for (let c = minCol; c <= maxCol; c++) {
            if (!occupiedGrid.has(`${r},${c}`)) {
                return false;
            }
        }
    }

    return true;
}

export function mergeCells(coords: Array<CellKey>, state: TableState): void {
    if (coords.length < 2) return;

    if (!areAllMergeable(coords, state.cells)) {
        console.warn("Cells are not mergeable");
        return;
    }

    const sorted = [...coords].sort((a, b) => {
        const [aRow, aCol] = parseCellKey(a);
        const [bRow, bCol] = parseCellKey(b);
        return aRow === bRow ? aCol - bCol : aRow - bRow;
    });
    const topLeft = sorted[0];
    const [topLeftRow, topLeftCol] = parseCellKey(topLeft);

    let minRow = topLeftRow;
    let maxRow = topLeftRow;
    let minCol = topLeftCol;
    let maxCol = topLeftCol;

    for (const coord of coords) {
        const [r, c] = parseCellKey(coord);
        const span = getSpan(state.cells, coord);
        minRow = Math.min(minRow, r);
        maxRow = Math.max(maxRow, r + span.rowSpan - 1);
        minCol = Math.min(minCol, c);
        maxCol = Math.max(maxCol, c + span.colSpan - 1);
    }

    const newRowSpan = maxRow - minRow + 1;
    const newColSpan = maxCol - minCol + 1;
    const coordSet = new Set(coords);
    const nextCells = { ...state.cells };

    Object.keys(nextCells).forEach(key => {
        if (coordSet.has(key as CellKey) && key !== topLeft) {
            delete nextCells[key as CellKey];
        }
    });

    nextCells[topLeft] = {
        ...(nextCells[topLeft] || {}),
        span: { rowSpan: newRowSpan, colSpan: newColSpan },
    };

    state.setCells(nextCells);
    state.setSelectedCells([topLeft]);
}

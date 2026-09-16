import { BlockInstance } from "@wordpress/blocks";

import {
    Cell,
    CellElement,
    CellKey,
    RowConfigs,
    TablebergBlockAttrs,
} from "../attributes";

/**
 * JS mirror of renderer/Table/InnerBlocksAttrsAdapter.php: reduces the v4
 * native block tree (rows -> cells -> elements) to the v3 cells/rows shape.
 * Used to snapshot the tree into the table store so the existing preview UI
 * (sorting/search/pagination/responsive via PrimaryTable) renders from it.
 */
export function blocksToV3Content(rowBlocks: BlockInstance[]): {
    cells: Record<CellKey, Cell>;
    rows: RowConfigs;
    rowsCount: number;
    colsCount: number;
    /** Grid position -> cell block clientId (for targeted write-backs). */
    cellClientIds: Record<CellKey, string>;
} {
    const cells: Record<CellKey, Cell> = {};
    const cellClientIds: Record<CellKey, string> = {};
    const rows: RowConfigs = [];
    const covered = new Set<string>();
    let colsCount = 0;

    let row = 0;
    for (const rowBlock of rowBlocks) {
        if (rowBlock.name !== "tableberg/row") {
            continue;
        }

        const rowAttrs = rowBlock.attributes ?? {};
        rows[row] =
            Object.keys(rowAttrs).length > 0
                ? ({ ...rowAttrs } as RowConfigs[number])
                : null;

        let col = 0;
        for (const cellBlock of rowBlock.innerBlocks) {
            if (cellBlock.name !== "tableberg/cell") {
                continue;
            }

            while (covered.has(`${row},${col}`)) {
                col++;
            }

            const attrs = cellBlock.attributes ?? {};
            // Keep the reverse adapter symmetric with v3-to-v4: all block
            // attributes pass through, while elements come from innerBlocks.
            const cell: Cell = { ...attrs } as Cell;
            cell.elements = blocksToElements(cellBlock.innerBlocks);

            cells[`${row},${col}` as CellKey] = cell;
            cellClientIds[`${row},${col}` as CellKey] = cellBlock.clientId;

            const rowSpan = Math.max(1, attrs.span?.rowSpan ?? 1);
            const colSpan = Math.max(1, attrs.span?.colSpan ?? 1);
            for (let dr = 0; dr < rowSpan; dr++) {
                for (let dc = 0; dc < colSpan; dc++) {
                    if (dr === 0 && dc === 0) {
                        continue;
                    }
                    covered.add(`${row + dr},${col + dc}`);
                }
            }

            col += colSpan;
            if (col > colsCount) {
                colsCount = col;
            }
        }

        while (covered.has(`${row},${col}`)) {
            col++;
            if (col > colsCount) {
                colsCount = col;
            }
        }

        row++;
    }

    return { cells, rows, rowsCount: row, colsCount, cellClientIds };
}

function blocksToElements(elementBlocks: BlockInstance[]): CellElement[] {
    const elements: CellElement[] = [];

    for (const block of elementBlocks) {
        if (!block.name.startsWith("tableberg/")) {
            continue;
        }

        const name = block.name.slice("tableberg/".length);
        const { bindings, ...attributes } = block.attributes ?? {};

        const element = {
            name,
            attributes,
        } as CellElement;
        if (bindings && Object.keys(bindings).length > 0) {
            element.bindings = bindings;
        }

        elements.push(element);
    }

    return elements;
}

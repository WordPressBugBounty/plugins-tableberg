import { BlockInstance, createBlock } from "@wordpress/blocks";

import { Cell, CellKey, TablebergBlockAttrs } from "../attributes";

/**
 * JS mirror of renderer/Migrations/TableBlockMigratorV3ToV4.php.
 *
 * Converts v3 (faux-block era) table attrs into the v4 native-blocks shape:
 * slim attrs (no cells/rows) + a real block tree (rows -> cells -> elements).
 * Used by the table block's deprecated entry, transforms, and the native
 * edit's safety-net converter. Any v3 shim innerBlocks are discarded — the
 * attrs are canonical.
 */

export const ELEMENT_NAMES = [
    "text",
    "button",
    "image",
    "list",
    "styled-list",
    "icon",
    "star-rating",
    "custom-html",
];

export function isV3OrOlder(attrs: Partial<TablebergBlockAttrs>): boolean {
    return (attrs.version ?? 0) <= 3;
}

export function toV4Attrs(
    attrs: Partial<TablebergBlockAttrs>
): Partial<TablebergBlockAttrs> {
    const slim: Record<string, unknown> = { ...attrs };
    delete slim.cells;
    delete slim.rows;
    slim.version = 4;
    return slim as Partial<TablebergBlockAttrs>;
}

/**
 * Positions covered by a rowSpan/colSpan anchor (excluding the anchor).
 */
function computeCoveredPositions(
    cells: Partial<Record<CellKey, Cell>>,
    rowsCount: number,
    colsCount: number
): Set<string> {
    const covered = new Set<string>();

    for (const [key, cell] of Object.entries(cells)) {
        const span = cell?.span;
        if (!span) {
            continue;
        }

        const [row, col] = key.split(",").map(Number);
        const rowSpan = Math.max(1, span.rowSpan || 1);
        const colSpan = Math.max(1, span.colSpan || 1);

        for (let dr = 0; dr < rowSpan; dr++) {
            for (let dc = 0; dc < colSpan; dc++) {
                if (dr === 0 && dc === 0) {
                    continue;
                }
                const r = row + dr;
                const c = col + dc;
                if (r >= rowsCount || c >= colsCount) {
                    continue;
                }
                covered.add(`${r},${c}`);
            }
        }
    }

    return covered;
}

function buildCellBlock(cell: Cell): BlockInstance {
    // Every registered cell attribute must survive migration. `elements` is
    // the only exception because it becomes the cell's inner block list.
    const { elements = [], ...cellAttrs } = cell;

    const elementBlocks: BlockInstance[] = [];
    for (const element of elements) {
        if (!element || !ELEMENT_NAMES.includes(element.name)) {
            continue;
        }

        const elementAttrs: Record<string, unknown> = {
            ...(element.attributes ?? {}),
        };
        if (element.bindings && Object.keys(element.bindings).length > 0) {
            elementAttrs.bindings = element.bindings;
        }

        elementBlocks.push(
            createBlock(`tableberg/${element.name}`, elementAttrs)
        );
    }

    return createBlock("tableberg/cell", cellAttrs, elementBlocks);
}

/**
 * Builds the v4 row-block tree from v3 attrs.
 */
export function buildRowBlocksFromV3(
    attrs: Partial<TablebergBlockAttrs>
): BlockInstance[] {
    const rowsCount = attrs.table?.rows ?? 0;
    const colsCount = attrs.table?.cols ?? 0;
    const cells = attrs.cells ?? {};
    const rowConfigs = attrs.rows ?? [];

    const covered = computeCoveredPositions(cells, rowsCount, colsCount);

    const rowBlocks: BlockInstance[] = [];
    for (let row = 0; row < rowsCount; row++) {
        const cellBlocks: BlockInstance[] = [];

        for (let col = 0; col < colsCount; col++) {
            if (covered.has(`${row},${col}`)) {
                continue;
            }

            const cell = cells[`${row},${col}` as CellKey] ?? {};
            cellBlocks.push(buildCellBlock(cell));
        }

        // As with cells, rows can carry Pro-owned and future registered
        // attributes that this migration must not need to name individually.
        const rowAttrs = { ...(rowConfigs[row] ?? {}) };

        rowBlocks.push(createBlock("tableberg/row", rowAttrs, cellBlocks));
    }

    return rowBlocks;
}

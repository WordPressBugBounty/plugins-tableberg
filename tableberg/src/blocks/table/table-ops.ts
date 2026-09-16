import { store as blockEditorStore } from "@wordpress/block-editor";
import { BlockInstance, cloneBlock, createBlock } from "@wordpress/blocks";

import {
    GridRow,
    buildOccupancy,
    cellColumn,
    planDeleteColumn,
    planDeleteRow,
    planInsertColumn,
    planInsertRow,
    planMerge,
    planSplit,
} from "./grid-model";

/**
 * Structural table operations over the native block tree. Every op runs in
 * registry.batch() so it lands as a single undo step. The span-aware
 * decisions live in grid-model.ts (pure + unit-tested); this module only
 * reads the tree and dispatches the plan.
 */

// The data registry instance, obtained via useRegistry() in components.
type Registry = {
    batch: (fn: () => void) => void;
    select: (store: unknown) => any;
    dispatch: (store: unknown) => any;
};

function freshCell(): BlockInstance {
    return createBlock("tableberg/cell", {}, [createBlock("tableberg/text")]);
}

export function readGrid(registry: Registry, tableClientId: string) {
    const be = registry.select(blockEditorStore);
    const rowBlocks: BlockInstance[] = (
        be.getBlock(tableClientId)?.innerBlocks ?? []
    ).filter((b: BlockInstance) => b.name === "tableberg/row");

    const rows: GridRow[] = rowBlocks.map(rowBlock =>
        rowBlock.innerBlocks
            .filter(b => b.name === "tableberg/cell")
            .map(cellBlock => ({
                id: cellBlock.clientId,
                rowSpan: cellBlock.attributes?.span?.rowSpan ?? 1,
                colSpan: cellBlock.attributes?.span?.colSpan ?? 1,
            }))
    );

    return { rows, rowBlocks };
}

function spanAttr(rowSpan: number, colSpan: number) {
    // Always write an explicit span: updateBlockAttributes ignores keys set
    // to undefined, so a merged cell could never reset back to 1x1.
    return { span: { rowSpan, colSpan } };
}

export function updateSpan(
    registry: Registry,
    rows: GridRow[],
    clientId: string,
    dRow: number,
    dCol: number
) {
    const cell = rows.flat().find(c => c.id === clientId);
    if (!cell) {
        return;
    }
    registry
        .dispatch(blockEditorStore)
        .updateBlockAttributes(
            clientId,
            spanAttr(
                Math.max(1, cell.rowSpan + dRow),
                Math.max(1, cell.colSpan + dCol)
            )
        );
}

/** Locates a cell block's row/table/grid context. */
export function getCellContext(registry: Registry, cellClientId: string) {
    const be = registry.select(blockEditorStore);
    const rowClientId = be.getBlockRootClientId(cellClientId);
    if (!rowClientId) {
        return null;
    }
    const tableClientId = be.getBlockRootClientId(rowClientId);
    if (!tableClientId) {
        return null;
    }
    const rowIndex = be.getBlockIndex(rowClientId);
    const { rows } = readGrid(registry, tableClientId);
    const column = cellColumn(rows, cellClientId);

    return { rowClientId, tableClientId, rowIndex, column, rows };
}

export function insertRow(
    registry: Registry,
    tableClientId: string,
    index: number
) {
    const { rows } = readGrid(registry, tableClientId);
    const plan = planInsertRow(rows, index);
    const dispatch = registry.dispatch(blockEditorStore);

    registry.batch(() => {
        for (const id of plan.growSpans) {
            updateSpan(registry, rows, id, 1, 0);
        }

        const cells = Array.from(
            { length: Math.max(1, plan.newCellCount) },
            freshCell
        );
        dispatch.insertBlocks(
            createBlock("tableberg/row", {}, cells),
            index,
            tableClientId,
            false
        );
    });
}

export function deleteRow(
    registry: Registry,
    tableClientId: string,
    index: number
) {
    const { rows, rowBlocks } = readGrid(registry, tableClientId);
    if (rowBlocks.length <= 1) {
        return;
    }

    const plan = planDeleteRow(rows, index);
    const dispatch = registry.dispatch(blockEditorStore);
    const rowClientId = rowBlocks[index].clientId;
    const nextRowClientId = rowBlocks[index + 1]?.clientId;

    registry.batch(() => {
        for (const id of plan.shrinkSpans) {
            updateSpan(registry, rows, id, -1, 0);
        }

        // Move down-spanning cells (with their content) into the next row
        // before the row block disappears.
        for (const item of plan.reanchor) {
            if (!nextRowClientId) {
                break;
            }
            dispatch.moveBlocksToPosition(
                [item.id],
                rowClientId,
                nextRowClientId,
                item.insertIndex
            );
            dispatch.updateBlockAttributes(
                item.id,
                spanAttr(item.rowSpan, item.colSpan)
            );
        }

        dispatch.removeBlocks([rowClientId], false);
    });
}

export function insertColumn(
    registry: Registry,
    tableClientId: string,
    index: number
) {
    const { rows, rowBlocks } = readGrid(registry, tableClientId);
    const actions = planInsertColumn(rows, index);
    const dispatch = registry.dispatch(blockEditorStore);

    registry.batch(() => {
        for (const action of actions) {
            if (action.type === "grow") {
                updateSpan(registry, rows, action.id, 0, 1);
            } else if (action.type === "insert") {
                dispatch.insertBlocks(
                    freshCell(),
                    action.insertIndex,
                    rowBlocks[action.rowIndex].clientId,
                    false
                );
            }
        }
    });
}

export function deleteColumn(
    registry: Registry,
    tableClientId: string,
    index: number
) {
    const { rows } = readGrid(registry, tableClientId);
    const actions = planDeleteColumn(rows, index);
    const dispatch = registry.dispatch(blockEditorStore);

    const removals = actions
        .filter(a => a.type === "remove")
        .map(a => (a as { id: string }).id);
    const shrinks = actions
        .filter(a => a.type === "shrink")
        .map(a => (a as { id: string }).id);

    // If every row would lose its only cell, keep the table intact.
    const totalCols = Math.max(0, ...rows.map(row =>
        row.reduce((sum, c) => sum + c.colSpan, 0)
    ));
    if (totalCols <= 1) {
        return;
    }

    registry.batch(() => {
        for (const id of shrinks) {
            updateSpan(registry, rows, id, 0, -1);
        }
        if (removals.length > 0) {
            dispatch.removeBlocks(removals, false);
        }
    });
}


/**
 * Duplicates a row directly below itself. Cells whose rowSpan crosses the
 * insertion line (including this row's own multi-row anchors) grow by one
 * instead of being cloned, keeping the grid consistent.
 */
export function mergeCells(
    registry: Registry,
    tableClientId: string,
    cellClientIds: string[]
): boolean {
    const { rows } = readGrid(registry, tableClientId);
    const plan = planMerge(rows, cellClientIds);
    if (!plan) {
        return false;
    }

    const be = registry.select(blockEditorStore);
    const dispatch = registry.dispatch(blockEditorStore);

    const { anchors } = buildOccupancy(rows);
    const anchorPos = anchors.get(plan.anchorId);

    registry.batch(() => {
        for (const absorbedId of plan.absorbedIds) {
            const children: string[] = be.getBlockOrder(absorbedId);
            if (children.length > 0) {
                // Remember where each element came from so a later split can
                // put it back into its original cell.
                const absorbedPos = anchors.get(absorbedId);
                if (anchorPos && absorbedPos) {
                    const origin = {
                        dr: absorbedPos.row - anchorPos.row,
                        dc: absorbedPos.col - anchorPos.col,
                    };
                    for (const childId of children) {
                        dispatch.updateBlockAttributes(childId, {
                            mergeOrigin: origin,
                        });
                    }
                }

                const anchorCount = be.getBlockOrder(plan.anchorId).length;
                dispatch.moveBlocksToPosition(
                    children,
                    absorbedId,
                    plan.anchorId,
                    anchorCount
                );
            }
        }

        dispatch.updateBlockAttributes(
            plan.anchorId,
            spanAttr(plan.rowSpan, plan.colSpan)
        );
        dispatch.removeBlocks(plan.absorbedIds, false);
    });

    return true;
}

export function splitCell(
    registry: Registry,
    tableClientId: string,
    cellClientId: string
) {
    const { rows, rowBlocks } = readGrid(registry, tableClientId);
    const plan = planSplit(rows, cellClientId);
    if (!plan) {
        return;
    }

    const be = registry.select(blockEditorStore);
    const dispatch = registry.dispatch(blockEditorStore);

    const { anchors } = buildOccupancy(rows);
    const anchorPos = anchors.get(cellClientId);
    const anchorCell = rows.flat().find(c => c.id === cellClientId);

    // Offset (dr,dc) -> the fresh cell created for that grid position.
    const freshByOffset = new Map<string, ReturnType<typeof freshCell>>();

    registry.batch(() => {
        dispatch.updateBlockAttributes(cellClientId, {
            span: { rowSpan: 1, colSpan: 1 },
        });

        for (const item of plan.inserts) {
            const dr = anchorPos ? item.rowIndex - anchorPos.row : 0;
            const cells = Array.from({ length: item.count }, (_, i) => {
                const cell = freshCell();
                const dc = dr === 0 ? i + 1 : i;
                freshByOffset.set(`${dr},${dc}`, cell);
                return cell;
            });
            dispatch.insertBlocks(
                cells,
                item.insertIndex,
                rowBlocks[item.rowIndex].clientId,
                false
            );
        }

        // Send elements that were absorbed during a merge back to the cell
        // at their original offset; everything else stays in the anchor.
        const children: string[] = be.getBlockOrder(cellClientId);
        for (const childId of children) {
            const origin = be.getBlockAttributes(childId)?.mergeOrigin as
                | { dr: number; dc: number }
                | undefined;
            if (!origin) {
                continue;
            }

            const target = freshByOffset.get(`${origin.dr},${origin.dc}`);
            // null, not undefined — updateBlockAttributes ignores undefined.
            dispatch.updateBlockAttributes(childId, {
                mergeOrigin: null,
            });
            if (!target) {
                continue;
            }

            const targetCount = be.getBlockOrder(target.clientId).length;
            dispatch.moveBlocksToPosition(
                [childId],
                cellClientId,
                target.clientId,
                targetCount
            );
        }
    });

    void anchorCell;
}

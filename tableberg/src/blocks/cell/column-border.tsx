import { ReactNode } from "react";
import {
    InspectorControls,
    store as blockEditorStore,
} from "@wordpress/block-editor";
import { useDispatch, useRegistry, useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { BorderControl } from "@tableberg/components";

import LockedControl from "../../components/LockedControl";
import { Border } from "../../attributes";
import { buildOccupancy, cellColumn, GridRow } from "../table/grid-model";

const EMPTY_BORDER: Border = { top: "", right: "", bottom: "", left: "" };

const hasBorder = (border: Border) =>
    !!border.top || !!border.right || !!border.bottom || !!border.left;

export interface ColumnBorderContext {
    columnBorderControlProps: {
        label: string;
        value: Border;
        hasValue: () => boolean;
        onChange: (newBorder: Border) => void;
        onDeselect: () => void;
    };
}

/**
 * Column border — bulk-apply the picked border to every cell in the
 * selected cell's column, mirroring `CellColumnBackgroundControls` (and,
 * further back, `CellDimensionsControls`'s column width): a column has no
 * block of its own, so this is set from whichever cell you have selected.
 * Writes each target cell's own `border` attribute — the same one the
 * individual per-cell border control uses, with the same legacy
 * `styles.border` fallback (tables where it lived before it got its own
 * attribute). Deliberately not `styles.border` directly: that key is read
 * unconditionally by free's own rendering (the table-wide default's
 * fallback target), so anything written there keeps showing even with pro
 * switched off — moving it to a dedicated pro-only attribute is what makes
 * it disappear correctly, the same fix already applied to backgroundColor.
 *
 * The border wraps the column as one block, not each cell individually:
 * every cell gets the left/right sides, but only the topmost cell gets the
 * top and only the bottommost gets the bottom — otherwise cells in the
 * middle of the column would each draw a border against their neighbours.
 */
export function CellColumnBorderControls({
    clientId,
    cellDefaultsBorder,
    // Injected by the pro plugin; undefined when pro is not installed. A
    // render function rather than a plain node: resolving the column's
    // sibling cells and bulk-writing their styles needs the block registry,
    // which pro's editor.BlockEdit HOC can't reach from outside the tree.
    ProColumnBorderContent,
}: {
    clientId: string;
    cellDefaultsBorder: Border;
    ProColumnBorderContent?: (ctx: ColumnBorderContext) => ReactNode;
}) {
    const { updateBlockAttributes } = useDispatch(blockEditorStore) as any;
    const registry = useRegistry() as any;

    const info = useSelect(
        select => {
            const be = select(blockEditorStore) as any;
            const rowClientId = be.getBlockRootClientId(clientId);
            const tableClientId = rowClientId
                ? be.getBlockRootClientId(rowClientId)
                : null;

            if (!rowClientId || !tableClientId) {
                return null;
            }

            const rows: GridRow[] = (
                be.getBlock(tableClientId)?.innerBlocks ?? []
            )
                .filter((b: any) => b.name === "tableberg/row")
                .map((rowBlock: any) =>
                    rowBlock.innerBlocks
                        .filter((b: any) => b.name === "tableberg/cell")
                        .map((cellBlock: any) => ({
                            id: cellBlock.clientId,
                            rowSpan: cellBlock.attributes?.span?.rowSpan ?? 1,
                            colSpan: cellBlock.attributes?.span?.colSpan ?? 1,
                        }))
                );

            const column = cellColumn(rows, clientId);
            let columnCellIds: string[] = [];
            if (column !== null) {
                const occupancy = buildOccupancy(rows);
                const seen = new Set<string>();
                for (let r = 0; r < rows.length; r++) {
                    const id = occupancy.matrix[r]?.[column];
                    if (id && !seen.has(id)) {
                        seen.add(id);
                        columnCellIds.push(id);
                    }
                }
            }

            const getResolvedBorder = (id: string): Border => {
                const cellAttrs = be.getBlockAttributes(id);
                // New attribute first, legacy `styles.border` fallback for
                // cells edited before it existed — same resolution the
                // individual cell border control uses.
                const cellBorder = (cellAttrs?.border ??
                    cellAttrs?.styles?.border) as Border | undefined;
                return cellBorder && hasBorder(cellBorder)
                    ? cellBorder
                    : cellDefaultsBorder;
            };

            // A column is one rectangular block: only its outermost edges
            // carry the border. Top comes from the first cell, bottom from
            // the last — the cells in between share no border with each
            // other, so their own top/bottom don't factor in here.
            let columnBorder: Border | undefined;
            if (columnCellIds.length > 0) {
                const resolved = columnCellIds.map(getResolvedBorder);
                const first = resolved[0];
                const last = resolved[resolved.length - 1];
                const sidesConsistent = resolved.every(
                    border =>
                        border.left === first.left &&
                        border.right === first.right
                );
                columnBorder = sidesConsistent
                    ? {
                          top: first.top,
                          right: first.right,
                          bottom: last.bottom,
                          left: first.left,
                      }
                    : undefined;
            }

            return { columnCellIds, columnBorder };
        },
        [
            clientId,
            cellDefaultsBorder.top,
            cellDefaultsBorder.right,
            cellDefaultsBorder.bottom,
            cellDefaultsBorder.left,
        ]
    );

    if (!info) {
        return null;
    }

    const applyToCells = (newBorder: Border) => {
        const be = registry.select(blockEditorStore);
        const total = info.columnCellIds.length;
        registry.batch(() => {
            info.columnCellIds.forEach((id, index) => {
                const currentStyles = be.getBlockAttributes(id)?.styles ?? {};
                const { border: _legacy, ...styles } = currentStyles;
                const isFirst = index === 0;
                const isLast = index === total - 1;
                updateBlockAttributes(id, {
                    // Left/right run the full column, but top/bottom only
                    // belong to the outermost cells — an interior cell
                    // shares its neighbours' edges, not its own.
                    border: {
                        top: isFirst ? newBorder.top : "",
                        right: newBorder.right,
                        bottom: isLast ? newBorder.bottom : "",
                        left: newBorder.left,
                    },
                    styles,
                });
            });
        });
    };

    const columnBorder = info.columnBorder ?? EMPTY_BORDER;
    const context: ColumnBorderContext = {
        columnBorderControlProps: {
            label: __("Column Border", "tableberg"),
            value: columnBorder,
            hasValue: () => hasBorder(columnBorder),
            onChange: (newBorder: Border) => applyToCells(newBorder),
            onDeselect: () => applyToCells(EMPTY_BORDER),
        },
    };

    return (
        <InspectorControls group="border">
            {ProColumnBorderContent ? (
                ProColumnBorderContent(context)
            ) : (
                <LockedControl isEnhanced selected="col-border">
                    <BorderControl {...context.columnBorderControlProps} />
                </LockedControl>
            )}
        </InspectorControls>
    );
}

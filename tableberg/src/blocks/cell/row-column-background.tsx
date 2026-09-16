import { ReactNode } from "react";
import {
    InspectorControls,
    store as blockEditorStore,
} from "@wordpress/block-editor";
import { useDispatch, useRegistry, useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { ColorControl } from "@tableberg/components";

import { ColorControlProps } from "../../hooks";
import LockedControl from "../../components/LockedControl";
import { buildOccupancy, cellColumn, GridRow } from "../table/grid-model";

/**
 * Column background colour — bulk-apply the picked colour to every cell in
 * the selected cell's column, mirroring `CellDimensionsControls` (column
 * width is also set from the cell you select, since that's what the user
 * has in hand — a column has no block of its own, unlike a row). This
 * doesn't change a shared attribute: it writes each target cell's own
 * `backgroundColor` — the exact same attribute (and legacy-migration
 * behaviour) the per-cell background control already reads and renders, so
 * the two never disagree about which key holds the cell's colour.
 */
export interface ColumnBackgroundContext {
    columnBackgroundColorControl: ColorControlProps;
}

export function CellColumnBackgroundControls({
    clientId,
    cellDefaultsBackgroundColor,
    // Injected by the pro plugin; undefined when pro is not installed. A
    // render function rather than a plain node: resolving the column's
    // sibling cells and bulk-writing their styles needs the block registry,
    // which pro's editor.BlockEdit HOC can't reach from outside the tree.
    ProColumnBackgroundContent,
}: {
    clientId: string;
    cellDefaultsBackgroundColor: string;
    ProColumnBackgroundContent?: (ctx: ColumnBackgroundContext) => ReactNode;
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

            const getResolvedColor = (id: string) => {
                const cellAttrs = be.getBlockAttributes(id);
                // New attribute first, legacy `styles.backgroundColor`
                // fallback for cells edited before it existed — same
                // resolution the per-cell background control uses.
                const cellColor = (cellAttrs?.backgroundColor ??
                    cellAttrs?.styles?.backgroundColor) as
                    | string
                    | undefined;
                return cellColor && cellColor.trim() !== ""
                    ? cellColor
                    : cellDefaultsBackgroundColor;
            };

            let columnColor: string | undefined;
            if (columnCellIds.length > 0) {
                const [first, ...rest] = columnCellIds.map(getResolvedColor);
                columnColor = rest.every(color => color === first)
                    ? first
                    : undefined;
            }

            return { columnCellIds, columnColor };
        },
        [clientId, cellDefaultsBackgroundColor]
    );

    if (!info) {
        return null;
    }

    const applyToCells = (backgroundColor: string) => {
        const be = registry.select(blockEditorStore);
        registry.batch(() => {
            info.columnCellIds.forEach(id => {
                const currentStyles = be.getBlockAttributes(id)?.styles ?? {};
                // Write the canonical attribute and drop the legacy key, so
                // a cell never ends up with both disagreeing.
                const { backgroundColor: _legacy, ...styles } = currentStyles;
                updateBlockAttributes(id, {
                    backgroundColor: backgroundColor || null,
                    styles,
                });
            });
        });
    };

    const context: ColumnBackgroundContext = {
        columnBackgroundColorControl: {
            label: __("Column Background Color", "tableberg"),
            value: info.columnColor,
            onChange: (color: string) => applyToCells(color),
            onDeselect: () => applyToCells(""),
        },
    };

    return (
        <InspectorControls group="color">
            {/*
             * The colour control renders a ToolsPanel item, so it only shows
             * up inside a ToolsPanel. The editor's own "Color" group is one;
             * a plain PanelBody is not.
             */}
            {ProColumnBackgroundContent ? (
                ProColumnBackgroundContent(context)
            ) : (
                <LockedControl isEnhanced selected="col-bg">
                    <ColorControl
                        {...context.columnBackgroundColorControl}
                    />
                </LockedControl>
            )}
        </InspectorControls>
    );
}

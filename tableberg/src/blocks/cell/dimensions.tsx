import {
    InspectorControls,
    store as blockEditorStore,
} from "@wordpress/block-editor";
import { useDispatch, useSelect } from "@wordpress/data";
import {
    PanelBody,
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { SizeControl } from "@tableberg/components";

import { ColumnConfig, TableConfig } from "../../attributes";
import { cellColumn, GridRow } from "../table/grid-model";

export const DEFAULT_FIXED_COLUMN_WIDTH = "150px";
export const DEFAULT_FIXED_ROW_HEIGHT = "50px";

/**
 * Column width and row height for the selected cell.
 *
 * These live on the cell because that is what the user selects, but neither
 * value belongs to the cell block: a column width is one entry of the table
 * block's `columns` attribute, and a row height is the parent row block's
 * `height`. Both are written straight to the owning block, which is also
 * where the renderer reads them from.
 */
export function CellDimensionsControls({ clientId }: { clientId: string }) {
    const { updateBlockAttributes } = useDispatch(blockEditorStore) as any;

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

            const tableAttrs = be.getBlockAttributes(tableClientId) ?? {};
            const columns: ColumnConfig[] = Array.isArray(tableAttrs.columns)
                ? tableAttrs.columns
                : [];

            // The column index has to account for the spans of earlier cells
            // and rows, so it comes from the same grid walk the table
            // operations use. Reading the grid through `select` keeps it
            // fresh when a column is inserted or removed.
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

            return {
                rowClientId,
                tableClientId,
                columns,
                column: cellColumn(rows, clientId),
                rowHeight: be.getBlockAttributes(rowClientId)?.height as
                    | string
                    | undefined,
                fixedColumnWidths:
                    (tableAttrs.table as TableConfig | undefined)
                        ?.fixedColumnWidths ?? true,
            };
        },
        [clientId]
    );

    if (!info) {
        return null;
    }

    const {
        rowClientId,
        tableClientId,
        columns,
        column,
        rowHeight,
        fixedColumnWidths,
    } = info;

    const columnWidth =
        column === null ? undefined : columns[column]?.width;
    const columnWidthMode = columnWidth ? "fixed" : "auto";
    const rowHeightMode = rowHeight ? "fixed" : "auto";

    const setColumnWidth = (width: string | undefined) => {
        if (column === null) {
            return;
        }

        const next = columns.slice();
        // A column with no settings left is dropped rather than kept as an
        // empty object, so the attribute stays as small as it was before.
        const { width: _dropped, ...rest } = next[column] ?? {};
        next[column] = width ? { ...rest, width } : rest;

        updateBlockAttributes(tableClientId, { columns: next });
    };

    const setRowHeight = (height: string | undefined) => {
        // `null`, not `undefined`: updateBlockAttributes ignores undefined.
        updateBlockAttributes(rowClientId, { height: height ?? null });
    };

    return (
        <InspectorControls>
            <PanelBody title={__("Column & Row Dimensions", "tableberg")}>
                {column !== null && (
                    <>
                        <ToggleGroupControl
                            label={__("Width Mode", "tableberg")}
                            value={columnWidthMode}
                            isBlock
                            onChange={value => {
                                if (fixedColumnWidths) {
                                    return;
                                }
                                setColumnWidth(
                                    (value || columnWidthMode) === "fixed"
                                        ? columnWidth ||
                                              DEFAULT_FIXED_COLUMN_WIDTH
                                        : undefined
                                );
                            }}
                        >
                            <ToggleGroupControlOption
                                value="auto"
                                label={__("Auto", "tableberg")}
                                disabled={fixedColumnWidths}
                            />
                            <ToggleGroupControlOption
                                value="fixed"
                                label={__("Fixed", "tableberg")}
                                disabled={fixedColumnWidths}
                            />
                        </ToggleGroupControl>

                        {columnWidthMode === "fixed" && (
                            <SizeControl
                                label={__("Column Width", "tableberg")}
                                value={
                                    columnWidth || DEFAULT_FIXED_COLUMN_WIDTH
                                }
                                disabled={fixedColumnWidths}
                                onChange={(value: string) =>
                                    setColumnWidth(
                                        value || DEFAULT_FIXED_COLUMN_WIDTH
                                    )
                                }
                            />
                        )}

                        {fixedColumnWidths && (
                            <p style={{ marginBottom: 0, color: "#757575" }}>
                                {__(
                                    "Turn off 'Equal width columns' in the table settings to set a width for this column.",
                                    "tableberg"
                                )}
                            </p>
                        )}

                        <div style={{ marginTop: "16px" }} />
                    </>
                )}

                <ToggleGroupControl
                    label={__("Height Mode", "tableberg")}
                    value={rowHeightMode}
                    isBlock
                    onChange={value =>
                        setRowHeight(
                            (value || rowHeightMode) === "fixed"
                                ? rowHeight || DEFAULT_FIXED_ROW_HEIGHT
                                : undefined
                        )
                    }
                >
                    <ToggleGroupControlOption
                        value="auto"
                        label={__("Auto", "tableberg")}
                    />
                    <ToggleGroupControlOption
                        value="fixed"
                        label={__("Fixed", "tableberg")}
                    />
                </ToggleGroupControl>

                {rowHeightMode === "fixed" && (
                    <SizeControl
                        label={__("Row Height", "tableberg")}
                        value={rowHeight || DEFAULT_FIXED_ROW_HEIGHT}
                        onChange={(value: string) =>
                            setRowHeight(value || DEFAULT_FIXED_ROW_HEIGHT)
                        }
                    />
                )}
            </PanelBody>
        </InspectorControls>
    );
}

import { createBlock } from "@wordpress/blocks";
import {
    attrDefaults,
    attrVersion,
    Cell,
    CellKey,
    getCellKey,
    TablebergBlockAttrs,
} from "./attributes";
import { textAttributeDefaults } from "./elements";
import { buildRowBlocksFromV3, toV4Attrs } from "./migrate/v3-to-v4";

interface CoreTableCell {
    content?: string;
    align?: string;
    colspan?: string;
    rowspan?: string;
}

interface CoreTableRow {
    cells?: CoreTableCell[];
}

interface CoreTableAttrs {
    caption?: string;
    hasFixedLayout?: boolean;
    head?: CoreTableRow[];
    body?: CoreTableRow[];
    foot?: CoreTableRow[];
}

function normalizeSpan(value?: string): number {
    const parsed = Number.parseInt(value || "", 10);

    if (Number.isNaN(parsed) || parsed < 1) {
        return 1;
    }

    return parsed;
}

function normalizeAlign(value?: string) {
    if (value === "left" || value === "center" || value === "right") {
        return value;
    }

    return textAttributeDefaults.align;
}

function buildTablebergAttrs(attributes: CoreTableAttrs): TablebergBlockAttrs {
    const head = attributes.head || [];
    const body = attributes.body || [];
    const foot = attributes.foot || [];
    const rows = [...head, ...body, ...foot];

    const cells: Record<CellKey, Cell> = {};
    const occupied = new Set<CellKey>();

    rows.forEach((row, rowIndex) => {
        let colIndex = 0;

        (row.cells || []).forEach(cell => {
            while (occupied.has(getCellKey(rowIndex, colIndex))) {
                colIndex += 1;
            }

            const rowSpan = normalizeSpan(cell.rowspan);
            const colSpan = normalizeSpan(cell.colspan);
            const key = getCellKey(rowIndex, colIndex);

            cells[key] = {
                elements: [
                    {
                        name: "text",
                        attributes: {
                            ...textAttributeDefaults,
                            content: cell.content || "",
                            align: normalizeAlign(cell.align),
                        },
                    },
                ],
                ...(rowSpan > 1 || colSpan > 1
                    ? {
                          span: {
                              rowSpan,
                              colSpan,
                          },
                      }
                    : {}),
            };

            for (let rowOffset = 0; rowOffset < rowSpan; rowOffset++) {
                for (let colOffset = 0; colOffset < colSpan; colOffset++) {
                    if (rowOffset === 0 && colOffset === 0) {
                        continue;
                    }

                    occupied.add(
                        getCellKey(rowIndex + rowOffset, colIndex + colOffset)
                    );
                }
            }

            colIndex += colSpan;
        });
    });

    const totalCols = Object.entries(cells).reduce((max, [key, cell]) => {
        const [, colIndex] = key
            .split(",")
            .map(value => Number.parseInt(value, 10));
        const colSpan = cell.span?.colSpan || 1;
        return Math.max(max, colIndex + colSpan);
    }, 0);

    return {
        ...attrDefaults,
        version: attrVersion,
        table: {
            ...attrDefaults.table,
            rows: rows.length,
            cols: totalCols,
            headerEnabled: head.length > 0,
            footerEnabled: foot.length > 0,
            caption: attributes.caption || "",
            fixedColumnWidths: attributes.hasFixedLayout ?? true,
        },
        cells,
    };
}

const transforms = {
    from: [
        {
            type: "block" as const,
            blocks: ["core/table"],
            transform: (attributes: CoreTableAttrs) => {
                const v3Attrs = buildTablebergAttrs(attributes);

                return createBlock(
                    "tableberg/table",
                    toV4Attrs(v3Attrs),
                    buildRowBlocksFromV3(v3Attrs)
                );
            },
        },
    ],
} as any;

export default transforms;

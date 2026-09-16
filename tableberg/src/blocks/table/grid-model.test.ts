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

const cell = (id: string, rowSpan = 1, colSpan = 1) => ({
    id,
    rowSpan,
    colSpan,
});

/**
 * 3x3 with a 2x2 merged block "M" anchored at (0,0):
 *   M M a
 *   M M b
 *   c d e
 */
const spanned: GridRow[] = [
    [cell("M", 2, 2), cell("a")],
    [cell("b")],
    [cell("c"), cell("d"), cell("e")],
];

const plain: GridRow[] = [
    [cell("a1"), cell("a2"), cell("a3")],
    [cell("b1"), cell("b2"), cell("b3")],
];

describe("buildOccupancy", () => {
    it("maps anchors and covered positions", () => {
        const { matrix, anchors, cols } = buildOccupancy(spanned);

        expect(cols).toBe(3);
        expect(matrix[0]).toEqual(["M", "M", "a"]);
        expect(matrix[1]).toEqual(["M", "M", "b"]);
        expect(matrix[2]).toEqual(["c", "d", "e"]);
        expect(anchors.get("b")).toEqual({ row: 1, col: 2 });
        expect(anchors.get("d")).toEqual({ row: 2, col: 1 });
    });

    it("computes cellColumn through spans", () => {
        expect(cellColumn(spanned, "b")).toBe(2);
        expect(cellColumn(spanned, "e")).toBe(2);
    });
});

describe("planInsertRow", () => {
    it("plain: full-width new row", () => {
        expect(planInsertRow(plain, 1)).toEqual({
            growSpans: [],
            newCellCount: 3,
        });
    });

    it("grows spans crossing the line and shrinks the new row", () => {
        // Between row0 and row1: M (rows 0-1) crosses.
        expect(planInsertRow(spanned, 1)).toEqual({
            growSpans: ["M"],
            newCellCount: 1,
        });
    });

    it("no crossing at outer edges", () => {
        expect(planInsertRow(spanned, 0).growSpans).toEqual([]);
        expect(planInsertRow(spanned, 3).growSpans).toEqual([]);
        expect(planInsertRow(spanned, 0).newCellCount).toBe(3);
    });
});

describe("planDeleteRow", () => {
    it("plain: nothing special", () => {
        expect(planDeleteRow(plain, 0)).toEqual({
            shrinkSpans: [],
            reanchor: [],
        });
    });

    it("shrinks spans crossing the deleted row", () => {
        // Deleting row 1: M crosses (anchored row 0, extends into row 1).
        expect(planDeleteRow(spanned, 1)).toEqual({
            shrinkSpans: ["M"],
            reanchor: [],
        });
    });

    it("re-anchors spans anchored in the deleted row", () => {
        // Deleting row 0: M is anchored there with rowSpan 2 -> it must be
        // recreated in row 1 (as first cell) with rowSpan 1.
        expect(planDeleteRow(spanned, 0)).toEqual({
            shrinkSpans: [],
            reanchor: [
                { id: "M", insertIndex: 0, rowSpan: 1, colSpan: 2 },
            ],
        });
    });
});

describe("planInsertColumn", () => {
    it("plain: inserts at the right array position in each row", () => {
        expect(planInsertColumn(plain, 1)).toEqual([
            { type: "insert", rowIndex: 0, insertIndex: 1 },
            { type: "insert", rowIndex: 1, insertIndex: 1 },
        ]);
    });

    it("grows a span crossed by the line, once, at its anchor row", () => {
        // Line between col0 and col1 runs through M (cols 0-1).
        expect(planInsertColumn(spanned, 1)).toEqual([
            { type: "grow", rowIndex: 0, id: "M" },
            { type: "skip", rowIndex: 1 },
            { type: "insert", rowIndex: 2, insertIndex: 1 },
        ]);
    });

    it("edge inserts never split spans", () => {
        expect(planInsertColumn(spanned, 0)).toEqual([
            { type: "insert", rowIndex: 0, insertIndex: 0 },
            { type: "insert", rowIndex: 1, insertIndex: 0 },
            { type: "insert", rowIndex: 2, insertIndex: 0 },
        ]);
        expect(planInsertColumn(spanned, 3)).toEqual([
            { type: "insert", rowIndex: 0, insertIndex: 2 },
            { type: "insert", rowIndex: 1, insertIndex: 1 },
            { type: "insert", rowIndex: 2, insertIndex: 3 },
        ]);
    });
});

describe("planDeleteColumn", () => {
    it("plain: removes one cell per row", () => {
        expect(planDeleteColumn(plain, 1)).toEqual([
            { type: "remove", rowIndex: 0, id: "a2" },
            { type: "remove", rowIndex: 1, id: "b2" },
        ]);
    });

    it("shrinks spans covering the column", () => {
        expect(planDeleteColumn(spanned, 0)).toEqual([
            { type: "shrink", rowIndex: 0, id: "M" },
            { type: "skip", rowIndex: 1 },
            { type: "remove", rowIndex: 2, id: "c" },
        ]);
    });
});

describe("planMerge", () => {
    it("merges a clean rectangle", () => {
        expect(planMerge(plain, ["a1", "a2"])).toEqual({
            anchorId: "a1",
            rowSpan: 1,
            colSpan: 2,
            absorbedIds: ["a2"],
        });
    });

    it("merges vertically across rows", () => {
        expect(planMerge(plain, ["a1", "b1"])).toEqual({
            anchorId: "a1",
            rowSpan: 2,
            colSpan: 1,
            absorbedIds: ["b1"],
        });
    });

    it("merges an already-merged cell with neighbours tiling a rect", () => {
        // M (2x2) + a + b = full 2x3 rect.
        expect(planMerge(spanned, ["M", "a", "b"])).toEqual({
            anchorId: "M",
            rowSpan: 2,
            colSpan: 3,
            absorbedIds: ["a", "b"],
        });
    });

    it("rejects non-rectangular selections", () => {
        // L-shape: a1 + a2 + b1
        expect(planMerge(plain, ["a1", "a2", "b1"])).toBeNull();
        // M + c does not tile a rectangle.
        expect(planMerge(spanned, ["M", "c"])).toBeNull();
    });

    it("rejects fewer than two cells", () => {
        expect(planMerge(plain, ["a1"])).toBeNull();
    });
});

describe("planSplit", () => {
    it("splits a merged cell into 1x1 positions", () => {
        expect(planSplit(spanned, "M")).toEqual({
            inserts: [
                { rowIndex: 0, insertIndex: 1, count: 1 },
                { rowIndex: 1, insertIndex: 0, count: 2 },
            ],
        });
    });

    it("returns null for 1x1 cells", () => {
        expect(planSplit(plain, "a1")).toBeNull();
    });
});

describe("round-trips", () => {
    it("insert row then occupancy stays consistent", () => {
        const plan = planInsertRow(spanned, 1);
        // Simulate: M grows to rowSpan 3, new row with 1 cell inserted at 1.
        const grown: GridRow[] = [
            [cell("M", 3, 2), cell("a")],
            [cell("new1")],
            [cell("b")],
            [cell("c"), cell("d"), cell("e")],
        ];
        expect(plan.newCellCount).toBe(1);
        const { matrix, cols } = buildOccupancy(grown);
        expect(cols).toBe(3);
        expect(matrix[1]).toEqual(["M", "M", "new1"]);
        expect(matrix[2]).toEqual(["M", "M", "b"]);
    });

    it("merge then split restores full occupancy", () => {
        const merge = planMerge(plain, ["a1", "a2", "b1", "b2"]);
        expect(merge).toEqual({
            anchorId: "a1",
            rowSpan: 2,
            colSpan: 2,
            absorbedIds: ["a2", "b1", "b2"],
        });

        const merged: GridRow[] = [
            [cell("a1", 2, 2), cell("a3")],
            [cell("b3")],
        ];
        const split = planSplit(merged, "a1");
        expect(split).toEqual({
            inserts: [
                { rowIndex: 0, insertIndex: 1, count: 1 },
                { rowIndex: 1, insertIndex: 0, count: 2 },
            ],
        });
    });
});

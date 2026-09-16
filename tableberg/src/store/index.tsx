import { createContext, useContext, ReactNode, useRef, useEffect } from "react";
import { create } from "zustand";
import {
    attrDefaults,
    TablebergBlockAttrs,
    TableConfig,
    TableCellStylesType,
    CellElement,
    SortableType,
    ColumnConfig,
    RowConfig,
    PaginationConfig,
    RibbonConfig,
    BindingDefinition,
    Cell,
    CellKey,
    getCellKey,
    parseCellKey,
} from "../attributes";
import { ElementBindings } from "../dynamic-data/types";
import { SortOrder, sortRowsByColumn, isColumnSortable } from "../sorting";
import { tableHasRowSpanningCells, getTotalPages } from "../pagination";
import { filterRowsBySearch } from "../search";
import { createElement } from "../elements";
import {
    insertRowAt,
    insertColumnAt,
    deleteRowAt,
    deleteColumnAt,
    duplicateRowAt,
    duplicateColumnAt,
    moveRowTo,
    moveColumnTo,
    hasMergedCells,
} from "../table-structure";
import { cloneValue } from "../hooks/block-editor-compat/elementClipboard";

export type TableEditPreview = {
    operation: "insert" | "duplicate" | "delete";
    target: "row" | "column";
    index: number;
} | null;

export interface SelectedElement {
    cell: CellKey;
    elementIndex: number;
}

export interface TableState extends TablebergBlockAttrs {
    selectedCells: Array<CellKey>;
    /** Native editor's modifier-click marquee (cell block clientIds). */
    nativeSelectedCells: string[];
    selectedElement: SelectedElement | null;
    selectedRibbonCell: CellKey | null;
    tableEditPreview: TableEditPreview;

    sortPreviewMode: boolean;
    previewSortColumn: number | null;
    previewSortOrder: SortOrder;

    currentPage: number;

    searchTerm: string;
    showCaption: boolean;
    showRowColumnControls: boolean;
    showDuplicateMoveControls: boolean;

    setTable: (table: TableConfig) => void;
    setCells: (cells: Record<CellKey, Cell>) => void;
    setCellDefaults: (
        cellDefaults: TablebergBlockAttrs["cellDefaults"]
    ) => void;
    setBindings: (bindings: Record<string, BindingDefinition>) => void;
    setSelectedCells: (coords: Array<CellKey>) => void;
    setNativeSelectedCells: (clientIds: string[]) => void;
    setSelectedElement: (cell: CellKey, elementIndex: number) => void;
    clearSelectedElement: () => void;
    isElementSelected: (cell: CellKey, elementIndex: number) => boolean;

    updateTable: (updates: Partial<TableConfig>) => void;
    updateCellGlobalStyles: (updates: Partial<TableCellStylesType>) => void;
    updateCellStyles: (
        coords: CellKey,
        updates: Partial<TableCellStylesType>
    ) => void;
    addSelectedCells: (coords: Array<CellKey>) => void;

    getCellStyle: (coord: CellKey) => Partial<TableCellStylesType> | undefined;
    getCellSpan: (coord: CellKey) => { rowSpan: number; colSpan: number };
    getCellRibbon: (coord: CellKey) => RibbonConfig | undefined;
    setCellRibbon: (coord: CellKey, ribbon: RibbonConfig | undefined) => void;
    setSelectedRibbon: (cell: CellKey) => void;
    clearSelectedRibbon: () => void;
    isRibbonSelected: (cell: CellKey) => boolean;
    setTableEditPreview: (preview: TableEditPreview) => void;
    clearTableEditPreview: () => void;

    addElementToCell: (coord: CellKey, element: CellElement) => void;
    insertElementInCell: (
        coord: CellKey,
        elementIndex: number,
        element: CellElement
    ) => void;
    reorderElementsInCell: (
        coord: CellKey,
        sourceIndicesInNextOrder: number[]
    ) => void;
    duplicateElementInCell: (coord: CellKey, elementIndex: number) => void;
    removeElementFromCell: (coord: CellKey, elementIndex: number) => void;
    updateCellElement: (
        coord: CellKey,
        elementIndex: number,
        updates: { attributes: Partial<CellElement["attributes"]> }
    ) => void;
    updateSelectedElementStyles: (styles: Record<string, unknown>) => void;
    updateSelectedElementAttrs: (attrs: Record<string, unknown>) => void;
    updateSelectedElementBindings: (
        bindings: ElementBindings | undefined
    ) => void;
    createBindingDefinition: (binding: BindingDefinition) => string;
    updateBindingDefinition: (
        bindingId: string,
        binding: BindingDefinition
    ) => void;
    removeBindingDefinition: (bindingId: string) => void;
    replaceCellElement: (
        coord: CellKey,
        elementIndex: number,
        newElement: CellElement
    ) => void;

    setColumnSortable: (
        column: number,
        sortable: SortableType | undefined
    ) => void;
    setColumnWidth: (column: number, width: string | undefined) => void;
    insertRow: (rowIndex: number) => void;
    deleteRow: (rowIndex: number) => void;
    insertColumn: (columnIndex: number) => void;
    deleteColumn: (columnIndex: number) => void;
    duplicateRow: (rowIndex: number) => void;
    duplicateColumn: (columnIndex: number) => void;
    moveRow: (subjectRow: number, targetRow: number) => void;
    moveColumn: (subjectColumn: number, targetColumn: number) => void;
    getColumnConfig: (column: number) => ColumnConfig | undefined;
    setRowHeight: (row: number, height: string | undefined) => void;
    getRowConfig: (row: number) => RowConfig | undefined;
    isColumnSortableAllowed: (column: number) => boolean;

    enterSortPreviewMode: () => void;
    exitSortPreviewMode: () => void;
    setPreviewSort: (column: number | null, order?: SortOrder) => void;
    togglePreviewSort: (column: number) => void;
    getSortedRowIndices: () => number[];

    setCurrentPage: (page: number) => void;
    setPaginationConfig: (config: Partial<PaginationConfig>) => void;
    isPaginationAllowed: () => boolean;

    setSearchTerm: (term: string) => void;
    getFilteredRowIndices: () => number[];
    setShowCaption: (show: boolean) => void;
    toggleRowColumnControls: () => void;
    toggleDuplicateMoveControls: () => void;

    setTableAttrs: (attrs: TablebergBlockAttrs) => void;
    getTableAttrs: () => TablebergBlockAttrs;

    setAttrVersion: (version: number) => void;

    reset: () => void;
}

type TableStore = ReturnType<typeof createTableStore>;

type RowType = "header" | "footer" | "even" | "odd";
type HomogeneousRowTypeColors = Partial<Record<RowType, string>>;

function setCell(
    coord: CellKey,
    cell: Cell | undefined,
    cells: Record<CellKey, Cell>
): Record<CellKey, Cell> {
    const nextCells = { ...cells };

    if (
        !cell ||
        (cell.span === undefined &&
            cell.elements === undefined &&
            cell.styles === undefined &&
            cell.ribbon === undefined)
    ) {
        delete nextCells[coord];
        return nextCells;
    }

    nextCells[coord] = cell;
    return nextCells;
}

function getCellRow(coord: CellKey): number {
    return parseCellKey(coord)[0];
}

function getCellColumn(coord: CellKey): number {
    return parseCellKey(coord)[1];
}

function getRowSiblingCellCoordsFromCells(
    cells: Record<CellKey, Cell>,
    rowIndices: number[]
): CellKey[] {
    if (rowIndices.length === 0) {
        return [];
    }

    const rowSet = new Set(rowIndices);

    return Object.keys(cells).filter(key =>
        rowSet.has(parseCellKey(key)[0])
    ) as CellKey[];
}

function getCellStyleOverrides(cells: Record<CellKey, Cell>) {
    const styleMap = new Map<string, Partial<TableCellStylesType>>();

    Object.entries(cells).forEach(([key, cell]) => {
        if (cell.styles) {
            styleMap.set(key, cell.styles);
        }
    });

    return styleMap;
}

function collectUsedBindingIds(cells: Record<CellKey, Cell>): Set<string> {
    const used = new Set<string>();

    Object.values(cells).forEach(cell => {
        const elements = cell.elements || [];
        elements.forEach(element => {
            Object.values(element.bindings || {}).forEach(bindingId => {
                if (bindingId) {
                    used.add(bindingId);
                }
            });
        });
    });

    return used;
}

function pruneUnusedBindings(
    bindings: Record<string, BindingDefinition>,
    cells: Record<CellKey, Cell>
): Record<string, BindingDefinition> {
    const usedBindingIds = collectUsedBindingIds(cells);
    const nextBindings: Record<string, BindingDefinition> = {};

    Object.entries(bindings).forEach(([bindingId, binding]) => {
        if (usedBindingIds.has(bindingId)) {
            nextBindings[bindingId] = binding;
        }
    });

    return nextBindings;
}

const getRowType = (row: number, rows: number, table: TableConfig): RowType => {
    if (table.headerEnabled && row === 0) {
        return "header";
    }

    if (table.footerEnabled && row === rows - 1) {
        return "footer";
    }

    const adjustedRow = table.headerEnabled ? row - 1 : row;

    return adjustedRow % 2 === 0 ? "odd" : "even";
};

const getCommonBackgroundColor = (
    coords: CellKey[],
    cellStyleMap: Map<string, Partial<TableCellStylesType>>,
    globalBackgroundColor: string
): string | undefined => {
    if (coords.length === 0) {
        return undefined;
    }

    let commonColor: string | undefined;
    let hasExplicitColor = false;

    for (const coord of coords) {
        const cellStyle = cellStyleMap.get(coord);
        const explicitBackgroundColor = cellStyle?.backgroundColor?.trim();

        if (explicitBackgroundColor) {
            hasExplicitColor = true;
        }

        const resolvedBackgroundColor =
            explicitBackgroundColor || globalBackgroundColor;

        if (commonColor === undefined) {
            commonColor = resolvedBackgroundColor;
            continue;
        }

        if (commonColor !== resolvedBackgroundColor) {
            return undefined;
        }
    }

    if (!commonColor || !hasExplicitColor) {
        return undefined;
    }

    return commonColor;
};

const getHomogeneousRowTypeColors = ({
    table,
    cells,
    cellDefaults,
}: {
    table: TableConfig;
    cells: Record<CellKey, Cell>;
    cellDefaults: TablebergBlockAttrs["cellDefaults"];
}): HomogeneousRowTypeColors => {
    const styleMap = getCellStyleOverrides(cells);

    const rowTypes: RowType[] = ["header", "even", "odd", "footer"];
    const colors: HomogeneousRowTypeColors = {};

    rowTypes.forEach(rowType => {
        const rowIndices: number[] = [];

        for (let row = 0; row < table.rows; row++) {
            if (getRowType(row, table.rows, table) === rowType) {
                rowIndices.push(row);
            }
        }

        const color = getCommonBackgroundColor(
            getRowSiblingCellCoordsFromCells(cells, rowIndices),
            styleMap,
            cellDefaults.styles.backgroundColor
        );

        if (color) {
            colors[rowType] = color;
        }
    });

    return colors;
};

const applyRowTypeColorsToCells = (
    cells: Record<CellKey, Cell>,
    targetCells: CellKey[],
    totalRows: number,
    table: TableConfig,
    rowTypeColors: HomogeneousRowTypeColors
): Record<CellKey, Cell> => {
    if (targetCells.length === 0) {
        return cells;
    }

    let nextCells = { ...cells };

    targetCells.forEach(coord => {
        const [row] = parseCellKey(coord);
        const rowType = getRowType(row, totalRows, table);
        const color = rowTypeColors[rowType];

        if (!color) {
            return;
        }

        const existingCell = nextCells[coord] || {};
        nextCells = setCell(
            coord,
            {
                ...existingCell,
                styles: {
                    ...(existingCell.styles || {}),
                    backgroundColor: color,
                },
            },
            nextCells
        );
    });

    return nextCells;
};

const getRowsToRecolorAfterInsert = (
    insertAt: number,
    previousRowCount: number,
    tableConfig: TableConfig,
    rowTypeColors: HomogeneousRowTypeColors
): number[] => {
    const rowsToRecolor = new Set<number>();
    const nextRowCount = previousRowCount + 1;

    const insertedRowType = getRowType(insertAt, nextRowCount, tableConfig);
    if (rowTypeColors[insertedRowType]) {
        rowsToRecolor.add(insertAt);
    }

    for (let row = insertAt; row < previousRowCount; row++) {
        const shiftedRow = row + 1;
        const previousRowType = getRowType(row, previousRowCount, tableConfig);
        const shiftedRowType = getRowType(
            shiftedRow,
            nextRowCount,
            tableConfig
        );

        if (
            previousRowType !== shiftedRowType &&
            rowTypeColors[shiftedRowType]
        ) {
            rowsToRecolor.add(shiftedRow);
        }
    }

    return Array.from(rowsToRecolor);
};

function createTableStore(initialValues?: TablebergBlockAttrs) {
    return create<TableState>((set, get) => {
        const attrs = initialValues || attrDefaults;
        const initialState = {
            ...attrs,
            selectedCells: [] as Array<CellKey>,
            nativeSelectedCells: [] as string[],
            selectedElement: null as SelectedElement | null,
            selectedRibbonCell: null as CellKey | null,
            tableEditPreview: null as TableEditPreview,
            sortPreviewMode: false,
            previewSortColumn: null as number | null,
            previewSortOrder: "asc" as SortOrder,
            currentPage: 0,
            searchTerm: "",
            showCaption: !!(attrs.table.caption || ""),
            showRowColumnControls: true,
            showDuplicateMoveControls: true,
        };

        return {
            ...initialState,

            setTable: table => set({ table }),
            setCells: cells =>
                set(state => ({
                    cells,
                    bindings: pruneUnusedBindings(state.bindings, cells),
                })),
            setCellDefaults: cellDefaults => set({ cellDefaults }),
            setBindings: bindings => set({ bindings }),

            updateTable: updates =>
                set(state => ({
                    table: { ...state.table, ...updates },
                })),

            updateCellGlobalStyles: updates =>
                set(state => {
                    const updatedKeys = Object.keys(updates) as Array<
                        keyof TableCellStylesType
                    >;
                    const cells = Object.fromEntries(
                        Object.entries(state.cells).map(([key, cell]) => {
                            if (!cell.styles) {
                                return [key, cell];
                            }

                            const nextStyles = { ...cell.styles };
                            updatedKeys.forEach(styleKey => {
                                delete nextStyles[styleKey];
                            });

                            return [
                                key,
                                {
                                    ...cell,
                                    styles:
                                        Object.keys(nextStyles).length > 0
                                            ? nextStyles
                                            : undefined,
                                },
                            ];
                        })
                    ) as Record<CellKey, Cell>;

                    return {
                        cells,
                        cellDefaults: {
                            styles: {
                                ...state.cellDefaults.styles,
                                ...updates,
                            },
                        },
                    };
                }),

            updateCellStyles: (coord, updates) => {
                set(state => {
                    const existingCell = state.cells[coord] || {};
                    return {
                        cells: setCell(
                            coord,
                            {
                                ...existingCell,
                                styles: {
                                    ...(existingCell.styles || {}),
                                    ...updates,
                                },
                            },
                            state.cells
                        ),
                    };
                });
            },

            getCellStyle: coord => {
                return get().cells[coord]?.styles;
            },

            getCellSpan: coord => {
                return (
                    get().cells[coord]?.span || {
                        rowSpan: 1,
                        colSpan: 1,
                    }
                );
            },

            getCellRibbon: coord => {
                return get().cells[coord]?.ribbon;
            },

            setCellRibbon: (coord, ribbon) => {
                set(state => {
                    const existingCell = state.cells[coord] || {};
                    return {
                        cells: setCell(
                            coord,
                            {
                                ...existingCell,
                                ribbon,
                            },
                            state.cells
                        ),
                    };
                });
            },

            addElementToCell: (coord, element) => {
                set(state => {
                    const nextElements = [
                        ...(state.cells[coord]?.elements || []),
                        element,
                    ];
                    let nextElementIndex = 0;
                    nextElementIndex = nextElements.length - 1;
                    const cells = setCell(
                        coord,
                        {
                            ...(state.cells[coord] || {}),
                            elements: nextElements,
                        },
                        state.cells
                    );

                    return {
                        cells,
                        selectedElement: {
                            cell: coord,
                            elementIndex: nextElementIndex,
                        },
                        selectedRibbonCell: null,
                    };
                });
            },

            insertElementInCell: (coord, elementIndex, element) => {
                set(state => {
                    const existingCell = state.cells[coord];
                    const cellElements = [
                        ...(state.cells[coord]?.elements || []),
                    ];

                    if (!existingCell && elementIndex !== 0) {
                        return state;
                    }

                    if (cellElements.length === 0 && elementIndex === 0) {
                        const cells = setCell(
                            coord,
                            { ...(existingCell || {}), elements: [element] },
                            state.cells
                        );

                        return {
                            cells,
                            selectedElement: {
                                cell: coord,
                                elementIndex: 0,
                            },
                            selectedRibbonCell: null,
                        };
                    }

                    if (cellElements.length === 0) {
                        if (elementIndex !== 0) {
                            return state;
                        }
                    }
                    const insertAt = Math.max(
                        0,
                        Math.min(elementIndex, cellElements.length)
                    );

                    cellElements.splice(insertAt, 0, element);
                    const cells = setCell(
                        coord,
                        { ...(existingCell || {}), elements: cellElements },
                        state.cells
                    );

                    return {
                        cells,
                        selectedElement: {
                            cell: coord,
                            elementIndex: insertAt,
                        },
                        selectedRibbonCell: null,
                    };
                });
            },

            reorderElementsInCell: (coord, sourceIndicesInNextOrder) => {
                set(state => {
                    const existingCell = state.cells[coord];
                    if (!existingCell) {
                        return state;
                    }

                    const cellElements = [...(existingCell.elements || [])];

                    if (
                        cellElements.length !== sourceIndicesInNextOrder.length
                    ) {
                        return state;
                    }

                    const validIndices = new Set<number>();

                    for (const sourceIndex of sourceIndicesInNextOrder) {
                        if (
                            sourceIndex < 0 ||
                            sourceIndex >= cellElements.length ||
                            validIndices.has(sourceIndex)
                        ) {
                            return state;
                        }

                        validIndices.add(sourceIndex);
                    }

                    const reorderedElements = sourceIndicesInNextOrder.map(
                        sourceIndex => cellElements[sourceIndex]
                    );
                    const didChangeOrder = reorderedElements.some(
                        (element, index) => element !== cellElements[index]
                    );

                    if (!didChangeOrder) {
                        return state;
                    }

                    const cells = setCell(
                        coord,
                        { ...existingCell, elements: reorderedElements },
                        state.cells
                    );

                    let nextSelectedElement = state.selectedElement;

                    if (
                        nextSelectedElement &&
                        nextSelectedElement.cell === coord
                    ) {
                        const nextIndex = sourceIndicesInNextOrder.findIndex(
                            sourceIndex =>
                                sourceIndex ===
                                nextSelectedElement?.elementIndex
                        );

                        nextSelectedElement =
                            nextIndex === -1
                                ? null
                                : {
                                      cell: coord,
                                      elementIndex: nextIndex,
                                  };
                    }

                    return {
                        cells,
                        selectedElement: nextSelectedElement,
                    };
                });
            },

            duplicateElementInCell: (coord, elementIndex) => {
                set(state => {
                    const existingCell = state.cells[coord];
                    if (!existingCell) return state;

                    const cellElements = [...(existingCell.elements || [])];
                    const sourceElement = cellElements[elementIndex];

                    if (!sourceElement) {
                        return state;
                    }

                    const nextElementIndex = elementIndex + 1;
                    cellElements.splice(
                        nextElementIndex,
                        0,
                        cloneValue(sourceElement) as CellElement
                    );
                    const cells = setCell(
                        coord,
                        { ...existingCell, elements: cellElements },
                        state.cells
                    );

                    return {
                        cells,
                        selectedElement: {
                            cell: coord,
                            elementIndex: nextElementIndex,
                        },
                        selectedRibbonCell: null,
                    };
                });
            },

            removeElementFromCell: (coord, elementIndex) => {
                set(state => {
                    const existingCell = state.cells[coord];
                    if (!existingCell) return state;

                    const cellElements = [...(existingCell.elements || [])];
                    if (
                        elementIndex < 0 ||
                        elementIndex >= cellElements.length
                    ) {
                        return state;
                    }

                    cellElements.splice(elementIndex, 1);
                    const cells = setCell(
                        coord,
                        { ...existingCell, elements: cellElements },
                        state.cells
                    );

                    let nextSelectedElement = state.selectedElement;
                    if (
                        nextSelectedElement &&
                        nextSelectedElement.cell === coord
                    ) {
                        if (nextSelectedElement.elementIndex === elementIndex) {
                            nextSelectedElement = null;
                        } else if (
                            nextSelectedElement.elementIndex > elementIndex
                        ) {
                            nextSelectedElement = {
                                cell: nextSelectedElement.cell,
                                elementIndex:
                                    nextSelectedElement.elementIndex - 1,
                            };
                        }
                    }

                    const bindings = pruneUnusedBindings(state.bindings, cells);

                    return {
                        cells,
                        bindings,
                        selectedElement: nextSelectedElement,
                    };
                });
            },

            updateCellElement: (coord, elementIndex, updates) => {
                set(state => {
                    const existingCell = state.cells[coord];
                    if (!existingCell) return state;

                    const cellElements = [...(existingCell.elements || [])];
                    if (elementIndex >= cellElements.length) return state;

                    cellElements[elementIndex] = {
                        ...cellElements[elementIndex],
                        attributes: {
                            ...cellElements[elementIndex].attributes,
                            ...updates.attributes,
                        },
                    } as CellElement;
                    return {
                        cells: setCell(
                            coord,
                            { ...existingCell, elements: cellElements },
                            state.cells
                        ),
                    };
                });
            },

            updateSelectedElementStyles: styles => {
                const { selectedElement } = get();
                if (!selectedElement) return;

                set(state => {
                    const existingCell = state.cells[selectedElement.cell];
                    if (!existingCell) return state;

                    const cellElements = [...(existingCell.elements || [])];
                    const elementIndex = selectedElement.elementIndex;
                    if (elementIndex >= cellElements.length) return state;

                    const element = cellElements[elementIndex];
                    const currentStyles =
                        (
                            element.attributes as {
                                styles?: Record<string, unknown>;
                            }
                        ).styles || {};

                    cellElements[elementIndex] = {
                        ...element,
                        attributes: {
                            ...element.attributes,
                            styles: {
                                ...currentStyles,
                                ...styles,
                            },
                        },
                    } as CellElement;
                    return {
                        cells: setCell(
                            selectedElement.cell,
                            { ...existingCell, elements: cellElements },
                            state.cells
                        ),
                    };
                });
            },

            updateSelectedElementAttrs: attrs => {
                const { selectedElement } = get();
                if (!selectedElement) return;

                set(state => {
                    const existingCell = state.cells[selectedElement.cell];
                    if (!existingCell) return state;

                    const cellElements = [...(existingCell.elements || [])];
                    const elementIndex = selectedElement.elementIndex;
                    if (elementIndex >= cellElements.length) return state;

                    const element = cellElements[elementIndex];

                    cellElements[elementIndex] = {
                        ...element,
                        attributes: {
                            ...element.attributes,
                            ...attrs,
                        },
                    } as CellElement;
                    return {
                        cells: setCell(
                            selectedElement.cell,
                            { ...existingCell, elements: cellElements },
                            state.cells
                        ),
                    };
                });
            },

            updateSelectedElementBindings: bindings => {
                const { selectedElement } = get();
                if (!selectedElement) return;

                set(state => {
                    const existingCell = state.cells[selectedElement.cell];
                    if (!existingCell) return state;

                    const cellElements = [...(existingCell.elements || [])];
                    const elementIndex = selectedElement.elementIndex;
                    if (elementIndex >= cellElements.length) return state;

                    const element = cellElements[elementIndex];

                    const updatedElement = {
                        ...element,
                        bindings,
                    };

                    if (bindings === undefined) {
                        delete (
                            updatedElement as { bindings?: ElementBindings }
                        ).bindings;
                    }

                    cellElements[elementIndex] = updatedElement as CellElement;
                    const cells = setCell(
                        selectedElement.cell,
                        { ...existingCell, elements: cellElements },
                        state.cells
                    );
                    const nextBindings = pruneUnusedBindings(
                        state.bindings,
                        cells
                    );

                    return {
                        cells,
                        bindings: nextBindings,
                    };
                });
            },

            createBindingDefinition: binding => {
                const bindingId = `${Math.random().toString(36).slice(2, 10)}`;
                set(state => ({
                    bindings: {
                        ...state.bindings,
                        [bindingId]: binding,
                    },
                }));
                return bindingId;
            },

            updateBindingDefinition: (bindingId, binding) => {
                set(state => ({
                    bindings: {
                        ...state.bindings,
                        [bindingId]: binding,
                    },
                }));
            },

            removeBindingDefinition: bindingId => {
                set(state => {
                    const bindings = { ...state.bindings };
                    delete bindings[bindingId];
                    return { bindings };
                });
            },

            replaceCellElement: (coord, elementIndex, newElement) => {
                set(state => {
                    const existingCell = state.cells[coord];
                    if (!existingCell) return state;

                    const cellElements = [...(existingCell.elements || [])];
                    if (elementIndex >= cellElements.length) return state;

                    cellElements[elementIndex] = newElement;
                    const cells = setCell(
                        coord,
                        { ...existingCell, elements: cellElements },
                        state.cells
                    );
                    const bindings = pruneUnusedBindings(state.bindings, cells);

                    return {
                        cells,
                        bindings,
                    };
                });
            },

            setSelectedCells: coords =>
                set(state => {
                    if (
                        state.selectedCells.length === coords.length &&
                        state.selectedCells.every(
                            (coord, index) => coord === coords[index]
                        )
                    ) {
                        return state;
                    }

                    return { selectedCells: coords };
                }),

            setNativeSelectedCells: clientIds =>
                set(state => {
                    if (
                        state.nativeSelectedCells.length ===
                            clientIds.length &&
                        state.nativeSelectedCells.every(
                            (id, index) => id === clientIds[index]
                        )
                    ) {
                        return state;
                    }

                    return { nativeSelectedCells: clientIds };
                }),

            setSelectedElement: (cell, elementIndex) => {
                set(state => {
                    if (
                        state.selectedElement?.cell === cell &&
                        state.selectedElement.elementIndex === elementIndex
                    ) {
                        return state;
                    }

                    return { selectedElement: { cell, elementIndex } };
                });
            },

            clearSelectedElement: () => {
                set(state => {
                    if (state.selectedElement === null) {
                        return state;
                    }

                    return { selectedElement: null };
                });
            },

            isElementSelected: (cell, elementIndex) => {
                const { selectedElement } = get();
                return (
                    selectedElement !== null &&
                    selectedElement.cell === cell &&
                    selectedElement.elementIndex === elementIndex
                );
            },

            setSelectedRibbon: cell => {
                set(state => {
                    if (
                        state.selectedRibbonCell === cell &&
                        state.selectedElement === null
                    ) {
                        return state;
                    }

                    return { selectedRibbonCell: cell, selectedElement: null };
                });
            },

            clearSelectedRibbon: () => {
                set(state => {
                    if (state.selectedRibbonCell === null) {
                        return state;
                    }

                    return { selectedRibbonCell: null };
                });
            },

            isRibbonSelected: cell => {
                const { selectedRibbonCell } = get();
                return (
                    selectedRibbonCell !== null && selectedRibbonCell === cell
                );
            },

            setTableEditPreview: tableEditPreview => {
                set(state => {
                    const current = state.tableEditPreview;

                    if (
                        current?.operation === tableEditPreview?.operation &&
                        current?.target === tableEditPreview?.target &&
                        current?.index === tableEditPreview?.index
                    ) {
                        return state;
                    }

                    if (current === null && tableEditPreview === null) {
                        return state;
                    }

                    return { tableEditPreview };
                });
            },

            clearTableEditPreview: () => {
                set(state => {
                    if (state.tableEditPreview === null) {
                        return state;
                    }

                    return { tableEditPreview: null };
                });
            },

            addSelectedCells: coords =>
                set(state => {
                    // Toggle each coord: add if absent, remove if already
                    // selected. Keeps the selection free of duplicates so
                    // building a multi-cell selection for merging is reliable.
                    const next = [...state.selectedCells];

                    for (const coord of coords) {
                        const existingIndex = next.indexOf(coord);

                        if (existingIndex === -1) {
                            next.push(coord);
                        } else {
                            next.splice(existingIndex, 1);
                        }
                    }

                    return { selectedCells: next };
                }),

            setColumnSortable: (column, sortable) => {
                set(state => {
                    // columns is an ARRAY — spreading it into an object
                    // turned it into an indexed map, which then crashed
                    // every columns.some() consumer.
                    const columns = state.columns.slice();
                    if (sortable === undefined) {
                        if (columns[column]) {
                            const { sortable: _, ...rest } = columns[column]!;
                            columns[column] =
                                Object.keys(rest).length === 0 ? null : rest;
                        }
                    } else {
                        columns[column] = { ...columns[column], sortable };
                    }
                    return { columns };
                });
            },

            setColumnWidth: (column, width) => {
                set(state => {
                    const columns = state.columns.slice();
                    const normalizedWidth = width?.trim();

                    if (!normalizedWidth) {
                        if (columns[column]) {
                            const { width: _, ...rest } = columns[column];
                            if (Object.keys(rest).length === 0) {
                                delete columns[column];
                            } else {
                                columns[column] = rest;
                            }
                        }
                    } else {
                        columns[column] = {
                            ...columns[column],
                            width: normalizedWidth,
                        };
                    }

                    return { columns };
                });
            },

            insertRow: rowIndex => {
                set(state => {
                    const insertAt = Math.max(
                        0,
                        Math.min(rowIndex, state.table.rows)
                    );
                    const rowTypeColors = getHomogeneousRowTypeColors({
                        table: state.table,
                        cells: state.cells,
                        cellDefaults: state.cellDefaults,
                    });
                    const textElement = createElement("text") ?? undefined;
                    const nextState = insertRowAt(
                        state.table,
                        state.rows,
                        state.columns,
                        state.cells,
                        insertAt,
                        textElement
                    );
                    const rowsToRecolor = getRowsToRecolorAfterInsert(
                        insertAt,
                        state.table.rows,
                        state.table,
                        rowTypeColors
                    );
                    const recoloredCells = applyRowTypeColorsToCells(
                        nextState.cells,
                        getRowSiblingCellCoordsFromCells(
                            nextState.cells,
                            rowsToRecolor
                        ),
                        nextState.table.rows,
                        state.table,
                        rowTypeColors
                    );

                    const selectedCol =
                        state.selectedCells.length > 0
                            ? getCellColumn(state.selectedCells[0])
                            : 0;
                    const nextSelectedCol = Math.max(
                        0,
                        Math.min(selectedCol, nextState.table.cols - 1)
                    );

                    return {
                        table: nextState.table,
                        rows: nextState.rows,
                        columns: nextState.columns,
                        cells: recoloredCells,
                        selectedCells: [getCellKey(insertAt, nextSelectedCol)],
                        selectedElement: null,
                        selectedRibbonCell: null,
                    };
                });
            },

            deleteRow: rowIndex => {
                set(state => {
                    if (state.table.rows <= 1) {
                        return state;
                    }

                    const deleteAt = Math.max(
                        0,
                        Math.min(rowIndex, state.table.rows - 1)
                    );
                    const nextState = deleteRowAt(
                        state.table,
                        state.rows,
                        state.columns,
                        state.cells,
                        deleteAt
                    );

                    const selectedCol =
                        state.selectedCells.length > 0
                            ? getCellColumn(state.selectedCells[0])
                            : 0;
                    const nextSelectedCol = Math.max(
                        0,
                        Math.min(selectedCol, nextState.table.cols - 1)
                    );
                    const nextSelectedRow = Math.max(
                        0,
                        Math.min(deleteAt, nextState.table.rows - 1)
                    );

                    return {
                        table: nextState.table,
                        rows: nextState.rows,
                        columns: nextState.columns,
                        cells: nextState.cells,
                        bindings: pruneUnusedBindings(
                            state.bindings,
                            nextState.cells
                        ),
                        selectedCells: [
                            getCellKey(nextSelectedRow, nextSelectedCol),
                        ],
                        selectedElement: null,
                        selectedRibbonCell: null,
                    };
                });
            },

            insertColumn: columnIndex => {
                set(state => {
                    const insertAt = Math.max(
                        0,
                        Math.min(columnIndex, state.table.cols)
                    );
                    const rowTypeColors = getHomogeneousRowTypeColors({
                        table: state.table,
                        cells: state.cells,
                        cellDefaults: state.cellDefaults,
                    });
                    const textElement = createElement("text") ?? undefined;
                    const nextState = insertColumnAt(
                        state.table,
                        state.rows,
                        state.columns,
                        state.cells,
                        insertAt,
                        textElement
                    );
                    const insertedColumnCells = Object.keys(
                        nextState.cells
                    ).filter(
                        key => getCellColumn(key as CellKey) === insertAt
                    ) as CellKey[];
                    const recoloredCells = applyRowTypeColorsToCells(
                        nextState.cells,
                        insertedColumnCells,
                        nextState.table.rows,
                        state.table,
                        rowTypeColors
                    );

                    const selectedRow =
                        state.selectedCells.length > 0
                            ? getCellRow(state.selectedCells[0])
                            : 0;
                    const nextSelectedRow = Math.max(
                        0,
                        Math.min(selectedRow, nextState.table.rows - 1)
                    );

                    return {
                        table: nextState.table,
                        rows: nextState.rows,
                        columns: nextState.columns,
                        cells: recoloredCells,
                        selectedCells: [getCellKey(nextSelectedRow, insertAt)],
                        selectedElement: null,
                        selectedRibbonCell: null,
                    };
                });
            },

            deleteColumn: columnIndex => {
                set(state => {
                    if (state.table.cols <= 1) {
                        return state;
                    }

                    const deleteAt = Math.max(
                        0,
                        Math.min(columnIndex, state.table.cols - 1)
                    );
                    const nextState = deleteColumnAt(
                        state.table,
                        state.rows,
                        state.columns,
                        state.cells,
                        deleteAt
                    );

                    const selectedRow =
                        state.selectedCells.length > 0
                            ? getCellRow(state.selectedCells[0])
                            : 0;
                    const nextSelectedRow = Math.max(
                        0,
                        Math.min(selectedRow, nextState.table.rows - 1)
                    );
                    const nextSelectedCol = Math.max(
                        0,
                        Math.min(deleteAt, nextState.table.cols - 1)
                    );

                    return {
                        table: nextState.table,
                        rows: nextState.rows,
                        columns: nextState.columns,
                        cells: nextState.cells,
                        bindings: pruneUnusedBindings(
                            state.bindings,
                            nextState.cells
                        ),
                        selectedCells: [
                            getCellKey(nextSelectedRow, nextSelectedCol),
                        ],
                        selectedElement: null,
                        selectedRibbonCell: null,
                    };
                });
            },

            duplicateRow: rowIndex => {
                set(state => {
                    if (hasMergedCells(state.cells)) {
                        return state;
                    }

                    const sourceRow = Math.max(
                        0,
                        Math.min(rowIndex, state.table.rows - 1)
                    );

                    const nextState = duplicateRowAt(
                        state.table,
                        state.rows,
                        state.columns,
                        state.cells,
                        sourceRow
                    );

                    const selectedCol =
                        state.selectedCells.length > 0
                            ? getCellColumn(state.selectedCells[0])
                            : 0;
                    const nextSelectedCol = Math.max(
                        0,
                        Math.min(selectedCol, nextState.table.cols - 1)
                    );

                    return {
                        table: nextState.table,
                        rows: nextState.rows,
                        columns: nextState.columns,
                        cells: nextState.cells,
                        selectedCells: [
                            getCellKey(sourceRow + 1, nextSelectedCol),
                        ],
                        selectedElement: null,
                        selectedRibbonCell: null,
                    };
                });
            },

            duplicateColumn: columnIndex => {
                set(state => {
                    if (hasMergedCells(state.cells)) {
                        return state;
                    }

                    const sourceColumn = Math.max(
                        0,
                        Math.min(columnIndex, state.table.cols - 1)
                    );

                    const nextState = duplicateColumnAt(
                        state.table,
                        state.rows,
                        state.columns,
                        state.cells,
                        sourceColumn
                    );

                    const selectedRow =
                        state.selectedCells.length > 0
                            ? getCellRow(state.selectedCells[0])
                            : 0;
                    const nextSelectedRow = Math.max(
                        0,
                        Math.min(selectedRow, nextState.table.rows - 1)
                    );

                    return {
                        table: nextState.table,
                        rows: nextState.rows,
                        columns: nextState.columns,
                        cells: nextState.cells,
                        selectedCells: [
                            getCellKey(nextSelectedRow, sourceColumn + 1),
                        ],
                        selectedElement: null,
                        selectedRibbonCell: null,
                    };
                });
            },

            moveRow: (subjectRow, targetRow) => {
                set(state => {
                    if (hasMergedCells(state.cells)) {
                        return state;
                    }

                    if (
                        subjectRow < 0 ||
                        subjectRow >= state.table.rows ||
                        targetRow < 0 ||
                        targetRow >= state.table.rows
                    ) {
                        return state;
                    }

                    const nextState = moveRowTo(
                        state.table,
                        state.rows,
                        state.columns,
                        state.cells,
                        subjectRow,
                        targetRow
                    );

                    const selectedCol =
                        state.selectedCells.length > 0
                            ? getCellColumn(state.selectedCells[0])
                            : 0;
                    const nextSelectedCol = Math.max(
                        0,
                        Math.min(selectedCol, nextState.table.cols - 1)
                    );

                    return {
                        table: nextState.table,
                        rows: nextState.rows,
                        columns: nextState.columns,
                        cells: nextState.cells,
                        selectedCells: [getCellKey(targetRow, nextSelectedCol)],
                        selectedElement: null,
                        selectedRibbonCell: null,
                    };
                });
            },

            moveColumn: (subjectColumn, targetColumn) => {
                set(state => {
                    if (hasMergedCells(state.cells)) {
                        return state;
                    }

                    if (
                        subjectColumn < 0 ||
                        subjectColumn >= state.table.cols ||
                        targetColumn < 0 ||
                        targetColumn >= state.table.cols
                    ) {
                        return state;
                    }

                    const nextState = moveColumnTo(
                        state.table,
                        state.rows,
                        state.columns,
                        state.cells,
                        subjectColumn,
                        targetColumn
                    );

                    const selectedRow =
                        state.selectedCells.length > 0
                            ? getCellRow(state.selectedCells[0])
                            : 0;
                    const nextSelectedRow = Math.max(
                        0,
                        Math.min(selectedRow, nextState.table.rows - 1)
                    );

                    return {
                        table: nextState.table,
                        rows: nextState.rows,
                        columns: nextState.columns,
                        cells: nextState.cells,
                        selectedCells: [
                            getCellKey(nextSelectedRow, targetColumn),
                        ],
                        selectedElement: null,
                        selectedRibbonCell: null,
                    };
                });
            },

            getColumnConfig: column => {
                return get().columns[column] || undefined;
            },

            setRowHeight: (row, height) => {
                set(state => {
                    const rowConfigs = state.rows.slice();
                    const normalizedHeight = height?.trim();

                    if (!normalizedHeight) {
                        if (rowConfigs[row]) {
                            const { height: _, ...rest } = rowConfigs[row];
                            if (Object.keys(rest).length === 0) {
                                delete rowConfigs[row];
                            } else {
                                rowConfigs[row] = rest;
                            }
                        }
                    } else {
                        rowConfigs[row] = {
                            ...rowConfigs[row],
                            height: normalizedHeight,
                        };
                    }

                    return { rows: rowConfigs };
                });
            },

            getRowConfig: row => {
                return get().rows[row] || undefined;
            },

            isColumnSortableAllowed: column => {
                return isColumnSortable(column, get().cells);
            },

            enterSortPreviewMode: () => {
                set({
                    sortPreviewMode: true,
                    previewSortColumn: null,
                    previewSortOrder: "asc",
                    selectedCells: [],
                });
            },

            exitSortPreviewMode: () => {
                set({
                    sortPreviewMode: false,
                    previewSortColumn: null,
                    previewSortOrder: "asc",
                });
            },

            setPreviewSort: (column, order) => {
                set(state => ({
                    previewSortColumn: column,
                    previewSortOrder: order || state.previewSortOrder,
                }));
            },

            togglePreviewSort: column => {
                set(state => {
                    if (state.previewSortColumn === column) {
                        if (state.previewSortOrder === "asc") {
                            return { previewSortOrder: "desc" as SortOrder };
                        } else {
                            return {
                                previewSortColumn: null,
                                previewSortOrder: "asc" as SortOrder,
                            };
                        }
                    }
                    return {
                        previewSortColumn: column,
                        previewSortOrder: "asc" as SortOrder,
                    };
                });
            },

            getSortedRowIndices: () => {
                const {
                    sortPreviewMode,
                    previewSortColumn,
                    previewSortOrder,
                    table,
                    columns,
                    cells,
                } = get();

                if (!sortPreviewMode || previewSortColumn === null) {
                    return Array.from({ length: table.rows }, (_, i) => i);
                }

                const sortType = columns[previewSortColumn]?.sortable || "text";

                return sortRowsByColumn(
                    cells,
                    table.rows,
                    table,
                    previewSortColumn,
                    sortType,
                    previewSortOrder
                );
            },

            setCurrentPage: page => {
                set({ currentPage: page });
            },

            setPaginationConfig: config => {
                set(state => {
                    const newPagination = {
                        ...state.table.pagination!,
                        ...config,
                    };

                    const totalPages = getTotalPages(
                        state.table.rows,
                        newPagination.pageSize,
                        state.table.headerEnabled,
                        state.table.footerEnabled
                    );
                    const maxPage = Math.max(0, totalPages - 1);
                    const currentPage = Math.min(state.currentPage, maxPage);

                    return {
                        table: {
                            ...state.table,
                            pagination: newPagination,
                        },
                        currentPage,
                    };
                });
            },

            isPaginationAllowed: () => {
                return !tableHasRowSpanningCells(get().cells);
            },

            setSearchTerm: term => {
                set(_ => {
                    return {
                        searchTerm: term,
                        currentPage: 0,
                    };
                });
            },

            setShowCaption: show => {
                set(state => {
                    if (state.showCaption === show) {
                        return state;
                    }

                    return { showCaption: show };
                });
            },

            toggleRowColumnControls: () => {
                set(state => ({
                    showRowColumnControls: !state.showRowColumnControls,
                }));
            },

            toggleDuplicateMoveControls: () => {
                set(state => ({
                    showDuplicateMoveControls: !state.showDuplicateMoveControls,
                }));
            },

            getFilteredRowIndices: () => {
                const { searchTerm, table, cells } = get();

                if (!table.search?.enabled || !searchTerm.trim()) {
                    return Array.from({ length: table.rows }, (_, i) => i);
                }

                return filterRowsBySearch(
                    cells,
                    table.rows,
                    table.cols,
                    table,
                    searchTerm
                );
            },

            setTableAttrs: attrs => set({ ...attrs }),

            getTableAttrs: () => {
                const {
                    version,
                    isExample,
                    table,
                    rows,
                    columns,
                    cells,
                    bindings,
                    cellDefaults,
                } = get();
                return {
                    version,
                    isExample,
                    table,
                    rows,
                    columns,
                    cells,
                    bindings,
                    cellDefaults,
                };
            },

            setAttrVersion: version =>
                set(state => {
                    if (state.version === version) {
                        return state;
                    }

                    return { version };
                }),

            reset: () => set(initialState),
        };
    });
}

// Exported so the native editor's element bridge can mount a patched store
// around reused element components (see src/native/element-bridge.tsx).
export const TableStoreContext = createContext<TableStore | null>(null);

interface TableStoreProviderProps {
    children: ReactNode;
    clientId: string;
    attributes: TablebergBlockAttrs;
    setAttributes: (attrs: Partial<TablebergBlockAttrs>) => void;
    /**
     * Native-blocks mode: cell/row content lives in the block tree, not in
     * attrs. The store only mirrors table-level state (for the inspector
     * controls), so cells/rows must not sync back into the block attributes.
     */
    contentSyncDisabled?: boolean;
}

// Stable fallbacks: fresh objects on every attributes-effect run would keep
// changing state references and ping-pong with setAttributes into an
// infinite update loop (React #185).
const EMPTY_CELLS: TablebergBlockAttrs["cells"] = {};
const EMPTY_ROWS: TablebergBlockAttrs["rows"] = [];
const EMPTY_BINDINGS: TablebergBlockAttrs["bindings"] = {};

export function TableStoreProvider({
    children,
    attributes,
    setAttributes,
    contentSyncDisabled = false,
}: TableStoreProviderProps) {
    const storeRef = useRef<TableStore | null>(null);

    // Posts saved while the setColumnSortable object-spread bug was live have
    // columns as an indexed map instead of an array — normalize on the way in.
    const normalizeColumns = (
        columns: TablebergBlockAttrs["columns"] | undefined
    ): TablebergBlockAttrs["columns"] => {
        if (Array.isArray(columns)) {
            return columns;
        }
        if (!columns || typeof columns !== "object") {
            return [];
        }
        const result: TablebergBlockAttrs["columns"] = [];
        for (const [key, value] of Object.entries(columns)) {
            const index = Number(key);
            if (Number.isInteger(index) && index >= 0) {
                result[index] = value;
            }
        }
        return result;
    };

    // v4 attrs carry no cells/rows (and may omit defaulted keys); the store
    // still expects the collections to exist.
    // Tables created with partial config (or by older builds) must still
    // satisfy controls that destructure pagination/search/responsive — but
    // only build a new object when keys are actually missing, so the
    // reference stays stable once the table is complete.
    const withTableDefaults = (
        table: TablebergBlockAttrs["table"] | undefined
    ): TablebergBlockAttrs["table"] => {
        if (!table) {
            return attrDefaults.table;
        }
        for (const key of Object.keys(attrDefaults.table)) {
            if (!(key in table)) {
                return { ...attrDefaults.table, ...table };
            }
        }
        return table;
    };

    // Row/column counts are derived from the block tree, which the preview
    // snapshot keeps fresh; the counts in the attributes can be stale, so
    // never clobber the live ones. Returns the same reference when the
    // values already agree, so this converges instead of looping.
    const withLiveCounts = (
        table: TablebergBlockAttrs["table"],
        currentTable: TablebergBlockAttrs["table"] | undefined
    ): TablebergBlockAttrs["table"] => {
        if (
            !currentTable ||
            (table.rows === currentTable.rows &&
                table.cols === currentTable.cols)
        ) {
            return table;
        }
        return { ...table, rows: currentTable.rows, cols: currentTable.cols };
    };

    // The store's initial state needs every key present.
    const initialAttrs = (attrs: TablebergBlockAttrs) =>
        contentSyncDisabled
            ? {
                  ...attrs,
                  table: withTableDefaults(attrs.table),
                  cells: attrs.cells ?? EMPTY_CELLS,
                  rows: attrs.rows ?? EMPTY_ROWS,
                  columns: normalizeColumns(attrs.columns),
                  bindings: attrs.bindings ?? EMPTY_BINDINGS,
              }
            : attrs;

    // Applied on every attributes change. In native mode the cell content and
    // row configs live in the block tree (the preview snapshot writes them
    // into the store), so those keys must be left out entirely — writing them
    // from the attributes would wipe the snapshot, because effects run
    // child-first and this provider is the parent.
    const syncAttrs = (
        attrs: TablebergBlockAttrs,
        current: TableState
    ): Partial<TableState> => {
        if (!contentSyncDisabled) {
            return attrs;
        }

        const { cells: _cells, rows: _rows, ...rest } = attrs;

        return {
            ...rest,
            table: withLiveCounts(withTableDefaults(attrs.table), current.table),
            columns: normalizeColumns(attrs.columns),
            bindings: attrs.bindings ?? EMPTY_BINDINGS,
        };
    };

    if (!storeRef.current) {
        storeRef.current = createTableStore(initialAttrs(attributes));
    }

    useEffect(() => {
        if (storeRef.current) {
            storeRef.current.setState(
                syncAttrs(attributes, storeRef.current.getState())
            );
        }
    }, [attributes]);

    useEffect(() => {
        if (storeRef.current) {
            const unsubscribe = storeRef.current.subscribe(state => {
                if (contentSyncDisabled) {
                    setAttributes({
                        version: state.version,
                        isExample: state.isExample,
                        table: state.table,
                        columns: state.columns,
                        bindings: state.bindings,
                        cellDefaults: state.cellDefaults,
                    });
                    return;
                }

                setAttributes({
                    version: state.version,
                    isExample: state.isExample,
                    table: state.table,
                    rows: state.rows,
                    columns: state.columns,
                    cells: state.cells,
                    bindings: state.bindings,
                    cellDefaults: state.cellDefaults,
                });
            });
            return unsubscribe;
        }
    }, [setAttributes, contentSyncDisabled]);

    return (
        <TableStoreContext.Provider value={storeRef.current}>
            {children}
        </TableStoreContext.Provider>
    );
}

export function useTableStore<T>(selector: (state: TableState) => T): T {
    const store = useContext(TableStoreContext);
    if (!store) {
        throw new Error("useTableStore must be used within TableStoreProvider");
    }
    return store(selector);
}

/**
 * Raw store handle for imperative snapshots (native editor preview mode
 * pushes a cells/rows snapshot of the block tree into the store so the
 * existing preview UI can render from it).
 */
export function useTableStoreApi(): TableStore {
    const store = useContext(TableStoreContext);
    if (!store) {
        throw new Error(
            "useTableStoreApi must be used within TableStoreProvider"
        );
    }
    return store;
}

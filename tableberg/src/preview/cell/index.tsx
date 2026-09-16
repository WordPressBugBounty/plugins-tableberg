import { CSSProperties, useState, MouseEvent } from "react";
import {
    store as blockEditorStore,
    useBlockProps,
} from "@wordpress/block-editor";
import { useDispatch } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import {
    Span,
    CellElement,
    CellKey,
    attrDefaults,
    parseCellKey,
} from "../../attributes";
import { useTableStore } from "../../store";
import { useBlockCardUpdateShim } from "../../hooks/block-editor-compat";
import {
    elementAlignmentToJustifyContent,
    getElementAlignment,
    getUniformElementsAlignment,
} from "../../alignment";
import {
    TextElement,
    ButtonElement,
    ImageElement,
    ListElement,
    createElement,
} from "../../elements";
import CellInserter, {
    getCellInserterItems,
} from "../../components/cell-inserter";
import classNames from "classnames";
import { renderExtendedElement } from "../../extensions";
import { renderExtendedCellRibbon } from "../../ribbon-extensions";
import { isProAvailable } from "../../pro-status";

const cellDefaultsStyles = attrDefaults.cellDefaults.styles;

const VERTICAL_ALIGN_TO_FLEX: Record<
    "top" | "middle" | "bottom",
    CSSProperties["alignItems"]
> = {
    top: "flex-start",
    middle: "center",
    bottom: "flex-end",
};

type WrapperBlockProps = {
    className?: string;
    style?: CSSProperties;
    [key: string]: unknown;
};
type BlockEditorActions = {
    selectBlock: (clientId: string, initialPosition?: 0 | -1 | null) => void;
};

function getTableClientIdFromElement(element: HTMLElement): string | null {
    const tableBlock = element.closest<HTMLElement>(
        ".tableberg-editor-shell[id^='block-']"
    );

    return tableBlock?.id.replace(/^block-/, "") || null;
}

function selectTableBlockFromElement(
    element: HTMLElement,
    selectBlock: BlockEditorActions["selectBlock"]
) {
    const tableClientId = getTableClientIdFromElement(element);
    if (tableClientId) {
        selectBlock(tableClientId);
    }
}

function mergeWrapperBlockProps(
    blockProps: WrapperBlockProps | undefined,
    className: string | undefined,
    style: CSSProperties
): WrapperBlockProps {
    const mergedClassName = classNames(className, blockProps?.className);

    return {
        ...(blockProps || {}),
        ...(mergedClassName ? { className: mergedClassName } : {}),
        style: {
            ...((blockProps?.style as CSSProperties | undefined) || {}),
            ...style,
        },
    };
}

export function Cell({
    span,
    cellCoords,
}: {
    span: Span;
    cellCoords: CellKey;
}) {
    const [row, column] = parseCellKey(cellCoords);
    const getCellStyleState = useTableStore(state => state.getCellStyle);
    const cellStyles = getCellStyleState(cellCoords);
    const isPro = isProAvailable();
    const innerBorderType = useTableStore(state =>
        isPro ? state.table.innerBorderType || "" : ""
    );
    const totalRows = useTableStore(state => state.table.rows);
    const totalCols = useTableStore(state => state.table.cols);

    const cellStyleCss: {
        position: CSSProperties["position"];
        top?: string;
        zIndex?: CSSProperties["zIndex"];

        boxShadow?: string;
        backgroundColor?: string;

        paddingTop?: string;
        paddingRight?: string;
        paddingBottom?: string;
        paddingLeft?: string;

        borderTop?: string;
        borderRight?: string;
        borderBottom?: string;
        borderLeft?: string;

        borderTopLeftRadius?: string;
        borderTopRightRadius?: string;
        borderBottomLeftRadius?: string;
        borderBottomRightRadius?: string;

        verticalAlign?: CSSProperties["verticalAlign"];

        height?: string;
        minHeight?: string;

        width?: string;
        minWidth?: string;
    } = {
        position: "relative",
    };

    const cellGlobalPadding = useTableStore(
        state => state.cellDefaults.styles.padding
    );
    (function getCellPadding() {
        let padding:
            | {
                  top: string;
                  right: string;
                  bottom: string;
                  left: string;
              }
            | undefined;

        padding = cellGlobalPadding;
        if (cellStyles?.padding) {
            padding = cellStyles?.padding;
        }

        cellStyleCss.paddingTop = padding?.top;
        cellStyleCss.paddingRight = padding?.right;
        cellStyleCss.paddingBottom = padding?.bottom;
        cellStyleCss.paddingLeft = padding?.left;
    })();

    const cellGlobalBorder = useTableStore(
        state => state.cellDefaults.styles.border
    );
    (function getCellBorder() {
        let border:
            | {
                  top: string;
                  right: string;
                  bottom: string;
                  left: string;
              }
            | undefined;

        border = cellGlobalBorder;
        if (cellStyles?.border) {
            border = cellStyles?.border;
        }

        cellStyleCss.borderTop = border?.top;
        cellStyleCss.borderRight = border?.right;
        cellStyleCss.borderBottom = border?.bottom;
        cellStyleCss.borderLeft = border?.left;
    })();

    // These Pro modes render inner separators only. The separate table
    // border control owns the outside rectangle.
    if (innerBorderType === "row") {
        cellStyleCss.borderLeft = undefined;
        cellStyleCss.borderRight = undefined;
        if (row === 0) {
            cellStyleCss.borderTop = undefined;
        }
        if (row + span.rowSpan >= totalRows) {
            cellStyleCss.borderBottom = undefined;
        }
    } else if (innerBorderType === "col") {
        cellStyleCss.borderTop = undefined;
        cellStyleCss.borderBottom = undefined;
        if (column === 0) {
            cellStyleCss.borderLeft = undefined;
        }
        if (column + span.colSpan >= totalCols) {
            cellStyleCss.borderRight = undefined;
        }
    }

    (function getCellBorderRadius() {
        // The common/table border radius is rendered on the table wrapper, so
        // here we only honour a per-cell override (rounds that single cell).
        const override = cellStyles?.borderRadius;

        cellStyleCss.borderTopLeftRadius = override?.topLeft;
        cellStyleCss.borderTopRightRadius = override?.topRight;
        cellStyleCss.borderBottomRightRadius = override?.bottomRight;
        cellStyleCss.borderBottomLeftRadius = override?.bottomLeft;
    })();

    const cellDefaultStyles = useTableStore(state => state.cellDefaults.styles);
    const headerEnabled = useTableStore(state => state.table.headerEnabled);
    const footerEnabled = useTableStore(state => state.table.footerEnabled);

    let rowPositionBackground = "";
    if (headerEnabled && row === 0) {
        rowPositionBackground = cellDefaultStyles.headerBackgroundColor;
    } else if (footerEnabled && row === totalRows - 1) {
        rowPositionBackground = cellDefaultStyles.footerBackgroundColor;
    } else {
        const dataRowPosition = headerEnabled ? row - 1 : row;
        rowPositionBackground =
            dataRowPosition % 2 === 0
                ? cellDefaultStyles.oddRowBackgroundColor
                : cellDefaultStyles.evenRowBackgroundColor;
    }

    cellStyleCss.backgroundColor =
        rowPositionBackground || cellDefaultStyles.backgroundColor;
    if (cellStyles?.backgroundColor) {
        cellStyleCss.backgroundColor = cellStyles?.backgroundColor;
    }

    const cellGlobalOrientation = useTableStore(
        state => state.cellDefaults.styles.orientation
    );
    const cellOrientation =
        cellStyles?.orientation ||
        (isPro ? cellGlobalOrientation : undefined) ||
        cellDefaultsStyles.orientation;

    const cellGlobalWrap = useTableStore(
        state => state.cellDefaults.styles.wrap
    );
    const cellWrap =
        cellStyles?.wrap ||
        (isPro ? cellGlobalWrap : undefined) ||
        cellDefaultsStyles.wrap;

    const cellGlobalElementGap = useTableStore(
        state => state.cellDefaults.styles.elementGap
    );
    const cellElementGap =
        cellStyles?.elementGap ??
        cellGlobalElementGap ??
        cellDefaultsStyles.elementGap;

    const cellGlobalVerticalAlign = useTableStore(
        state => state.cellDefaults.styles.verticalAlign
    );
    const cellVerticalAlign =
        cellStyles?.verticalAlign ||
        cellGlobalVerticalAlign ||
        cellDefaultsStyles.verticalAlign;
    cellStyleCss.verticalAlign = cellVerticalAlign;

    const isCurrentCellSelected = useTableStore(state =>
        state.selectedCells.includes(cellCoords)
    );

    if (isCurrentCellSelected) {
        cellStyleCss.boxShadow = "inset 0 0 0 2px var(--wp-admin-theme-color)";
    }

    const selectedCellBlockProps = useBlockProps();

    const tableRows = useTableStore(state => state.table.rows);
    const isFirstRow = row === 0;
    const isLastRow = row === tableRows - 1;

    const stickyHeader = useTableStore(
        state => state.table.stickyHeader ?? false
    );
    const isHeaderCell = isFirstRow && headerEnabled;
    const isStickyHeaderCell = isPro && stickyHeader && isHeaderCell;

    if (isStickyHeaderCell) {
        cellStyleCss.position = "sticky";
        cellStyleCss.top = "0";
        cellStyleCss.zIndex = 2;

        if (!cellStyleCss.backgroundColor) {
            cellStyleCss.backgroundColor = "#fff";
        }
    }

    const sortPreviewMode = useTableStore(state => state.sortPreviewMode);
    const tableEditPreview = useTableStore(state => state.tableEditPreview);
    const previewSortColumn = useTableStore(state => state.previewSortColumn);
    const previewSortOrder = useTableStore(state => state.previewSortOrder);
    const togglePreviewSort = useTableStore(state => state.togglePreviewSort);
    const columns = useTableStore(state => state.columns);
    const rows = useTableStore(state => state.rows);
    const table = useTableStore(state => state.table);
    const fixedColumnWidths = useTableStore(
        state => state.table.fixedColumnWidths ?? true
    );
    const isSortable = isPro && isHeaderCell && !!columns[column]?.sortable;
    const isSorted = previewSortColumn === column;

    const columnWidth =
        span.colSpan > 1
            ? undefined
            : fixedColumnWidths && table.cols > 0
              ? `${100 / table.cols}%`
              : columns[column]?.width;

    if (columnWidth) {
        cellStyleCss.width = columnWidth;
        cellStyleCss.minWidth = columnWidth;
    }

    const rowHeight = span.rowSpan > 1 ? undefined : rows[row]?.height;

    if (rowHeight) {
        cellStyleCss.height = rowHeight;
        cellStyleCss.minHeight = rowHeight;
    }

    let Tag: "td" | "th" = "td";
    if (isHeaderCell) {
        Tag = "th";
    }
    if (isLastRow && footerEnabled) {
        Tag = "th";
    }

    const cells = useTableStore(state => state.cells);
    const addElementToCell = useTableStore(state => state.addElementToCell);
    const getCellRibbon = useTableStore(state => state.getCellRibbon);
    const cellRibbon = getCellRibbon(cellCoords);

    const setSelectedCells = useTableStore(state => state.setSelectedCells);
    const addSelectedCells = useTableStore(state => state.addSelectedCells);
    const clearSelectedElement = useTableStore(
        state => state.clearSelectedElement
    );
    const { selectBlock } = useDispatch(
        blockEditorStore
    ) as unknown as BlockEditorActions;

    const updateBlockCard = useBlockCardUpdateShim();

    const cellElements = cells[cellCoords]?.elements || [];
    const cellClassName = cells[cellCoords]?.className || "";

    const [isHovered, setIsHovered] = useState(false);
    const [isInserterOpen, setIsInserterOpen] = useState(false);
    const showInserter =
        !sortPreviewMode &&
        (isHovered || isCurrentCellSelected || isInserterOpen);

    const handleCellClick = (e: MouseEvent<HTMLTableCellElement>) => {
        if (sortPreviewMode) {
            if (isHeaderCell && isSortable) {
                togglePreviewSort(column);
            }
            return;
        }

        const { ctrlKey, metaKey, shiftKey } = e;

        if (ctrlKey || metaKey || shiftKey) {
            // Building a multi-cell selection: drop any single-element
            // selection so the cell selection drives the merge controls.
            selectTableBlockFromElement(e.currentTarget, selectBlock);
            clearSelectedElement();
            addSelectedCells([cellCoords]);
            updateBlockCard(
                e.currentTarget,
                "Multiple Cells",
                "Tableberg Cells: Individual cells of a tableberg table"
            );
            return;
        }

        selectTableBlockFromElement(e.currentTarget, selectBlock);
        clearSelectedElement();
        setSelectedCells([cellCoords]);
        updateBlockCard(
            e.currentTarget,
            "Cell",
            "Tableberg Cell: Individual cell of a tableberg table"
        );
    };

    const renderSortIndicator = () => {
        if (!isHeaderCell || !isSortable) {
            return null;
        }

        if (sortPreviewMode) {
            return (
                <span
                    className={classNames("tableberg-sort-indicator", {
                        "tableberg-sort-indicator--active": isSorted,
                    })}
                    style={{
                        userSelect: "none",
                    }}
                    title={
                        isSorted
                            ? __("Click to change sort order", "tableberg")
                            : __("Click to sort by this column", "tableberg")
                    }
                >
                    {isSorted
                        ? previewSortOrder === "asc"
                            ? "\u25B2"
                            : "\u25BC"
                        : "\u25B2\u25BC"}
                </span>
            );
        }

        return (
            <span
                className="tableberg-sort-indicator"
                style={{
                    color: "#a0a0a0",
                    userSelect: "none",
                }}
                title={__(
                    "Sorting enabled. Use Preview Sorting to test.",
                    "tableberg"
                )}
            >
                {"\u25B2\u25BC"}
            </span>
        );
    };

    const sortableStyles: CSSProperties =
        sortPreviewMode && isHeaderCell && isSortable
            ? { cursor: "pointer" }
            : {};

    const previewRowIndex =
        tableEditPreview && tableEditPreview.target === "row"
            ? tableEditPreview.index
            : null;
    const previewColumnIndex =
        tableEditPreview && tableEditPreview.target === "column"
            ? tableEditPreview.index
            : null;
    const isPreviewDelete = tableEditPreview?.operation === "delete";
    const isPreviewDuplicate = tableEditPreview?.operation === "duplicate";
    const isPreviewInsertOrDuplicate =
        tableEditPreview?.operation === "insert" ||
        tableEditPreview?.operation === "duplicate";

    const rowStart = row;
    const rowEnd = row + span.rowSpan - 1;
    const colStart = column;
    const colEnd = column + span.colSpan - 1;

    const intersectsPreviewRow =
        previewRowIndex !== null &&
        previewRowIndex >= 0 &&
        previewRowIndex < table.rows &&
        previewRowIndex >= rowStart &&
        previewRowIndex <= rowEnd;

    const intersectsPreviewColumn =
        previewColumnIndex !== null &&
        previewColumnIndex >= 0 &&
        previewColumnIndex < table.cols &&
        previewColumnIndex >= colStart &&
        previewColumnIndex <= colEnd;

    const duplicateSourceRowIndex =
        isPreviewDuplicate && previewRowIndex !== null
            ? Math.max(0, Math.min(previewRowIndex - 1, table.rows - 1))
            : null;

    const duplicateSourceColumnIndex =
        isPreviewDuplicate && previewColumnIndex !== null
            ? Math.max(0, Math.min(previewColumnIndex - 1, table.cols - 1))
            : null;
    const cellInserterItems = getCellInserterItems();

    const intersectsDuplicateSourceRow =
        duplicateSourceRowIndex !== null &&
        duplicateSourceRowIndex >= rowStart &&
        duplicateSourceRowIndex <= rowEnd;

    const intersectsDuplicateSourceColumn =
        duplicateSourceColumnIndex !== null &&
        duplicateSourceColumnIndex >= colStart &&
        duplicateSourceColumnIndex <= colEnd;

    const previewInsertRowAtBoundary =
        isPreviewInsertOrDuplicate &&
        previewRowIndex !== null &&
        previewRowIndex >= 0 &&
        previewRowIndex < table.rows &&
        rowStart === previewRowIndex;

    const previewInsertColumnAtBoundary =
        isPreviewInsertOrDuplicate &&
        previewColumnIndex !== null &&
        previewColumnIndex >= 0 &&
        previewColumnIndex < table.cols &&
        colStart === previewColumnIndex;

    const previewInsertRowAtEnd =
        isPreviewInsertOrDuplicate &&
        previewRowIndex === table.rows &&
        rowEnd === table.rows - 1;

    const previewInsertColumnAtEnd =
        isPreviewInsertOrDuplicate &&
        previewColumnIndex === table.cols &&
        colEnd === table.cols - 1;

    const mergedCellBlockProps = mergeWrapperBlockProps(
        isCurrentCellSelected ? selectedCellBlockProps : undefined,
        classNames(cellClassName, {
            "is-selected": isCurrentCellSelected,
            "tableberg-sortable-header": isHeaderCell && isSortable,
            "tableberg-cell-preview-delete-row":
                isPreviewDelete && intersectsPreviewRow,
            "tableberg-cell-preview-delete-column":
                isPreviewDelete && intersectsPreviewColumn,
            "tableberg-cell-preview-duplicate-source-row":
                isPreviewDuplicate && intersectsDuplicateSourceRow,
            "tableberg-cell-preview-duplicate-source-column":
                isPreviewDuplicate && intersectsDuplicateSourceColumn,
            "tableberg-cell-preview-insert-row-boundary":
                previewInsertRowAtBoundary,
            "tableberg-cell-preview-insert-column-boundary":
                previewInsertColumnAtBoundary,
            "tableberg-cell-preview-insert-row-end": previewInsertRowAtEnd,
            "tableberg-cell-preview-insert-column-end":
                previewInsertColumnAtEnd,
        }),
        { ...cellStyleCss, ...sortableStyles }
    );

    return (
        <Tag
            {...mergedCellBlockProps}
            rowSpan={span.rowSpan}
            colSpan={span.colSpan}
            data-sortable={
                isPro && isHeaderCell ? columns[column]?.sortable : undefined
            }
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={handleCellClick}
        >
            <CellElementRenderer
                cellElements={cellElements}
                cellCoords={cellCoords}
                orientation={cellOrientation}
                elementGap={cellElementGap}
                wrap={cellWrap}
                verticalAlign={cellVerticalAlign}
            />
            {renderSortIndicator()}
            {cellRibbon && renderExtendedCellRibbon(cellRibbon, cellCoords)}
            {showInserter && (
                <CellInserter
                    items={cellInserterItems}
                    onSelect={item => {
                        const newElement = createElement(item.name);
                        if (newElement) {
                            addElementToCell(cellCoords, newElement);
                        }
                    }}
                    onOpenChange={setIsInserterOpen}
                />
            )}
        </Tag>
    );
}

interface CellElementRendererProps {
    cellElements: CellElement[];
    cellCoords: CellKey;
    orientation: "vertical" | "horizontal";
    elementGap: string;
    wrap: "wrap" | "nowrap";
    verticalAlign: "top" | "middle" | "bottom";
}

function CellElementRenderer({
    cellElements,
    cellCoords,
    orientation,
    elementGap,
    wrap,
    verticalAlign,
}: CellElementRendererProps) {
    const isElementSelected = useTableStore(state => state.isElementSelected);
    const selectedElementBlockProps = useBlockProps();

    const isHorizontal = orientation === "horizontal";
    const implicitAlignment = getUniformElementsAlignment(cellElements);
    const elementsStyle: CSSProperties = {
        display: "flex",
        flexDirection: isHorizontal ? "row" : "column",
        justifyContent: isHorizontal
            ? elementAlignmentToJustifyContent(implicitAlignment || "left")
            : VERTICAL_ALIGN_TO_FLEX[verticalAlign],
        alignItems: isHorizontal
            ? VERTICAL_ALIGN_TO_FLEX[verticalAlign]
            : "stretch",
        gap: elementGap,
        flexWrap: wrap,
    };

    return (
        <div
            className={classNames("tableberg-cell-elements", {
                "tableberg-cell-elements-horizontal": isHorizontal,
            })}
            style={elementsStyle}
        >
            {cellElements.map((element, index) => {
                const isSelected = isElementSelected(cellCoords, index);

                let elementComponent: React.ReactNode;
                switch (element.name) {
                    case "text":
                        elementComponent = (
                            <TextElement
                                key={index}
                                attributes={element.attributes}
                                bindings={element.bindings}
                                cellCoords={cellCoords}
                                elementIndex={index}
                            />
                        );
                        break;
                    case "button":
                        elementComponent = (
                            <ButtonElement
                                key={index}
                                attributes={element.attributes}
                                bindings={element.bindings}
                                cellCoords={cellCoords}
                                elementIndex={index}
                            />
                        );
                        break;
                    case "image":
                        elementComponent = (
                            <ImageElement
                                key={index}
                                attributes={element.attributes}
                                bindings={element.bindings}
                                cellCoords={cellCoords}
                                elementIndex={index}
                            />
                        );
                        break;
                    case "list":
                        elementComponent = (
                            <ListElement
                                key={index}
                                attributes={element.attributes}
                                bindings={element.bindings}
                                cellCoords={cellCoords}
                                elementIndex={index}
                            />
                        );
                        break;
                    default:
                        elementComponent = renderExtendedElement(
                            element,
                            cellCoords,
                            index
                        );
                        break;
                }

                return (
                    <CellElementBlockWrapper
                        key={index}
                        cellCoords={cellCoords}
                        element={element}
                        elementIndex={index}
                        isHorizontal={isHorizontal}
                        isSelected={isSelected}
                        selectedBlockProps={selectedElementBlockProps}
                    >
                        {elementComponent}
                    </CellElementBlockWrapper>
                );
            })}
        </div>
    );
}

function CellElementBlockWrapper({
    children,
    cellCoords,
    element,
    elementIndex,
    isHorizontal,
    isSelected,
    selectedBlockProps,
}: {
    children: React.ReactNode;
    cellCoords: CellKey;
    element: CellElement;
    elementIndex: number;
    isHorizontal: boolean;
    isSelected: boolean;
    selectedBlockProps: WrapperBlockProps;
}) {
    const sortPreviewMode = useTableStore(state => state.sortPreviewMode);
    const setSelectedElement = useTableStore(state => state.setSelectedElement);
    const addSelectedCells = useTableStore(state => state.addSelectedCells);
    const clearSelectedElement = useTableStore(
        state => state.clearSelectedElement
    );
    const updateBlockCard = useBlockCardUpdateShim();
    const { selectBlock } = useDispatch(
        blockEditorStore
    ) as unknown as BlockEditorActions;

    const mergedElementBlockProps = mergeWrapperBlockProps(
        isSelected ? selectedBlockProps : undefined,
        classNames("tableberg-cell-element", {
            "is-selected": isSelected,
        }),
        {
            display: "flex",
            justifyContent: elementAlignmentToJustifyContent(
                getElementAlignment(element)
            ),
            width: isHorizontal ? undefined : "100%",
        }
    );

    // Modifier+click on element content should select the whole cell for
    // merging instead of the element. Handle it in the capture phase so the
    // element's own click handler (which stops propagation) never runs.
    const handleClickCapture = (e: MouseEvent<HTMLDivElement>) => {
        if (e.ctrlKey || e.metaKey || e.shiftKey) {
            e.preventDefault();
            e.stopPropagation();
            selectTableBlockFromElement(e.currentTarget, selectBlock);
            clearSelectedElement();
            addSelectedCells([cellCoords]);
            return;
        }

        if (sortPreviewMode) {
            return;
        }

        selectTableBlockFromElement(e.currentTarget, selectBlock);
        setSelectedElement(cellCoords, elementIndex);
        updateBlockCard(
            e.currentTarget,
            element.name,
            `A ${element.name} element within a Tableberg cell`
        );
    };

    const handleClick = (e: MouseEvent<HTMLDivElement>) => {
        e.stopPropagation();
    };

    return (
        <div
            {...mergedElementBlockProps}
            onClickCapture={handleClickCapture}
            onClick={handleClick}
        >
            {children}
        </div>
    );
}

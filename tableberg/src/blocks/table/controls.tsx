/**
 * WordPress Imports
 */
import { __, sprintf } from "@wordpress/i18n";
import {
    positionLeft,
    positionCenter,
    positionRight,
    cog,
    styles as stylesIcon,
    caption as captionIcon,
    table,
    tableRowBefore,
    arrowDown,
    arrowRight,
    arrowUp,
    justifyLeft,
    justifyCenter,
    justifyRight,
} from "@wordpress/icons";
import {
    InspectorControls,
    BlockControls,
    FontSizePicker,
    ColorPalette,
    useBlockEditContext,
    store as blockEditorStore,
} from "@wordpress/block-editor";
import {
    ToggleControl,
    __experimentalToolsPanel as ToolsPanel,
    __experimentalToolsPanelItem as ToolsPanelItem,
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
    __experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
    PanelBody,
    ToolbarButton,
    ToolbarGroup,
    SelectControl,
    Button,
    Dropdown,
    TabPanel,
} from "@wordpress/components";
import { ReactNode, useState } from "react";
/**
 * Internal Imports
 */
import { useDispatch, useRegistry, useSelect } from "@wordpress/data";
import {
    SpacingControl,
    SpacingControlSingle,
    ColorControl,
    ToolbarWithDropdown,
    SizeControl,
    BorderControl,
    BorderRadiusControl,
} from "@tableberg/components";
import LockedControl from "../../components/LockedControl";
import { useTableStore } from "../../store";
import TablebergIcon from "@tableberg/shared/icons/tableberg";
import { DuplicateRowIcon } from "@tableberg/shared/icons/enhancements";
import { areAllMergeable, mergeCells } from "../../merge";
import {
    attrDefaults,
    Cell,
    CellKey,
    CellSpacing,
    PaginationConfig,
    SortableType,
    TableAlignment,
} from "../../attributes";
import { hasSortableColumns, tableHasMergedCells } from "../../sorting";
import { tableHasRowSpanningCells } from "../../pagination";
import { useBackgroundColorHelpers, useCellStyleControl } from "../../hooks";
import { ResponsiveControl } from "../../components/ResponsiveControl";
import {
    ElementAlignment,
    getUniformElementsAlignment,
    setElementAlignment,
} from "../../alignment";
import { isProAvailable } from "../../pro-status";
import { UpsellEnhancedModal } from "../../components/UpsellModal";
import { AdvancedCustomClassControl } from "../../components/AdvancedCustomClassControl";

const cellDefaultsStyles = attrDefaults.cellDefaults.styles;

const TABLE_ALIGNMENT_TOOLBAR_CONTROLS: {
    value: TableAlignment;
    icon: JSX.Element;
    title: string;
}[] = [
    {
        value: "left",
        icon: positionLeft,
        title: __("Align left", "tableberg"),
    },
    {
        value: "center",
        icon: positionCenter,
        title: __("Align center", "tableberg"),
    },
    {
        value: "right",
        icon: positionRight,
        title: __("Align right", "tableberg"),
    },
];

type TableWidthMode = "auto" | "fixed" | "wide" | "full";

type SidebarTab = "settings" | "styles" | "datatable";

const DEFAULT_FIXED_TABLE_WIDTH = "350px";

const getCellEntries = (cells: Record<CellKey, Cell>) =>
    Object.entries(cells).map(
        ([key, cell]) => [key as CellKey, cell.elements || []] as const
    );

const resetToolsPanelFilters = (filters: (() => unknown)[] = []) => {
    filters.forEach(filter => {
        filter();
    });
};

const TABLE_WIDTH_PRESET_VALUES = ["auto", "wide", "full"] as const;

const isTableWidthPreset = (
    value: string
): value is (typeof TABLE_WIDTH_PRESET_VALUES)[number] =>
    (TABLE_WIDTH_PRESET_VALUES as readonly string[]).includes(value);

const CELL_ORIENTATION_OPTIONS = [
    {
        value: "vertical",
        icon: arrowDown,
        label: __("Vertical", "tableberg"),
    },
    {
        value: "horizontal",
        icon: arrowRight,
        label: __("Horizontal", "tableberg"),
    },
] as const;

const CELL_ALIGNMENT_OPTIONS = [
    {
        value: "left",
        icon: justifyLeft,
        label: __("Left", "tableberg"),
    },
    {
        value: "center",
        icon: justifyCenter,
        label: __("Center", "tableberg"),
    },
    {
        value: "right",
        icon: justifyRight,
        label: __("Right", "tableberg"),
    },
] as const;

const CELL_VERTICAL_ALIGN_OPTIONS = [
    {
        value: "top",
        icon: arrowUp,
        label: __("Top", "tableberg"),
    },
    {
        value: "middle",
        icon: positionCenter,
        label: __("Middle", "tableberg"),
    },
    {
        value: "bottom",
        icon: arrowDown,
        label: __("Bottom", "tableberg"),
    },
] as const;

type FourSidesSpacing = {
    top: string;
    right: string;
    bottom: string;
    left: string;
};

const tableConfigDefaults = attrDefaults.table;

function getDefaultCellSpacing(): CellSpacing {
    const defaultCellSpacing = tableConfigDefaults.cellSpacing!!;

    return {
        horizontal: defaultCellSpacing.horizontal,
        vertical: defaultCellSpacing.vertical,
    };
}

function toCellSpacingPaddingValue(cellSpacing: CellSpacing) {
    return {
        top: cellSpacing.vertical,
        right: cellSpacing.horizontal,
        bottom: cellSpacing.vertical,
        left: cellSpacing.horizontal,
    };
}

function fromCellSpacingPaddingValue(
    newPadding: FourSidesSpacing,
    previousCellSpacing: CellSpacing,
    defaultCellSpacing: CellSpacing
) {
    const previousPadding = toCellSpacingPaddingValue(previousCellSpacing);

    let horizontal = previousCellSpacing.horizontal;
    if (newPadding.right !== previousPadding.right) {
        horizontal = newPadding.right;
    } else if (newPadding.left !== previousPadding.left) {
        horizontal = newPadding.left;
    }

    let vertical = previousCellSpacing.vertical;
    if (newPadding.top !== previousPadding.top) {
        vertical = newPadding.top;
    } else if (newPadding.bottom !== previousPadding.bottom) {
        vertical = newPadding.bottom;
    }

    return {
        horizontal: horizontal || defaultCellSpacing.horizontal,
        vertical: vertical || defaultCellSpacing.vertical,
    };
}

interface ElementFontOptionControlProps {
    label: string;
    onSelect: (value: string) => void;
    onReset: () => void;
}

function ElementFontColorOptionControl({
    label,
    onSelect,
    onReset,
}: ElementFontOptionControlProps) {
    return (
        <div className="tableberg-element-font-option">
            <Dropdown
                className="block-editor-tools-panel-color-gradient-settings__dropdown"
                popoverProps={{ placement: "bottom-start" }}
                renderToggle={({ isOpen, onToggle }) => (
                    <Button
                        __next40pxDefaultSize
                        onClick={onToggle}
                        aria-expanded={isOpen}
                        className={`block-editor-panel-color-gradient-settings__dropdown tableberg-element-font-option-toggle${
                            isOpen ? " is-open" : ""
                        }`}
                    >
                        <span className="tableberg-element-font-option-label">
                            {label}
                        </span>
                    </Button>
                )}
                renderContent={({ onClose }) => (
                    <div className="tableberg-element-font-option-popover">
                        <ColorPalette
                            value={undefined}
                            clearable={false}
                            onChange={newValue => {
                                if (!newValue) {
                                    return;
                                }

                                onSelect(newValue);
                                onClose();
                            }}
                        />
                        <Button
                            __next40pxDefaultSize
                            className="components-circular-option-picker__clear"
                            variant="tertiary"
                            onClick={() => {
                                onReset();
                                onClose();
                            }}
                        >
                            {__("Reset", "tableberg")}
                        </Button>
                    </div>
                )}
            />
        </div>
    );
}

function ElementFontSizeOptionControl({
    label,
    onSelect,
    onReset,
}: ElementFontOptionControlProps) {
    return (
        <div className="tableberg-element-font-option">
            <Dropdown
                className="block-editor-tools-panel-color-gradient-settings__dropdown"
                popoverProps={{ placement: "bottom-start" }}
                renderToggle={({ isOpen, onToggle }) => (
                    <Button
                        __next40pxDefaultSize
                        onClick={onToggle}
                        aria-expanded={isOpen}
                        className={`block-editor-panel-color-gradient-settings__dropdown tableberg-element-font-option-toggle${
                            isOpen ? " is-open" : ""
                        }`}
                    >
                        <span className="tableberg-element-font-option-label">
                            {label}
                        </span>
                    </Button>
                )}
                renderContent={({ onClose }) => (
                    <div
                        className="tableberg-element-font-option-popover tableberg-element-font-option-popover--font-size"
                        onKeyDown={event => {
                            if (event.key === "Enter") {
                                onClose();
                            }
                        }}
                    >
                        <FontSizePicker
                            value={undefined}
                            withReset={false}
                            onChange={fontSize => {
                                if (!fontSize) {
                                    return;
                                }

                                onSelect(String(fontSize));
                            }}
                        />
                        <Button
                            __next40pxDefaultSize
                            className="components-circular-option-picker__clear"
                            variant="tertiary"
                            onClick={() => {
                                onReset();
                                onClose();
                            }}
                        >
                            {__("Reset to default", "tableberg")}
                        </Button>
                    </div>
                )}
            />
        </div>
    );
}

/** Everything pro's column-sorting UI needs, gathered from the store. */
export interface ColumnSortingContext {
    columnNumbers: number[];
    getColumnConfig: (column: number) => ColumnConfig | undefined;
    isColumnSortableAllowed: (column: number) => boolean;
    setColumnSortable: (
        column: number,
        sortable: SortableType | undefined
    ) => void;
    hasSortableCols: boolean;
    sortPreviewMode: boolean;
    enterSortPreviewMode: () => void;
}

function ColumnSortingControl({
    ProColumnSortingContent,
}: {
    // Injected by the pro plugin; undefined when pro is not installed. A
    // render function rather than a plain node: the merged-cells check and
    // the live preview toggle both need store state pro cannot reach from
    // outside (it runs above TableStoreProvider), so free gathers the
    // context and pro only renders from it.
    ProColumnSortingContent?: (ctx: ColumnSortingContext) => ReactNode;
}) {
    const cells = useTableStore(state => state.cells);
    const columns = useTableStore(state => state.columns);
    const tableConfig = useTableStore(state => state.table);
    const sortPreviewMode = useTableStore(state => state.sortPreviewMode);
    const getColumnConfig = useTableStore(state => state.getColumnConfig);
    const setColumnSortable = useTableStore(state => state.setColumnSortable);
    const isColumnSortableAllowed = useTableStore(
        state => state.isColumnSortableAllowed
    );
    const enterSortPreviewMode = useTableStore(
        state => state.enterSortPreviewMode
    );

    const { headerEnabled } = tableConfig;

    if (!headerEnabled) {
        return (
            <InspectorControls>
                <PanelBody title={__("Column Sorting", "tableberg")}>
                    <p style={{ color: "#757575" }}>
                        {__(
                            "To enable column sorting, make the top row a header in the Header & Footer Settings panel.",
                            "tableberg"
                        )}
                    </p>
                </PanelBody>
            </InspectorControls>
        );
    }

    if (tableHasMergedCells(cells)) {
        return (
            <InspectorControls>
                <PanelBody title={__("Column Sorting", "tableberg")}>
                    <p style={{ color: "#757575" }}>
                        {__(
                            "Column sorting is not available for tables with merged cells.",
                            "tableberg"
                        )}
                    </p>
                </PanelBody>
            </InspectorControls>
        );
    }

    const columnNumbers = Array.from(
        { length: tableConfig.cols },
        (_, index) => index
    );
    const hasSortableCols = hasSortableColumns(columns);

    if (!ProColumnSortingContent) {
        return (
            <InspectorControls>
                <LockedControl isEnhanced selected="sorting">
                    <PanelBody title={__("Column Sorting", "tableberg")}>
                        {columnNumbers.map(column => (
                            <ToggleControl
                                key={column}
                                checked={false}
                                label={sprintf(
                                    __("Column %d", "tableberg"),
                                    column + 1
                                )}
                                onChange={() => null}
                            />
                        ))}
                    </PanelBody>
                </LockedControl>
            </InspectorControls>
        );
    }

    return (
        <InspectorControls>
            <PanelBody
                title={__("Column Sorting", "tableberg")}
                initialOpen={hasSortableCols}
            >
                {ProColumnSortingContent({
                    columnNumbers,
                    getColumnConfig,
                    isColumnSortableAllowed,
                    setColumnSortable,
                    hasSortableCols,
                    sortPreviewMode,
                    enterSortPreviewMode,
                })}
            </PanelBody>
        </InspectorControls>
    );
}

/** Everything pro's pagination UI needs, gathered from the store. */
export interface PaginationContext {
    paginationConfig: PaginationConfig;
    updatePaginationConfig: (patch: Partial<PaginationConfig>) => void;
}

function PaginationControl({
    ProPaginationContent,
}: {
    // Injected by the pro plugin; undefined when pro is not installed. A
    // render function rather than a plain node: the row-span check needs
    // block-tree `cells` pro cannot reach from outside (it runs above
    // TableStoreProvider), and setPaginationConfig also clamps the store's
    // ephemeral currentPage, so free gathers the context and pro only
    // renders from it.
    ProPaginationContent?: (ctx: PaginationContext) => ReactNode;
}) {
    const cells = useTableStore(state => state.cells);
    const paginationConfig = useTableStore(state => state.table.pagination!);
    const setPaginationConfig = useTableStore(
        state => state.setPaginationConfig
    );

    if (!ProPaginationContent) {
        return (
            <InspectorControls>
                <LockedControl isEnhanced selected="pagination">
                    <PanelBody title={__("Pagination", "tableberg")}>
                        <ToggleControl
                            checked={false}
                            label={__("Enable Pagination", "tableberg")}
                            onChange={() => null}
                        />
                    </PanelBody>
                </LockedControl>
            </InspectorControls>
        );
    }

    if (tableHasRowSpanningCells(cells)) {
        return (
            <InspectorControls>
                <PanelBody title={__("Pagination", "tableberg")}>
                    <p style={{ color: "#757575" }}>
                        {__(
                            "Pagination is not available for tables with row-spanning cells (cells that span multiple rows).",
                            "tableberg"
                        )}
                    </p>
                </PanelBody>
            </InspectorControls>
        );
    }

    return (
        <InspectorControls>
            <PanelBody title={__("Pagination", "tableberg")}>
                {ProPaginationContent({
                    paginationConfig,
                    updatePaginationConfig: setPaginationConfig,
                })}
            </PanelBody>
        </InspectorControls>
    );
}

/**
 * Only the table-wide switch lives here. The per-column width and per-row
 * height are set on the cell you select, from the cell block's sidebar —
 * that is where the selection actually is in the block editor.
 */
function ColumnAndRowDimensionsControl() {
    const tableConfig = useTableStore(state => state.table);
    const updateTableConfig = useTableStore(state => state.updateTable);

    if (tableConfig.cols < 1 && tableConfig.rows < 1) {
        return null;
    }

    return (
        <InspectorControls>
            <PanelBody title={__("Column & Row Dimensions", "tableberg")}>
                <ToggleControl
                    checked={tableConfig.fixedColumnWidths ?? true}
                    label={__("Equal width columns", "tableberg")}
                    onChange={(enabled: boolean) => {
                        updateTableConfig({ fixedColumnWidths: enabled });
                    }}
                />
                <p style={{ marginBottom: 0, color: "#757575" }}>
                    {__(
                        "Select a cell to set the width of its column and the height of its row.",
                        "tableberg"
                    )}
                </p>
            </PanelBody>
        </InspectorControls>
    );
}

interface TablebergControlsProps {
    // Injected by the pro plugin via NativeTableEdit's generic Pro*-prop
    // forwarding (same mechanism the element bridge uses for cell elements).
    // Undefined when pro is not installed.
    ProStickyHeaderControl?: ReactNode;
    ProStickyFirstColControl?: ReactNode;
    ProCellOrientationControl?: ReactNode;
    ProBorderModeControls?: ReactNode;
    ProColumnSortingContent?: (ctx: ColumnSortingContext) => ReactNode;
    ProSearchControl?: ReactNode;
    ProPaginationContent?: (ctx: PaginationContext) => ReactNode;
}

function TablebergControls({
    ProStickyHeaderControl,
    ProStickyFirstColControl,
    ProCellOrientationControl,
    ProBorderModeControls,
    ProColumnSortingContent,
    ProSearchControl,
    ProPaginationContent,
}: TablebergControlsProps = {}) {
    const isPro = isProAvailable();
    const { clientId } = useBlockEditContext();
    const tableConfig = useTableStore(state => state.table);
    const cells = useTableStore(state => state.cells);
    const updateConfig = useTableStore(state => state.updateTable);
    const setCells = useTableStore(state => state.setCells);
    const selectedCells = useTableStore(state => state.selectedCells);
    const tableState = useTableStore(state => state);
    const sortPreviewMode = useTableStore(state => state.sortPreviewMode);
    const selectedRibbonCell = useTableStore(state => state.selectedRibbonCell);
    const showCaption = useTableStore(state => state.showCaption);
    const setShowCaption = useTableStore(state => state.setShowCaption);
    const showRowColumnControls = useTableStore(
        state => state.showRowColumnControls
    );
    const showDuplicateMoveControls = useTableStore(
        state => state.showDuplicateMoveControls
    );
    const toggleRowColumnControls = useTableStore(
        state => state.toggleRowColumnControls
    );
    const toggleDuplicateMoveControls = useTableStore(
        state => state.toggleDuplicateMoveControls
    );
    const caption = tableConfig.caption || "";
    const [activeTab, setActiveTab] = useState<SidebarTab>("settings");
    const [showDuplicateMoveUpsell, setShowDuplicateMoveUpsell] =
        useState(false);

    const isRibbonSelected = selectedRibbonCell !== null;
    const tableAlignment: TableAlignment = tableConfig.tableAlignment || "left";
    const tableWidth = (tableConfig.tableWidth || "auto").trim();
    const tableWidthMode: TableWidthMode = isTableWidthPreset(tableWidth)
        ? tableWidth
        : "fixed";
    const isFixedWidthMode = tableWidthMode === "fixed";
    const fixedTableWidthValue = isFixedWidthMode
        ? tableWidth || DEFAULT_FIXED_TABLE_WIDTH
        : DEFAULT_FIXED_TABLE_WIDTH;
    const defaultCellSpacing = getDefaultCellSpacing();
    const cellSpacing = tableConfig.cellSpacing || defaultCellSpacing;
    const horizontalCellSpacing =
        cellSpacing.horizontal || defaultCellSpacing.horizontal;
    const verticalCellSpacing =
        cellSpacing.vertical || defaultCellSpacing.vertical;
    const defaultTableBorder = tableConfigDefaults.tableBorder!!;
    const tableBorder = tableConfig.tableBorder || defaultTableBorder;

    const tableBorderControlProps = {
        label: __("Table Border", "tableberg"),
        value: tableBorder,
        hasValue: () =>
            !!tableBorder.top ||
            !!tableBorder.right ||
            !!tableBorder.bottom ||
            !!tableBorder.left,
        onChange: (newBorder: typeof tableBorder) => {
            updateConfig({ tableBorder: newBorder });
        },
        onDeselect: () => {
            updateConfig({ tableBorder: { ...defaultTableBorder } });
        },
    };

    const defaultBlockMargin = tableConfigDefaults.margin!!;
    const blockMargin = tableConfig.margin || defaultBlockMargin;
    const blockMarginControlProps = {
        label: __("Block Margin", "tableberg"),
        value: blockMargin,
        hasValue: () =>
            !!blockMargin.top ||
            !!blockMargin.right ||
            !!blockMargin.bottom ||
            !!blockMargin.left,
        onChange: (newMargin: typeof blockMargin) => {
            updateConfig({ margin: newMargin });
        },
        onDeselect: () => {
            updateConfig({ margin: { ...defaultBlockMargin } });
        },
    };

    const defaultBlockPadding = tableConfigDefaults.padding!!;
    const blockPadding = tableConfig.padding || defaultBlockPadding;
    const blockPaddingControlProps = {
        label: __("Block Padding", "tableberg"),
        value: blockPadding,
        hasValue: () =>
            !!blockPadding.top ||
            !!blockPadding.right ||
            !!blockPadding.bottom ||
            !!blockPadding.left,
        onChange: (newPadding: typeof blockPadding) => {
            updateConfig({ padding: newPadding });
        },
        onDeselect: () => {
            updateConfig({ padding: { ...defaultBlockPadding } });
        },
    };

    const borderControlProps = useCellStyleControl({
        styleKey: "border",
        defaultValue: cellDefaultsStyles.border,
        label: __("Cell Border", "tableberg"),
        labelSelected: __("Common Cell Border", "tableberg"),
        hasValue: border =>
            !!border.top || !!border.right || !!border.bottom || !!border.left,
    });

    const borderRadiusControlProps = useCellStyleControl({
        styleKey: "borderRadius",
        defaultValue: cellDefaultsStyles.borderRadius,
        label: __("Table Border Radius", "tableberg"),
        labelSelected: __("Cell Border Radius", "tableberg"),
        hasValue: borderRadius =>
            !!borderRadius.topLeft ||
            !!borderRadius.topRight ||
            !!borderRadius.bottomRight ||
            !!borderRadius.bottomLeft,
    });

    const paddingControlProps = useCellStyleControl({
        styleKey: "padding",
        defaultValue: cellDefaultsStyles.padding,
        hasValue: padding =>
            !!padding.top ||
            !!padding.right ||
            !!padding.bottom ||
            !!padding.left,
        label: __("Common Cell Padding", "tableberg"),
        labelSelected: __("Cell Padding", "tableberg"),
    });

    const backgroundColorControlProps = useCellStyleControl({
        styleKey: "backgroundColor",
        defaultValue: cellDefaultsStyles.backgroundColor,
        hasValue: bg => !!bg,
        label: __("Common Cell Background Color", "tableberg"),
        labelSelected: __("Cell Background Color", "tableberg"),
    });

    const elementGapControlProps = useCellStyleControl({
        styleKey: "elementGap",
        defaultValue: cellDefaultsStyles.elementGap,
        hasValue: elementGap => elementGap !== cellDefaultsStyles.elementGap,
        label: __("Common Element Spacing", "tableberg"),
        labelSelected: __("Element Spacing", "tableberg"),
    });

    const selectedCellKeys = new Set(selectedCells);
    const cellEntries = getCellEntries(cells);

    const scopedCellEntries =
        selectedCells.length > 0
            ? cellEntries.filter(([cellKey]) => selectedCellKeys.has(cellKey))
            : cellEntries;

    const scopedElements = scopedCellEntries.flatMap(
        ([, elements]) => elements
    );

    const fontOptionsRegistry = useRegistry() as any;

    // Element alignment lives on the element BLOCKS in the tree now.
    const forEachElementBlock = (
        visit: (elBlock: any, dispatch: any) => void
    ) => {
        const be = fontOptionsRegistry.select(blockEditorStore);
        const beDispatch = fontOptionsRegistry.dispatch(blockEditorStore);
        const rowBlocks = be.getBlock(clientId)?.innerBlocks ?? [];

        fontOptionsRegistry.batch(() => {
            for (const rowBlock of rowBlocks) {
                for (const cellBlock of rowBlock.innerBlocks ?? []) {
                    for (const elBlock of cellBlock.innerBlocks ?? []) {
                        visit(elBlock, beDispatch);
                    }
                }
            }
        });
    };

    const elementsAlignmentValue = (() => {
        const be = fontOptionsRegistry.select(blockEditorStore);
        const rowBlocks = be.getBlock(clientId)?.innerBlocks ?? [];
        let uniform: ElementAlignment | undefined;
        for (const rowBlock of rowBlocks) {
            for (const cellBlock of rowBlock.innerBlocks ?? []) {
                for (const elBlock of cellBlock.innerBlocks ?? []) {
                    const align = elBlock.attributes?.align as
                        | ElementAlignment
                        | undefined;
                    if (!align) {
                        continue;
                    }
                    if (uniform === undefined) {
                        uniform = align;
                    } else if (uniform !== align) {
                        return undefined;
                    }
                }
            }
        }
        return uniform;
    })();

    const elementsAlignmentControlProps = {
        label: __("Common Elements Alignment", "tableberg"),
        value: elementsAlignmentValue,
        onChange: (newAlignment: ElementAlignment) => {
            forEachElementBlock((elBlock, dispatch) => {
                dispatch.updateBlockAttributes(elBlock.clientId, {
                    align: newAlignment,
                });
            });
        },
    };


    // Bulk-updates every text/list ELEMENT BLOCK in the table's tree (the
    // legacy store path below only worked when cell content lived in attrs).
    const updateElementFontOptions = (updates: {
        textColor?: string;
        linkColor?: string;
        fontSize?: string;
    }) => {
        const be = fontOptionsRegistry.select(blockEditorStore);
        const beDispatch = fontOptionsRegistry.dispatch(blockEditorStore);
        const rowBlocks = be.getBlock(clientId)?.innerBlocks ?? [];

        fontOptionsRegistry.batch(() => {
            for (const rowBlock of rowBlocks) {
                for (const cellBlock of rowBlock.innerBlocks ?? []) {
                    for (const elBlock of cellBlock.innerBlocks ?? []) {
                        if (
                            elBlock.name !== "tableberg/text" &&
                            elBlock.name !== "tableberg/list"
                        ) {
                            continue;
                        }
                        beDispatch.updateBlockAttributes(elBlock.clientId, {
                            styles: {
                                ...(elBlock.attributes?.styles ?? {}),
                                ...(updates.textColor !== undefined
                                    ? { textColor: updates.textColor }
                                    : {}),
                                ...(updates.linkColor !== undefined
                                    ? { linkColor: updates.linkColor }
                                    : {}),
                                ...(updates.fontSize !== undefined
                                    ? { fontSize: updates.fontSize }
                                    : {}),
                            },
                        });
                    }
                }
            }
        });
    };

    const legacyUpdateElementFontOptions = (updates: {
        textColor?: string;
        linkColor?: string;
        fontSize?: string;
    }) => {
        const nextCells = Object.fromEntries(
            cellEntries.map(([key, elements]) => {
                if (selectedCells.length > 0 && !selectedCellKeys.has(key)) {
                    return [key, cells[key]];
                }

                return [
                    key,
                    {
                        ...(cells[key] || {}),
                        elements: elements.map(element => {
                            if (
                                element.name === "text" ||
                                element.name === "list"
                            ) {
                                return {
                                    ...element,
                                    attributes: {
                                        ...element.attributes,
                                        styles: {
                                            ...element.attributes.styles,
                                            ...(updates.textColor !== undefined
                                                ? {
                                                      textColor:
                                                          updates.textColor,
                                                  }
                                                : {}),
                                            ...(updates.linkColor !== undefined
                                                ? {
                                                      linkColor:
                                                          updates.linkColor,
                                                  }
                                                : {}),
                                            ...(updates.fontSize !== undefined
                                                ? { fontSize: updates.fontSize }
                                                : {}),
                                        },
                                    },
                                };
                            }

                            if (element.name === "star-rating") {
                                return {
                                    ...element,
                                    attributes: {
                                        ...element.attributes,
                                        ...(updates.textColor !== undefined
                                            ? {
                                                  reviewTextColor:
                                                      updates.textColor,
                                              }
                                            : {}),
                                        ...(updates.linkColor !== undefined
                                            ? {
                                                  reviewTextLinkColor:
                                                      updates.linkColor,
                                              }
                                            : {}),
                                        ...(updates.fontSize !== undefined
                                            ? {
                                                  reviewTextFontSize:
                                                      updates.fontSize,
                                              }
                                            : {}),
                                    },
                                };
                            }

                            return element;
                        }),
                    },
                ];
            })
        ) as Record<CellKey, Cell>;

        setCells(nextCells);
    };

    const verticalAlignControlProps = useCellStyleControl({
        styleKey: "verticalAlign",
        defaultValue: cellDefaultsStyles.verticalAlign,
        hasValue: verticalAlign =>
            verticalAlign !== cellDefaultsStyles.verticalAlign,
        label: __("Common Elements Vertical Alignment", "tableberg"),
        labelSelected: __("Elements Vertical Alignment", "tableberg"),
    });

    const {
        headerBackgroundColorControl,
        evenRowBackgroundColorControl,
        oddRowBackgroundColorControl,
        footerBackgroundColorControl,
    } = useBackgroundColorHelpers();

    if (sortPreviewMode) {
        return null;
    }

    return (
        <>
            <BlockControls>
                <ToolbarWithDropdown
                    title={__("Align table", "tableberg")}
                    value={tableAlignment}
                    controls={TABLE_ALIGNMENT_TOOLBAR_CONTROLS}
                    disabled={!isFixedWidthMode}
                    onChange={(newAlignment?: string) => {
                        if (!isFixedWidthMode || !newAlignment) {
                            return;
                        }

                        updateConfig({
                            tableAlignment: newAlignment as TableAlignment,
                        });
                    }}
                />
                <ToolbarGroup>
                    <ToolbarButton
                        onClick={() => {
                            const nextShowCaption = !showCaption;
                            setShowCaption(nextShowCaption);

                            if (!nextShowCaption && caption.trim() !== "") {
                                updateConfig({ caption: "" });
                            }
                        }}
                        icon={captionIcon}
                        isPressed={showCaption}
                        label={
                            showCaption
                                ? __("Remove caption", "tableberg")
                                : __("Add caption", "tableberg")
                        }
                    />
                    <ToolbarButton
                        onClick={() => {
                            mergeCells(selectedCells, tableState);
                        }}
                        title="Merge Cells"
                        icon={table}
                        disabled={
                            !areAllMergeable(selectedCells, tableState.cells)
                        }
                    />
                </ToolbarGroup>
            </BlockControls>

            <InspectorControls>
                <TabPanel
                    className="tableberg-sidebar-tabs"
                    initialTabName="settings"
                    onSelect={selectedTab => {
                        if (
                            selectedTab === "settings" ||
                            selectedTab === "styles" ||
                            selectedTab === "datatable"
                        ) {
                            setActiveTab(selectedTab);
                        }
                    }}
                    tabs={[
                        {
                            name: "settings",
                            title: __("Settings", "tableberg"),
                            icon: cog,
                        },
                        {
                            name: "styles",
                            title: __("Styles", "tableberg"),
                            icon: stylesIcon,
                        },
                        {
                            name: "datatable",
                            title: __("Datatable", "tableberg"),
                            icon: table,
                        },
                    ]}
                >
                    {() => null}
                </TabPanel>
            </InspectorControls>

            {selectedCells.length === 0 ? (
                <AdvancedCustomClassControl
                    label={__("Additional CSS class(es)", "tableberg")}
                    value={tableConfig.className}
                    onChange={className => {
                        updateConfig({
                            className: className || "",
                        });
                    }}
                />
            ) : (
                <AdvancedCustomClassControl
                    label={__("Additional CSS class(es)", "tableberg")}
                    value={
                        selectedCells.every(
                            key =>
                                (cells[key]?.className || "") ===
                                (cells[selectedCells[0]]?.className || "")
                        )
                            ? cells[selectedCells[0]]?.className
                            : ""
                    }
                    onChange={className => {
                        const nextClassName = className || "";

                        setCells(
                            Object.fromEntries(
                                Object.entries(cells).map(([key, cell]) => {
                                    if (
                                        !selectedCells.includes(key as CellKey)
                                    ) {
                                        return [key, cell];
                                    }

                                    return [
                                        key,
                                        {
                                            ...cell,
                                            className: nextClassName,
                                        },
                                    ];
                                })
                            ) as Record<CellKey, Cell>
                        );
                    }}
                />
            )}

            {activeTab === "settings" && (
                <>
                    <InspectorControls>
                        <PanelBody title={__("Table Width", "tableberg")}>
                            <ToggleGroupControl
                                label={__("Width Mode", "tableberg")}
                                value={tableWidthMode}
                                onChange={(
                                    newValue: string | number | undefined
                                ) => {
                                    if (
                                        typeof newValue !== "string" ||
                                        !newValue
                                    ) {
                                        return;
                                    }

                                    if (newValue === "fixed") {
                                        updateConfig({
                                            tableAlignment,
                                            tableWidth:
                                                tableWidthMode === "fixed"
                                                    ? tableWidth
                                                    : DEFAULT_FIXED_TABLE_WIDTH,
                                        });
                                        return;
                                    }

                                    if (
                                        newValue === "auto" ||
                                        newValue === "wide" ||
                                        newValue === "full"
                                    ) {
                                        updateConfig({
                                            tableAlignment,
                                            tableWidth: newValue,
                                        });
                                    }
                                }}
                                isBlock
                            >
                                <ToggleGroupControlOption
                                    value="auto"
                                    label={__("Auto", "tableberg")}
                                />
                                <ToggleGroupControlOption
                                    value="fixed"
                                    label={__("Fixed", "tableberg")}
                                />
                                <ToggleGroupControlOption
                                    value="wide"
                                    label={__("Wide", "tableberg")}
                                />
                                <ToggleGroupControlOption
                                    value="full"
                                    label={__("Full", "tableberg")}
                                />
                            </ToggleGroupControl>

                            {isFixedWidthMode && (
                                <SizeControl
                                    label={__("Table Width", "tableberg")}
                                    value={fixedTableWidthValue}
                                    onChange={newValue => {
                                        updateConfig({
                                            tableWidth: newValue
                                                ? newValue.trim()
                                                : DEFAULT_FIXED_TABLE_WIDTH,
                                        });
                                    }}
                                />
                            )}
                        </PanelBody>
                    </InspectorControls>

                    <InspectorControls>
                        <PanelBody title={__("Cell Elements", "tableberg")}>
                            {/*
                             * Horizontal cell layout — and the wrap choice
                             * that only matters with it — is a pro feature:
                             * pro hands the whole control down as one prop.
                             * Free has no implementation of its own, so
                             * without pro the locked placeholder below is
                             * all there is.
                             */}
                            {ProCellOrientationControl ?? (
                                <LockedControl
                                    isEnhanced
                                    selected="cell-orientation"
                                >
                                    <ToggleGroupControl
                                        __nextHasNoMarginBottom
                                        label={__(
                                            "Common Elements Orientation",
                                            "tableberg"
                                        )}
                                        value="vertical"
                                        isBlock
                                        onChange={() => null}
                                    >
                                        {CELL_ORIENTATION_OPTIONS.map(
                                            ({ value, icon, label }) => (
                                                <ToggleGroupControlOptionIcon
                                                    key={value}
                                                    value={value}
                                                    icon={icon}
                                                    label={label}
                                                />
                                            )
                                        )}
                                    </ToggleGroupControl>
                                </LockedControl>
                            )}

                            <SpacingControlSingle
                                label={elementGapControlProps.label}
                                value={elementGapControlProps.value}
                                onChange={value => {
                                    elementGapControlProps.onChange(value);
                                }}
                            />

                            <ToggleGroupControl
                                __nextHasNoMarginBottom
                                label={elementsAlignmentControlProps.label}
                                value={elementsAlignmentControlProps.value}
                                isBlock
                                onChange={newAlignment => {
                                    if (
                                        newAlignment !== "left" &&
                                        newAlignment !== "center" &&
                                        newAlignment !== "right"
                                    ) {
                                        return;
                                    }

                                    elementsAlignmentControlProps.onChange(
                                        newAlignment
                                    );
                                }}
                            >
                                {CELL_ALIGNMENT_OPTIONS.map(
                                    ({ value, icon, label }) => (
                                        <ToggleGroupControlOptionIcon
                                            key={value}
                                            value={value}
                                            icon={icon}
                                            label={label}
                                        />
                                    )
                                )}
                            </ToggleGroupControl>

                            <ToggleGroupControl
                                __nextHasNoMarginBottom
                                label={verticalAlignControlProps.label}
                                value={verticalAlignControlProps.value}
                                isBlock
                                onChange={newVerticalAlign => {
                                    if (
                                        newVerticalAlign !== "top" &&
                                        newVerticalAlign !== "middle" &&
                                        newVerticalAlign !== "bottom"
                                    ) {
                                        return;
                                    }

                                    verticalAlignControlProps.onChange(
                                        newVerticalAlign
                                    );
                                }}
                            >
                                {CELL_VERTICAL_ALIGN_OPTIONS.map(
                                    ({ value, icon, label }) => (
                                        <ToggleGroupControlOptionIcon
                                            key={value}
                                            value={value}
                                            icon={icon}
                                            label={label}
                                        />
                                    )
                                )}
                            </ToggleGroupControl>
                        </PanelBody>
                    </InspectorControls>

                    <InspectorControls>
                        <PanelBody
                            title={__("Element Font Options", "tableberg")}
                        >
                            <div className="tableberg-element-font-options">
                                <ElementFontColorOptionControl
                                    label={__(
                                        "Set all elements' text color",
                                        "tableberg"
                                    )}
                                    onSelect={textColor => {
                                        updateElementFontOptions({
                                            textColor,
                                        });
                                    }}
                                    onReset={() => {
                                        updateElementFontOptions({
                                            textColor: "#000000",
                                        });
                                    }}
                                />
                                <ElementFontColorOptionControl
                                    label={__(
                                        "Set all elements' link color",
                                        "tableberg"
                                    )}
                                    onSelect={linkColor => {
                                        updateElementFontOptions({
                                            linkColor,
                                        });
                                    }}
                                    onReset={() => {
                                        updateElementFontOptions({
                                            linkColor: "",
                                        });
                                    }}
                                />
                                <ElementFontSizeOptionControl
                                    label={__(
                                        "Set all elements' font size",
                                        "tableberg"
                                    )}
                                    onSelect={fontSize => {
                                        updateElementFontOptions({
                                            fontSize,
                                        });
                                    }}
                                    onReset={() => {
                                        updateElementFontOptions({
                                            fontSize: "1.38rem",
                                        });
                                    }}
                                />
                            </div>
                        </PanelBody>
                    </InspectorControls>

                    <InspectorControls>
                        <PanelBody
                            title={__("Header & Footer Settings", "tableberg")}
                        >
                            <ToggleControl
                                checked={tableConfig.headerEnabled}
                                label={__("Make Top Row Header", "tableberg")}
                                onChange={(headerEnabled: boolean) => {
                                    updateConfig({ headerEnabled });
                                }}
                            />
                            <ToggleControl
                                checked={tableConfig.footerEnabled}
                                label={__(
                                    "Make Bottom Row Footer",
                                    "tableberg"
                                )}
                                onChange={(footerEnabled: boolean) => {
                                    updateConfig({ footerEnabled });
                                }}
                            />
                            {/*
                             * Sticky header/first column are pro features:
                             * pro hands the real toggles down as props. Free
                             * has no implementation of its own, so without
                             * pro the locked placeholders below are all
                             * there is.
                             */}
                            {ProStickyHeaderControl ?? (
                                <LockedControl
                                    isEnhanced
                                    selected="sticky-top-row"
                                >
                                    <ToggleControl
                                        checked={false}
                                        label={__("Sticky Header", "tableberg")}
                                        help={__(
                                            "Available in Tableberg Pro.",
                                            "tableberg"
                                        )}
                                        onChange={() => null}
                                    />
                                </LockedControl>
                            )}
                            {ProStickyFirstColControl ?? (
                                <LockedControl
                                    isEnhanced
                                    selected="sticky-first-col"
                                >
                                    <ToggleControl
                                        checked={false}
                                        label={__(
                                            "Sticky First Column",
                                            "tableberg"
                                        )}
                                        help={__(
                                            "Available in Tableberg Pro.",
                                            "tableberg"
                                        )}
                                        onChange={() => null}
                                    />
                                </LockedControl>
                            )}
                        </PanelBody>
                    </InspectorControls>

                    <ColumnAndRowDimensionsControl />
                    <ResponsiveControl />
                </>
            )}

            {activeTab === "styles" && (
                <>
                    <InspectorControls>
                        <ToolsPanel
                            label={__("Colors", "tableberg")}
                            resetAll={resetToolsPanelFilters}
                            panelId={clientId}
                            className="tableberg-colors-tools-panel"
                            style={{ gap: "0" }}
                        >
                            {selectedCells.length > 0 && !isPro ? (
                                <LockedControl isEnhanced selected="cell-bg">
                                    <ColorControl
                                        {...backgroundColorControlProps}
                                    />
                                </LockedControl>
                            ) : (
                                <ColorControl
                                    {...backgroundColorControlProps}
                                />
                            )}
                            {headerBackgroundColorControl && (
                                <ColorControl
                                    {...headerBackgroundColorControl}
                                />
                            )}
                            <ColorControl {...evenRowBackgroundColorControl} />
                            <ColorControl {...oddRowBackgroundColorControl} />
                            {footerBackgroundColorControl && (
                                <ColorControl
                                    {...footerBackgroundColorControl}
                                />
                            )}
                        </ToolsPanel>
                    </InspectorControls>

                    <InspectorControls>
                        <ToolsPanel
                            label={__("Dimensions", "tableberg")}
                            resetAll={resetToolsPanelFilters}
                            panelId={clientId}
                        >
                            <div className="tableberg-border-mode-controls">
                                {ProBorderModeControls ?? (
                                    <>
                                        <LockedControl
                                            isEnhanced
                                            selected="row-only-border"
                                        >
                                            <ToggleControl
                                                checked={false}
                                                label={__(
                                                    "Row Only Border",
                                                    "tableberg"
                                                )}
                                                onChange={() => null}
                                            />
                                        </LockedControl>
                                        <LockedControl
                                            isEnhanced
                                            selected="column-only-border"
                                        >
                                            <ToggleControl
                                                checked={false}
                                                label={__(
                                                    "Column Only Border",
                                                    "tableberg"
                                                )}
                                                onChange={() => null}
                                            />
                                        </LockedControl>
                                    </>
                                )}
                            </div>
                            <BorderControl {...tableBorderControlProps} />
                            <BorderControl {...borderControlProps} />
                            <BorderRadiusControl
                                {...borderRadiusControlProps}
                            />
                            <SpacingControl {...paddingControlProps} />
                            <SpacingControl
                                label={__("Cell Spacing", "tableberg")}
                                value={toCellSpacingPaddingValue({
                                    horizontal: horizontalCellSpacing,
                                    vertical: verticalCellSpacing,
                                })}
                                hasValue={() =>
                                    horizontalCellSpacing !==
                                        defaultCellSpacing.horizontal ||
                                    verticalCellSpacing !==
                                        defaultCellSpacing.vertical
                                }
                                onChange={newValue => {
                                    updateConfig({
                                        cellSpacing:
                                            fromCellSpacingPaddingValue(
                                                newValue,
                                                {
                                                    horizontal:
                                                        horizontalCellSpacing,
                                                    vertical:
                                                        verticalCellSpacing,
                                                },
                                                defaultCellSpacing
                                            ),
                                    });
                                }}
                                onDeselect={() => {
                                    updateConfig({
                                        cellSpacing: { ...defaultCellSpacing },
                                    });
                                }}
                            />
                            <SpacingControl {...blockMarginControlProps} />
                            <SpacingControl {...blockPaddingControlProps} />
                        </ToolsPanel>
                    </InspectorControls>
                </>
            )}

            {activeTab === "datatable" && (
                <>
                    <ColumnSortingControl
                        ProColumnSortingContent={ProColumnSortingContent}
                    />
                    <PaginationControl
                        ProPaginationContent={ProPaginationContent}
                    />
                    {ProSearchControl ?? (
                        <InspectorControls>
                            <LockedControl isEnhanced selected="search">
                                <ToolsPanel
                                    label={__("Search", "tableberg")}
                                    resetAll={() => null}
                                >
                                    <ToolsPanelItem
                                        label={__(
                                            "Enable Search",
                                            "tableberg"
                                        )}
                                        hasValue={() => false}
                                        onDeselect={() => null}
                                        isShownByDefault
                                    >
                                        <ToggleControl
                                            checked={false}
                                            label={__(
                                                "Enable Search",
                                                "tableberg"
                                            )}
                                            onChange={() => null}
                                        />
                                    </ToolsPanelItem>
                                </ToolsPanel>
                            </LockedControl>
                        </InspectorControls>
                    )}
                </>
            )}

            {showDuplicateMoveUpsell && (
                <UpsellEnhancedModal
                    onClose={() => setShowDuplicateMoveUpsell(false)}
                    selected="duplicate-row-col"
                />
            )}
        </>
    );
}
export default TablebergControls;

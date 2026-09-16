import { ElementBindings } from "./dynamic-data/types";

export interface TablebergBlockAttrs {
    version?: number;
    isExample?: boolean;
    table: TableConfig;
    rows: RowConfigs;
    columns: ColumnConfigs;
    cells: Record<CellKey, Cell>;
    bindings: Record<string, BindingDefinition>;
    cellDefaults: CellDefaults;
}

export type RowConfigs = Array<RowConfig | null | undefined>;
export type ColumnConfigs = Array<ColumnConfig | null | undefined>;

export type CellKey = `${number},${number}`;

export interface Span {
    rowSpan: number;
    colSpan: number;
}

export type ElementTypes =
    | "text"
    | "button"
    | "image"
    | "list"
    | "styled-list"
    | "icon"
    | "ribbon"
    | "star-rating"
    | "custom-html";

export type SortableType = "text" | "number" | "date";

export interface ColumnConfig {
    sortable?: SortableType;
    width?: string;
}

export interface RowConfig {
    height?: string;
    // Pro-owned: declared in the free schema for data preservation, but free
    // never writes it directly. It only excludes such rows from bulk-applied
    // colours (even/odd, etc.) so the row's own colour can show through.
    backgroundColor?: string;
    border?: Border;
}

import {
    TextElementType,
    ButtonElementType,
    ImageElementType,
    ListElementType,
} from "./elements";

export interface GenericCellElement<
    TName extends string = string,
    TAttributes extends Record<string, unknown> = Record<string, unknown>,
> {
    name: TName;
    attributes: TAttributes;
    bindings?: ElementBindings;
}

export type CellElement =
    | TextElementType
    | ButtonElementType
    | ImageElementType
    | ListElementType
    | GenericCellElement<"styled-list">
    | GenericCellElement<"icon">
    | GenericCellElement<"star-rating">
    | GenericCellElement<"custom-html">;

export type { TextElementType, TextElementAttributes } from "./elements";
export type { ButtonElementType, ButtonElementAttributes } from "./elements";
export type { ImageElementType, ImageElementAttributes } from "./elements";
export type { ListElementType, ListElementAttributes } from "./elements";

export interface PaginationConfig {
    enabled: boolean;
    pageSize: number;
    showPageNumbers: boolean;
    showPrevNext: boolean;
}

export type SearchPosition = "left" | "right";

export type TableAlignment = "left" | "center" | "right";

export type TableWidth = "auto" | "wide" | "full" | string;

export interface CellSpacing {
    horizontal: string;
    vertical: string;
}

export interface SearchConfig {
    enabled: boolean;
    placeholder: string;
    highlightColor: string;
    position: SearchPosition;
}

export type ResponsiveMode = "" | "scroll" | "stack";

export interface ResponsiveBreakpoint {
    enabled: boolean;
    maxWidth: number;
    mode: ResponsiveMode;
    transpose: boolean;
    stackCount: number;
    repeatFirstCol: boolean;
}

export interface ResponsiveConfig {
    tablet: ResponsiveBreakpoint;
    mobile: ResponsiveBreakpoint;
}

export type RibbonType = "bookmark" | "corner" | "side" | "icon" | "badge";

export interface RibbonAttrs {
    text: string;

    style: {
        color: string;
        background: string;
        bgGradient: string;
        fontSize: string;
        padding: {
            top: string;
            right: string;
            bottom: string;
            left: string;
        };
        borderRadius: {
            topLeft: string;
            topRight: string;
            bottomRight: string;
            bottomLeft: string;
        };
    };

    originX: "left" | "right" | "center";
    originY: "top" | "bottom" | "center";
    x: string;
    y: string;

    rotate: number;

    height: string;
    width: string;

    iconSize: string;
    shape: "up" | "down" | "slant-up" | "slant-down";
    icon: {
        iconName: string;
        svg?: {
            viewBox: string;
            path: string;
        };
    } | null;
}

export type RibbonConfig =
    | { enabled: false; type?: RibbonType; attrs?: RibbonAttrs }
    | { enabled: true; type: RibbonType; attrs: RibbonAttrs };

export type Border = {
    top: string;
    right: string;
    bottom: string;
    left: string;
};

export interface TableConfig {
    rows: number;
    cols: number;
    className?: string;
    headerEnabled: boolean;
    footerEnabled: boolean;
    stickyHeader?: boolean;
    stickyFirstCol?: boolean;
    // Pro-owned table-wide grid mode. Declared here so the value survives
    // while Pro is inactive; free never enables or renders it.
    innerBorderType?: "" | "row" | "col";
    caption?: string;
    tableWidth?: TableWidth;
    tableAlignment?: TableAlignment;
    cellSpacing?: CellSpacing;
    tableBorder?: Border;
    margin?: Border;
    padding?: Border;
    fixedColumnWidths?: boolean;
    pagination?: PaginationConfig;
    search?: SearchConfig;
    responsive?: ResponsiveConfig;
}

export interface TableCellStylesType {
    padding: {
        top: string;
        right: string;
        bottom: string;
        left: string;
    };
    backgroundColor: string;
    // Row-position-based defaults, resolved per cell alongside the plain
    // `backgroundColor` fallback above: header/footer rows take their own
    // colour, other rows alternate even/odd. Table-wide, not a per-cell
    // attribute, so these apply the same with or without pro.
    headerBackgroundColor: string;
    footerBackgroundColor: string;
    evenRowBackgroundColor: string;
    oddRowBackgroundColor: string;
    border: Border;
    borderRadius: {
        topLeft: string;
        topRight: string;
        bottomRight: string;
        bottomLeft: string;
    };
    orientation: "vertical" | "horizontal";
    elementGap: string;
    wrap: "wrap" | "nowrap";
    verticalAlign: "top" | "middle" | "bottom";
}

export interface CellDefaults {
    styles: TableCellStylesType;
}

export interface Cell {
    span?: Span;
    className?: string;
    elements?: Array<CellElement>;
    styles?: Partial<TableCellStylesType>;
    ribbon?: RibbonConfig;
    // Pro-owned: declared in the free schema for data preservation. Free
    // never reads or writes it directly.
    backgroundColor?: string;
    border?: Border;
    emptyCell?: boolean;
}

export interface BindingDefinition {
    key: string;
    postId?: number;
    fallback?: string;
}

export interface Structure {
    rows: number;
    cols: number;
    cells: Array<[[number, number], Span]>;
    columns?: Record<number, ColumnConfig>;
    rowConfigs?: Record<number, RowConfig>;
}

export interface Data {
    cells: Array<[[number, number], Array<CellElement>]>;
}

export interface CellStyles extends TableCellStylesType {
    cells: Array<
        [
            [number, number],
            Partial<TableCellStylesType> & { ribbon?: RibbonConfig },
        ]
    >;
}

export const attrVersion = 3;

export const attrDefaults: TablebergBlockAttrs = {
    version: 0,
    isExample: false,
    table: {
        rows: 0,
        cols: 0,
        className: "",
        headerEnabled: false,
        footerEnabled: false,
        stickyHeader: false,
        stickyFirstCol: false,
        innerBorderType: "",
        caption: "",
        tableWidth: "auto",
        tableAlignment: "left",
        cellSpacing: {
            horizontal: "0",
            vertical: "0",
        },
        tableBorder: {
            top: "",
            right: "",
            bottom: "",
            left: "",
        },
        margin: {
            top: "",
            right: "",
            bottom: "",
            left: "",
        },
        padding: {
            top: "",
            right: "",
            bottom: "",
            left: "",
        },
        fixedColumnWidths: true,
        pagination: {
            enabled: false,
            pageSize: 10,
            showPageNumbers: true,
            showPrevNext: true,
        },
        search: {
            enabled: false,
            placeholder: "Search...",
            highlightColor: "",
            position: "left",
        },
        responsive: {
            tablet: {
                enabled: false,
                maxWidth: 700,
                mode: "scroll",
                transpose: false,
                stackCount: 3,
                repeatFirstCol: false,
            },
            mobile: {
                enabled: false,
                maxWidth: 375,
                mode: "scroll",
                transpose: false,
                stackCount: 1,
                repeatFirstCol: false,
            },
        },
    },
    rows: [],
    columns: [],
    cells: {},
    bindings: {},
    cellDefaults: {
        styles: {
            padding: {
                top: "var(--wp--preset--spacing--20)",
                right: "var(--wp--preset--spacing--20)",
                bottom: "var(--wp--preset--spacing--20)",
                left: "var(--wp--preset--spacing--20)",
            },
            border: {
                top: "1px solid black",
                right: "1px solid black",
                bottom: "1px solid black",
                left: "1px solid black",
            },
            borderRadius: {
                topLeft: "0px",
                topRight: "0px",
                bottomRight: "0px",
                bottomLeft: "0px",
            },
            orientation: "vertical",
            elementGap: "var(--wp--preset--spacing--20)",
            wrap: "nowrap",
            verticalAlign: "middle",
            backgroundColor: "",
            headerBackgroundColor: "",
            footerBackgroundColor: "",
            evenRowBackgroundColor: "",
            oddRowBackgroundColor: "",
        },
    },
};

export function getCellKey(row: number, col: number): CellKey {
    return `${row},${col}`;
}

export function parseCellKey(key: string): [number, number] {
    const [row, col] = key.split(",").map(value => parseInt(value, 10));
    return [row || 0, col || 0];
}

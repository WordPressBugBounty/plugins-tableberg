export const TABLEBERG_ROWS_CHANGED_EVENT = "tableberg:rows-changed";

type SortableType = "text" | "number" | "date";
type SortOrder = "asc" | "desc" | null;

interface TableSortState {
    table: HTMLTableElement;
    tbody: HTMLTableSectionElement;
    headerEnabled: boolean;
    footerEnabled: boolean;
    sortableColumns: Map<number, SortableType>;
    originalRows: HTMLTableRowElement[];
    currentColumn: number | null;
    currentOrder: SortOrder;
}

interface TableRows {
    headerRow: HTMLTableRowElement | null;
    footerRow: HTMLTableRowElement | null;
    dataRows: HTMLTableRowElement[];
}

function isSortableType(value: string | null): value is SortableType {
    return value === "text" || value === "number" || value === "date";
}

function getColumnIndex(cell: HTMLTableCellElement): number | null {
    const rawColumn = cell.getAttribute("data-cell-col");
    if (!rawColumn) {
        return null;
    }

    const column = Number.parseInt(rawColumn, 10);
    return Number.isNaN(column) ? null : column;
}

function getCellText(row: HTMLTableRowElement, column: number): string {
    const cell = row.querySelector<HTMLElement>(`[data-cell-col="${column}"]`);
    return (cell?.textContent || "").trim();
}

function parseSortValue(
    rawValue: string,
    sortType: SortableType
): string | number {
    if (sortType === "number") {
        const cleaned = rawValue.replace(/[^0-9.-]/g, "");
        const numberValue = Number.parseFloat(cleaned);
        return Number.isNaN(numberValue) ? 0 : numberValue;
    }

    if (sortType === "date") {
        const timestamp = Date.parse(rawValue);
        return Number.isNaN(timestamp) ? 0 : timestamp;
    }

    return rawValue.toLowerCase();
}

function compareRows(
    rowA: HTMLTableRowElement,
    rowB: HTMLTableRowElement,
    column: number,
    sortType: SortableType,
    order: Exclude<SortOrder, null>
): number {
    const valueA = parseSortValue(getCellText(rowA, column), sortType);
    const valueB = parseSortValue(getCellText(rowB, column), sortType);

    let result = 0;
    if (typeof valueA === "number" && typeof valueB === "number") {
        result = valueA - valueB;
    } else {
        result = String(valueA).localeCompare(String(valueB));
    }

    return order === "asc" ? result : -result;
}

function getTableRows(state: TableSortState): TableRows {
    const rows = Array.from(state.tbody.rows);
    const headerRow = state.headerEnabled && rows.length > 0 ? rows[0] : null;
    const footerRow =
        state.footerEnabled && rows.length > (headerRow ? 1 : 0)
            ? rows[rows.length - 1]
            : null;

    const dataStart = headerRow ? 1 : 0;
    const dataEnd = footerRow ? rows.length - 1 : rows.length;

    return {
        headerRow,
        footerRow,
        dataRows: rows.slice(dataStart, Math.max(dataStart, dataEnd)),
    };
}

function ensureSortIndicator(cell: HTMLTableCellElement): HTMLSpanElement {
    const existingIndicator = cell.querySelector<HTMLSpanElement>(
        ".tableberg-sort-indicator"
    );
    if (existingIndicator) {
        return existingIndicator;
    }

    const indicator = document.createElement("span");
    indicator.className = "tableberg-sort-indicator";
    indicator.setAttribute("aria-hidden", "true");
    indicator.textContent = "\u25B2\u25BC";
    cell.appendChild(indicator);

    return indicator;
}

function updateSortIndicators(state: TableSortState) {
    const { headerRow } = getTableRows(state);
    if (!headerRow) {
        return;
    }

    const sortableHeaders = Array.from(
        headerRow.querySelectorAll<HTMLTableCellElement>("th[data-sortable]")
    );

    for (const headerCell of sortableHeaders) {
        const column = getColumnIndex(headerCell);
        if (column === null) {
            continue;
        }

        const indicator = ensureSortIndicator(headerCell);
        const isActive =
            state.currentColumn === column && state.currentOrder !== null;

        if (!isActive) {
            indicator.textContent = "\u25B2\u25BC";
            indicator.classList.remove("tableberg-sort-indicator--active");
            headerCell.setAttribute("aria-sort", "none");
            continue;
        }

        indicator.textContent =
            state.currentOrder === "asc" ? "\u25B2" : "\u25BC";
        indicator.classList.add("tableberg-sort-indicator--active");
        headerCell.setAttribute(
            "aria-sort",
            state.currentOrder === "asc" ? "ascending" : "descending"
        );
    }
}

function renderRows(state: TableSortState, dataRows: HTMLTableRowElement[]) {
    const { headerRow, footerRow } = getTableRows(state);

    const rowsToRender: HTMLTableRowElement[] = [];
    if (headerRow) {
        rowsToRender.push(headerRow);
    }

    rowsToRender.push(...dataRows);

    if (footerRow) {
        rowsToRender.push(footerRow);
    }

    for (const row of rowsToRender) {
        state.tbody.appendChild(row);
    }

    updateSortIndicators(state);

    state.table.dispatchEvent(new CustomEvent(TABLEBERG_ROWS_CHANGED_EVENT));
}

function applySort(state: TableSortState) {
    const { currentColumn, currentOrder } = state;

    if (currentColumn === null || currentOrder === null) {
        renderRows(state, state.originalRows.slice());
        return;
    }

    const sortType = state.sortableColumns.get(currentColumn);
    if (!sortType) {
        renderRows(state, state.originalRows.slice());
        return;
    }

    const sortedRows = state.originalRows
        .slice()
        .sort((rowA, rowB) =>
            compareRows(rowA, rowB, currentColumn, sortType, currentOrder)
        );

    renderRows(state, sortedRows);
}

function toggleSort(state: TableSortState, column: number) {
    if (state.currentColumn !== column) {
        state.currentColumn = column;
        state.currentOrder = "asc";
        applySort(state);
        return;
    }

    if (state.currentOrder === "asc") {
        state.currentOrder = "desc";
        applySort(state);
        return;
    }

    state.currentColumn = null;
    state.currentOrder = null;
    applySort(state);
}

function setupSortableTable(table: HTMLTableElement) {
    if (table.dataset.tablebergSortingInitialized === "true") {
        return;
    }

    const tbody = table.tBodies.item(0);
    if (!tbody) {
        return;
    }

    const headerEnabled = table.dataset.tablebergHeader === "true";
    if (!headerEnabled || tbody.rows.length === 0) {
        return;
    }

    const headerRow = tbody.rows[0];
    const sortableHeaders = Array.from(
        headerRow.querySelectorAll<HTMLTableCellElement>("th[data-sortable]")
    );

    if (sortableHeaders.length === 0) {
        return;
    }

    const state: TableSortState = {
        table,
        tbody,
        headerEnabled,
        footerEnabled: table.dataset.tablebergFooter === "true",
        sortableColumns: new Map<number, SortableType>(),
        originalRows: [],
        currentColumn: null,
        currentOrder: null,
    };

    for (const headerCell of sortableHeaders) {
        const sortTypeAttr = headerCell.getAttribute("data-sortable");
        if (!isSortableType(sortTypeAttr)) {
            continue;
        }

        const column = getColumnIndex(headerCell);
        if (column === null) {
            continue;
        }

        state.sortableColumns.set(column, sortTypeAttr);

        headerCell.setAttribute("role", "button");
        headerCell.setAttribute("tabindex", "0");
        headerCell.setAttribute("aria-sort", "none");

        const handleToggleSort = () => {
            toggleSort(state, column);
        };

        headerCell.addEventListener("click", handleToggleSort);
        headerCell.addEventListener("keydown", event => {
            if (
                event.key !== "Enter" &&
                event.key !== " " &&
                event.key !== "Spacebar"
            ) {
                return;
            }

            event.preventDefault();
            handleToggleSort();
        });
    }

    const { dataRows } = getTableRows(state);
    state.originalRows = dataRows.slice();
    updateSortIndicators(state);
    table.dataset.tablebergSortingInitialized = "true";
}

export function initializeSorting() {
    const tables = Array.from(
        document.querySelectorAll<HTMLTableElement>(
            ".wp-block-tableberg[data-tableberg-sortable='true']"
        )
    );

    for (const table of tables) {
        setupSortableTable(table);
    }
}

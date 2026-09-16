import { TABLEBERG_ROWS_CHANGED_EVENT } from "./sorting";
import { TABLEBERG_SEARCH_CHANGED_EVENT } from "./search";

interface PaginationConfig {
    enabled: boolean;
    pageSize: number;
    showPageNumbers: boolean;
    showPrevNext: boolean;
}

interface PaginationState {
    table: HTMLTableElement;
    tbody: HTMLTableSectionElement;
    headerEnabled: boolean;
    footerEnabled: boolean;
    config: PaginationConfig;
    currentPage: number;
    controlsEl: HTMLDivElement;
}

interface TableRows {
    headerRow: HTMLTableRowElement | null;
    footerRow: HTMLTableRowElement | null;
    dataRows: HTMLTableRowElement[];
}

type PageItem = number | "ellipsis";

function getTableRows(state: PaginationState): TableRows {
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

function getTotalPages(dataRowCount: number, pageSize: number): number {
    if (dataRowCount <= 0 || pageSize <= 0) {
        return 1;
    }

    return Math.ceil(dataRowCount / pageSize);
}

function clampPage(page: number, totalPages: number): number {
    if (totalPages <= 1) {
        return 0;
    }

    if (page < 0) {
        return 0;
    }

    if (page > totalPages - 1) {
        return totalPages - 1;
    }

    return page;
}

function getPageItems(currentPage: number, totalPages: number): PageItem[] {
    const pages: PageItem[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
        for (let page = 0; page < totalPages; page++) {
            pages.push(page);
        }
        return pages;
    }

    pages.push(0);

    if (currentPage > 2) {
        pages.push("ellipsis");
    }

    const start = Math.max(1, currentPage - 1);
    const end = Math.min(totalPages - 2, currentPage + 1);

    for (let page = start; page <= end; page++) {
        if (!pages.includes(page)) {
            pages.push(page);
        }
    }

    if (currentPage < totalPages - 3) {
        pages.push("ellipsis");
    }

    if (!pages.includes(totalPages - 1)) {
        pages.push(totalPages - 1);
    }

    return pages;
}

function setDataRowsVisibility(
    dataRows: HTMLTableRowElement[],
    matchingRows: HTMLTableRowElement[],
    pageSize: number,
    currentPage: number
) {
    const matchingRowSet = new Set(matchingRows);
    const start = currentPage * pageSize;
    const end = start + pageSize;

    let matchingIndex = 0;

    dataRows.forEach(row => {
        if (!matchingRowSet.has(row)) {
            row.hidden = true;
            return;
        }

        row.hidden = matchingIndex < start || matchingIndex >= end;
        matchingIndex++;
    });
}

function getSearchMatchedRows(
    dataRows: HTMLTableRowElement[]
): HTMLTableRowElement[] {
    return dataRows.filter(row => row.dataset.tablebergSearchMatch !== "false");
}

function createButton(
    label: string,
    className: string,
    onClick: () => void,
    options?: {
        disabled?: boolean;
        ariaLabel?: string;
    }
): HTMLButtonElement {
    const button = document.createElement("button");
    button.type = "button";
    button.className = className;

    if (options?.disabled) {
        button.disabled = true;
    }

    if (options?.ariaLabel) {
        button.setAttribute("aria-label", options.ariaLabel);
    }

    button.textContent = label;
    button.addEventListener("click", onClick);

    return button;
}

function renderControls(state: PaginationState, totalPages: number) {
    const { controlsEl, config, currentPage } = state;
    const { showPageNumbers, showPrevNext } = config;

    controlsEl.replaceChildren();

    if (totalPages <= 1 || (!showPageNumbers && !showPrevNext)) {
        controlsEl.hidden = true;
        return;
    }

    controlsEl.hidden = false;

    const canGoPrev = currentPage > 0;
    const canGoNext = currentPage < totalPages - 1;
    const buttonClass = "tableberg-pagination__button";

    if (showPrevNext) {
        controlsEl.appendChild(
            createButton(
                "\u2039",
                `${buttonClass} ${buttonClass}--arrow`,
                () => {
                    goToPage(state, currentPage - 1);
                },
                {
                    disabled: !canGoPrev,
                    ariaLabel: "Previous page",
                }
            )
        );
    }

    if (showPageNumbers) {
        const pageItems = getPageItems(currentPage, totalPages);

        pageItems.forEach(item => {
            if (item === "ellipsis") {
                const ellipsis = document.createElement("span");
                ellipsis.className = "tableberg-pagination__ellipsis";
                ellipsis.textContent = "...";
                ellipsis.setAttribute("aria-hidden", "true");
                controlsEl.appendChild(ellipsis);
                return;
            }

            const isActive = currentPage === item;
            controlsEl.appendChild(
                createButton(
                    String(item + 1),
                    isActive
                        ? `${buttonClass} ${buttonClass}--active`
                        : buttonClass,
                    () => {
                        goToPage(state, item);
                    }
                )
            );
        });
    }

    if (showPrevNext) {
        controlsEl.appendChild(
            createButton(
                "\u203A",
                `${buttonClass} ${buttonClass}--arrow`,
                () => {
                    goToPage(state, currentPage + 1);
                },
                {
                    disabled: !canGoNext,
                    ariaLabel: "Next page",
                }
            )
        );
    }
}

function renderPagination(state: PaginationState) {
    const { headerRow, footerRow, dataRows } = getTableRows(state);
    const matchingRows = getSearchMatchedRows(dataRows);
    const totalPages = getTotalPages(
        matchingRows.length,
        state.config.pageSize
    );

    state.currentPage = clampPage(state.currentPage, totalPages);

    if (headerRow) {
        headerRow.hidden = false;
    }

    if (footerRow) {
        footerRow.hidden = false;
    }

    setDataRowsVisibility(
        dataRows,
        matchingRows,
        state.config.pageSize,
        state.currentPage
    );
    renderControls(state, totalPages);
}

function goToPage(state: PaginationState, page: number) {
    const { dataRows } = getTableRows(state);
    const matchingRows = getSearchMatchedRows(dataRows);
    const totalPages = getTotalPages(
        matchingRows.length,
        state.config.pageSize
    );
    const nextPage = clampPage(page, totalPages);

    if (nextPage === state.currentPage) {
        return;
    }

    state.currentPage = nextPage;
    renderPagination(state);
}

function parsePaginationConfig(
    table: HTMLTableElement
): PaginationConfig | null {
    const rawConfig = table.dataset.tablebergPagination;
    if (!rawConfig) {
        return null;
    }

    let parsedConfig: unknown;

    try {
        parsedConfig = JSON.parse(rawConfig);
    } catch {
        return null;
    }

    if (!parsedConfig || typeof parsedConfig !== "object") {
        return null;
    }

    const config = parsedConfig as Partial<PaginationConfig>;

    const pageSizeValue = Number(config.pageSize);
    const pageSize =
        Number.isFinite(pageSizeValue) && pageSizeValue > 0
            ? Math.floor(pageSizeValue)
            : 10;

    return {
        enabled: config.enabled === true,
        pageSize,
        showPageNumbers: config.showPageNumbers !== false,
        showPrevNext: config.showPrevNext !== false,
    };
}

function hasRowSpanningCells(tbody: HTMLTableSectionElement): boolean {
    return Array.from(tbody.rows).some(row =>
        Array.from(row.cells).some(cell => cell.rowSpan > 1)
    );
}

function setupPagination(table: HTMLTableElement) {
    if (table.dataset.tablebergPaginationInitialized === "true") {
        return;
    }

    const config = parsePaginationConfig(table);
    if (!config || !config.enabled) {
        return;
    }

    const tbody = table.tBodies.item(0);
    if (!tbody || hasRowSpanningCells(tbody)) {
        return;
    }

    const controlsEl = document.createElement("div");
    controlsEl.className = "tableberg-pagination";
    table.insertAdjacentElement("afterend", controlsEl);

    const state: PaginationState = {
        table,
        tbody,
        headerEnabled: table.dataset.tablebergHeader === "true",
        footerEnabled: table.dataset.tablebergFooter === "true",
        config,
        currentPage: 0,
        controlsEl,
    };

    table.addEventListener(TABLEBERG_ROWS_CHANGED_EVENT, () => {
        renderPagination(state);
    });

    table.addEventListener(TABLEBERG_SEARCH_CHANGED_EVENT, () => {
        state.currentPage = 0;
        renderPagination(state);
    });

    renderPagination(state);
    table.dataset.tablebergPaginationInitialized = "true";
}

export function initializePagination() {
    const tables = Array.from(
        document.querySelectorAll<HTMLTableElement>(
            ".wp-block-tableberg[data-tableberg-pagination]"
        )
    );

    tables.forEach(setupPagination);
}

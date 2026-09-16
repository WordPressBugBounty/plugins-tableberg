export const TABLEBERG_SEARCH_CHANGED_EVENT = "tableberg:search-changed";

type SearchPosition = "left" | "right";

interface SearchConfig {
    enabled: boolean;
    placeholder: string;
    position: SearchPosition;
    highlightColor: string;
}

interface SearchState {
    table: HTMLTableElement;
    tbody: HTMLTableSectionElement;
    headerEnabled: boolean;
    footerEnabled: boolean;
    config: SearchConfig;
    inputEl: HTMLInputElement;
    clearButtonEl: HTMLButtonElement;
    resultsEl: HTMLSpanElement;
}

interface TableRows {
    dataRows: HTMLTableRowElement[];
}

const SEARCH_HIDDEN_CLASS = "tableberg-search-row--hidden";
const SEARCH_HIGHLIGHT_CLASS = "tableberg-search-highlight";
const TEXT_ELEMENT_SELECTOR = ".tableberg-text-element";

function getTextElementsInRow(row: HTMLTableRowElement): HTMLElement[] {
    return Array.from(row.querySelectorAll<HTMLElement>(TEXT_ELEMENT_SELECTOR));
}

function parseSearchConfig(table: HTMLTableElement): SearchConfig {
    const enabled = table.dataset.tablebergSearchEnabled === "true";
    const position =
        table.dataset.tablebergSearchPosition === "right" ? "right" : "left";

    return {
        enabled,
        placeholder: table.dataset.tablebergSearchPlaceholder || "Search...",
        position,
        highlightColor: table.dataset.tablebergSearchHighlightColor || "",
    };
}

function getTableRows(state: SearchState): TableRows {
    const rows = Array.from(state.tbody.rows);
    const headerOffset = state.headerEnabled ? 1 : 0;
    const footerOffset = state.footerEnabled ? 1 : 0;
    const dataEnd = rows.length - footerOffset;

    return {
        dataRows: rows.slice(headerOffset, Math.max(headerOffset, dataEnd)),
    };
}

function normalizeSearchTerm(value: string): string {
    return value.toLowerCase().trim();
}

function rowMatchesSearch(
    row: HTMLTableRowElement,
    normalizedSearchTerm: string
): boolean {
    if (!normalizedSearchTerm) {
        return true;
    }

    const textElements = getTextElementsInRow(row);
    if (textElements.length === 0) {
        return false;
    }

    return textElements.some(element =>
        (element.textContent || "").toLowerCase().includes(normalizedSearchTerm)
    );
}

function clearRowHighlights(row: HTMLTableRowElement) {
    const highlights = row.querySelectorAll<HTMLElement>(
        `mark.${SEARCH_HIGHLIGHT_CLASS}`
    );

    highlights.forEach(highlight => {
        const textNode = document.createTextNode(highlight.textContent || "");
        highlight.replaceWith(textNode);
    });

    row.normalize();
}

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlightTextInElement(element: HTMLElement, escapedTerm: string) {
    const textNodes: Text[] = [];

    const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
        acceptNode(node) {
            if (!node.nodeValue || !node.nodeValue.trim()) {
                return NodeFilter.FILTER_REJECT;
            }

            if (!node.parentElement) {
                return NodeFilter.FILTER_REJECT;
            }

            if (node.parentElement.closest(`mark.${SEARCH_HIGHLIGHT_CLASS}`)) {
                return NodeFilter.FILTER_REJECT;
            }

            return NodeFilter.FILTER_ACCEPT;
        },
    });

    let currentNode: Node | null = walker.nextNode();
    while (currentNode) {
        textNodes.push(currentNode as Text);
        currentNode = walker.nextNode();
    }

    textNodes.forEach(node => {
        const text = node.nodeValue || "";
        const regex = new RegExp(`(${escapedTerm})`, "gi");
        const parts = text.split(regex);

        if (parts.length <= 1) {
            return;
        }

        const fragment = document.createDocumentFragment();

        parts.forEach((part, index) => {
            if (!part) {
                return;
            }

            if (index % 2 === 1) {
                const mark = document.createElement("mark");
                mark.className = SEARCH_HIGHLIGHT_CLASS;
                mark.textContent = part;
                fragment.appendChild(mark);
                return;
            }

            fragment.appendChild(document.createTextNode(part));
        });

        node.replaceWith(fragment);
    });
}

function highlightTextInRow(row: HTMLTableRowElement, term: string) {
    if (!term) {
        return;
    }

    const textElements = getTextElementsInRow(row);
    if (textElements.length === 0) {
        return;
    }

    const escapedTerm = escapeRegExp(term);
    textElements.forEach(element => {
        highlightTextInElement(element, escapedTerm);
    });
}

function getResultsLabel(matchCount: number): string {
    if (matchCount <= 0) {
        return "No results found";
    }

    return matchCount === 1 ? "1 result" : `${matchCount} results`;
}

function updateResultDisplay(
    state: SearchState,
    normalizedSearchTerm: string,
    matchCount: number
) {
    if (!normalizedSearchTerm) {
        state.resultsEl.hidden = true;
        state.resultsEl.textContent = "";
        return;
    }

    state.resultsEl.hidden = false;
    state.resultsEl.textContent = getResultsLabel(matchCount);
}

function applySearch(state: SearchState) {
    const rawSearchTerm = state.inputEl.value.trim();
    const normalizedSearchTerm = normalizeSearchTerm(rawSearchTerm);
    const { dataRows } = getTableRows(state);

    let matchCount = 0;

    for (const row of dataRows) {
        clearRowHighlights(row);

        const matches = rowMatchesSearch(row, normalizedSearchTerm);

        row.dataset.tablebergSearchMatch = matches ? "true" : "false";
        row.classList.toggle(SEARCH_HIDDEN_CLASS, !matches);

        if (matches) {
            matchCount++;

            if (normalizedSearchTerm) {
                highlightTextInRow(row, rawSearchTerm);
            }
        }
    }

    state.clearButtonEl.hidden = normalizedSearchTerm.length === 0;
    updateResultDisplay(state, normalizedSearchTerm, matchCount);

    state.table.dispatchEvent(
        new CustomEvent(TABLEBERG_SEARCH_CHANGED_EVENT, {
            detail: {
                searchTerm: normalizedSearchTerm,
                matchCount,
            },
        })
    );
}

function createSearchContainer(state: SearchState): HTMLDivElement {
    const container = document.createElement("div");
    container.className = "tableberg-search";
    container.style.justifyContent =
        state.config.position === "right" ? "flex-end" : "flex-start";

    const inputWrapper = document.createElement("div");
    inputWrapper.className = "tableberg-search__input-wrapper";

    const icon = document.createElement("span");
    icon.className = "tableberg-search__icon";
    icon.setAttribute("aria-hidden", "true");
    icon.innerHTML =
        "<svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='11' cy='11' r='8'></circle><path d='M21 21l-4.35-4.35'></path></svg>";

    state.inputEl.className = "tableberg-search__input";
    state.inputEl.type = "text";
    state.inputEl.placeholder = state.config.placeholder;

    state.clearButtonEl.className = "tableberg-search__clear";
    state.clearButtonEl.type = "button";
    state.clearButtonEl.setAttribute("aria-label", "Clear search");
    state.clearButtonEl.hidden = true;
    state.clearButtonEl.innerHTML =
        "<svg width='16' height='16' viewBox='0 0 24 24' fill='currentColor'><path d='M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z'></path></svg>";

    state.resultsEl.className = "tableberg-search__results";
    state.resultsEl.hidden = true;

    inputWrapper.appendChild(icon);
    inputWrapper.appendChild(state.inputEl);
    inputWrapper.appendChild(state.clearButtonEl);

    container.appendChild(inputWrapper);
    container.appendChild(state.resultsEl);

    return container;
}

function setupSearch(table: HTMLTableElement) {
    if (table.dataset.tablebergSearchInitialized === "true") {
        return;
    }

    const config = parseSearchConfig(table);
    if (!config.enabled) {
        return;
    }

    const tbody = table.tBodies.item(0);
    if (!tbody) {
        return;
    }

    const state: SearchState = {
        table,
        tbody,
        headerEnabled: table.dataset.tablebergHeader === "true",
        footerEnabled: table.dataset.tablebergFooter === "true",
        config,
        inputEl: document.createElement("input"),
        clearButtonEl: document.createElement("button"),
        resultsEl: document.createElement("span"),
    };

    if (state.config.highlightColor) {
        table.style.setProperty(
            "--tableberg-search-highlight-color",
            state.config.highlightColor
        );
    }

    const searchContainer = createSearchContainer(state);
    table.insertAdjacentElement("beforebegin", searchContainer);

    state.inputEl.addEventListener("input", () => {
        applySearch(state);
    });

    state.clearButtonEl.addEventListener("click", () => {
        state.inputEl.value = "";
        applySearch(state);
        state.inputEl.focus();
    });

    applySearch(state);
    table.dataset.tablebergSearchInitialized = "true";
}

export function initializeSearch() {
    const tables = Array.from(
        document.querySelectorAll<HTMLTableElement>(
            ".wp-block-tableberg[data-tableberg-search-enabled='true']"
        )
    );

    for (const table of tables) {
        setupSearch(table);
    }
}

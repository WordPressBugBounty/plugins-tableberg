export const TABLEBERG_RESPONSIVE_CHANGED_EVENT =
    "tableberg:responsive-changed";

type ResponsiveMode = "" | "scroll" | "stack";

type RowType = "header" | "footer" | "even-row" | "odd-row";

interface ResponsiveBreakpoint {
    enabled: boolean;
    maxWidth: number;
    mode: ResponsiveMode;
    transpose: boolean;
    stackCount: number;
    repeatFirstCol: boolean;
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
    const parsed = Number.parseInt(value || "", 10);

    if (Number.isNaN(parsed) || parsed < 1) {
        return fallback;
    }

    return parsed;
}

function parseBoolean(value: string | undefined): boolean {
    return value === "true" || value === "1";
}

function parseNonNegativeInt(
    value: string | undefined,
    fallback: number
): number {
    const parsed = Number.parseInt(value || "", 10);

    if (Number.isNaN(parsed) || parsed < 0) {
        return fallback;
    }

    return parsed;
}

function getCellRow(cell: HTMLTableCellElement): number {
    return parseNonNegativeInt(
        cell.getAttribute("data-cell-row") || undefined,
        0
    );
}

function getCellCol(cell: HTMLTableCellElement): number {
    return parseNonNegativeInt(
        cell.getAttribute("data-cell-col") || undefined,
        0
    );
}

function getTableRowCount(table: HTMLTableElement): number {
    return parsePositiveInt(
        table.dataset.tablebergRows,
        table.tBodies[0]?.rows.length || 1
    );
}

function getTableColCount(table: HTMLTableElement): number {
    return parsePositiveInt(table.dataset.tablebergCols, 1);
}

function getTableWrapper(table: HTMLTableElement): HTMLElement | null {
    return table.closest<HTMLElement>(".tableberg-table-wrapper");
}

function setTableClassName(table: HTMLTableElement, className?: string) {
    ["tableberg-rowstack-table", "tableberg-colstack-table"].forEach(value =>
        table.classList.remove(value)
    );

    if (className) {
        table.classList.add(className);
    }
}

function markRowCell(cell: HTMLTableCellElement, rowType: RowType) {
    [
        "tableberg-even-row-cell",
        "tableberg-header-cell",
        "tableberg-footer-cell",
        "tableberg-odd-row-cell",
    ].forEach(className => cell.classList.remove(className));

    cell.classList.add(`tableberg-${rowType}-cell`);
}

function markRow(row: HTMLTableRowElement, rowType: RowType) {
    [
        "tableberg-even-row",
        "tableberg-header",
        "tableberg-footer",
        "tableberg-odd-row",
    ].forEach(className => row.classList.remove(className));

    row.classList.add(`tableberg-${rowType}`);
}

function getRowType(
    row: number,
    rows: number,
    hasHeader: boolean,
    hasFooter: boolean
): RowType {
    if (hasHeader && row === 0) {
        return "header";
    }

    if (hasFooter && row === rows - 1) {
        return "footer";
    }

    let adjustedRow = row;
    if (hasHeader && row > 0) {
        adjustedRow += 1;
    }

    return adjustedRow % 2 ? "even-row" : "odd-row";
}

function getResponsiveBreakpoint(
    table: HTMLTableElement,
    device: "mobile" | "tablet"
): ResponsiveBreakpoint {
    const prefix = device === "mobile" ? "tablebergMobile" : "tablebergTablet";

    const enabled = parseBoolean(table.dataset[`${prefix}Enabled`]);
    const maxWidth = parsePositiveInt(
        table.dataset[`${prefix}Width`],
        device === "mobile" ? 700 : 1024
    );
    const modeValue = table.dataset[`${prefix}Mode`] || "";
    const mode: ResponsiveMode =
        modeValue === "scroll" || modeValue === "stack" ? modeValue : "";
    const transpose =
        parseBoolean(table.dataset[`${prefix}Transpose`]) ||
        table.dataset[`${prefix}Direction`] === "row";

    const repeatFirstCol =
        parseBoolean(table.dataset[`${prefix}RepeatFirstCol`]) ||
        parseBoolean(table.dataset[`${prefix}Header`]);

    return {
        enabled,
        maxWidth,
        mode,
        transpose,
        stackCount: parsePositiveInt(table.dataset[`${prefix}Count`], 1),
        repeatFirstCol,
    };
}

function reviveTable(table: HTMLTableElement) {
    const oldMode = table.dataset.tablebergLast;
    if (!oldMode) {
        return;
    }

    delete table.dataset.tablebergLast;

    const wrapper = getTableWrapper(table);
    wrapper?.classList.remove("tableberg-scroll-x");

    table
        .querySelectorAll("[data-tableberg-tmp='1']")
        .forEach(element => element.remove());

    if (!oldMode.includes("stack")) {
        setTableClassName(table);
        return;
    }

    setTableClassName(table);

    const colGroup = table.querySelector("colgroup");
    if (colGroup) {
        colGroup.removeAttribute("style");
    }

    const cells = Array.from(
        table.querySelectorAll<HTMLTableCellElement>("th, td")
    );
    cells.sort((a, b) => {
        const rowDiff = getCellRow(a) - getCellRow(b);
        if (rowDiff !== 0) {
            return rowDiff;
        }

        return getCellCol(a) - getCellCol(b);
    });

    const tbody = table.tBodies.item(0);
    if (!tbody) {
        return;
    }

    tbody.innerHTML = "";

    const rowCount = getTableRowCount(table);
    const hasHeader = parseBoolean(table.dataset.tablebergHeader);
    const hasFooter = parseBoolean(table.dataset.tablebergFooter);

    let lastRow = -1;
    let lastRowElement: HTMLTableRowElement | null = null;

    for (const cell of cells) {
        const cellRow = getCellRow(cell);

        if (lastRow !== cellRow) {
            lastRow = cellRow;
            lastRowElement = document.createElement("tr");
            markRow(
                lastRowElement,
                getRowType(cellRow, rowCount, hasHeader, hasFooter)
            );
            tbody.appendChild(lastRowElement);
        }

        lastRowElement?.appendChild(cell);
    }
}

function toScrollTable(table: HTMLTableElement) {
    if (table.dataset.tablebergLast === "scroll") {
        return;
    }

    if (table.dataset.tablebergLast) {
        reviveTable(table);
    }

    table.dataset.tablebergLast = "scroll";
    getTableWrapper(table)?.classList.add("tableberg-scroll-x");
}

function toRowStack(
    table: HTMLTableElement,
    repeatFirstCol: boolean,
    stackCount: number,
    tag: string
) {
    if (table.dataset.tablebergLast === tag) {
        return;
    }

    reviveTable(table);
    setTableClassName(table, "tableberg-rowstack-table");
    table.dataset.tablebergLast = tag;

    const colGroup = table.querySelector("colgroup");
    if (colGroup) {
        colGroup.style.display = "none";
    }

    const tbody = table.tBodies.item(0);
    if (!tbody) {
        return;
    }

    const cells = Array.from(
        table.querySelectorAll<HTMLTableCellElement>("th, td")
    );
    tbody.innerHTML = "";

    const hasHeader = parseBoolean(table.dataset.tablebergHeader);
    const hasFooter = parseBoolean(table.dataset.tablebergFooter);
    const rowCount = getTableRowCount(table);
    const columnCount = getTableColCount(table);

    const headerCells: HTMLTableCellElement[] = [];
    const maxColumnsPerStack = repeatFirstCol
        ? Math.max(2, stackCount)
        : Math.max(1, stackCount);

    if (repeatFirstCol) {
        for (const cell of cells) {
            if (getCellRow(cell) > 0) {
                break;
            }

            headerCells.push(cell);
        }
    }

    const subRowMap = new Map<
        number,
        {
            count: number;
            rowElement: HTMLTableRowElement;
        }
    >();

    for (const cell of cells) {
        const cellRow = getCellRow(cell);
        const cellCol = getCellCol(cell);
        const rowType = getRowType(cellRow, rowCount, hasHeader, hasFooter);
        markRowCell(cell, rowType);

        const mappedRow = subRowMap.get(cellCol);
        if (!mappedRow) {
            const rowElement = document.createElement("tr");
            subRowMap.set(cellCol, {
                count: 1,
                rowElement,
            });

            rowElement.appendChild(cell);
            tbody.appendChild(rowElement);
            continue;
        }

        if (mappedRow.count >= maxColumnsPerStack) {
            const rowElement = document.createElement("tr");
            let nextCount = 1;

            if (repeatFirstCol && headerCells[cellCol]) {
                const clonedHeader = headerCells[cellCol].cloneNode(
                    true
                ) as HTMLTableCellElement;
                clonedHeader.setAttribute("data-tableberg-tmp", "1");
                rowElement.appendChild(clonedHeader);
                nextCount += 1;
            }

            rowElement.appendChild(cell);
            tbody.appendChild(rowElement);

            subRowMap.set(cellCol, {
                count: nextCount,
                rowElement,
            });

            continue;
        }

        mappedRow.count += 1;
        mappedRow.rowElement.appendChild(cell);
    }

    if (columnCount > 0) {
        table.dataset.tablebergResponsiveColumns = String(columnCount);
    }
}

function toColStack(
    table: HTMLTableElement,
    repeatFirstCol: boolean,
    stackCount: number,
    tag: string
) {
    const previousMode = table.dataset.tablebergLast;
    if (previousMode === tag) {
        return;
    }

    reviveTable(table);
    table.dataset.tablebergLast = tag;

    setTableClassName(table, "tableberg-colstack-table");

    let cells = Array.from(
        table.querySelectorAll<HTMLTableCellElement>("th, td")
    );

    if (previousMode && previousMode.includes("stack-row")) {
        cells.sort((a, b) => {
            const rowDiff = getCellRow(a) - getCellRow(b);
            if (rowDiff !== 0) {
                return rowDiff;
            }

            return getCellCol(a) - getCellCol(b);
        });
    }

    const tbody = table.tBodies.item(0);
    if (!tbody) {
        return;
    }

    tbody.innerHTML = "";

    const totalRows = getTableRowCount(table);
    const totalCols = getTableColCount(table);
    const maxCellsPerStackRow = repeatFirstCol
        ? Math.max(2, stackCount)
        : Math.max(1, stackCount);
    const perStackDataCount = repeatFirstCol
        ? Math.max(1, maxCellsPerStackRow - 1)
        : maxCellsPerStackRow;
    const hasHeader = parseBoolean(table.dataset.tablebergHeader);
    const hasFooter = parseBoolean(table.dataset.tablebergFooter);

    const colsToStack = repeatFirstCol ? totalCols - 1 : totalCols;
    if (colsToStack < 1) {
        return;
    }

    const rowsToGenerate =
        totalRows * Math.ceil(colsToStack / perStackDataCount);
    const rowMarkups = Array.from({ length: rowsToGenerate }, () => "");

    const markCell = (cell: HTMLTableCellElement) => {
        markRowCell(
            cell,
            getRowType(getCellRow(cell), totalRows, hasHeader, hasFooter)
        );
    };

    if (repeatFirstCol) {
        const leftColumnCells = cells.filter(cell => getCellCol(cell) === 0);
        const nonLeftCells = cells.filter(cell => getCellCol(cell) !== 0);
        const leftCellsWithRowspanGaps: Array<HTMLTableCellElement | "gap"> =
            [];

        leftColumnCells.forEach(cell => {
            leftCellsWithRowspanGaps.push(cell);

            const rowSpanValue = parsePositiveInt(
                cell.getAttribute("rowspan") || undefined,
                1
            );
            for (let offset = 1; offset < rowSpanValue; offset++) {
                leftCellsWithRowspanGaps.push("gap");
            }
        });

        cells = nonLeftCells;

        for (let row = 0; row < rowsToGenerate; row++) {
            const cell = leftCellsWithRowspanGaps[row % totalRows];
            if (!cell || cell === "gap") {
                continue;
            }

            if (row > totalRows - 1) {
                cell.setAttribute("data-tableberg-tmp", "1");
            }

            markCell(cell);
            rowMarkups[row] += cell.outerHTML;
        }
    }

    cells.forEach(cell => {
        const colIndex = repeatFirstCol
            ? getCellCol(cell) - 1
            : getCellCol(cell);
        const rowIndex = getCellRow(cell);

        const targetRow =
            totalRows * (Math.ceil((colIndex + 1) / perStackDataCount) - 1) +
            rowIndex;

        markCell(cell);

        if (targetRow >= 0 && targetRow < rowMarkups.length) {
            rowMarkups[targetRow] += cell.outerHTML;
        }
    });

    let tableMarkup = "";

    for (let rowIndex = 0; rowIndex < rowsToGenerate; rowIndex++) {
        const isHeaderRow = rowIndex % totalRows === 0;
        const isFooterRow = rowIndex % totalRows === totalRows - 1;

        let rowType: RowType;
        if (hasHeader && isHeaderRow) {
            rowType = "header";
        } else if (hasFooter && isFooterRow) {
            rowType = "footer";
        } else {
            rowType = rowIndex % 2 === 0 ? "even-row" : "odd-row";
        }

        tableMarkup += `<tr class="tableberg-${rowType}">${rowMarkups[rowIndex]}</tr>`;
    }

    const colGroup = table.querySelector("colgroup");
    if (colGroup) {
        colGroup.style.display = "none";
    }

    tbody.innerHTML = tableMarkup;
}

function getCurrentBreakpoint(
    table: HTMLTableElement
): ResponsiveBreakpoint | null {
    const mobile = getResponsiveBreakpoint(table, "mobile");
    const tablet = getResponsiveBreakpoint(table, "tablet");
    const viewportWidth = window.innerWidth;

    if (mobile.enabled && viewportWidth <= mobile.maxWidth) {
        return mobile;
    }

    if (tablet.enabled && viewportWidth <= tablet.maxWidth) {
        return tablet;
    }

    return null;
}

function resizeTable(table: HTMLTableElement) {
    const breakpoint = getCurrentBreakpoint(table);

    if (!breakpoint || breakpoint.mode === "") {
        reviveTable(table);
        return;
    }

    if (breakpoint.mode === "scroll") {
        toScrollTable(table);
        table.dispatchEvent(
            new CustomEvent(TABLEBERG_RESPONSIVE_CHANGED_EVENT)
        );
        return;
    }

    const renderTag = `stack-${breakpoint.transpose ? "transpose" : "normal"}-${breakpoint.stackCount}-${breakpoint.repeatFirstCol ? "repeat-first-col" : "none"}`;

    if (breakpoint.transpose) {
        toRowStack(
            table,
            breakpoint.repeatFirstCol,
            breakpoint.stackCount,
            renderTag
        );
    } else {
        toColStack(
            table,
            breakpoint.repeatFirstCol,
            breakpoint.stackCount,
            renderTag
        );
    }

    table.dispatchEvent(new CustomEvent(TABLEBERG_RESPONSIVE_CHANGED_EVENT));
}

export function initializeResponsive() {
    const tables = Array.from(
        document.querySelectorAll<HTMLTableElement>(
            ".wp-block-tableberg[data-tableberg-responsive='true']"
        )
    );

    if (tables.length === 0) {
        return;
    }

    const runResize = () => {
        tables.forEach(table => {
            resizeTable(table);
        });
    };

    runResize();

    let resizeTimeout: number | undefined;
    window.addEventListener("resize", () => {
        if (resizeTimeout) {
            window.clearTimeout(resizeTimeout);
        }

        resizeTimeout = window.setTimeout(() => {
            runResize();
        }, 120);
    });
}

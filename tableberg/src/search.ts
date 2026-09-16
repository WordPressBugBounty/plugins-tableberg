import { Cell, CellElement, CellKey, TableConfig } from "./attributes";
import { getCellKey } from "./attributes";
import { getElementTextContent } from "./elements";

function getCellElements(
    cells: Record<CellKey, Cell>,
    row: number,
    col: number
): CellElement[] {
    return cells[getCellKey(row, col)]?.elements || [];
}

function rowMatchesSearch(
    row: number,
    cols: number,
    cells: Record<CellKey, Cell>,
    searchTerm: string
): boolean {
    const normalizedSearch = searchTerm.toLowerCase().trim();
    if (!normalizedSearch) return true;

    for (let col = 0; col < cols; col++) {
        const cellText = getCellElements(cells, row, col)
            .map(element => getElementTextContent(element))
            .join(" ")
            .toLowerCase();

        if (cellText.includes(normalizedSearch)) {
            return true;
        }
    }

    return false;
}

export function filterRowsBySearch(
    cells: Record<CellKey, Cell>,
    totalRows: number,
    totalCols: number,
    table: TableConfig,
    searchTerm: string
): number[] {
    const { headerEnabled, footerEnabled } = table;

    const normalizedSearch = searchTerm.toLowerCase().trim();

    if (!normalizedSearch) {
        return Array.from({ length: totalRows }, (_, i) => i);
    }

    const headerRow = headerEnabled ? 0 : -1;
    const footerRow = footerEnabled ? totalRows - 1 : -1;

    const result: number[] = [];

    if (headerEnabled) {
        result.push(0);
    }

    for (let row = 0; row < totalRows; row++) {
        if (row === headerRow || row === footerRow) {
            continue;
        }

        if (rowMatchesSearch(row, totalCols, cells, normalizedSearch)) {
            result.push(row);
        }
    }

    if (footerEnabled) {
        result.push(totalRows - 1);
    }

    return result;
}

export function getMatchingRowCount(
    cells: Record<CellKey, Cell>,
    totalRows: number,
    totalCols: number,
    table: TableConfig,
    searchTerm: string
): number {
    const filteredRows = filterRowsBySearch(
        cells,
        totalRows,
        totalCols,
        table,
        searchTerm
    );
    let count = filteredRows.length;

    if (table.headerEnabled) count--;
    if (table.footerEnabled) count--;

    return Math.max(0, count);
}

export interface HighlightSegment {
    text: string;
    highlighted: boolean;
}

export function getHighlightSegments(
    content: string,
    searchTerm: string
): HighlightSegment[] {
    const plainText = content.replace(/<[^>]*>/g, "");
    const trimmedSearch = searchTerm.trim();

    if (!trimmedSearch || !plainText) {
        return [{ text: plainText, highlighted: false }];
    }

    const escapedTerm = trimmedSearch.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedTerm})`, "gi");

    const segments: HighlightSegment[] = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(plainText)) !== null) {
        if (match.index > lastIndex) {
            segments.push({
                text: plainText.slice(lastIndex, match.index),
                highlighted: false,
            });
        }

        segments.push({
            text: match[1],
            highlighted: true,
        });

        lastIndex = regex.lastIndex;
    }

    if (lastIndex < plainText.length) {
        segments.push({
            text: plainText.slice(lastIndex),
            highlighted: false,
        });
    }

    return segments.length > 0
        ? segments
        : [{ text: plainText, highlighted: false }];
}

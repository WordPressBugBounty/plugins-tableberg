import { Cell, CellKey } from "./attributes";

export function tableHasRowSpanningCells(
    cells: Record<CellKey, Cell>
): boolean {
    return Object.values(cells).some(cell => (cell.span?.rowSpan || 1) > 1);
}

export function getTotalPages(
    totalRows: number,
    pageSize: number,
    headerEnabled: boolean,
    footerEnabled: boolean
): number {
    let dataRows = totalRows;
    if (headerEnabled) dataRows--;
    if (footerEnabled) dataRows--;

    if (dataRows <= 0) return 1;
    if (pageSize <= 0) return 1;

    return Math.ceil(dataRows / pageSize);
}

export function getPagedRowIndices(
    totalRows: number,
    pageSize: number,
    currentPage: number,
    headerEnabled: boolean,
    footerEnabled: boolean
): number[] {
    const result: number[] = [];

    if (headerEnabled) {
        result.push(0);
    }

    const dataStartRow = headerEnabled ? 1 : 0;
    const dataEndRow = footerEnabled ? totalRows - 2 : totalRows - 1;
    const dataRowCount = dataEndRow - dataStartRow + 1;

    if (dataRowCount > 0 && pageSize > 0) {
        const pageStartIndex = currentPage * pageSize;
        const pageEndIndex = Math.min(
            pageStartIndex + pageSize - 1,
            dataRowCount - 1
        );

        for (let i = pageStartIndex; i <= pageEndIndex; i++) {
            result.push(dataStartRow + i);
        }
    }

    if (footerEnabled) {
        result.push(totalRows - 1);
    }

    return result;
}

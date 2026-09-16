import { __ } from "@wordpress/i18n";
import { useTableStore } from "../../store";
import { getTotalPages } from "../../pagination";
import { isProAvailable } from "../../pro-status";

interface PaginationNavigationProps {
    filteredRowCount?: number;
}

export function PaginationNavigation({
    filteredRowCount,
}: PaginationNavigationProps) {
    const isPro = isProAvailable();
    const currentPage = useTableStore(state => state.currentPage);
    const setCurrentPage = useTableStore(state => state.setCurrentPage);
    const tableConfig = useTableStore(state => state.table);

    const paginationConfig = tableConfig.pagination!;
    const { enabled, pageSize, showPageNumbers, showPrevNext } =
        paginationConfig;

    if (!isPro || !enabled) {
        return null;
    }

    const rowCount = filteredRowCount ?? tableConfig.rows;
    const totalPages = getTotalPages(
        rowCount,
        pageSize,
        tableConfig.headerEnabled,
        tableConfig.footerEnabled
    );

    if (totalPages <= 1) {
        return null;
    }

    const canGoPrev = currentPage > 0;
    const canGoNext = currentPage < totalPages - 1;

    const getPageNumbers = () => {
        const pages: (number | "ellipsis")[] = [];
        const maxVisiblePages = 5;

        if (totalPages <= maxVisiblePages) {
            for (let i = 0; i < totalPages; i++) {
                pages.push(i);
            }
        } else {
            pages.push(0);

            if (currentPage > 2) {
                pages.push("ellipsis");
            }

            const start = Math.max(1, currentPage - 1);
            const end = Math.min(totalPages - 2, currentPage + 1);

            for (let i = start; i <= end; i++) {
                if (!pages.includes(i)) {
                    pages.push(i);
                }
            }

            if (currentPage < totalPages - 3) {
                pages.push("ellipsis");
            }

            if (!pages.includes(totalPages - 1)) {
                pages.push(totalPages - 1);
            }
        }

        return pages;
    };

    const buttonClass = "tableberg-pagination__button";

    return (
        <div className="tableberg-pagination">
            {showPrevNext && (
                <button
                    type="button"
                    disabled={!canGoPrev}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className={`${buttonClass} ${buttonClass}--arrow`}
                    aria-label={__("Previous Page", "tableberg")}
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M14.6 7L10 12l4.6 5-1.4 1.4L6.8 12l6.4-6.4z" />
                    </svg>
                </button>
            )}

            {showPageNumbers &&
                getPageNumbers().map((page, index) => {
                    if (page === "ellipsis") {
                        return (
                            <span
                                key={`ellipsis-${index}`}
                                className="tableberg-pagination__ellipsis"
                            >
                                ...
                            </span>
                        );
                    }

                    const isActive = currentPage === page;

                    return (
                        <button
                            key={page}
                            type="button"
                            onClick={() => setCurrentPage(page)}
                            className={`${buttonClass}${isActive ? ` ${buttonClass}--active` : ""}`}
                        >
                            {page + 1}
                        </button>
                    );
                })}

            {showPrevNext && (
                <button
                    type="button"
                    disabled={!canGoNext}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className={`${buttonClass} ${buttonClass}--arrow`}
                    aria-label={__("Next Page", "tableberg")}
                >
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M9.4 7l4.6 5-4.6 5 1.4 1.4 6-6.4-6-6.4z" />
                    </svg>
                </button>
            )}
        </div>
    );
}

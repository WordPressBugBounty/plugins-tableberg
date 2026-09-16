import { __, _n, sprintf } from "@wordpress/i18n";
import { useTableStore } from "../../store";
import { getMatchingRowCount } from "../../search";
import { isProAvailable } from "../../pro-status";

export function SearchInput() {
    const isPro = isProAvailable();
    const searchTerm = useTableStore(state => state.searchTerm);
    const setSearchTerm = useTableStore(state => state.setSearchTerm);
    const table = useTableStore(state => state.table);
    const cells = useTableStore(state => state.cells);
    const searchConfig = table.search;

    if (!isPro || !searchConfig?.enabled) {
        return null;
    }

    const placeholder = searchConfig.placeholder;
    const position = searchConfig.position || "left";

    const matchingCount = searchTerm.trim()
        ? getMatchingRowCount(cells, table.rows, table.cols, table, searchTerm)
        : null;

    const handleClear = () => {
        setSearchTerm("");
    };

    return (
        <div
            className="tableberg-search"
            style={{
                justifyContent:
                    position === "right" ? "flex-end" : "flex-start",
            }}
        >
            <div className="tableberg-search__input-wrapper">
                <svg
                    className="tableberg-search__icon"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <circle cx="11" cy="11" r="8" />
                    <path d="M21 21l-4.35-4.35" />
                </svg>
                <input
                    type="text"
                    className="tableberg-search__input"
                    placeholder={placeholder}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                    <button
                        type="button"
                        className="tableberg-search__clear"
                        onClick={handleClear}
                        aria-label={__("Clear search", "tableberg")}
                    >
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                        >
                            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
                        </svg>
                    </button>
                )}
            </div>
            {matchingCount !== null && (
                <span className="tableberg-search__results">
                    {matchingCount === 0
                        ? __("No results found", "tableberg")
                        : /* translators: %d is the number of matching rows */
                          sprintf(
                              _n(
                                  "%d result",
                                  "%d results",
                                  matchingCount,
                                  "tableberg"
                              ),
                              matchingCount
                          )}
                </span>
            )}
        </div>
    );
}

import { RefObject, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ToolbarButton } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import {
    arrowDown,
    arrowLeft,
    arrowRight,
    arrowUp,
    tableColumnAfter,
    tableColumnBefore,
    tableColumnDelete,
    tableRowAfter,
    tableRowBefore,
    tableRowDelete,
} from "@wordpress/icons";
import {
    DuplicateColumnIcon,
    DuplicateRowIcon,
} from "@tableberg/shared/icons/enhancements";
import { parseCellKey } from "../../attributes";
import { useTableStore } from "../../store";
import type { TableEditPreview } from "../../store";

interface ToolbarButtonInteractions {
    onEnter?: () => void;
    onLeave?: () => void;
    onFocus?: () => void;
    onBlur?: () => void;
}

interface TableEditToolbarButtonProps
    extends Omit<React.ComponentProps<typeof ToolbarButton>, "showTooltip"> {
    tooltip: string;
    interactions?: ToolbarButtonInteractions;
}

function TableEditToolbarButton({
    tooltip,
    interactions,
    ...props
}: TableEditToolbarButtonProps) {
    // The hover/focus interactions drive the row/column preview highlight; the
    // label is shown via the native WordPress tooltip, which positions reliably
    // inside the portaled/transformed toolbar.
    return (
        <span
            className="tableberg-edit-toolbar-button-anchor"
            onMouseEnter={() => interactions?.onEnter?.()}
            onMouseLeave={() => interactions?.onLeave?.()}
            onFocus={() => interactions?.onFocus?.()}
            onBlur={() => interactions?.onBlur?.()}
        >
            <ToolbarButton {...props} label={tooltip} showTooltip />
        </span>
    );
}

function getPortalDocument(sourceDocument: Document): Document {
    try {
        return sourceDocument.defaultView?.parent?.document || sourceDocument;
    } catch {
        return sourceDocument;
    }
}

interface TableEditToolbarProps {
    anchorRef: RefObject<HTMLElement | null>;
}

export function TableEditToolbar({ anchorRef }: TableEditToolbarProps) {
    const selectedCells = useTableStore(state => state.selectedCells);
    const cells = useTableStore(state => state.cells);
    const rows = useTableStore(state => state.table.rows);
    const cols = useTableStore(state => state.table.cols);
    const insertRow = useTableStore(state => state.insertRow);
    const deleteRow = useTableStore(state => state.deleteRow);
    const insertColumn = useTableStore(state => state.insertColumn);
    const deleteColumn = useTableStore(state => state.deleteColumn);
    const duplicateRow = useTableStore(state => state.duplicateRow);
    const duplicateColumn = useTableStore(state => state.duplicateColumn);
    const moveRow = useTableStore(state => state.moveRow);
    const moveColumn = useTableStore(state => state.moveColumn);
    const showRowColumnControls = useTableStore(
        state => state.showRowColumnControls
    );
    const showDuplicateMoveControls = useTableStore(
        state => state.showDuplicateMoveControls
    );
    const setTableEditPreview = useTableStore(
        state => state.setTableEditPreview
    );
    const clearTableEditPreview = useTableStore(
        state => state.clearTableEditPreview
    );
    const tableEditPreview = useTableStore(state => state.tableEditPreview);

    const toolbarRef = useRef<HTMLDivElement | null>(null);
    const portalMountRef = useRef<HTMLDivElement | null>(null);
    const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
    const [toolbarPosition, setToolbarPosition] = useState<{
        top: number;
        left: number;
    } | null>(null);

    const primaryCell = selectedCells[0];

    useEffect(
        () => () => {
            if (tableEditPreview !== null) {
                clearTableEditPreview();
            }
        },
        [clearTableEditPreview, tableEditPreview]
    );

    useEffect(() => {
        if (tableEditPreview !== null) {
            clearTableEditPreview();
        }
    }, [
        showRowColumnControls,
        showDuplicateMoveControls,
        clearTableEditPreview,
        tableEditPreview,
    ]);

    useEffect(() => {
        const anchorElement = anchorRef.current;

        if (!anchorElement) {
            setPortalTarget(null);
            setToolbarPosition(null);
            return;
        }

        const ownerDocument = anchorElement.ownerDocument;
        const portalDocument = getPortalDocument(ownerDocument);
        const portalWindow = portalDocument.defaultView;
        const ownerWindow = ownerDocument.defaultView;

        if (!portalMountRef.current) {
            portalMountRef.current = portalDocument.createElement("div");
            portalMountRef.current.className = "tableberg-edit-toolbar-mount";
        }

        const mountNode = portalMountRef.current;

        if (mountNode.parentElement !== portalDocument.body) {
            portalDocument.body.appendChild(mountNode);
        }

        setPortalTarget(mountNode);

        let frameId: number | null = null;

        const syncPosition = () => {
            const currentAnchor = anchorRef.current;

            if (!currentAnchor) {
                setToolbarPosition(null);
                return;
            }

            // Anchor to the actual table (inside any block padding/alignment),
            // not the outer block figure, so the rail stays attached to the
            // table when block padding is applied.
            const tableElement =
                currentAnchor.querySelector(".tableberg-table-wrapper") ||
                currentAnchor.querySelector("table") ||
                currentAnchor;

            const anchorRect = tableElement.getBoundingClientRect();
            let top = anchorRect.top;
            let left = anchorRect.left - 8;

            if (ownerDocument !== portalDocument) {
                const frameElement = ownerWindow?.frameElement;
                const frameRect = frameElement?.getBoundingClientRect() || null;

                if (frameRect) {
                    top += frameRect.top;
                    left += frameRect.left;
                }
            }

            setToolbarPosition({ top, left });
        };

        const schedulePositionSync = () => {
            if (!portalWindow) {
                syncPosition();
                return;
            }

            if (frameId !== null) {
                return;
            }

            frameId = portalWindow.requestAnimationFrame(() => {
                frameId = null;
                syncPosition();
            });
        };

        const resizeObserver = new ResizeObserver(() => {
            schedulePositionSync();
        });

        resizeObserver.observe(anchorElement);

        ownerWindow?.addEventListener("resize", schedulePositionSync);
        ownerDocument.addEventListener("scroll", schedulePositionSync, true);

        if (portalWindow && portalWindow !== ownerWindow) {
            portalWindow.addEventListener("resize", schedulePositionSync);
            portalDocument.addEventListener(
                "scroll",
                schedulePositionSync,
                true
            );
        }

        schedulePositionSync();

        return () => {
            resizeObserver.disconnect();
            ownerWindow?.removeEventListener("resize", schedulePositionSync);
            ownerDocument.removeEventListener(
                "scroll",
                schedulePositionSync,
                true
            );

            if (portalWindow && portalWindow !== ownerWindow) {
                portalWindow.removeEventListener(
                    "resize",
                    schedulePositionSync
                );
                portalDocument.removeEventListener(
                    "scroll",
                    schedulePositionSync,
                    true
                );
            }

            if (frameId !== null && portalWindow) {
                portalWindow.cancelAnimationFrame(frameId);
            }

            if (mountNode.parentElement) {
                mountNode.parentElement.removeChild(mountNode);
            }

            setPortalTarget(null);
        };
    }, [anchorRef]);

    if (!primaryCell) {
        return null;
    }

    if (!showRowColumnControls && !showDuplicateMoveControls) {
        return null;
    }

    if (!portalTarget || !toolbarPosition) {
        return null;
    }

    const [row, col] = parseCellKey(primaryCell);
    const hasMergedCells = Object.values(cells).some(cell => {
        const span = cell.span;
        return !!span && (span.rowSpan > 1 || span.colSpan > 1);
    });
    const advancedDisabled = hasMergedCells;

    const getButtonInteractions = (
        preview: TableEditPreview,
        disablePreview = false
    ): ToolbarButtonInteractions => {
        if (disablePreview || !preview) {
            return {};
        }

        return {
            onEnter: () => {
                setTableEditPreview(preview);
            },
            onLeave: () => {
                clearTableEditPreview();
            },
            onFocus: () => {
                setTableEditPreview(preview);
            },
            onBlur: () => {
                clearTableEditPreview();
            },
        };
    };

    return createPortal(
        <div
            ref={toolbarRef}
            className="tableberg-edit-toolbar"
            role="toolbar"
            aria-label={__("Edit table", "tableberg")}
            style={{
                top: `${toolbarPosition.top}px`,
                left: `${toolbarPosition.left}px`,
            }}
        >
            {showDuplicateMoveControls && (
                <div className="tableberg-edit-toolbar-column">
                    <div className="tableberg-edit-toolbar-group tableberg-edit-toolbar-group-advanced">
                        <TableEditToolbarButton
                            tooltip={
                                advancedDisabled
                                    ? __(
                                          "Duplicate and move controls are disabled for merged tables.",
                                          "tableberg"
                                      )
                                    : __("Duplicate row", "tableberg")
                            }
                            interactions={getButtonInteractions(
                                {
                                    operation: "duplicate",
                                    target: "row",
                                    index: row + 1,
                                },
                                advancedDisabled
                            )}
                            icon={DuplicateRowIcon}
                            label={__("Duplicate row", "tableberg")}
                            disabled={advancedDisabled}
                            onClick={() => {
                                clearTableEditPreview();
                                duplicateRow(row);
                            }}
                        />
                        <TableEditToolbarButton
                            tooltip={
                                advancedDisabled
                                    ? __(
                                          "Duplicate and move controls are disabled for merged tables.",
                                          "tableberg"
                                      )
                                    : __("Duplicate column", "tableberg")
                            }
                            interactions={getButtonInteractions(
                                {
                                    operation: "duplicate",
                                    target: "column",
                                    index: col + 1,
                                },
                                advancedDisabled
                            )}
                            icon={DuplicateColumnIcon}
                            label={__("Duplicate column", "tableberg")}
                            disabled={advancedDisabled}
                            onClick={() => {
                                clearTableEditPreview();
                                duplicateColumn(col);
                            }}
                        />
                        <TableEditToolbarButton
                            tooltip={
                                advancedDisabled
                                    ? __(
                                          "Duplicate and move controls are disabled for merged tables.",
                                          "tableberg"
                                      )
                                    : __("Move row up", "tableberg")
                            }
                            icon={arrowUp}
                            label={__("Move row up", "tableberg")}
                            disabled={advancedDisabled || row === 0}
                            onClick={() => {
                                moveRow(row, row - 1);
                            }}
                        />
                        <TableEditToolbarButton
                            tooltip={
                                advancedDisabled
                                    ? __(
                                          "Duplicate and move controls are disabled for merged tables.",
                                          "tableberg"
                                      )
                                    : __("Move row down", "tableberg")
                            }
                            icon={arrowDown}
                            label={__("Move row down", "tableberg")}
                            disabled={advancedDisabled || row >= rows - 1}
                            onClick={() => {
                                moveRow(row, row + 1);
                            }}
                        />
                        <TableEditToolbarButton
                            tooltip={
                                advancedDisabled
                                    ? __(
                                          "Duplicate and move controls are disabled for merged tables.",
                                          "tableberg"
                                      )
                                    : __("Move column left", "tableberg")
                            }
                            icon={arrowLeft}
                            label={__("Move column left", "tableberg")}
                            disabled={advancedDisabled || col === 0}
                            onClick={() => {
                                moveColumn(col, col - 1);
                            }}
                        />
                        <TableEditToolbarButton
                            tooltip={
                                advancedDisabled
                                    ? __(
                                          "Duplicate and move controls are disabled for merged tables.",
                                          "tableberg"
                                      )
                                    : __("Move column right", "tableberg")
                            }
                            icon={arrowRight}
                            label={__("Move column right", "tableberg")}
                            disabled={advancedDisabled || col >= cols - 1}
                            onClick={() => {
                                moveColumn(col, col + 1);
                            }}
                        />
                    </div>
                </div>
            )}

            {showRowColumnControls && (
                <div className="tableberg-edit-toolbar-column">
                    <div className="tableberg-edit-toolbar-group">
                        <TableEditToolbarButton
                            tooltip={__("Insert row before", "tableberg")}
                            interactions={getButtonInteractions({
                                operation: "insert",
                                target: "row",
                                index: row,
                            })}
                            icon={tableRowBefore}
                            label={__("Insert row before", "tableberg")}
                            onClick={() => {
                                clearTableEditPreview();
                                insertRow(row);
                            }}
                        />
                        <TableEditToolbarButton
                            tooltip={__("Insert row after", "tableberg")}
                            interactions={getButtonInteractions({
                                operation: "insert",
                                target: "row",
                                index: row + 1,
                            })}
                            icon={tableRowAfter}
                            label={__("Insert row after", "tableberg")}
                            onClick={() => {
                                clearTableEditPreview();
                                insertRow(row + 1);
                            }}
                        />
                        <TableEditToolbarButton
                            tooltip={__("Delete row", "tableberg")}
                            interactions={getButtonInteractions(
                                {
                                    operation: "delete",
                                    target: "row",
                                    index: row,
                                },
                                rows <= 1
                            )}
                            icon={tableRowDelete}
                            label={__("Delete row", "tableberg")}
                            disabled={rows <= 1}
                            onClick={() => {
                                clearTableEditPreview();
                                deleteRow(row);
                            }}
                        />
                    </div>

                    <div className="tableberg-edit-toolbar-group">
                        <TableEditToolbarButton
                            tooltip={__("Insert column before", "tableberg")}
                            interactions={getButtonInteractions({
                                operation: "insert",
                                target: "column",
                                index: col,
                            })}
                            icon={tableColumnBefore}
                            label={__("Insert column before", "tableberg")}
                            onClick={() => {
                                clearTableEditPreview();
                                insertColumn(col);
                            }}
                        />
                        <TableEditToolbarButton
                            tooltip={__("Insert column after", "tableberg")}
                            interactions={getButtonInteractions({
                                operation: "insert",
                                target: "column",
                                index: col + 1,
                            })}
                            icon={tableColumnAfter}
                            label={__("Insert column after", "tableberg")}
                            onClick={() => {
                                clearTableEditPreview();
                                insertColumn(col + 1);
                            }}
                        />
                        <TableEditToolbarButton
                            tooltip={__("Delete column", "tableberg")}
                            interactions={getButtonInteractions(
                                {
                                    operation: "delete",
                                    target: "column",
                                    index: col,
                                },
                                cols <= 1
                            )}
                            icon={tableColumnDelete}
                            label={__("Delete column", "tableberg")}
                            disabled={cols <= 1}
                            onClick={() => {
                                clearTableEditPreview();
                                deleteColumn(col);
                            }}
                        />
                    </div>
                </div>
            )}
        </div>,
        portalTarget
    );
}

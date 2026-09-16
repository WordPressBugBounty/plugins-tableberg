import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { store as blockEditorStore } from "@wordpress/block-editor";
import { useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";

import { CellKey } from "../../attributes";
import { createElement } from "../../elements";
import { useTableStore } from "../../store";
import InserterList from "../cell-inserter/inserter-list";
import { getCellInserterItems, InserterItem } from "../cell-inserter/items";

import "./style.scss";

function getEditorDocument(): Document {
    try {
        const parentDoc = document.defaultView?.parent?.document;
        return parentDoc || document;
    } catch {
        return document;
    }
}

function findBlocksTabContainer(rootDoc: Document): HTMLElement | null {
    const sidebar = rootDoc.querySelector(".editor-inserter-sidebar");

    if (!(sidebar instanceof HTMLElement)) {
        return null;
    }

    const activeTabPanel = rootDoc.querySelector(
        ".editor-inserter-sidebar .block-editor-tabbed-sidebar__tabpanel:not([hidden])"
    );

    if (activeTabPanel instanceof HTMLElement) {
        const blocksList = activeTabPanel.querySelector(
            ".block-editor-inserter__block-list"
        );

        if (blocksList instanceof HTMLElement) {
            return blocksList;
        }
    }

    const blocksList = sidebar.querySelector(
        ".block-editor-inserter__block-list"
    );

    return blocksList instanceof HTMLElement ? blocksList : null;
}

export function TableElementsInserterExtension({
    clientId,
}: {
    clientId: string;
}) {
    const selectedElement = useTableStore(state => state.selectedElement);
    const selectedCells = useTableStore(state => state.selectedCells);
    const addElementToCell = useTableStore(state => state.addElementToCell);

    const targetCell = useMemo<CellKey | null>(() => {
        if (selectedElement) {
            return selectedElement.cell;
        }

        return selectedCells[0] || null;
    }, [selectedElement, selectedCells]);

    const { isTablebergContextSelected } = useSelect(
        select => {
            const blockSelect = select(blockEditorStore) as {
                getSelectedBlockClientId: () => string | null;
                getBlockParents: (clientId: string) => string[];
            };

            const selectedBlockClientId =
                blockSelect.getSelectedBlockClientId();
            const isCurrentBlockSelected = selectedBlockClientId === clientId;
            const isCurrentInnerBlockSelected = selectedBlockClientId
                ? blockSelect
                      .getBlockParents(selectedBlockClientId)
                      .includes(clientId)
                : false;

            return {
                isTablebergContextSelected:
                    isCurrentBlockSelected || isCurrentInnerBlockSelected,
            };
        },
        [clientId]
    );

    const shouldShow = isTablebergContextSelected && targetCell !== null;

    const [portalTarget, setPortalTarget] = useState<HTMLElement | null>(null);
    const mountNodeRef = useRef<HTMLElement | null>(null);
    const cellInserterItems = getCellInserterItems();

    useEffect(() => {
        if (!shouldShow) {
            setPortalTarget(null);

            if (mountNodeRef.current?.parentElement) {
                mountNodeRef.current.parentElement.removeChild(
                    mountNodeRef.current
                );
            }

            return;
        }

        const rootDoc = getEditorDocument();
        const rootWindow = rootDoc.defaultView;

        const syncTarget = () => {
            const blocksTabContainer = findBlocksTabContainer(rootDoc);

            if (!blocksTabContainer) {
                setPortalTarget(null);
                return;
            }

            if (!mountNodeRef.current) {
                mountNodeRef.current = rootDoc.createElement("div");
                mountNodeRef.current.className =
                    "tableberg-inserter-table-elements-mount";
            }

            const mountNode = mountNodeRef.current;

            if (mountNode.parentElement !== blocksTabContainer) {
                blocksTabContainer.prepend(mountNode);
            } else if (blocksTabContainer.firstElementChild !== mountNode) {
                blocksTabContainer.prepend(mountNode);
            }

            setPortalTarget(mountNode);
        };

        syncTarget();

        let frameId: number | null = null;
        const observer = new MutationObserver(() => {
            if (!rootWindow) {
                syncTarget();
                return;
            }

            if (frameId !== null) {
                rootWindow.cancelAnimationFrame(frameId);
            }

            frameId = rootWindow.requestAnimationFrame(() => {
                frameId = null;
                syncTarget();
            });
        });

        observer.observe(rootDoc.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ["hidden", "class", "aria-selected"],
        });

        return () => {
            observer.disconnect();

            if (frameId !== null && rootWindow) {
                rootWindow.cancelAnimationFrame(frameId);
            }

            if (mountNodeRef.current?.parentElement) {
                mountNodeRef.current.parentElement.removeChild(
                    mountNodeRef.current
                );
            }
        };
    }, [shouldShow]);

    const onInsertElement = useCallback(
        (item: InserterItem) => {
            if (!targetCell) {
                return;
            }

            const element = createElement(item.name);

            if (element) {
                addElementToCell(targetCell, element);
            }
        },
        [addElementToCell, targetCell]
    );

    if (!shouldShow || !portalTarget) {
        return null;
    }

    return createPortal(
        <div className="tableberg-inserter-table-elements">
            <div className="block-editor-inserter__panel-header">
                <h2 className="block-editor-inserter__panel-title">
                    {__("Table elements", "tableberg")}
                </h2>
            </div>
            <div className="block-editor-inserter__panel-content">
                <InserterList
                    items={cellInserterItems}
                    onSelect={onInsertElement}
                />
            </div>
        </div>,
        portalTarget
    );
}

import {
    MenuGroup,
    MenuItem,
    ToolbarDropdownMenu,
} from "@wordpress/components";
import { BlockControls } from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";
import { moreVertical } from "@wordpress/icons";

import { createElement } from "../elements";
import {
    applyElementStyleClipboardPayload,
    parseElementStyleClipboardPayload,
    readClipboardText,
    serializeElementClipboardPayload,
    serializeElementStyleClipboardPayload,
    writeClipboardText,
} from "../hooks/block-editor-compat/elementClipboard";
import { CellKey } from "../attributes";
import { useTableStore } from "../store";

function getShortcutRepresentation(name: string): string | undefined {
    const store = window.wp?.keyboardShortcuts?.store;
    const select = window.wp?.data?.select;

    if (!store || !select) {
        return undefined;
    }

    return select(store).getShortcutRepresentation?.(name);
}

export function ElementOptionsButton({
    cellCoords,
    elementIndex,
}: {
    cellCoords: CellKey;
    elementIndex: number;
}) {
    const cells = useTableStore(state => state.cells);
    const insertElementInCell = useTableStore(
        state => state.insertElementInCell
    );
    const duplicateElementInCell = useTableStore(
        state => state.duplicateElementInCell
    );
    const removeElementFromCell = useTableStore(
        state => state.removeElementFromCell
    );
    const updateCellElement = useTableStore(state => state.updateCellElement);

    const selectedElement = cells[cellCoords]?.elements?.[elementIndex] || null;
    const shortcuts = {
        copy: getShortcutRepresentation("core/block-editor/copy"),
        cut: getShortcutRepresentation("core/block-editor/cut"),
        duplicate: getShortcutRepresentation("core/block-editor/duplicate"),
        insertBefore: getShortcutRepresentation(
            "core/block-editor/insert-before"
        ),
        insertAfter: getShortcutRepresentation(
            "core/block-editor/insert-after"
        ),
        remove: getShortcutRepresentation("core/block-editor/remove"),
    };

    if (!selectedElement) {
        return null;
    }

    const insertTextElement = (targetIndex: number) => {
        const textElement = createElement("text");

        if (!textElement) {
            return;
        }

        insertElementInCell(cellCoords, targetIndex, textElement);
    };

    return (
        <ToolbarDropdownMenu
            icon={moreVertical}
            label={__("Element options", "tableberg")}
            toggleProps={{
                title: __("Element options", "tableberg"),
                showTooltip: true,
            }}
            popoverProps={{ placement: "bottom-start" }}
        >
            {({ onClose }) => (
                <>
                    <MenuGroup>
                        <MenuItem
                            shortcut={shortcuts.copy}
                            onClick={() => {
                                void writeClipboardText(
                                    serializeElementClipboardPayload(
                                        selectedElement
                                    )
                                );
                                onClose();
                            }}
                        >
                            {__("Copy", "tableberg")}
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                void writeClipboardText(
                                    serializeElementStyleClipboardPayload(
                                        selectedElement
                                    )
                                );
                                onClose();
                            }}
                        >
                            {__("Copy styles", "tableberg")}
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                void (async () => {
                                    const clipboardText =
                                        await readClipboardText();
                                    const stylePayload =
                                        parseElementStyleClipboardPayload(
                                            clipboardText
                                        );

                                    if (!stylePayload) {
                                        return;
                                    }

                                    const styledElement =
                                        applyElementStyleClipboardPayload(
                                            selectedElement,
                                            stylePayload
                                        );

                                    updateCellElement(
                                        cellCoords,
                                        elementIndex,
                                        {
                                            attributes:
                                                styledElement.attributes,
                                        }
                                    );
                                })();
                                onClose();
                            }}
                        >
                            {__("Paste styles", "tableberg")}
                        </MenuItem>
                        <MenuItem
                            shortcut={shortcuts.cut}
                            onClick={() => {
                                void (async () => {
                                    await writeClipboardText(
                                        serializeElementClipboardPayload(
                                            selectedElement
                                        )
                                    );
                                    removeElementFromCell(
                                        cellCoords,
                                        elementIndex
                                    );
                                })();
                                onClose();
                            }}
                        >
                            {__("Cut", "tableberg")}
                        </MenuItem>
                        <MenuItem
                            shortcut={shortcuts.duplicate}
                            onClick={() => {
                                duplicateElementInCell(
                                    cellCoords,
                                    elementIndex
                                );
                                onClose();
                            }}
                        >
                            {__("Duplicate", "tableberg")}
                        </MenuItem>
                    </MenuGroup>
                    <MenuGroup>
                        <MenuItem
                            shortcut={shortcuts.insertBefore}
                            onClick={() => {
                                insertTextElement(elementIndex);
                                onClose();
                            }}
                        >
                            {__("Add before", "tableberg")}
                        </MenuItem>
                        <MenuItem
                            shortcut={shortcuts.insertAfter}
                            onClick={() => {
                                insertTextElement(elementIndex + 1);
                                onClose();
                            }}
                        >
                            {__("Add after", "tableberg")}
                        </MenuItem>
                    </MenuGroup>
                    <MenuGroup>
                        <MenuItem
                            shortcut={shortcuts.remove}
                            onClick={() => {
                                removeElementFromCell(cellCoords, elementIndex);
                                onClose();
                            }}
                        >
                            {__("Delete", "tableberg")}
                        </MenuItem>
                    </MenuGroup>
                </>
            )}
        </ToolbarDropdownMenu>
    );
}

export function ElementOptionsBlockControls({
    cellCoords,
    elementIndex,
}: {
    cellCoords: CellKey;
    elementIndex: number;
}) {
    return (
        <BlockControls group="other">
            <ElementOptionsButton
                cellCoords={cellCoords}
                elementIndex={elementIndex}
            />
        </BlockControls>
    );
}

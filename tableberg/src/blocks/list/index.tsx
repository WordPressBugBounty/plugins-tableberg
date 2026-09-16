import { registerBlockType } from "@wordpress/blocks";
import listIcon from "@tableberg/shared/icons/styled-list";

import metadata from "./block.json";
import { ListElement } from "./element";
import { createBridgedElementEdit } from "../element-bridge";

/**
 * The edit is the shared ListElement — the same component pro's styled list
 * runs — so the block gets its keyboard handling (Enter for a new item,
 * Tab/Shift+Tab to indent, Backspace to outdent or remove), its indent and
 * outdent toolbar buttons, and its real nested rendering. The block used to
 * have a hand-written edit that rendered a flat list of RichTexts with no key
 * handling at all, so Enter only inserted a line break.
 */
export function registerListBlock() {
    registerBlockType(metadata.name, {
        ...(metadata as any),
        icon: listIcon,
        edit: createBridgedElementEdit(metadata.name, ListElement),
        save: () => null,
    });
}

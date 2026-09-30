import { CSSProperties } from "react";

import { CellElement, CellKey } from "../attributes";
import {
    ElementAlignment,
    elementAlignmentToJustifyContent,
} from "../alignment";

/** Shared bits for the element blocks' edit components. */

export function alignmentWrapperStyle(align: ElementAlignment): CSSProperties {
    return {
        display: "flex",
        justifyContent: elementAlignmentToJustifyContent(align),
        textAlign: align,
    };
}

// Placeholder coords for reused controls whose store path is inactive in
// the native editor (the passed updateAttrs/updateStyles override always
// wins).
export const NO_COORDS = "0,0" as CellKey;

import { BlockControls } from "@wordpress/block-editor";
import {
    MenuGroup,
    MenuItem,
    ToolbarDropdownMenu,
} from "@wordpress/components";
import { styles as stylesIcon } from "@wordpress/icons";
import { ToolbarWithDropdown } from "@tableberg/components";
import { __ } from "@wordpress/i18n";

import {
    applyElementStyleClipboardPayload,
    readElementStylePayload,
    rememberElementStylePayload,
    serializeElementStyleClipboardPayload,
    writeClipboardText,
} from "../hooks/block-editor-compat/elementClipboard";

export function ElementAlignmentToolbar({
    align,
    onChange,
}: {
    align: ElementAlignment;
    onChange: (align: ElementAlignment) => void;
}) {
    return (
        <BlockControls>
            <ToolbarWithDropdown
                title={__("Align element", "tableberg")}
                value={align}
                onChange={(newAlign?: string) => {
                    if (
                        newAlign === "left" ||
                        newAlign === "center" ||
                        newAlign === "right"
                    ) {
                        onChange(newAlign);
                    }
                }}
                controlset="alignment"
            />
        </BlockControls>
    );
}

/**
 * Copy styles / paste styles for an element block.
 *
 * The element options menu that carries these in the preview path works off
 * the table store, which the element blocks are not in, so they get their own
 * toolbar entry here. The clipboard payload is the shared one, so styles can
 * be pasted onto any element that has the same style keys.
 */
export function ElementStyleOptions({
    elementName,
    attributes,
    setAttributes,
}: {
    /** The element's name without the `tableberg/` prefix. */
    elementName: string;
    /** Merged with the defaults, so the copy carries what is rendered. */
    attributes: Record<string, unknown>;
    setAttributes: (attrs: Record<string, unknown>) => void;
}) {
    const element = {
        name: elementName,
        attributes,
    } as unknown as CellElement;

    return (
        <BlockControls group="other">
            <ToolbarDropdownMenu
                icon={stylesIcon}
                label={__("Element styles", "tableberg")}
                toggleProps={{
                    title: __("Element styles", "tableberg"),
                    showTooltip: true,
                }}
                popoverProps={{ placement: "bottom-start" }}
            >
                {({ onClose }) => (
                    <MenuGroup>
                        <MenuItem
                            onClick={() => {
                                rememberElementStylePayload(element);
                                // Also on the system clipboard, so the styles
                                // can be pasted in another tab.
                                void writeClipboardText(
                                    serializeElementStyleClipboardPayload(
                                        element
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
                                    const payload =
                                        await readElementStylePayload();

                                    if (!payload) {
                                        return;
                                    }

                                    setAttributes(
                                        applyElementStyleClipboardPayload(
                                            element,
                                            payload
                                        ).attributes as Record<string, unknown>
                                    );
                                })();
                                onClose();
                            }}
                        >
                            {__("Paste styles", "tableberg")}
                        </MenuItem>
                    </MenuGroup>
                )}
            </ToolbarDropdownMenu>
        </BlockControls>
    );
}

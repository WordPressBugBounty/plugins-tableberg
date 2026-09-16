import { CSSProperties } from "react";

import { CellKey } from "../attributes";
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
import { ToolbarWithDropdown } from "@tableberg/components";
import { __ } from "@wordpress/i18n";

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

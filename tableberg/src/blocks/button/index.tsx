import { CSSProperties } from "react";
import { RichText, useBlockProps } from "@wordpress/block-editor";
import { BlockEditProps, registerBlockType } from "@wordpress/blocks";
import { __ } from "@wordpress/i18n";
import { mergeAttrsWithDefaultsAndApplyBindings } from "@tableberg/shared/utils/merge-attrs-with-defaults-and-apply-bindings";
import buttonIcon from "@tableberg/shared/icons/button";

import { ButtonElementAttributes, buttonAttrDefaults } from "./element";
import metadata from "./block.json";
import { ButtonElementControls } from "./controls";
import { ElementBindings } from "../../dynamic-data/types";
import {
    ElementAlignmentToolbar,
    NO_COORDS,
    alignmentWrapperStyle,
} from "../element-edit-common";

function ButtonEdit({
    attributes,
    setAttributes,
    isSelected,
}: BlockEditProps<ButtonElementAttributes>) {
    const merged = mergeAttrsWithDefaultsAndApplyBindings(
        attributes,
        buttonAttrDefaults,
        undefined,
        {},
        __("(No data)", "tableberg")
    );
    const { content, align, styles } = merged;

    const blockProps = useBlockProps({
        style: alignmentWrapperStyle(align),
    });

    const buttonStyle: CSSProperties = {
        backgroundColor: styles.backgroundColor || undefined,
        color: styles.textColor || undefined,
        fontSize: (styles as { fontSize?: string }).fontSize || undefined,
        textAlign: styles.textAlign as CSSProperties["textAlign"],
        width: styles.width === "auto" ? undefined : styles.width,
        paddingTop: styles.padding?.top,
        paddingRight: styles.padding?.right,
        paddingBottom: styles.padding?.bottom,
        paddingLeft: styles.padding?.left,
        borderTopLeftRadius: styles.borderRadius?.topLeft,
        borderTopRightRadius: styles.borderRadius?.topRight,
        borderBottomRightRadius: styles.borderRadius?.bottomRight,
        borderBottomLeftRadius: styles.borderRadius?.bottomLeft,
        border: "none",
        cursor: "text",
    };

    return (
        <div {...blockProps}>
            {isSelected && (
                <ElementAlignmentToolbar
                    align={align}
                    onChange={newAlign => setAttributes({ align: newAlign })}
                />
            )}
            {isSelected && (
                <ButtonElementControls
                    attributes={merged}
                    bindings={
                        (attributes as { bindings?: ElementBindings }).bindings
                    }
                    cellCoords={NO_COORDS}
                    elementIndex={0}
                    updateStyles={newStyles =>
                        setAttributes({
                            styles: {
                                ...(attributes.styles ?? merged.styles),
                                ...newStyles,
                            },
                        })
                    }
                    updateAttrs={attrs => setAttributes(attrs)}
                />
            )}
            <RichText
                tagName="div"
                className="tableberg-button-element"
                placeholder={__("Button text", "tableberg")}
                value={content}
                onChange={newContent =>
                    setAttributes({ content: newContent })
                }
                style={buttonStyle}
            />
        </div>
    );
}

export function registerButtonBlock() {
    registerBlockType(metadata.name, {
        ...(metadata as any),
        icon: buttonIcon,
        edit: ButtonEdit,
        save: () => null,
    });
}

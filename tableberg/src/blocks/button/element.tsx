import { useRef } from "react";
import { RichText } from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";
import classNames from "classnames";
import { mergeAttrsWithDefaultsAndApplyBindings } from "@tableberg/shared/utils/merge-attrs-with-defaults-and-apply-bindings";

import { CellKey } from "../../attributes";
import { useTableStore } from "../../store";
import { useClickOutside } from "../../hooks/useClickOutside";
import { ElementRendererProps } from "../../elements";
import { ButtonElementControls } from "./controls";
import { BindableAttribute, ElementBindings } from "../../dynamic-data/types";
import { useDynamicDataBindings } from "../../dynamic-data/hooks/useDynamicData";
import { HighlightedText } from "../../components/HighlightedText";
import { useBlockCardUpdateShim } from "../../hooks/block-editor-compat";
import {
    elementAlignmentToJustifyContent,
    ElementAlignment,
} from "../../alignment";
import { isProAvailable } from "../../pro-status";

export interface ButtonElementAttributes {
    content: string;
    id: string;
    align: ElementAlignment;
    link: {
        url: string;
        target: "_blank" | "_self";
    };
    styles: {
        backgroundColor: string;
        textColor: string;
        backgroundHoverColor: string;
        textHoverColor: string;

        textAlign: "left" | "center" | "right";
        width: "auto" | "25%" | "50%" | "75%" | "100%";

        padding: {
            top: string;
            right: string;
            bottom: string;
            left: string;
        };

        borderRadius: {
            topLeft: string;
            topRight: string;
            bottomRight: string;
            bottomLeft: string;
        };

        fontSize: string;
    };
}

export const buttonAttrDefaults: ButtonElementAttributes = {
    content: "",
    id: "",
    align: "left",
    link: {
        url: "",
        target: "_self",
    },
    styles: {
        backgroundColor: "#000000",
        textColor: "#ffffff",
        backgroundHoverColor: "",
        textHoverColor: "",
        textAlign: "center",
        width: "auto",
        padding: {
            top: "var(--wp--preset--spacing--20)",
            right: "var(--wp--preset--spacing--20)",
            bottom: "var(--wp--preset--spacing--20)",
            left: "var(--wp--preset--spacing--20)",
        },
        borderRadius: {
            topLeft: "4px",
            topRight: "4px",
            bottomRight: "4px",
            bottomLeft: "4px",
        },
        fontSize: "1.38rem",
    },
};

export interface ButtonElementType {
    name: "button";
    attributes: ButtonElementAttributes;
    bindings?: ElementBindings;
}

function getLegacyCustomWidthStyle(
    width: ButtonElementAttributes["styles"]["width"]
): string | undefined {
    switch (width) {
        case "25%":
            return "calc(25% - (var(--wp--style--block-gap, 0.5em) * 0.75))";
        case "50%":
            return "calc(50% - (var(--wp--style--block-gap, 0.5em) * 0.5))";
        case "75%":
            return "calc(75% - (var(--wp--style--block-gap, 0.5em) * 0.25))";
        case "100%":
            return "100%";
        default:
            return undefined;
    }
}

export function ButtonElement({
    attributes,
    bindings,
    cellCoords,
    elementIndex,
}: ElementRendererProps<ButtonElementAttributes>) {
    const wrapperRef = useRef<HTMLDivElement>(null);

    const sortPreviewMode = useTableStore(state => state.sortPreviewMode);
    const isElementSelected = useTableStore(state => state.isElementSelected);
    const setSelectedElement = useTableStore(state => state.setSelectedElement);
    const clearSelectedElement = useTableStore(
        state => state.clearSelectedElement
    );
    const updateBlockCard = useBlockCardUpdateShim();

    const isSelected = isElementSelected(cellCoords, elementIndex);

    const { values: previewValues, isLoading: isDynamicLoading } =
        useDynamicDataBindings(bindings);

    useClickOutside({
        ref: wrapperRef,
        onClickOutside: () => {
            if (isSelected) {
                clearSelectedElement();
            }
        },
    });

    const buttonAttributes = mergeAttrsWithDefaultsAndApplyBindings(
        attributes,
        buttonAttrDefaults,
        bindings,
        previewValues,
        __("(No data)", "tableberg")
    );

    const hasDynamicBindings = !!bindings && Object.keys(bindings).length > 0;
    const contentIsBound = !!bindings?.content;
    const { content, align, styles } = buttonAttributes;
    const customWidth = getLegacyCustomWidthStyle(styles.width);

    const wrapperStyleCss: Record<string, string | undefined> = {
        "display": "flex",
        "justifyContent": elementAlignmentToJustifyContent(align),
        "width": customWidth ? "100%" : undefined,
        "--tableberg-button-background-color": styles.backgroundColor,
        "--tableberg-button-text-color": styles.textColor,
        "--tableberg-button-hover-background-color":
            styles.backgroundHoverColor || styles.backgroundColor,
        "--tableberg-button-text-hover-color":
            styles.textHoverColor || styles.textColor,
    };

    const customWidthWrapperStyleCss: Record<string, string | undefined> = {
        width: customWidth,
        maxWidth: customWidth ? "none" : undefined,
        minWidth: customWidth ? "0" : undefined,
        flexBasis: styles.width === "100%" ? "100%" : undefined,
    };

    const buttonStyleCss: Record<string, string | undefined> = {
        display: "inline-block",
        textAlign: styles.textAlign,
        fontSize: styles.fontSize,
        paddingTop: styles.padding.top,
        paddingRight: styles.padding.right,
        paddingBottom: styles.padding.bottom,
        paddingLeft: styles.padding.left,
        borderTopLeftRadius: styles.borderRadius.topLeft,
        borderTopRightRadius: styles.borderRadius.topRight,
        borderBottomRightRadius: styles.borderRadius.bottomRight,
        borderBottomLeftRadius: styles.borderRadius.bottomLeft,
        width: customWidth ? "100%" : undefined,
    };

    return (
        <>
            {isSelected && (
                <ButtonElementControls
                    attributes={buttonAttributes}
                    bindings={bindings}
                    cellCoords={cellCoords}
                    elementIndex={elementIndex}
                />
            )}
            <div
                ref={wrapperRef}
                style={wrapperStyleCss}
                onClick={e => {
                    e.stopPropagation();
                    if (!sortPreviewMode) {
                        setSelectedElement(cellCoords, elementIndex);
                        if (wrapperRef.current) {
                            updateBlockCard(
                                wrapperRef.current,
                                "Button",
                                "A button element within a Tableberg cell"
                            );
                        }
                    }
                }}
            >
                <div style={customWidthWrapperStyleCss}>
                    <ButtonElementContent
                        content={content}
                        cellCoords={cellCoords}
                        elementIndex={elementIndex}
                        contentIsBound={contentIsBound}
                        hasDynamicBindings={hasDynamicBindings}
                        isDynamicLoading={isDynamicLoading}
                        buttonStyleCss={buttonStyleCss}
                    />
                </div>
            </div>
        </>
    );
}

function ButtonElementContent({
    content,
    cellCoords,
    elementIndex,
    contentIsBound,
    hasDynamicBindings,
    isDynamicLoading,
    buttonStyleCss,
}: {
    content: string;
    cellCoords: CellKey;
    elementIndex: number;
    contentIsBound: boolean;
    hasDynamicBindings: boolean;
    isDynamicLoading: boolean;
    buttonStyleCss: Record<string, string | undefined>;
}) {
    const sortPreviewMode = useTableStore(state => state.sortPreviewMode);
    const updateCellElement = useTableStore(state => state.updateCellElement);

    const searchTerm = useTableStore(state => state.searchTerm);
    const searchConfig = useTableStore(state => state.table.search);
    const isPro = isProAvailable();

    const shouldHighlight =
        isPro &&
        searchConfig?.enabled &&
        searchConfig?.highlightColor &&
        searchTerm.trim();

    const baseClassName = classNames(
        "wp-block-button__link",
        "wp-element-button"
    );

    const className = classNames(baseClassName, {
        "tableberg-dynamic-content": hasDynamicBindings,
    });

    if (isDynamicLoading) {
        return (
            <div className={className} style={buttonStyleCss}>
                {__("Loading...", "tableberg")}
            </div>
        );
    }

    if (shouldHighlight) {
        return (
            <div className={className} style={buttonStyleCss}>
                <HighlightedText
                    content={content}
                    searchTerm={searchTerm}
                    highlightColor={searchConfig!.highlightColor}
                />
            </div>
        );
    }

    if (sortPreviewMode || contentIsBound) {
        return (
            <div className={className} style={buttonStyleCss}>
                {content}
            </div>
        );
    }

    return (
        <RichText
            className={baseClassName}
            tagName="div"
            style={buttonStyleCss}
            placeholder={__("Button text", "tableberg")}
            value={content}
            onChange={content =>
                updateCellElement(cellCoords, elementIndex, {
                    attributes: { content },
                })
            }
        />
    );
}

export const buttonBindableAttributes: BindableAttribute[] = [
    {
        path: "content",
        label: __("Button Text", "tableberg"),
    },
    {
        path: "link.url",
        label: __("Link URL", "tableberg"),
    },
    {
        path: "id",
        label: __("HTML ID", "tableberg"),
    },
    {
        path: "styles.backgroundColor",
        label: __("Background Color", "tableberg"),
    },
    {
        path: "styles.textColor",
        label: __("Text Color", "tableberg"),
    },
];

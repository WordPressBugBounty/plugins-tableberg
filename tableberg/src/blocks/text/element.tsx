import { CSSProperties, useRef } from "react";
import {
    RichText,
    InspectorControls,
    BlockControls,
} from "@wordpress/block-editor";
import { getBlockContent } from "@wordpress/blocks";
import { ToolbarWithDropdown } from "@tableberg/components";
import { mergeAttrsWithDefaultsAndApplyBindings } from "@tableberg/shared/utils/merge-attrs-with-defaults-and-apply-bindings";
import { __ } from "@wordpress/i18n";

import { getCellChildAutoCompleter } from "../../CellChildAutoCompleter";
import { CellElement, CellKey } from "../../attributes";
import { useTableStore } from "../../store";
import { useClickOutside } from "../../hooks/useClickOutside";
import { ElementRendererProps, createElement } from "../../elements";
import { DynamicDataPanel } from "../../components/DynamicDataPanel";
import { useDynamicDataBindings } from "../../dynamic-data/hooks/useDynamicData";
import { BindableAttribute, ElementBindings } from "../../dynamic-data/types";
import { HighlightedText } from "../../components/HighlightedText";
import { ElementDeleteButton } from "../../components/ElementDeleteButton";
import { ElementOptionsBlockControls } from "../../components/ElementOptionsButton";
import { useBlockCardUpdateShim } from "../../hooks/block-editor-compat";
import {
    elementAlignmentToJustifyContent,
    ElementAlignment,
} from "../../alignment";
import { TextElementControls } from "./controls";
import { isProAvailable } from "../../pro-status";

interface FourSides {
    top: string;
    right: string;
    bottom: string;
    left: string;
}

export interface TextElementAttributes {
    content: string;
    align: ElementAlignment;
    styles: {
        textColor: string;
        linkColor: string;
        backgroundColor: string;
        fontSize: string;
        padding: FourSides;
        margin: FourSides;
    };
}

const emptySides: FourSides = { top: "", right: "", bottom: "", left: "" };

export const textAttributeDefaults: TextElementAttributes = {
    content: "",
    align: "left",
    styles: {
        textColor: "#000000",
        linkColor: "",
        backgroundColor: "",
        fontSize: "1.38rem",
        padding: { ...emptySides },
        margin: { ...emptySides },
    },
};

// Build a CSS shorthand from a 4-side object; returns undefined when all sides
// are empty so the property is simply not set.
export function sidesToShorthand(sides?: FourSides): string | undefined {
    if (!sides) {
        return undefined;
    }
    const { top, right, bottom, left } = sides;
    if (!top && !right && !bottom && !left) {
        return undefined;
    }
    return `${top || "0"} ${right || "0"} ${bottom || "0"} ${left || "0"}`;
}

export interface TextElementType {
    name: "text";
    attributes: TextElementAttributes;
    bindings?: ElementBindings;
}

// When a cell is empty and content is pasted, the block editor hands the
// resulting blocks to onReplace. Since this RichText lives outside a real
// block context there is no block to replace, so we flatten the pasted blocks
// to plain text and drop it into the cell instead of losing the paste.
function pastedBlocksToPlainText(blocks: any[]): string {
    return blocks
        .map(block => {
            const html =
                typeof block?.attributes?.content === "string"
                    ? block.attributes.content
                    : getBlockContent(block) || "";
            const el = document.createElement("div");
            el.innerHTML = html;
            return (el.textContent || "").trim();
        })
        .filter(Boolean)
        .join("\n");
}

export function TextElement({
    attributes,
    bindings,
    cellCoords,
    elementIndex,
}: ElementRendererProps<TextElementAttributes>) {
    const wrapperRef = useRef<HTMLDivElement>(null);

    const sortPreviewMode = useTableStore(state => state.sortPreviewMode);
    const isElementSelected = useTableStore(state => state.isElementSelected);
    const setSelectedElement = useTableStore(state => state.setSelectedElement);
    const clearSelectedElement = useTableStore(
        state => state.clearSelectedElement
    );
    const updateCellElement = useTableStore(state => state.updateCellElement);
    const updateBlockCard = useBlockCardUpdateShim();

    const isSelected = isElementSelected(cellCoords, elementIndex);

    useClickOutside({
        ref: wrapperRef,
        onClickOutside: () => {
            if (isSelected) {
                clearSelectedElement();
            }
        },
    });

    const { values: previewValues, isLoading: isDynamicLoading } =
        useDynamicDataBindings(bindings);

    const mergedAttrs = mergeAttrsWithDefaultsAndApplyBindings(
        attributes,
        textAttributeDefaults,
        bindings,
        previewValues,
        __("(No data)", "tableberg")
    );

    const dynamicBindingEnabled = !!bindings?.content;
    const { content, align, styles } = mergedAttrs;

    const wrapperStyle: CSSProperties = {
        display: "flex",
        justifyContent: elementAlignmentToJustifyContent(align),
        // text-align is inherited, so wrapped lines inside the <p> align too.
        textAlign: align,
    };

    return (
        <>
            {isSelected && (
                <>
                    <BlockControls>
                        <ToolbarWithDropdown
                            title={__("Align text", "tableberg")}
                            value={align}
                            onChange={(newAlign?: string) => {
                                if (
                                    newAlign !== "left" &&
                                    newAlign !== "center" &&
                                    newAlign !== "right"
                                ) {
                                    return;
                                }

                                updateCellElement(cellCoords, elementIndex, {
                                    attributes: {
                                        align: newAlign,
                                    },
                                });
                            }}
                            controlset="alignment"
                        />
                        <ElementDeleteButton
                            cellCoords={cellCoords}
                            elementIndex={elementIndex}
                        />
                    </BlockControls>
                    <ElementOptionsBlockControls
                        cellCoords={cellCoords}
                        elementIndex={elementIndex}
                    />
                    <TextElementControls
                        attributes={mergedAttrs}
                        bindings={bindings}
                    />
                    <InspectorControls>
                        <DynamicDataPanel
                            elementType="text"
                            bindings={bindings}
                        />
                    </InspectorControls>
                </>
            )}
            <div
                ref={wrapperRef}
                style={wrapperStyle}
                onClick={e => {
                    e.stopPropagation();
                    if (!sortPreviewMode) {
                        setSelectedElement(cellCoords, elementIndex);
                        if (wrapperRef.current) {
                            updateBlockCard(
                                wrapperRef.current,
                                "Text",
                                "A text element within a Tableberg cell"
                            );
                        }
                    }
                }}
            >
                <TextElementContent
                    content={content}
                    cellCoords={cellCoords}
                    elementIndex={elementIndex}
                    dynamicBindingEnabled={dynamicBindingEnabled}
                    isDynamicLoading={isDynamicLoading}
                    textColor={styles.textColor}
                    linkColor={styles.linkColor}
                    backgroundColor={styles.backgroundColor}
                    fontSize={styles.fontSize}
                    padding={styles.padding}
                    margin={styles.margin}
                />
            </div>
        </>
    );
}

function TextElementContent({
    content,
    cellCoords,
    elementIndex,
    dynamicBindingEnabled,
    isDynamicLoading,
    textColor,
    linkColor,
    backgroundColor,
    fontSize,
    padding,
    margin,
}: {
    content: string;
    cellCoords: CellKey;
    elementIndex: number;
    dynamicBindingEnabled: boolean;
    isDynamicLoading: boolean;
    textColor: string;
    linkColor: string;
    backgroundColor: string;
    fontSize: string;
    padding: FourSides;
    margin: FourSides;
}) {
    const cellChildAutoCompleter = getCellChildAutoCompleter();
    const sortPreviewMode = useTableStore(state => state.sortPreviewMode);
    const updateCellElement = useTableStore(state => state.updateCellElement);
    const replaceCellElement = useTableStore(state => state.replaceCellElement);

    const searchTerm = useTableStore(state => state.searchTerm);
    const searchConfig = useTableStore(state => state.table.search);
    const isPro = isProAvailable();

    const shouldHighlight =
        isPro &&
        searchConfig?.enabled &&
        searchConfig?.highlightColor &&
        searchTerm.trim();

    const paddingValue = sidesToShorthand(padding);
    const marginValue = sidesToShorthand(margin);

    const textStyle: Record<string, string | undefined | number> = {
        "margin": marginValue ?? 0,
        "padding": paddingValue,
        "color": textColor || undefined,
        "fontSize": fontSize || undefined,
        "backgroundColor": backgroundColor || undefined,
        "--tableberg-text-link-color": linkColor || undefined,
    };

    const richTextStyle: Record<string, string | undefined> = {
        "margin": marginValue,
        "padding": paddingValue,
        "color": textColor || undefined,
        "fontSize": fontSize || undefined,
        "backgroundColor": backgroundColor || undefined,
        "--tableberg-text-link-color": linkColor || undefined,
    };

    const elementClassName = `tableberg-text-element${
        dynamicBindingEnabled ? " tableberg-dynamic-content" : ""
    }`;

    if (isDynamicLoading) {
        return (
            <p className={elementClassName} style={textStyle}>
                {__("Loading...", "tableberg")}
            </p>
        );
    }

    if (shouldHighlight) {
        return (
            <p className={elementClassName} style={textStyle}>
                <HighlightedText
                    content={content}
                    searchTerm={searchTerm}
                    highlightColor={searchConfig!.highlightColor}
                />
            </p>
        );
    }

    if (sortPreviewMode || dynamicBindingEnabled) {
        return (
            <RichText.Content
                tagName="p"
                className={elementClassName}
                value={content}
                style={textStyle}
            />
        );
    }

    return (
        <RichText
            className={elementClassName}
            placeholder={"Type here"}
            value={content}
            onChange={content =>
                updateCellElement(cellCoords, elementIndex, {
                    attributes: { content },
                })
            }
            autocompleters={[cellChildAutoCompleter]}
            style={richTextStyle}
            onReplace={(replacement: any[]) => {
                const first = replacement?.[0];

                // The "/" autocompleter sends a single element-name string.
                if (typeof first === "string") {
                    const newElement = createElement(
                        first as CellElement["name"]
                    );
                    if (newElement) {
                        replaceCellElement(
                            cellCoords,
                            elementIndex,
                            newElement
                        );
                    }
                    return;
                }

                // Otherwise this is pasted block content: flatten to text.
                const text = pastedBlocksToPlainText(replacement);
                if (text) {
                    updateCellElement(cellCoords, elementIndex, {
                        attributes: { content: text },
                    });
                }
            }}
        />
    );
}

export const textBindableAttributes: BindableAttribute[] = [
    {
        path: "content",
        label: __("Content", "tableberg"),
    },
    {
        path: "styles.textColor",
        label: __("Text Color", "tableberg"),
    },
    {
        path: "styles.linkColor",
        label: __("Link Color", "tableberg"),
    },
    {
        path: "styles.backgroundColor",
        label: __("Background Color", "tableberg"),
    },
    {
        path: "styles.fontSize",
        label: __("Font Size", "tableberg"),
    },
];

import { useRef, useState, useEffect, useMemo } from "react";
import {
    PlainText,
    store as blockEditorStore,
    transformStyles,
} from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";
import { mergeAttrsWithDefaultsAndApplyBindings } from "@tableberg/shared/utils/merge-attrs-with-defaults-and-apply-bindings";

import { useTableStore } from "../../store";
import { useClickOutside } from "../../hooks/useClickOutside";
import { ElementRendererProps } from "../index";
import { CustomHtmlElementControls } from "./controls";
import { BindableAttribute, ElementBindings } from "../../dynamic-data/types";
import { useDynamicDataBindings } from "../../dynamic-data/hooks/useDynamicData";
import { useSelect } from "@wordpress/data";
import {
    elementAlignmentToJustifyContent,
    ElementAlignment,
} from "../../alignment";

const DEFAULT_STYLES = `
    html,body,:root {
        margin: 0 !important;
        padding: 0 !important;
        overflow: visible !important;
        min-height: auto !important;
    }
`;

export interface CustomHtmlElementAttributes {
    content: string;
    align: ElementAlignment;
}

export const customHtmlAttrDefaults: CustomHtmlElementAttributes = {
    content: "",
    align: "left",
};

export interface CustomHtmlElementType {
    name: "custom-html";
    attributes: CustomHtmlElementAttributes;
    bindings?: ElementBindings;
}

export function CustomHtmlElement({
    attributes,
    bindings,
    cellCoords,
    elementIndex,
}: ElementRendererProps<CustomHtmlElementAttributes>) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const sortPreviewMode = useTableStore(state => state.sortPreviewMode);
    const isElementSelected = useTableStore(state => state.isElementSelected);
    const setSelectedElement = useTableStore(state => state.setSelectedElement);
    const clearSelectedElement = useTableStore(
        state => state.clearSelectedElement
    );
    const updateCellElement = useTableStore(state => state.updateCellElement);

    const isSelected = isElementSelected(cellCoords, elementIndex);
    const [isPreview, setIsPreview] = useState(false);

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
        customHtmlAttrDefaults,
        bindings,
        previewValues,
        __("(No data)", "tableberg")
    );

    const contentIsBound = !!bindings?.content;
    const { content, align } = mergedAttrs;

    const wrapperStyle: React.CSSProperties = {
        display: "flex",
        justifyContent: elementAlignmentToJustifyContent(align),
    };

    useEffect(() => {
        if (contentIsBound) {
            setIsPreview(true);
        }
    }, [contentIsBound]);

    const settingStyles = useSelect(
        select => (select(blockEditorStore) as any).getSettings()?.styles || [],
        []
    );

    const styles = useMemo(
        () =>
            [
                DEFAULT_STYLES,
                ...transformStyles(
                    settingStyles.filter((style: any) => style.css)
                ),
            ].join(""),
        [settingStyles]
    );

    const renderIframeContent = () => {
        const iframe = iframeRef.current;
        if (!iframe) {
            return;
        }
        const iframeDocument = iframe.contentWindow?.document;
        if (!iframeDocument) {
            return;
        }

        iframeDocument.head.innerHTML = `<style>${styles}</style>`;
        iframeDocument.body.innerHTML = content
            ? `<div
                style="width: max-content; overflow: hidden;"
                class="tableberg-html-content editor-styles-wrapper"
            >
                ${content}
            </div>`
            : `<div
                style="width: max-content; overflow: hidden; color: grey; padding: 8px;"
                class="tableberg-html-content editor-styles-wrapper"
            >
                ${__("Empty custom HTML block", "tableberg")}
            </div>`;

        const contentEl = iframeDocument.querySelector(
            ".tableberg-html-content"
        );
        if (contentEl) {
            const contentRect = contentEl.getBoundingClientRect();
            iframe.style.height = `${Math.ceil(contentRect.height) + 1}px`;
            iframe.style.width = `${Math.ceil(contentRect.width) + 1}px`;
        }
    };

    useEffect(() => {
        renderIframeContent();
    }, [styles, isPreview, content, isSelected]);

    const handleClick = () => {
        if (!sortPreviewMode) {
            setSelectedElement(cellCoords, elementIndex);
        }
    };

    const handleContentChange = (newContent: string) => {
        updateCellElement(cellCoords, elementIndex, {
            attributes: { content: newContent },
        });
    };

    if (isDynamicLoading) {
        return (
            <div
                ref={wrapperRef}
                className="tableberg-custom-html"
                style={wrapperStyle}
                onClick={handleClick}
            >
                <p style={{ margin: 0 }}>{__("Loading...", "tableberg")}</p>
            </div>
        );
    }

    const shouldShowPreview = sortPreviewMode || contentIsBound || isPreview;

    return (
        <>
            {isSelected && (
                <CustomHtmlElementControls
                    attributes={mergedAttrs}
                    bindings={bindings}
                    isPreview={isPreview}
                    setIsPreview={setIsPreview}
                    cellCoords={cellCoords}
                    elementIndex={elementIndex}
                />
            )}
            <div
                ref={wrapperRef}
                className="tableberg-custom-html"
                onClick={handleClick}
            >
                {shouldShowPreview ? (
                    <iframe
                        ref={iframeRef}
                        title={__("Custom HTML Preview", "tableberg")}
                        tabIndex={-1}
                        sandbox="allow-same-origin"
                        onLoad={renderIframeContent}
                        style={{
                            display: "block",
                            border: "none",
                            minWidth: "100px",
                            minHeight: "20px",
                            pointerEvents: "none",
                        }}
                    />
                ) : (
                    <PlainText
                        className="tableberg-custom-html-editor"
                        value={content}
                        onChange={handleContentChange}
                        placeholder={__("Write HTML...", "tableberg")}
                        aria-label={__("HTML", "tableberg")}
                    />
                )}
            </div>
        </>
    );
}

export const customHtmlBindableAttributes: BindableAttribute[] = [
    {
        path: "content",
        label: __("HTML Content", "tableberg"),
    },
];

import { useRef, useCallback, useState } from "react";
import { RichText, BlockControls } from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";
import { mergeAttrsWithDefaultsAndApplyBindings } from "@tableberg/shared/utils/merge-attrs-with-defaults-and-apply-bindings";
import { ToolbarButton } from "@wordpress/components";
import { formatIndent, formatOutdent } from "@wordpress/icons";
import { ToolbarWithDropdown } from "@tableberg/components";

import { useTableStore } from "../../store";
import { useClickOutside } from "../../hooks/useClickOutside";
import { ElementRendererProps } from "../../elements";
import { BindableAttribute, ElementBindings } from "../../dynamic-data/types";
import { useDynamicDataBindings } from "../../dynamic-data/hooks/useDynamicData";
import { ListElementControls } from "./controls";
import { ElementDeleteButton } from "../../components/ElementDeleteButton";
import { ElementOptionsBlockControls } from "../../components/ElementOptionsButton";
import { useBlockCardUpdateShim } from "../../hooks/block-editor-compat";
import { isProAvailable } from "../../pro-status";
import {
    elementAlignmentToJustifyContent,
    ElementAlignment,
} from "../../alignment";

export interface ListItemAttributes {
    content: string;
    indentLevel: number;
}

interface ListItemNode {
    item: ListItemAttributes;
    index: number;
    children: ListItemNode[];
}

function buildListTree(items: ListItemAttributes[]): ListItemNode[] {
    const root: ListItemNode[] = [];
    const stack: { node: ListItemNode; level: number }[] = [];

    items.forEach((item, index) => {
        const node: ListItemNode = { item, index, children: [] };
        const level = item.indentLevel;

        while (stack.length > 0 && stack[stack.length - 1].level >= level) {
            stack.pop();
        }

        if (stack.length === 0) {
            root.push(node);
        } else {
            stack[stack.length - 1].node.children.push(node);
        }

        stack.push({ node, level });
    });

    return root;
}

export interface ListElementAttributes {
    align: ElementAlignment;
    items: ListItemAttributes[];
    listType: "basic" | "styled";
    listStyle: "disc" | "circle" | "square" | "decimal" | "none";
    /** Pro-owned: preserved by free's schema, but free never writes it. */
    icon?: {
        iconName: string;
        svg?: {
            viewBox: string;
            path: string;
        };
    } | null;
    styles: {
        itemSpacing: string;
        iconColor: string;
        iconSize: string;
        iconSpacing: string;
        iconTopSpacing: string;
        fontSize: string;
        textColor: string;
        linkColor: string;
        backgroundColor: string;
    };
}

export const listAttrDefaults: ListElementAttributes = {
    align: "left",
    items: [{ content: "", indentLevel: 0 }],
    listType: "basic",
    listStyle: "disc",
    styles: {
        itemSpacing: "0",
        iconColor: "#000000",
        iconSize: "15px",
        iconSpacing: "var(--wp--preset--spacing--20)",
        iconTopSpacing: "0px",
        fontSize: "1.38rem",
        textColor: "#000000",
        linkColor: "",
        backgroundColor: "",
    },
};

export interface ListElementType {
    name: "list";
    attributes: ListElementAttributes;
    bindings?: ElementBindings;
}

export function ListElement({
    attributes: initialAttributes,
    bindings,
    cellCoords,
    elementIndex,
    forcedListType,
    allowListTypeSwitch = true,
    // Injected by the pro plugin; null when pro is not installed.
    ProListItemIcon = null,
    ProListIconSettings = null,
}: ElementRendererProps<ListElementAttributes> & {
    forcedListType?: "basic" | "styled";
    allowListTypeSwitch?: boolean;
    ProListItemIcon?: React.ReactNode;
    ProListIconSettings?: React.ReactNode;
}) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const richTextRefs = useRef<(HTMLSpanElement | null)[]>([]);
    const [focusedItemIndex, setFocusedItemIndex] = useState(0);

    const sortPreviewMode = useTableStore(state => state.sortPreviewMode);
    const isElementSelected = useTableStore(state => state.isElementSelected);
    const setSelectedElement = useTableStore(state => state.setSelectedElement);
    const clearSelectedElement = useTableStore(
        state => state.clearSelectedElement
    );
    const updateBlockCard = useBlockCardUpdateShim();
    const isPro = isProAvailable();

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

    const listAttributes = mergeAttrsWithDefaultsAndApplyBindings(
        initialAttributes,
        listAttrDefaults,
        bindings,
        previewValues,
        __("(No data)", "tableberg")
    );

    const updateCellElement = useTableStore(state => state.updateCellElement);

    // A styled list without a licence is shown as a basic one, but only for
    // display — the saved listType is left alone, the same way ListRenderer
    // downgrades at render time without touching the data. Rewriting it here
    // would quietly discard the styling of a list made while pro was active.
    const effectiveListAttributes = forcedListType
        ? { ...listAttributes, listType: forcedListType }
        : !isPro && listAttributes.listType === "styled"
          ? { ...listAttributes, listType: "basic" as const }
          : listAttributes;

    const itemRefs = richTextRefs.current;

    const updateItems = useCallback(
        (newItems: ListItemAttributes[], focusIndex?: number) => {
            updateCellElement(cellCoords, elementIndex, {
                attributes: { items: newItems },
            });
            if (focusIndex !== undefined) {
                setTimeout(() => {
                    const element = itemRefs[focusIndex];
                    if (element) {
                        element.focus();
                    }
                }, 0);
            }
        },
        [cellCoords, elementIndex, updateCellElement, itemRefs]
    );

    const addItem = useCallback(
        (insertAtIndex?: number, inheritIndentFrom?: number) => {
            const indentLevel =
                inheritIndentFrom !== undefined
                    ? (effectiveListAttributes.items[inheritIndentFrom]
                          ?.indentLevel ?? 0)
                    : 0;
            const insertIdx =
                insertAtIndex ?? effectiveListAttributes.items.length;
            const newItems = [
                ...effectiveListAttributes.items.slice(0, insertIdx),
                { content: "", indentLevel },
                ...effectiveListAttributes.items.slice(insertIdx),
            ];
            updateItems(newItems, insertIdx);
        },
        [effectiveListAttributes.items, updateItems]
    );

    const removeItem = useCallback(
        (index: number) => {
            if (effectiveListAttributes.items.length <= 1) {
                updateItems([{ content: "", indentLevel: 0 }], 0);
            } else {
                const newItems = effectiveListAttributes.items.filter(
                    (_, i) => i !== index
                );
                const focusIdx = index > 0 ? index - 1 : 0;
                updateItems(newItems, focusIdx);
            }
        },
        [effectiveListAttributes.items, updateItems]
    );

    const canIndent = useCallback(
        (index: number) => {
            if (index === 0) return false;
            const currentIndent =
                effectiveListAttributes.items[index]?.indentLevel ?? 0;
            const prevIndent =
                effectiveListAttributes.items[index - 1]?.indentLevel ?? 0;
            return currentIndent <= prevIndent;
        },
        [effectiveListAttributes.items]
    );

    const canOutdent = useCallback(
        (index: number) => {
            const currentIndent =
                effectiveListAttributes.items[index]?.indentLevel ?? 0;
            return currentIndent > 0;
        },
        [effectiveListAttributes.items]
    );

    const indentItem = useCallback(
        (index: number) => {
            if (!canIndent(index)) return;
            const newItems = [...effectiveListAttributes.items];
            const currentIndent = newItems[index]?.indentLevel ?? 0;
            newItems[index] = {
                ...newItems[index],
                indentLevel: currentIndent + 1,
            };
            updateCellElement(cellCoords, elementIndex, {
                attributes: { items: newItems },
            });
            setTimeout(() => {
                itemRefs[index]?.focus();
            }, 0);
        },
        [
            effectiveListAttributes.items,
            cellCoords,
            elementIndex,
            updateCellElement,
            canIndent,
            itemRefs,
        ]
    );

    const outdentItem = useCallback(
        (index: number) => {
            if (!canOutdent(index)) return;
            const newItems = [...effectiveListAttributes.items];
            const currentIndent = newItems[index]?.indentLevel ?? 0;
            newItems[index] = {
                ...newItems[index],
                indentLevel: currentIndent - 1,
            };
            updateCellElement(cellCoords, elementIndex, {
                attributes: { items: newItems },
            });
            setTimeout(() => {
                itemRefs[index]?.focus();
            }, 0);
        },
        [
            effectiveListAttributes.items,
            cellCoords,
            elementIndex,
            updateCellElement,
            canOutdent,
            itemRefs,
        ]
    );

    const updateItemContent = useCallback(
        (index: number, content: string) => {
            const newItems = [...effectiveListAttributes.items];
            newItems[index] = { ...newItems[index], content };
            updateCellElement(cellCoords, elementIndex, {
                attributes: { items: newItems },
            });
        },
        [
            effectiveListAttributes.items,
            cellCoords,
            elementIndex,
            updateCellElement,
        ]
    );

    const handleItemKeyDown = useCallback(
        (index: number, event: React.KeyboardEvent<"span">) => {
            if (event.key === "Enter") {
                event.preventDefault();
                addItem(index + 1, index);
            }
            if (event.key === "Tab") {
                event.preventDefault();
                event.stopPropagation();
                if (event.shiftKey) {
                    outdentItem(index);
                } else {
                    indentItem(index);
                }
            }
            if (
                event.key === "Backspace" &&
                effectiveListAttributes.items[index].content === ""
            ) {
                event.preventDefault();
                if (canOutdent(index)) {
                    outdentItem(index);
                } else {
                    removeItem(index);
                }
            }
        },
        [
            addItem,
            indentItem,
            outdentItem,
            removeItem,
            canOutdent,
            effectiveListAttributes.items,
        ]
    );

    const styledListStyle: React.CSSProperties = {
        listStyleType: "none",
        margin: 0,
    };

    const iconSize = effectiveListAttributes.styles.iconSize || "15px";
    const itemFontSize = effectiveListAttributes.styles.fontSize || "1.38rem";
    const iconTopSpacing = effectiveListAttributes.styles.iconTopSpacing || "0px";
    // Auto-centers the icon against the first line of (possibly wrapped)
    // item text; iconTopSpacing is a manual nudge added on top for cases
    // the auto value doesn't quite cover (custom fonts/line-heights).
    const firstLineIconOffset = `calc(max(0px, (1.5 * ${itemFontSize} - ${iconSize}) / 2) + ${iconTopSpacing})`;

    const getItemStyle = (): React.CSSProperties => ({
        display: "flex",
        alignItems: "flex-start",
        gap: effectiveListAttributes.styles.iconSpacing,
        fontSize: effectiveListAttributes.styles.fontSize || undefined,
        lineHeight: 1.5,
        padding: "2px 0",
        margin: effectiveListAttributes.styles.itemSpacing
            ? `0 0 ${effectiveListAttributes.styles.itemSpacing} 0`
            : "0 0 2px 0",
    });

    const iconStyle: React.CSSProperties = {
        color: effectiveListAttributes.styles.iconColor || undefined,
        width: iconSize,
        height: iconSize,
        minWidth: iconSize,
        flex: "0 0 auto",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        lineHeight: 0,
        marginTop: firstLineIconOffset,
    };

    const decimalMarkerStyle: React.CSSProperties = {
        color: effectiveListAttributes.styles.iconColor || undefined,
        minWidth: "20px",
        flex: "0 0 auto",
        lineHeight: 1.5,
    };

    const textStyle: Record<string, string | number | undefined> = {
        "fontSize": effectiveListAttributes.styles.fontSize || undefined,
        "color": effectiveListAttributes.styles.textColor || undefined,
        "--tableberg-list-link-color":
            effectiveListAttributes.styles.linkColor || undefined,
        "backgroundColor":
            effectiveListAttributes.styles.backgroundColor || undefined,
        "padding": effectiveListAttributes.styles.backgroundColor
            ? "2px 8px"
            : undefined,
        "borderRadius": effectiveListAttributes.styles.backgroundColor
            ? "4px"
            : undefined,
    };

    // Icon markers are a pro feature: pro hands the <svg> down and free
    // draws nothing without it. The positioning wrapper below stays here
    // because the decimal marker shares its styles. Mirrors the PHP side,
    // where free asks through `tableberg/render_list_item_icon`.

    const renderListItemContent = (
        content: string,
        index: number,
        additionalStyle?: React.CSSProperties
    ) => {
        const combinedStyle = { ...textStyle, ...additionalStyle };

        if (sortPreviewMode) {
            return (
                <RichText.Content
                    tagName="span"
                    style={combinedStyle}
                    value={content}
                />
            );
        }

        return (
            <RichText
                ref={el => {
                    // @ts-expect-error
                    itemRefs[index] = el;
                }}
                tagName="span"
                style={combinedStyle}
                placeholder={__("List item", "tableberg")}
                value={content}
                onChange={newContent => updateItemContent(index, newContent)}
                onFocus={() => setFocusedItemIndex(index)}
                onKeyDownCapture={event => handleItemKeyDown(index, event)}
            />
        );
    };

    const ListTag =
        effectiveListAttributes.listStyle === "decimal" ? "ol" : "ul";

    const renderBasicListItems = (nodes: ListItemNode[]): React.ReactNode => {
        return nodes.map(node => (
            <li key={node.index}>
                {renderListItemContent(node.item.content, node.index)}
                {node.children.length > 0 && (
                    <ListTag style={{ margin: 0 }}>
                        {renderBasicListItems(node.children)}
                    </ListTag>
                )}
            </li>
        ));
    };

    const renderStyledListItems = (nodes: ListItemNode[]): React.ReactNode => {
        return nodes.map(node => (
            <li key={node.index}>
                <div style={getItemStyle()}>
                    {effectiveListAttributes.listStyle !== "decimal" &&
                        ProListItemIcon && (
                            <span style={iconStyle}>{ProListItemIcon}</span>
                    )}
                    {effectiveListAttributes.listStyle === "decimal" && (
                        <span style={decimalMarkerStyle}>{node.index + 1}.</span>
                    )}
                    {renderListItemContent(node.item.content, node.index, {
                        flex: 1,
                    })}
                </div>
                {node.children.length > 0 && (
                    <ListTag style={{ ...styledListStyle, marginTop: "4px" }}>
                        {renderStyledListItems(node.children)}
                    </ListTag>
                )}
            </li>
        ));
    };

    const listTree = buildListTree(effectiveListAttributes.items);
    const wrapperStyle: React.CSSProperties = {
        display: "flex",
        justifyContent: elementAlignmentToJustifyContent(
            effectiveListAttributes.align
        ),
    };

    return (
        <>
            {isSelected && (
                <>
                    <BlockControls>
                        <ToolbarWithDropdown
                            title={__("Align list", "tableberg")}
                            value={effectiveListAttributes.align}
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
                        <ToolbarButton
                            icon={formatOutdent}
                            label={__("Outdent", "tableberg")}
                            onClick={() => outdentItem(focusedItemIndex)}
                            disabled={!canOutdent(focusedItemIndex)}
                        />
                        <ToolbarButton
                            icon={formatIndent}
                            label={__("Indent", "tableberg")}
                            onClick={() => indentItem(focusedItemIndex)}
                            disabled={!canIndent(focusedItemIndex)}
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
                    <ListElementControls
                        attributes={effectiveListAttributes}
                        bindings={bindings}
                        cellCoords={cellCoords}
                        elementIndex={elementIndex}
                        allowListTypeSwitch={allowListTypeSwitch}
                        ProListIconSettings={ProListIconSettings}
                    />
                </>
            )}
            <div
                ref={wrapperRef}
                className="tableberg-list"
                style={wrapperStyle}
                onClick={e => {
                    e.stopPropagation();
                    if (!sortPreviewMode) {
                        setSelectedElement(cellCoords, elementIndex);
                        if (wrapperRef.current) {
                            updateBlockCard(
                                wrapperRef.current,
                                "List",
                                "A list element within a Tableberg cell"
                            );
                        }
                    }
                }}
            >
                {isDynamicLoading ? (
                    <p style={{ margin: 0 }}>{__("Loading...", "tableberg")}</p>
                ) : effectiveListAttributes.listType === "basic" ? (
                    <ListTag
                        style={{
                            margin: 0,
                            paddingLeft: "20px",
                        }}
                    >
                        {renderBasicListItems(listTree)}
                    </ListTag>
                ) : (
                    <ListTag style={{ ...styledListStyle, paddingLeft: 0 }}>
                        {renderStyledListItems(listTree)}
                    </ListTag>
                )}
            </div>
        </>
    );
}

export const listBindableAttributes: BindableAttribute[] = [
    {
        path: "styles.iconColor",
        label: __("Icon Color", "tableberg"),
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

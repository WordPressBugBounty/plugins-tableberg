import {
    BlockSettingsMenuControls,
    RichText,
    useBlockProps,
} from "@wordpress/block-editor";
import { MenuItem } from "@wordpress/components";
import {
    BlockEditProps,
    createBlock,
    parse,
    registerBlockType,
} from "@wordpress/blocks";
import { __ } from "@wordpress/i18n";
import { paragraph } from "@wordpress/icons";
import { mergeAttrsWithDefaultsAndApplyBindings } from "@tableberg/shared/utils/merge-attrs-with-defaults-and-apply-bindings";

import {
    TextElementAttributes,
    sidesToShorthand,
    textAttributeDefaults,
} from "./element";
import metadata from "./block.json";
import { TextElementControls } from "./controls";
import { ElementBindings } from "../../dynamic-data/types";
import { CellElement } from "../../attributes";
import {
    applyElementStyleClipboardPayload,
    parseElementStyleClipboardPayload,
    readClipboardText,
    serializeElementStyleClipboardPayload,
    writeClipboardText,
} from "../../hooks/block-editor-compat/elementClipboard";
import {
    ElementAlignmentToolbar,
    alignmentWrapperStyle,
} from "../element-edit-common";

function TextEdit({
    attributes,
    setAttributes,
    isSelected,
    onReplace,
    onRemove,
    insertBlocksAfter,
    clientId,
}: BlockEditProps<TextElementAttributes> & {
    onReplace?: (blocks: unknown[]) => void;
    onRemove?: () => void;
    insertBlocksAfter?: (blocks: unknown[]) => void;
}) {
    const merged = mergeAttrsWithDefaultsAndApplyBindings(
        attributes,
        textAttributeDefaults,
        undefined,
        {},
        __("(No data)", "tableberg")
    );
    const { content, align, styles } = merged;

    const textElement = {
        name: "text",
        attributes: merged,
    } as CellElement;

    const pasteStyles = async () => {
        const payload = parseElementStyleClipboardPayload(
            await readClipboardText()
        );
        if (!payload) {
            return;
        }

        const styledElement = applyElementStyleClipboardPayload(
            textElement,
            payload
        );
        const styledAttributes =
            styledElement.attributes as TextElementAttributes;

        setAttributes({
            align: styledAttributes.align,
            styles: styledAttributes.styles,
        });
    };

    const blockProps = useBlockProps({
        style: alignmentWrapperStyle(align),
    });

    const paddingValue = sidesToShorthand(styles.padding);
    const marginValue = sidesToShorthand(styles.margin);

    const textStyle: Record<string, string | number | undefined> = {
        "margin": marginValue ?? 0,
        "padding": paddingValue,
        "color": styles.textColor || undefined,
        "fontSize": styles.fontSize || undefined,
        "backgroundColor": styles.backgroundColor || undefined,
        "--tableberg-text-link-color": styles.linkColor || undefined,
    };

    // Pasting a copied tableberg element while the caret is inside this text
    // block: RichText would inline the markup as plain text, so route it to
    // real block insertion instead (empty text gets replaced, otherwise the
    // blocks land right below).
    const onPasteCapture = (event: React.ClipboardEvent) => {
        const plain = event.clipboardData?.getData("text/plain") ?? "";
        if (!plain.includes("<!-- wp:tableberg/")) {
            return;
        }

        const blocks = parse(plain);
        if (blocks.length === 0 || blocks.some(b => !b.name)) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();

        if (!content && onReplace) {
            onReplace(blocks);
        } else if (insertBlocksAfter) {
            insertBlocksAfter(blocks);
        }
    };

    return (
        <div {...blockProps} onPasteCapture={onPasteCapture}>
            {isSelected && (
                <>
                    <ElementAlignmentToolbar
                        align={align}
                        onChange={newAlign =>
                            setAttributes({ align: newAlign })
                        }
                    />
                    <BlockSettingsMenuControls>
                        {({ onClose }: { onClose: () => void }) => (
                            <>
                                <MenuItem
                                    onClick={() => {
                                        void writeClipboardText(
                                            serializeElementStyleClipboardPayload(
                                                textElement
                                            )
                                        );
                                        onClose();
                                    }}
                                >
                                    {__("Copy styles", "tableberg")}
                                </MenuItem>
                                <MenuItem
                                    onClick={() => {
                                        void pasteStyles();
                                        onClose();
                                    }}
                                >
                                    {__("Paste styles", "tableberg")}
                                </MenuItem>
                            </>
                        )}
                    </BlockSettingsMenuControls>
                </>
            )}
            {isSelected && (
                <TextElementControls
                    attributes={merged}
                    bindings={
                        (attributes as { bindings?: ElementBindings }).bindings
                    }
                    updateStyles={newStyles =>
                        setAttributes({
                            styles: {
                                ...(attributes.styles ?? merged.styles),
                                ...newStyles,
                            },
                        })
                    }
                />
            )}
            <RichText
                tagName="p"
                className="tableberg-text-element"
                identifier="content"
                allowedFormats={[
                    "core/bold",
                    "core/italic",
                    "core/link",
                    "core/strikethrough",
                    "core/underline",
                ]}
                placeholder={__("Type here", "tableberg")}
                value={content}
                onChange={newContent =>
                    setAttributes({ content: newContent })
                }
                // Behave like core/paragraph: Enter splits into a new text
                // block; together with the slash-inserter support this makes
                // cells feel like the native canvas.
                onSplit={(value: string, isOriginal?: boolean) => {
                    let newBlock;
                    if (isOriginal || value) {
                        newBlock = createBlock("tableberg/text", {
                            ...attributes,
                            content: value,
                        });
                    } else {
                        newBlock = createBlock("tableberg/text", {
                            ...attributes,
                            content: "",
                        });
                    }
                    if (isOriginal) {
                        (newBlock as { clientId: string }).clientId = clientId;
                    }
                    return newBlock;
                }}
                onReplace={onReplace}
                onRemove={onRemove}
                style={textStyle}
            />
        </div>
    );
}

export function registerTextBlock() {
    registerBlockType(metadata.name, {
        ...(metadata as any),
        icon: paragraph,
        edit: TextEdit,
        save: () => null,
    });
}

import { CSSProperties, useState } from "react";
import { MediaPlaceholder, useBlockProps } from "@wordpress/block-editor";
import { BlockEditProps, registerBlockType } from "@wordpress/blocks";
import { __ } from "@wordpress/i18n";
import { mergeAttrsWithDefaultsAndApplyBindings } from "@tableberg/shared/utils/merge-attrs-with-defaults-and-apply-bindings";
import imageIcon from "@tableberg/shared/icons/image";

import { ImageElementAttributes, imageAttrDefaults } from "./element";
import metadata from "./block.json";
import { ImageElementControls } from "./controls";
import { ElementBindings } from "../../dynamic-data/types";
import {
    ElementAlignmentToolbar,
    NO_COORDS,
    alignmentWrapperStyle,
} from "../element-edit-common";

function ImageEdit({
    attributes,
    setAttributes,
    isSelected,
}: BlockEditProps<ImageElementAttributes>) {
    const merged = mergeAttrsWithDefaultsAndApplyBindings(
        attributes,
        imageAttrDefaults,
        undefined,
        {},
        __("(No data)", "tableberg")
    );
    const { media, alt, align, width, height, aspectRatio, scale } = merged;
    const { border, borderRadius } = merged;
    const [showCaption, setShowCaption] = useState(!!merged.caption);

    const blockProps = useBlockProps({
        style: alignmentWrapperStyle(align),
    });

    const controls = isSelected && media?.url && (
        <ImageElementControls
            attributes={merged}
            bindings={(attributes as { bindings?: ElementBindings }).bindings}
            showCaption={showCaption}
            setShowCaption={setShowCaption}
            cellCoords={NO_COORDS}
            elementIndex={0}
            updateAttrs={attrs => setAttributes(attrs)}
        />
    );

    if (!media?.url) {
        return (
            <div {...blockProps}>
                <MediaPlaceholder
                    icon="format-image"
                    labels={{ title: __("Image", "tableberg") }}
                    accept="image/*"
                    allowedTypes={["image"]}
                    onSelect={selected =>
                        setAttributes({
                            media: { id: selected.id, url: selected.url },
                            alt: selected.alt ?? "",
                        })
                    }
                />
            </div>
        );
    }

    return (
        <div {...blockProps}>
            {isSelected && (
                <ElementAlignmentToolbar
                    align={align}
                    onChange={newAlign => setAttributes({ align: newAlign })}
                />
            )}
            {controls}
            <img
                src={media.url}
                alt={alt}
                style={{
                    // An empty width falls back to the default like the PHP
                    // renderer does (the merge helper keeps ""), and never
                    // lets a large image push its column wider than the cell.
                    width: width || imageAttrDefaults.width,
                    maxWidth: "100%",
                    height: height || undefined,
                    aspectRatio: aspectRatio || undefined,
                    objectFit: scale as CSSProperties["objectFit"],
                    borderTop: border?.top || undefined,
                    borderRight: border?.right || undefined,
                    borderBottom: border?.bottom || undefined,
                    borderLeft: border?.left || undefined,
                    borderTopLeftRadius: borderRadius?.topLeft || undefined,
                    borderTopRightRadius: borderRadius?.topRight || undefined,
                    borderBottomRightRadius:
                        borderRadius?.bottomRight || undefined,
                    borderBottomLeftRadius:
                        borderRadius?.bottomLeft || undefined,
                }}
            />
        </div>
    );
}

export function registerImageBlock() {
    registerBlockType(metadata.name, {
        ...(metadata as any),
        icon: imageIcon,
        edit: ImageEdit,
        save: () => null,
    });
}

import { useRef, useState, useEffect } from "react";
import {
    RichText,
    MediaUpload,
    MediaUploadCheck,
} from "@wordpress/block-editor";
import { Button, Placeholder, ResizableBox } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { image as imageIcon } from "@wordpress/icons";
import { mergeAttrsWithDefaultsAndApplyBindings } from "@tableberg/shared/utils/merge-attrs-with-defaults-and-apply-bindings";

import { useTableStore } from "../../store";
import { useClickOutside } from "../../hooks/useClickOutside";
import { ElementRendererProps } from "../../elements";
import { ImageElementControls } from "./controls";
import { BindableAttribute, ElementBindings } from "../../dynamic-data/types";
import { useDynamicDataBindings } from "../../dynamic-data/hooks/useDynamicData";
import { useBlockCardUpdateShim } from "../../hooks/block-editor-compat";

interface MediaSize {
    height: number;
    width: number;
    url: string;
    orientation?: string;
}

export interface MediaSizes {
    thumbnail?: MediaSize;
    medium?: MediaSize;
    large?: MediaSize;
    full?: MediaSize;
    [key: string]: MediaSize | undefined;
}

export interface MediaObject {
    id?: number;
    url?: string;
    alt?: string;
    title?: string;
    sizes?: MediaSizes;
}

export interface ImageElementAttributes {
    media: MediaObject;
    height: string;
    width: string;
    alt: string;
    align: "left" | "center" | "right";
    aspectRatio: string;
    scale: string;
    sizeSlug: string;
    caption: string;
    href: string;
    linkTarget: string;
    lightbox: {
        enabled: boolean;
    };
    border: {
        top: string;
        right: string;
        bottom: string;
        left: string;
    };
    borderRadius: {
        topLeft: string;
        topRight: string;
        bottomLeft: string;
        bottomRight: string;
    };
}

export const imageAttrDefaults: ImageElementAttributes = {
    media: {},
    height: "",
    width: "150px",
    alt: "",
    align: "left",
    aspectRatio: "",
    scale: "cover",
    sizeSlug: "large",
    caption: "",
    href: "",
    linkTarget: "_self",
    lightbox: {
        enabled: false,
    },
    border: {
        top: "",
        right: "",
        bottom: "",
        left: "",
    },
    borderRadius: {
        topLeft: "",
        topRight: "",
        bottomLeft: "",
        bottomRight: "",
    },
};

export interface ImageElementType {
    name: "image";
    attributes: ImageElementAttributes;
    bindings?: ElementBindings;
}

export function ImageElement({
    attributes,
    bindings,
    cellCoords,
    elementIndex,
}: ElementRendererProps<ImageElementAttributes>) {
    const wrapperRef = useRef<HTMLDivElement>(null);
    const imageRef = useRef<HTMLImageElement>(null);

    const sortPreviewMode = useTableStore(state => state.sortPreviewMode);
    const isElementSelected = useTableStore(state => state.isElementSelected);
    const setSelectedElement = useTableStore(state => state.setSelectedElement);
    const clearSelectedElement = useTableStore(
        state => state.clearSelectedElement
    );
    const updateCellElement = useTableStore(state => state.updateCellElement);
    const updateBlockCard = useBlockCardUpdateShim();

    const isSelected = isElementSelected(cellCoords, elementIndex);

    const [showCaption, setShowCaption] = useState(!!attributes.caption);

    useClickOutside({
        ref: wrapperRef,
        onClickOutside: () => {
            if (isSelected) {
                clearSelectedElement();
            }
        },
    });

    const { values: previewValues } = useDynamicDataBindings(bindings);

    const mergedAttrs = mergeAttrsWithDefaultsAndApplyBindings(
        attributes,
        imageAttrDefaults,
        bindings,
        previewValues,
        __("(No data)", "tableberg")
    ) as ImageElementAttributes;

    const {
        media,
        height,
        width,
        alt,
        aspectRatio,
        scale,
        sizeSlug,
        caption,
        href,
        linkTarget,
        border,
        borderRadius,
    } = mergedAttrs;

    const hasImage = !!media.url || !!media.id;

    // Get image URL based on size slug
    const getImageUrl = () => {
        if (media.sizes && media.sizes[sizeSlug]) {
            return media.sizes[sizeSlug]!.url;
        }
        return media.url || "";
    };

    const imageSrc = getImageUrl();

    const onSelectMedia = (newMedia: any) => {
        if (!newMedia || !newMedia.url) {
            updateCellElement(cellCoords, elementIndex, {
                attributes: { media: {} },
            });
            return;
        }

        updateCellElement(cellCoords, elementIndex, {
            attributes: {
                media: {
                    id: newMedia.id,
                    url: newMedia.url,
                    alt: newMedia.alt || "",
                    title: newMedia.title || "",
                    sizes: newMedia.sizes || {},
                },
                alt: newMedia.alt || "",
            },
        });
    };

    const [naturalDimensions, setNaturalDimensions] = useState<{
        width: number;
        height: number;
    } | null>(null);

    useEffect(() => {
        if (imageRef.current?.complete && imageRef.current.naturalWidth) {
            setNaturalDimensions({
                width: imageRef.current.naturalWidth,
                height: imageRef.current.naturalHeight,
            });
        }
    }, [imageSrc]);

    const handleImageLoad = () => {
        if (imageRef.current) {
            setNaturalDimensions({
                width: imageRef.current.naturalWidth,
                height: imageRef.current.naturalHeight,
            });
        }
    };

    const getAspectRatio = () => {
        if (aspectRatio) {
            return aspectRatio;
        }
        if (naturalDimensions) {
            return `${naturalDimensions.width}/${naturalDimensions.height}`;
        }
        return undefined;
    };

    const handleResize = (_event: any, direction: string, elt: HTMLElement) => {
        let ratio = 1;
        const currentAspectRatio =
            aspectRatio ||
            (naturalDimensions
                ? `${naturalDimensions.width}/${naturalDimensions.height}`
                : "1/1");

        const parts = currentAspectRatio.split("/");
        if (parts.length === 2) {
            ratio = parseInt(parts[0]) / parseInt(parts[1]);
        } else if (currentAspectRatio === "1") {
            ratio = 1;
        }

        let w = elt.offsetWidth;
        let h = elt.offsetHeight;

        if (direction === "bottom") {
            w = h * ratio;
        } else {
            h = w / ratio;
        }

        updateCellElement(cellCoords, elementIndex, {
            attributes: {
                width: `${Math.round(w)}px`,
                height: `${Math.round(h)}px`,
            },
        });
    };

    const imageStyle: React.CSSProperties = {
        aspectRatio: getAspectRatio(),
        objectFit: scale as React.CSSProperties["objectFit"],
        width: width || "100%",
        height: height || "auto",
        borderTopLeftRadius: borderRadius.topLeft,
        borderTopRightRadius: borderRadius.topRight,
        borderBottomLeftRadius: borderRadius.bottomLeft,
        borderBottomRightRadius: borderRadius.bottomRight,
        borderTop: border.top,
        borderRight: border.right,
        borderBottom: border.bottom,
        borderLeft: border.left,
        display: "block",
    };

    const renderImage = () => {
        const img = (
            <img
                ref={imageRef}
                src={imageSrc}
                alt={alt || media.alt || ""}
                style={imageStyle}
                onLoad={handleImageLoad}
            />
        );

        if (href && !isSelected) {
            return (
                <a
                    href={href}
                    target={linkTarget}
                    rel={
                        linkTarget === "_blank"
                            ? "noopener noreferrer"
                            : undefined
                    }
                    onClick={e => e.preventDefault()}
                >
                    {img}
                </a>
            );
        }

        return img;
    };

    return (
        <>
            {isSelected && (
                <ImageElementControls
                    attributes={mergedAttrs}
                    bindings={bindings}
                    showCaption={showCaption}
                    setShowCaption={setShowCaption}
                    cellCoords={cellCoords}
                    elementIndex={elementIndex}
                />
            )}
            <figure
                ref={wrapperRef}
                className="tableberg-image-element"
                style={{ margin: 0, lineHeight: 1 }}
                onClick={e => {
                    e.stopPropagation();
                    if (!sortPreviewMode) {
                        setSelectedElement(cellCoords, elementIndex);
                        if (wrapperRef.current) {
                            updateBlockCard(
                                wrapperRef.current,
                                "Image",
                                "An image element within a Tableberg cell"
                            );
                        }
                    }
                }}
            >
                {hasImage ? (
                    <>
                        {isSelected ? (
                            <ResizableBox
                                size={{
                                    width: width || "auto",
                                    height: height || "auto",
                                }}
                                showHandle={isSelected}
                                minWidth={50}
                                minHeight={50}
                                maxWidth={720}
                                enable={{
                                    top: false,
                                    right: true,
                                    bottom: true,
                                    left: false,
                                }}
                                onResize={handleResize}
                            >
                                {renderImage()}
                            </ResizableBox>
                        ) : (
                            renderImage()
                        )}
                        {showCaption && (isSelected || caption) && (
                            <RichText
                                tagName="figcaption"
                                className="tableberg-image-caption"
                                aria-label={__(
                                    "Image caption text",
                                    "tableberg"
                                )}
                                placeholder={__("Add caption", "tableberg")}
                                value={caption}
                                onChange={(value: string) =>
                                    updateCellElement(
                                        cellCoords,
                                        elementIndex,
                                        {
                                            attributes: { caption: value },
                                        }
                                    )
                                }
                                style={{
                                    marginTop: "0.5em",
                                    marginBottom: "1em",
                                    textAlign: "center",
                                    fontSize: "0.875em",
                                    color: "#666",
                                }}
                            />
                        )}
                    </>
                ) : (
                    <MediaUploadCheck>
                        <MediaUpload
                            onSelect={onSelectMedia}
                            allowedTypes={["image"]}
                            value={media.id}
                            render={({ open }) => (
                                <Placeholder
                                    className="tableberg-image-placeholder"
                                    icon={imageIcon}
                                    label={__("Image", "tableberg")}
                                    instructions={__(
                                        "Upload an image or pick one from your media library.",
                                        "tableberg"
                                    )}
                                >
                                    <Button variant="secondary" onClick={open}>
                                        {__("Media Library", "tableberg")}
                                    </Button>
                                </Placeholder>
                            )}
                        />
                    </MediaUploadCheck>
                )}
            </figure>
        </>
    );
}

export const imageBindableAttributes: BindableAttribute[] = [
    {
        path: "media.url",
        label: __("Image URL", "tableberg"),
    },
    {
        path: "alt",
        label: __("Alt Text", "tableberg"),
    },
    {
        path: "href",
        label: __("Link URL", "tableberg"),
    },
    {
        path: "caption",
        label: __("Caption", "tableberg"),
    },
];

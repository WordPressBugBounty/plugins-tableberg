import { useState, useMemo } from "react";
import {
    InspectorControls,
    BlockControls,
    MediaUpload,
    MediaUploadCheck,
    __experimentalLinkControl as LinkControl,
} from "@wordpress/block-editor";
import {
    Button,
    SelectControl,
    TextareaControl,
    ToolbarButton,
    ToolbarGroup,
    Popover,
    __experimentalToolsPanel as ToolsPanel,
    __experimentalToolsPanelItem as ToolsPanelItem,
    __experimentalUnitControl as UnitControl,
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import {
    alignNone,
    caption as captionIcon,
    fullscreen,
    Icon,
    link,
    linkOff,
    replace,
} from "@wordpress/icons";
import { prependHTTP } from "@wordpress/url";
import {
    BorderControl,
    BorderRadiusControl,
    ToolbarWithDropdown,
} from "@tableberg/components";
import { CellKey } from "../../attributes";
import { useTableStore } from "../../store";
import { ImageElementAttributes, imageAttrDefaults } from "./element";
import { ElementBindings } from "../../dynamic-data/types";
import { DynamicDataPanel } from "../../components/DynamicDataPanel";
import { ElementDeleteButton } from "../../components/ElementDeleteButton";
import { ElementOptionsBlockControls } from "../../components/ElementOptionsButton";

const ASPECT_RATIO_OPTIONS = [
    { label: __("Original", "tableberg"), value: "" },
    { label: __("Square - 1:1", "tableberg"), value: "1" },
    { label: __("Standard - 4:3", "tableberg"), value: "4/3" },
    { label: __("Portrait - 3:4", "tableberg"), value: "3/4" },
    { label: __("Classic - 3:2", "tableberg"), value: "3/2" },
    { label: __("Classic Portrait - 2:3", "tableberg"), value: "2/3" },
    { label: __("Wide - 16:9", "tableberg"), value: "16/9" },
    { label: __("Tall - 9:16", "tableberg"), value: "9/16" },
];

const SCALE_OPTIONS = [
    {
        value: "cover",
        label: __("Cover", "tableberg"),
        help: __("Fill the space by clipping what doesn't fit.", "tableberg"),
    },
    {
        value: "contain",
        label: __("Contain", "tableberg"),
        help: __("Fit the content to the space without clipping.", "tableberg"),
    },
];

const SIZE_SLUG_OPTIONS = [
    { label: __("Thumbnail", "tableberg"), value: "thumbnail" },
    { label: __("Medium", "tableberg"), value: "medium" },
    { label: __("Large", "tableberg"), value: "large" },
    { label: __("Full Size", "tableberg"), value: "full" },
];

export function ImageElementControls({
    attributes,
    bindings,
    showCaption,
    setShowCaption,
    cellCoords,
    elementIndex,
    updateAttrs: updateAttrsProp,
}: {
    attributes: ImageElementAttributes;
    bindings?: ElementBindings;
    showCaption: boolean;
    setShowCaption: (show: boolean) => void;
    cellCoords: CellKey;
    elementIndex: number;
    // Native block edits inject a setAttributes-based updater; store-backed
    // element renderers use the table-store fallback.
    updateAttrs?: (attrs: Partial<ImageElementAttributes>) => void;
}) {
    const {
        media,
        alt,
        aspectRatio,
        height,
        width,
        scale,
        sizeSlug,
        href,
        linkTarget,
        lightbox,
        align,
        border,
        borderRadius,
        caption,
    } = attributes;

    const storeUpdateAttrs = useTableStore(
        state => state.updateSelectedElementAttrs
    );
    const updateAttrs = updateAttrsProp ?? storeUpdateAttrs;

    const [isEditingURL, setIsEditingURL] = useState(false);

    const isURLSet = !!href;
    const isLightboxEnabled = !!lightbox?.enabled;
    const hasLinkAction = isURLSet || isLightboxEnabled;
    const opensInNewTab = linkTarget === "_blank";

    const linkValue = useMemo(
        () => ({ url: href, opensInNewTab }),
        [href, opensInNewTab]
    );

    const unlink = () => {
        updateAttrs({
            href: "",
            linkTarget: "_self",
            lightbox: imageAttrDefaults.lightbox,
        });
        setIsEditingURL(false);
    };

    const toggleLightbox = () => {
        updateAttrs({
            lightbox: {
                enabled: !isLightboxEnabled,
            },
            ...(!isLightboxEnabled
                ? {
                      href: "",
                      linkTarget: "_self",
                  }
                : {}),
        });
        setIsEditingURL(false);
    };

    const onSelectMedia = (newMedia: any) => {
        if (!newMedia || !newMedia.url) {
            updateAttrs({ media: {} });
            return;
        }

        updateAttrs({
            media: {
                id: newMedia.id,
                url: newMedia.url,
                alt: newMedia.alt || "",
                title: newMedia.title || "",
                sizes: newMedia.sizes || {},
            },
            alt: newMedia.alt || "",
        });
    };

    const hasImage = !!media.url || !!media.id;
    const scaleHelp = useMemo(() => {
        return SCALE_OPTIONS.reduce(
            (acc: { [key: string]: string }, option) => {
                acc[option.value] = option.help;
                return acc;
            },
            {}
        );
    }, []);

    const resetAll = () => {
        updateAttrs({
            alt: "",
            aspectRatio: "",
            height: "",
            scale: "cover",
            width: "150px",
            sizeSlug: "large",
            lightbox: imageAttrDefaults.lightbox,
        });
    };

    return (
        <>
            <BlockControls group="block">
                <ToolbarWithDropdown
                    icon={alignNone}
                    title={__("Align image", "tableberg")}
                    value={align}
                    onChange={(newVal: string | undefined) => {
                        if (newVal) {
                            updateAttrs({
                                align: newVal as "left" | "center" | "right",
                            });
                        }
                    }}
                    controlset="alignment"
                />
                <ToolbarButton
                    onClick={() => {
                        setShowCaption(!showCaption);
                        if (showCaption && caption) {
                            updateAttrs({ caption: "" });
                        }
                    }}
                    icon={captionIcon}
                    isPressed={showCaption}
                    label={
                        showCaption
                            ? __("Remove caption", "tableberg")
                            : __("Add caption", "tableberg")
                    }
                />
                <ToolbarButton
                    icon={link}
                    title={
                        hasLinkAction
                            ? __("Edit link", "tableberg")
                            : __("Link", "tableberg")
                    }
                    onClick={() => setIsEditingURL(true)}
                    isActive={hasLinkAction}
                />
                <ElementDeleteButton
                    cellCoords={cellCoords}
                    elementIndex={elementIndex}
                />
                {isEditingURL && (
                    <Popover
                        placement="bottom"
                        onClose={() => setIsEditingURL(false)}
                        shift
                    >
                        {isLightboxEnabled ? (
                            <div
                                style={{
                                    alignItems: "center",
                                    border: "1px solid #1e1e1e",
                                    borderRadius: "2px",
                                    display: "flex",
                                    gap: "16px",
                                    justifyContent: "space-between",
                                    minWidth: "560px",
                                    padding: "12px 14px",
                                }}
                            >
                                <div
                                    style={{
                                        alignItems: "center",
                                        display: "flex",
                                        gap: "16px",
                                    }}
                                >
                                    <Icon icon={fullscreen} />
                                    <span
                                        style={{
                                            display: "flex",
                                            flexDirection: "column",
                                        }}
                                    >
                                        <span>
                                            {__(
                                                "Enlarge on click",
                                                "tableberg"
                                            )}
                                        </span>
                                        <span
                                            style={{
                                                color: "#757575",
                                            }}
                                        >
                                            {__(
                                                "Scales the image with a lightbox effect",
                                                "tableberg"
                                            )}
                                        </span>
                                    </span>
                                </div>
                                <Button
                                    icon={linkOff}
                                    label={__(
                                        "Disable Enlarge on click",
                                        "tableberg"
                                    )}
                                    onClick={toggleLightbox}
                                    showTooltip
                                    variant="secondary"
                                />
                            </div>
                        ) : (
                            <>
                                <LinkControl
                                    value={linkValue}
                                    onChange={({
                                        url: newURL = "",
                                        opensInNewTab: newOpensInNewTab,
                                    }: {
                                        url?: string;
                                        opensInNewTab?: boolean;
                                    }) => {
                                        updateAttrs({
                                            href: prependHTTP(newURL),
                                            linkTarget: newOpensInNewTab
                                                ? "_blank"
                                                : "_self",
                                            lightbox:
                                                imageAttrDefaults.lightbox,
                                        });
                                    }}
                                    onRemove={unlink}
                                />
                                {hasImage && (
                                    <div
                                        style={{
                                            borderTop: "1px solid #ddd",
                                            padding: "8px 0",
                                        }}
                                    >
                                        <Button
                                            icon={fullscreen}
                                            isPressed={isLightboxEnabled}
                                            onClick={toggleLightbox}
                                            style={{
                                                alignItems: "flex-start",
                                                display: "flex",
                                                gap: "16px",
                                                height: "auto",
                                                justifyContent: "flex-start",
                                                padding: "12px 16px",
                                                textAlign: "left",
                                                width: "100%",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: "4px",
                                                }}
                                            >
                                                <span>
                                                    {__(
                                                        "Enlarge on click",
                                                        "tableberg"
                                                    )}
                                                </span>
                                                <span
                                                    style={{
                                                        color: "#757575",
                                                        fontSize: "12px",
                                                    }}
                                                >
                                                    {__(
                                                        "Scale the image with a lightbox effect.",
                                                        "tableberg"
                                                    )}
                                                </span>
                                            </span>
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </Popover>
                )}
            </BlockControls>
            <ElementOptionsBlockControls
                cellCoords={cellCoords}
                elementIndex={elementIndex}
            />
            {hasImage && (
                <BlockControls>
                    <ToolbarGroup>
                        <MediaUploadCheck>
                            <MediaUpload
                                onSelect={onSelectMedia}
                                allowedTypes={["image"]}
                                value={media.id}
                                render={({ open }) => (
                                    <ToolbarButton
                                        onClick={open}
                                        icon={replace}
                                        label={__("Replace", "tableberg")}
                                    />
                                )}
                            />
                        </MediaUploadCheck>
                    </ToolbarGroup>
                </BlockControls>
            )}
            <InspectorControls>
                <ToolsPanel
                    label={__("Settings", "tableberg")}
                    resetAll={resetAll}
                >
                    <ToolsPanelItem
                        isShownByDefault
                        hasValue={() => !!alt}
                        label={__("Alternative Text", "tableberg")}
                        onDeselect={() => updateAttrs({ alt: "" })}
                    >
                        <TextareaControl
                            __nextHasNoMarginBottom
                            value={alt}
                            label={__("Alternative Text", "tableberg")}
                            onChange={(newValue: string) =>
                                updateAttrs({ alt: newValue })
                            }
                            help={__(
                                "Describe the image for screen readers.",
                                "tableberg"
                            )}
                        />
                    </ToolsPanelItem>
                    <ToolsPanelItem
                        isShownByDefault
                        label={__("Aspect ratio", "tableberg")}
                        onDeselect={() => updateAttrs({ aspectRatio: "" })}
                        hasValue={() => aspectRatio !== ""}
                    >
                        <SelectControl
                            value={aspectRatio || ""}
                            __nextHasNoMarginBottom
                            options={ASPECT_RATIO_OPTIONS}
                            label={__("Aspect ratio", "tableberg")}
                            onChange={newValue =>
                                updateAttrs({ aspectRatio: newValue })
                            }
                        />
                    </ToolsPanelItem>
                    {aspectRatio && (
                        <ToolsPanelItem
                            label={__("Scale", "tableberg")}
                            isShownByDefault
                            hasValue={() => scale !== "cover"}
                            onDeselect={() => updateAttrs({ scale: "cover" })}
                        >
                            <ToggleGroupControl
                                label={__("Scale", "tableberg")}
                                isBlock
                                help={scaleHelp[scale || "cover"]}
                                value={scale || "cover"}
                                onChange={newScale =>
                                    updateAttrs({ scale: newScale as string })
                                }
                                __nextHasNoMarginBottom
                            >
                                {SCALE_OPTIONS.map(option => (
                                    <ToggleGroupControlOption
                                        key={option.value}
                                        value={option.value}
                                        label={option.label}
                                    />
                                ))}
                            </ToggleGroupControl>
                        </ToolsPanelItem>
                    )}
                    <div
                        style={{
                            display: "flex",
                            gap: "10px",
                            gridColumn: "1 / -1",
                        }}
                    >
                        <ToolsPanelItem
                            isShownByDefault
                            label={__("Width", "tableberg")}
                            hasValue={() => width !== "" && width !== "150px"}
                            onDeselect={() => updateAttrs({ width: "150px" })}
                        >
                            <UnitControl
                                label={__("Width", "tableberg")}
                                placeholder={__("Auto", "tableberg")}
                                labelPosition="top"
                                units={[
                                    { value: "px", label: "px", default: 0 },
                                ]}
                                min={0}
                                value={width}
                                onChange={(newWidth: string | undefined) =>
                                    updateAttrs({ width: newWidth || "" })
                                }
                            />
                        </ToolsPanelItem>
                        <ToolsPanelItem
                            isShownByDefault
                            label={__("Height", "tableberg")}
                            hasValue={() => height !== ""}
                            onDeselect={() => updateAttrs({ height: "" })}
                        >
                            <UnitControl
                                label={__("Height", "tableberg")}
                                placeholder={__("Auto", "tableberg")}
                                labelPosition="top"
                                units={[
                                    { value: "px", label: "px", default: 0 },
                                ]}
                                min={0}
                                value={height}
                                onChange={(newHeight: string | undefined) =>
                                    updateAttrs({ height: newHeight || "" })
                                }
                            />
                        </ToolsPanelItem>
                    </div>
                    {hasImage &&
                        media.sizes &&
                        Object.keys(media.sizes).length > 0 && (
                            <ToolsPanelItem
                                isShownByDefault
                                label={__("Resolution", "tableberg")}
                                hasValue={() => sizeSlug !== "large"}
                                onDeselect={() =>
                                    updateAttrs({ sizeSlug: "large" })
                                }
                            >
                                <SelectControl
                                    label={__("Resolution", "tableberg")}
                                    value={sizeSlug}
                                    options={SIZE_SLUG_OPTIONS.filter(
                                        opt => media.sizes?.[opt.value]
                                    )}
                                    onChange={(newSlug: string) =>
                                        updateAttrs({ sizeSlug: newSlug })
                                    }
                                    help={__(
                                        "Select the size of the source image.",
                                        "tableberg"
                                    )}
                                />
                            </ToolsPanelItem>
                        )}
                </ToolsPanel>
            </InspectorControls>
            <InspectorControls group="border">
                <BorderControl
                    value={border}
                    label={__("Border", "tableberg")}
                    onChange={(newBorder: any) =>
                        updateAttrs({ border: newBorder })
                    }
                    onDeselect={() =>
                        updateAttrs({ border: imageAttrDefaults.border })
                    }
                    hasValue={() =>
                        !!border.top ||
                        !!border.right ||
                        !!border.bottom ||
                        !!border.left
                    }
                />
                <BorderRadiusControl
                    label={__("Border Radius", "tableberg")}
                    value={borderRadius}
                    onChange={(newRadius: any) =>
                        updateAttrs({ borderRadius: newRadius })
                    }
                    onDeselect={() =>
                        updateAttrs({
                            borderRadius: imageAttrDefaults.borderRadius,
                        })
                    }
                    hasValue={() =>
                        !!borderRadius.topLeft ||
                        !!borderRadius.topRight ||
                        !!borderRadius.bottomLeft ||
                        !!borderRadius.bottomRight
                    }
                />
            </InspectorControls>
            <InspectorControls>
                <DynamicDataPanel elementType="image" bindings={bindings} />
            </InspectorControls>
        </>
    );
}

import { useState, useMemo } from "react";
import {
    InspectorControls,
    BlockControls,
    AlignmentControl,
    FontSizePicker,
    __experimentalLinkControl as LinkControl,
} from "@wordpress/block-editor";
import {
    justifyLeft,
    justifyCenter,
    justifyRight,
    link,
    linkOff,
} from "@wordpress/icons";
import {
    PanelBody,
    BaseControl,
    ToolbarButton,
    Popover,
    TextControl,
    __experimentalToggleGroupControl as ToggleGroupControl,
    __experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon,
    __experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { prependHTTP } from "@wordpress/url";
import {
    SpacingControl,
    ColorControl,
    BorderRadiusControl,
} from "@tableberg/components";
import { CellKey } from "../../attributes";
import { useTableStore } from "../../store";
import { buttonAttrDefaults, ButtonElementAttributes } from "./element";
import { DynamicDataPanel } from "../../components/DynamicDataPanel";
import { ElementBindings } from "../../dynamic-data/types";
import { ElementDeleteButton } from "../../components/ElementDeleteButton";
import { ElementOptionsBlockControls } from "../../components/ElementOptionsButton";

export function ButtonElementControls({
    attributes,
    bindings,
    cellCoords,
    elementIndex,
    updateStyles: updateStylesProp,
    updateAttrs: updateAttrsProp,
}: {
    attributes: ButtonElementAttributes;
    bindings?: ElementBindings;
    cellCoords: CellKey;
    elementIndex: number;
    // Native block edits inject setAttributes-based updaters; store-backed
    // element renderers use the table-store fallbacks.
    updateStyles?: (
        styles: Partial<ButtonElementAttributes["styles"]>
    ) => void;
    updateAttrs?: (attrs: Partial<ButtonElementAttributes>) => void;
}) {
    const { styles, link: linkAttrs, id, align } = attributes;

    const storeUpdateStyles = useTableStore(
        state => state.updateSelectedElementStyles
    );
    const storeUpdateAttrs = useTableStore(
        state => state.updateSelectedElementAttrs
    );
    const updateStyles = updateStylesProp ?? storeUpdateStyles;
    const updateAttrs = updateAttrsProp ?? storeUpdateAttrs;

    const [isEditingURL, setIsEditingURL] = useState(false);

    const linkUrlIsBound = !!bindings?.["link.url"];
    const textColorIsBound = !!bindings?.["styles.textColor"];
    const backgroundColorIsBound = !!bindings?.["styles.backgroundColor"];
    const idIsBound = !!bindings?.id;

    const isURLSet = !!linkAttrs.url;
    const opensInNewTab = linkAttrs.target === "_blank";

    const linkValue = useMemo(
        () => ({ url: linkAttrs.url, opensInNewTab }),
        [linkAttrs.url, opensInNewTab]
    );

    const unlink = () => {
        updateAttrs({
            link: buttonAttrDefaults.link,
        });
        setIsEditingURL(false);
    };

    const validWidthValues = ["auto", "25%", "50%", "75%", "100%"];

    return (
        <>
            <BlockControls group="block">
                <AlignmentControl
                    value={styles.textAlign}
                    onChange={(textAlign: string) => {
                        if (
                            textAlign !== "left" &&
                            textAlign !== "center" &&
                            textAlign !== "right"
                        ) {
                            textAlign = buttonAttrDefaults.styles.textAlign;
                        }

                        updateStyles({
                            textAlign: textAlign,
                        });
                    }}
                />
                <ToolbarButton
                    icon={link}
                    title={
                        linkUrlIsBound
                            ? __("Link URL is dynamically bound", "tableberg")
                            : isURLSet
                              ? __("Unlink", "tableberg")
                              : __("Link", "tableberg")
                    }
                    onClick={
                        linkUrlIsBound
                            ? undefined
                            : isURLSet
                              ? unlink
                              : () => setIsEditingURL(true)
                    }
                    isActive={isURLSet || linkUrlIsBound}
                    disabled={linkUrlIsBound}
                />
                <ElementDeleteButton
                    cellCoords={cellCoords}
                    elementIndex={elementIndex}
                />
                {isEditingURL && !linkUrlIsBound && (
                    <Popover
                        placement="bottom"
                        onClose={() => setIsEditingURL(false)}
                        shift
                    >
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
                                    link: {
                                        ...linkAttrs,
                                        url: prependHTTP(newURL),
                                        target: newOpensInNewTab
                                            ? "_blank"
                                            : "_self",
                                    },
                                });
                            }}
                            onRemove={unlink}
                        />
                    </Popover>
                )}
            </BlockControls>
            <ElementOptionsBlockControls
                cellCoords={cellCoords}
                elementIndex={elementIndex}
            />
            <InspectorControls group="color">
                <ColorControl
                    label={
                        textColorIsBound
                            ? __("Text (dynamic)", "tableberg")
                            : __("Text", "tableberg")
                    }
                    value={styles.textColor}
                    onChange={textColor => updateStyles({ textColor })}
                    onDeselect={() =>
                        updateStyles({
                            textColor: buttonAttrDefaults.styles.textColor,
                        })
                    }
                />
                <ColorControl
                    label={__("Hover Text", "tableberg")}
                    value={styles.textHoverColor}
                    onChange={textHoverColor =>
                        updateStyles({ textHoverColor })
                    }
                    onDeselect={() =>
                        updateStyles({
                            textHoverColor:
                                buttonAttrDefaults.styles.textHoverColor,
                        })
                    }
                />
                <ColorControl
                    label={
                        backgroundColorIsBound
                            ? __("Background (dynamic)", "tableberg")
                            : __("Background", "tableberg")
                    }
                    value={styles.backgroundColor}
                    onChange={backgroundColor =>
                        updateStyles({ backgroundColor })
                    }
                    onDeselect={() =>
                        updateStyles({
                            backgroundColor:
                                buttonAttrDefaults.styles.backgroundColor,
                        })
                    }
                />
                <ColorControl
                    label={__("Hover Background", "tableberg")}
                    value={styles.backgroundHoverColor}
                    onChange={backgroundHoverColor =>
                        updateStyles({ backgroundHoverColor })
                    }
                    onDeselect={() =>
                        updateStyles({
                            backgroundHoverColor:
                                buttonAttrDefaults.styles.backgroundHoverColor,
                        })
                    }
                />
            </InspectorControls>
            <InspectorControls group="dimensions">
                <SpacingControl
                    label={__("Padding", "tableberg")}
                    value={styles.padding}
                    onChange={padding => updateStyles({ padding })}
                    onDeselect={() =>
                        updateStyles({
                            padding: buttonAttrDefaults.styles.padding,
                        })
                    }
                    hasValue={() =>
                        !!styles.padding.top ||
                        !!styles.padding.right ||
                        !!styles.padding.bottom ||
                        !!styles.padding.left
                    }
                />
                <BorderRadiusControl
                    label={__("Border Radius", "tableberg")}
                    value={styles.borderRadius}
                    onChange={borderRadius => updateStyles({ borderRadius })}
                    onDeselect={() =>
                        updateStyles({
                            borderRadius:
                                buttonAttrDefaults.styles.borderRadius,
                        })
                    }
                    hasValue={() =>
                        !!styles.borderRadius.topLeft ||
                        !!styles.borderRadius.topRight ||
                        !!styles.borderRadius.bottomLeft ||
                        !!styles.borderRadius.bottomRight
                    }
                />
            </InspectorControls>
            <InspectorControls>
                <PanelBody title={__("Typography", "tableberg")}>
                    <BaseControl __nextHasNoMarginBottom>
                        <FontSizePicker
                            value={styles.fontSize}
                            onChange={fontSize => {
                                updateStyles({
                                    fontSize:
                                        fontSize ||
                                        buttonAttrDefaults.styles.fontSize,
                                });
                            }}
                        />
                    </BaseControl>
                </PanelBody>
            </InspectorControls>
            <InspectorControls group="advanced">
                <TextControl
                    __nextHasNoMarginBottom
                    autoComplete="off"
                    label={
                        idIsBound
                            ? __("HTML ID (dynamic)", "tableberg")
                            : __("HTML ID", "tableberg")
                    }
                    help={
                        idIsBound
                            ? __("Overridden by dynamic data", "tableberg")
                            : ""
                    }
                    value={id}
                    onChange={id => updateAttrs({ id })}
                />
            </InspectorControls>
            <InspectorControls>
                <PanelBody title={__("Button Settings", "tableberg")}>
                    <ToggleGroupControl
                        label={__("Button Alignment", "tableberg")}
                        value={align}
                        onChange={value => {
                            if (
                                value !== "left" &&
                                value !== "center" &&
                                value !== "right"
                            ) {
                                value = buttonAttrDefaults.align;
                            }

                            updateAttrs({
                                align: value,
                            });
                        }}
                        isBlock
                    >
                        <ToggleGroupControlOptionIcon
                            value="left"
                            label={__("Left", "tableberg")}
                            icon={justifyLeft}
                        />
                        <ToggleGroupControlOptionIcon
                            value="center"
                            label={__("Center", "tableberg")}
                            icon={justifyCenter}
                        />
                        <ToggleGroupControlOptionIcon
                            value="right"
                            label={__("Right", "tableberg")}
                            icon={justifyRight}
                        />
                    </ToggleGroupControl>
                    <ToggleGroupControl
                        label={__("Width", "tableberg")}
                        value={styles.width}
                        onChange={width => {
                            if (!width || typeof width === "number") {
                                width = buttonAttrDefaults.styles.width;
                            }

                            if (!validWidthValues.includes(width)) {
                                width = buttonAttrDefaults.styles.width;
                            }

                            updateStyles({ width });
                        }}
                        isBlock
                    >
                        {validWidthValues.map(widthValue => {
                            return (
                                <ToggleGroupControlOption
                                    key={widthValue}
                                    value={widthValue}
                                    label={__(widthValue, "tableberg")}
                                />
                            );
                        })}
                    </ToggleGroupControl>
                </PanelBody>
            </InspectorControls>
            <InspectorControls>
                <DynamicDataPanel elementType="button" bindings={bindings} />
            </InspectorControls>
        </>
    );
}

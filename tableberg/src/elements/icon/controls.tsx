import { useState } from "react";
import {
    InspectorControls,
    BlockControls,
    HeightControl,
    __experimentalLinkControl as LinkControl,
    // @ts-ignore
    JustifyContentControl,
} from "@wordpress/block-editor";
import {
    PanelBody,
    Popover,
    RangeControl,
    SelectControl,
    TabPanel,
    TextControl,
    ToolbarGroup,
    ToolbarButton,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { link } from "@wordpress/icons";
import {
    BorderControl,
    BorderRadiusControl,
    ColorControl,
    SpacingControl,
} from "@tableberg/components";
import { IconPickerMini } from "@tableberg/components/icon-library";
import { CellKey } from "../../attributes";
import { useTableStore } from "../../store";
import { IconElementAttributes, iconAttrDefaults } from ".";
import { ElementBindings } from "../../dynamic-data/types";
import { DynamicDataPanel } from "../../components/DynamicDataPanel";
import { ElementDeleteButton } from "../../components/ElementDeleteButton";
import { ElementOptionsBlockControls } from "../../components/ElementOptionsButton";

export function IconElementControls({
    attributes,
    bindings,
    cellCoords,
    elementIndex,
}: {
    attributes: IconElementAttributes;
    bindings?: ElementBindings;
    cellCoords: CellKey;
    elementIndex: number;
}) {
    const { icon, size, behavior, link: iconLink, styles } = attributes;

    const updateAttrs = useTableStore(
        state => state.updateSelectedElementAttrs
    );

    const [isEditingURL, setIsEditingURL] = useState(false);
    const [iconMode, setIconMode] = useState<"url" | "icon">(
        icon?.url ? "url" : "icon"
    );

    const updateStyles = (newStyles: Partial<typeof styles>) => {
        updateAttrs({ styles: { ...styles, ...newStyles } });
    };

    const colorTabs: any[] = [
        {
            name: "normal",
            title: __("Normal", "tableberg"),
            component: (
                <>
                    <ColorControl
                        label={__("Icon Color", "tableberg")}
                        value={styles.color}
                        onChange={(newColor: string) =>
                            updateStyles({ color: newColor })
                        }
                        onDeselect={() =>
                            updateStyles({
                                color: iconAttrDefaults.styles.color,
                            })
                        }
                    />
                    <ColorControl
                        label={__("Background", "tableberg")}
                        value={styles.background}
                        onChange={(newBg: string) =>
                            updateStyles({ background: newBg })
                        }
                        onDeselect={() =>
                            updateStyles({
                                background: iconAttrDefaults.styles.background,
                            })
                        }
                    />
                </>
            ),
        },
        {
            name: "hover",
            title: __("Hover", "tableberg"),
            component: (
                <>
                    <ColorControl
                        label={__("Icon Color", "tableberg")}
                        value={styles.colorHover}
                        onChange={(newColor: string) =>
                            updateStyles({ colorHover: newColor })
                        }
                        onDeselect={() =>
                            updateStyles({
                                colorHover: iconAttrDefaults.styles.colorHover,
                            })
                        }
                    />
                    <ColorControl
                        label={__("Background", "tableberg")}
                        value={styles.backgroundHover}
                        onChange={(newBg: string) =>
                            updateStyles({ backgroundHover: newBg })
                        }
                        onDeselect={() =>
                            updateStyles({
                                backgroundHover:
                                    iconAttrDefaults.styles.backgroundHover,
                            })
                        }
                    />
                </>
            ),
        },
    ];

    return (
        <>
            <BlockControls>
                <ToolbarGroup>
                    <JustifyContentControl
                        value={styles.align}
                        allowedControls={["left", "center", "right"]}
                        onChange={(newJustify: "left" | "center" | "right") => {
                            updateStyles({ align: newJustify });
                        }}
                    />
                </ToolbarGroup>
                <ToolbarGroup>
                    <ToolbarButton
                        icon={link}
                        title={__("Link", "tableberg")}
                        onClick={() => setIsEditingURL(true)}
                        isActive={!!iconLink.url}
                    />
                </ToolbarGroup>
                <ElementDeleteButton
                    cellCoords={cellCoords}
                    elementIndex={elementIndex}
                />
            </BlockControls>
            <ElementOptionsBlockControls
                cellCoords={cellCoords}
                elementIndex={elementIndex}
            />
            {isEditingURL && (
                <Popover
                    placement="bottom"
                    onClose={() => setIsEditingURL(false)}
                    focusOnMount={true}
                >
                    <LinkControl
                        value={{
                            url: iconLink.url,
                            opensInNewTab: iconLink.target === "_blank",
                        }}
                        onChange={({
                            url = "",
                            opensInNewTab,
                        }: {
                            url?: string;
                            opensInNewTab?: boolean;
                        }) => {
                            updateAttrs({
                                link: {
                                    url,
                                    target: opensInNewTab ? "_blank" : "_self",
                                },
                            });
                        }}
                        onRemove={() => {
                            updateAttrs({
                                link: iconAttrDefaults.link,
                            });
                            setIsEditingURL(false);
                        }}
                    />
                </Popover>
            )}
            <InspectorControls>
                <PanelBody title={__("Icon Settings", "tableberg")} initialOpen>
                    <SelectControl
                        __nextHasNoMarginBottom
                        label={__("Behave As", "tableberg")}
                        value={behavior}
                        options={[
                            {
                                value: "paragraph",
                                label: __("Paragraph", "tableberg"),
                            },
                            {
                                value: "char",
                                label: __("Character", "tableberg"),
                            },
                        ]}
                        onChange={(newBehavior: string) =>
                            updateAttrs({
                                behavior: newBehavior as "paragraph" | "char",
                            })
                        }
                    />
                    <HeightControl
                        value={size}
                        label={__("Icon Size", "tableberg")}
                        onChange={(newSize: string) =>
                            updateAttrs({ size: newSize || "40px" })
                        }
                    />
                    <RangeControl
                        __nextHasNoMarginBottom
                        max={180}
                        min={-180}
                        allowReset
                        resetFallbackValue={0}
                        value={styles.rotation}
                        label={__("Rotation", "tableberg")}
                        onChange={(newRotation: number | undefined) =>
                            updateStyles({ rotation: newRotation ?? 0 })
                        }
                    />
                </PanelBody>
                <PanelBody title={__("Icon", "tableberg")} initialOpen>
                    <SelectControl
                        __nextHasNoMarginBottom
                        label={__("Icon Source", "tableberg")}
                        options={[
                            {
                                value: "icon",
                                label: __("Select from library", "tableberg"),
                            },
                            {
                                value: "url",
                                label: __("Import from URL", "tableberg"),
                            },
                        ]}
                        value={iconMode}
                        onChange={(mode: string) => {
                            if (mode === "url" || mode === "icon") {
                                setIconMode(mode);
                            }
                        }}
                    />
                    {iconMode === "icon" ? (
                        <IconPickerMini
                            onSelect={newIcon => updateAttrs({ icon: newIcon })}
                            maxHeight="180px"
                        />
                    ) : (
                        <TextControl
                            __nextHasNoMarginBottom
                            label={__("Icon URL", "tableberg")}
                            value={icon?.url || ""}
                            onChange={(url: string) =>
                                updateAttrs({
                                    icon: {
                                        iconName: "custom",
                                        url: encodeURI(url),
                                    },
                                })
                            }
                        />
                    )}
                </PanelBody>
            </InspectorControls>
            <InspectorControls group="color">
                <div style={{ marginTop: "0", gridColumn: "1/-1" }}>
                    <TabPanel tabs={colorTabs}>{tab => tab.component}</TabPanel>
                </div>
            </InspectorControls>
            <InspectorControls group="border">
                <BorderControl
                    label={__("Border", "tableberg")}
                    value={styles.border}
                    onChange={(newBorder: any) =>
                        updateStyles({ border: newBorder })
                    }
                    onDeselect={() =>
                        updateStyles({ border: iconAttrDefaults.styles.border })
                    }
                    hasValue={() =>
                        !!(
                            styles.border?.top ||
                            styles.border?.right ||
                            styles.border?.bottom ||
                            styles.border?.left
                        )
                    }
                />
                <BorderRadiusControl
                    label={__("Border Radius", "tableberg")}
                    value={styles.borderRadius}
                    onChange={(newRadius: any) =>
                        updateStyles({ borderRadius: newRadius })
                    }
                    onDeselect={() =>
                        updateStyles({
                            borderRadius: iconAttrDefaults.styles.borderRadius,
                        })
                    }
                    hasValue={() =>
                        !!(
                            styles.borderRadius?.topLeft ||
                            styles.borderRadius?.topRight ||
                            styles.borderRadius?.bottomLeft ||
                            styles.borderRadius?.bottomRight
                        )
                    }
                />
            </InspectorControls>
            <InspectorControls group="dimensions">
                <SpacingControl
                    label={__("Padding", "tableberg")}
                    value={styles.padding}
                    onChange={(newPadding: any) =>
                        updateStyles({ padding: newPadding })
                    }
                    onDeselect={() =>
                        updateStyles({
                            padding: iconAttrDefaults.styles.padding,
                        })
                    }
                    hasValue={() =>
                        !!(
                            styles.padding?.top ||
                            styles.padding?.right ||
                            styles.padding?.bottom ||
                            styles.padding?.left
                        )
                    }
                />
            </InspectorControls>
            <InspectorControls>
                <DynamicDataPanel elementType="icon" bindings={bindings} />
            </InspectorControls>
        </>
    );
}

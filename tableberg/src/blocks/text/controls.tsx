import {
    FontSizePicker,
    InspectorControls,
    useBlockEditContext,
} from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";
import { ColorControl, SpacingControl } from "@tableberg/components";
import {
    BaseControl,
    PanelBody,
    __experimentalToolsPanel as ToolsPanel,
} from "@wordpress/components";

import { textAttributeDefaults, TextElementAttributes } from "./element";
import { useTableStore } from "../../store";
import { ElementBindings } from "../../dynamic-data/types";

const hasSides = (sides: {
    top: string;
    right: string;
    bottom: string;
    left: string;
}) => !!sides.top || !!sides.right || !!sides.bottom || !!sides.left;

export function TextElementControls({
    attributes,
    bindings,
    updateStyles: updateStylesProp,
}: {
    attributes: TextElementAttributes;
    bindings?: ElementBindings;
    // Native block edits inject a setAttributes-based updater; store-backed
    // element renderers use the table-store fallback.
    updateStyles?: (styles: Partial<TextElementAttributes["styles"]>) => void;
}) {
    const storeUpdateStyles = useTableStore(
        state => state.updateSelectedElementStyles
    );
    const updateStyles = updateStylesProp ?? storeUpdateStyles;
    const { clientId } = useBlockEditContext();

    const textColorIsBound = !!bindings?.["styles.textColor"];
    const linkColorIsBound = !!bindings?.["styles.linkColor"];
    const backgroundColorIsBound = !!bindings?.["styles.backgroundColor"];
    const fontSizeIsBound = !!bindings?.["styles.fontSize"];

    return (
        <>
            <InspectorControls group="color">
                <ColorControl
                    label={
                        textColorIsBound
                            ? __("Text Color (dynamic)", "tableberg")
                            : __("Text Color", "tableberg")
                    }
                    value={attributes.styles.textColor}
                    onChange={textColor => updateStyles({ textColor })}
                    onDeselect={() =>
                        updateStyles({
                            textColor: textAttributeDefaults.styles.textColor,
                        })
                    }
                />
                <ColorControl
                    label={
                        linkColorIsBound
                            ? __("Link Color (dynamic)", "tableberg")
                            : __("Link Color", "tableberg")
                    }
                    value={attributes.styles.linkColor}
                    onChange={linkColor => updateStyles({ linkColor })}
                    onDeselect={() =>
                        updateStyles({
                            linkColor: textAttributeDefaults.styles.linkColor,
                        })
                    }
                />
                <ColorControl
                    label={
                        backgroundColorIsBound
                            ? __("Background Color (dynamic)", "tableberg")
                            : __("Background Color", "tableberg")
                    }
                    value={attributes.styles.backgroundColor}
                    onChange={backgroundColor =>
                        updateStyles({ backgroundColor })
                    }
                    onDeselect={() =>
                        updateStyles({
                            backgroundColor:
                                textAttributeDefaults.styles.backgroundColor,
                        })
                    }
                />
            </InspectorControls>
            <InspectorControls>
                <PanelBody title={__("Typography", "tableberg")}>
                    <BaseControl
                        __nextHasNoMarginBottom
                        help={
                            fontSizeIsBound
                                ? __("Overridden by dynamic data", "tableberg")
                                : ""
                        }
                    >
                        <FontSizePicker
                            value={attributes.styles.fontSize || undefined}
                            onChange={fontSize =>
                                updateStyles({
                                    fontSize: fontSize
                                        ? String(fontSize)
                                        : textAttributeDefaults.styles.fontSize,
                                })
                            }
                        />
                    </BaseControl>
                </PanelBody>
            </InspectorControls>
            <InspectorControls>
                <ToolsPanel
                    label={__("Dimensions", "tableberg")}
                    panelId={clientId}
                    resetAll={() =>
                        updateStyles({
                            padding: {
                                ...textAttributeDefaults.styles.padding,
                            },
                            margin: {
                                ...textAttributeDefaults.styles.margin,
                            },
                        })
                    }
                >
                    <SpacingControl
                        label={__("Padding", "tableberg")}
                        value={attributes.styles.padding}
                        hasValue={() => hasSides(attributes.styles.padding)}
                        onChange={padding => updateStyles({ padding })}
                        onDeselect={() =>
                            updateStyles({
                                padding: {
                                    ...textAttributeDefaults.styles.padding,
                                },
                            })
                        }
                    />
                    <SpacingControl
                        label={__("Margin", "tableberg")}
                        value={attributes.styles.margin}
                        hasValue={() => hasSides(attributes.styles.margin)}
                        onChange={margin => updateStyles({ margin })}
                        onDeselect={() =>
                            updateStyles({
                                margin: {
                                    ...textAttributeDefaults.styles.margin,
                                },
                            })
                        }
                    />
                </ToolsPanel>
            </InspectorControls>
        </>
    );
}

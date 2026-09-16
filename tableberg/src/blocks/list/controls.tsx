import { InspectorControls, FontSizePicker } from "@wordpress/block-editor";
import { __ } from "@wordpress/i18n";
import {
    PanelBody,
    SelectControl,
    Button,
    PanelRow,
    BaseControl,
} from "@wordpress/components";
import {
    ColorControl,
    SizeControl,
    SpacingControlSingle,
} from "@tableberg/components";

import { useTableStore } from "../../store";
import { DynamicDataPanel } from "../../components/DynamicDataPanel";
import LockedControl from "../../components/LockedControl";
import { ListElementAttributes, listAttrDefaults } from "./element";
import { CellKey } from "../../attributes";
import { ElementBindings } from "../../dynamic-data/types";
import { isProAvailable } from "../../pro-status";

interface ListElementControlsProps {
    attributes: ListElementAttributes;
    bindings?: ElementBindings;
    cellCoords: CellKey;
    elementIndex: number;
    allowListTypeSwitch?: boolean;
    // Injected by the pro plugin; null when pro is not installed.
    ProListIconSettings?: React.ReactNode;
    // Native block edits inject a setAttributes-based updater; store-backed
    // element renderers use the table-store fallback.
    updateAttrs?: (attrs: Partial<ListElementAttributes>) => void;
}

export function ListElementControls({
    attributes,
    bindings,
    cellCoords,
    elementIndex,
    allowListTypeSwitch = true,
    updateAttrs,
    ProListIconSettings = null,
}: ListElementControlsProps) {
    const isPro = isProAvailable();

    const updateCellElement = useTableStore(state => state.updateCellElement);

    const applyAttrs =
        updateAttrs ??
        ((attrs: Partial<ListElementAttributes>) =>
            updateCellElement(cellCoords, elementIndex, {
                attributes: attrs,
            }));

    const updateListType = (listType: "basic" | "styled") => {
        applyAttrs({ listType });
    };

    const updateListStyle = (listStyle: ListElementAttributes["listStyle"]) => {
        applyAttrs({ listStyle });
    };

    const updateStyle = <K extends keyof ListElementAttributes["styles"]>(
        key: K,
        value: ListElementAttributes["styles"][K]
    ) => {
        applyAttrs({
            styles: {
                ...attributes.styles,
                [key]: value,
            },
        });
    };

    return (
        <>
            <InspectorControls>
                <PanelBody title={__("List Settings", "tableberg")} initialOpen>
                    {allowListTypeSwitch && isPro && (
                        <SelectControl
                            label={__("List Type", "tableberg")}
                            value={attributes.listType}
                            options={[
                                {
                                    label: __("Basic", "tableberg"),
                                    value: "basic",
                                },
                                {
                                    label: __("Styled", "tableberg"),
                                    value: "styled",
                                },
                            ]}
                            onChange={value => {
                                updateListType(value as "basic" | "styled");
                            }}
                        />
                    )}
                    {allowListTypeSwitch && !isPro && (
                        <LockedControl selected="tableberg/styled-list">
                            <SelectControl
                                label={__("List Type", "tableberg")}
                                value={attributes.listType}
                                options={[
                                    {
                                        label: __("Basic", "tableberg"),
                                        value: "basic",
                                    },
                                    {
                                        label: __("Styled", "tableberg"),
                                        value: "styled",
                                    },
                                ]}
                                onChange={() => null}
                            />
                        </LockedControl>
                    )}
                    {attributes.listType === "basic" && (
                        <SelectControl
                            label={__("List Style", "tableberg")}
                            value={attributes.listStyle}
                            options={[
                                {
                                    label: __("Disc", "tableberg"),
                                    value: "disc",
                                },
                                {
                                    label: __("Circle", "tableberg"),
                                    value: "circle",
                                },
                                {
                                    label: __("Square", "tableberg"),
                                    value: "square",
                                },
                                {
                                    label: __("Numbered", "tableberg"),
                                    value: "decimal",
                                },
                                {
                                    label: __("None", "tableberg"),
                                    value: "none",
                                },
                            ]}
                            onChange={value => {
                                updateListStyle(
                                    value as ListElementAttributes["listStyle"]
                                );
                            }}
                        />
                    )}
                    <SpacingControlSingle
                        label={__("Item Spacing", "tableberg")}
                        value={attributes.styles.itemSpacing}
                        onChange={value => updateStyle("itemSpacing", value)}
                    />
                </PanelBody>
                {/*
                 * Icon markers are a pro feature: pro hands the whole Icon
                 * Settings panel down. Free has no icon implementation.
                 */}
                {attributes.listType === "styled" && ProListIconSettings}
                <PanelBody title="Font Size" initialOpen={true}>
                    <BaseControl __nextHasNoMarginBottom>
                        <FontSizePicker
                            value={attributes.styles.fontSize || undefined}
                            onChange={value => {
                                if (!value) {
                                    return;
                                }
                                updateStyle("fontSize", String(value));
                            }}
                        />
                    </BaseControl>
                </PanelBody>
                <DynamicDataPanel elementType="list" bindings={bindings} />
            </InspectorControls>
            <InspectorControls group="color">
                <ColorControl
                    label={__("Icon Color", "tableberg")}
                    value={attributes.styles.iconColor}
                    onChange={value => updateStyle("iconColor", value)}
                    onDeselect={() =>
                        updateStyle(
                            "iconColor",
                            listAttrDefaults.styles.iconColor
                        )
                    }
                />
                <ColorControl
                    label={__("Text Color", "tableberg")}
                    value={attributes.styles.textColor}
                    onChange={value => updateStyle("textColor", value)}
                    onDeselect={() =>
                        updateStyle(
                            "textColor",
                            listAttrDefaults.styles.textColor
                        )
                    }
                />
                <ColorControl
                    label={__("Link Color", "tableberg")}
                    value={attributes.styles.linkColor}
                    onChange={value => updateStyle("linkColor", value)}
                    onDeselect={() =>
                        updateStyle(
                            "linkColor",
                            listAttrDefaults.styles.linkColor
                        )
                    }
                />
                <ColorControl
                    label={__("Background Color", "tableberg")}
                    value={attributes.styles.backgroundColor}
                    onChange={value => updateStyle("backgroundColor", value)}
                    onDeselect={() =>
                        updateStyle(
                            "backgroundColor",
                            listAttrDefaults.styles.backgroundColor
                        )
                    }
                />
            </InspectorControls>
        </>
    );
}

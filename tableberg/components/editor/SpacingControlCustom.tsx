import {
    RangeControl,
    Button,
    BaseControl,
    __experimentalHStack as HStack,
    __experimentalVStack as VStack,
    __experimentalUnitControl as UnitControl,
    __experimentalUseCustomUnits as useCustomUnits,
    __experimentalParseQuantityAndUnitFromRawValue as parseQuantityAndUnitFromRawValue,
} from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { settings } from "@wordpress/icons";
import { HTMLAttributes, useMemo, useState } from "react";
import { useSettings } from "@wordpress/block-editor";

export interface Props {
    label: string;
    value: string;
    onChange: (value: string) => void;
    style?: HTMLAttributes<HTMLFieldSetElement>["style"];
}

function getSlugFromValue(value: string): string | undefined {
    if (!value) return undefined;
    if (value === "0") return "0";
    const match = value.match(/var\(--wp--preset--spacing--(.+)\)/);
    return match ? match[1] : undefined;
}

function isPresetValue(value: string): boolean {
    return value === "0" || /var\(--wp--preset--spacing--.+\)/.test(value);
}

export default function SpacingControlSingle({
    label,
    value,
    onChange,
    style,
}: Props) {
    const [
        legacySpacingSizes,
        customSpacingSizes,
        themeSpacingSizes,
        defaultSpacingSizes,
        defaultSpacingSizesEnabled,
    ] = useSettings(
        "spacing.spacingSizes",
        "spacing.spacingSizes.custom",
        "spacing.spacingSizes.theme",
        "spacing.spacingSizes.default",
        "spacing.defaultSpacingSizes"
    );

    const settingsSizes = legacySpacingSizes || [
        ...(customSpacingSizes || []),
        ...(themeSpacingSizes || []),
        ...(defaultSpacingSizes && defaultSpacingSizesEnabled !== false
            ? defaultSpacingSizes
            : []),
    ];
    const spacingSizes = [{ slug: "0", size: 0 }, ...settingsSizes];

    const [showCustomValueControl, setShowCustomValueControl] = useState(
        !!value && !isPresetValue(value)
    );

    const [availableUnits] = useSettings("spacing.units");
    const units = useCustomUnits({
        availableUnits: availableUnits || ["px", "em", "rem"],
    });

    const presetIndex = useMemo(() => {
        const slug = getSlugFromValue(value);
        if (!slug) return 0;
        const index = spacingSizes.findIndex(s => String(s.slug) === slug);
        return index !== -1 ? index : NaN;
    }, [value, spacingSizes]);

    const [numericValue, currentUnit] = useMemo(
        () => parseQuantityAndUnitFromRawValue(value),
        [value]
    );
    const selectedUnit = currentUnit || units[0]?.value || "px";

    const fieldsetStyle: HTMLAttributes<HTMLFieldSetElement>["style"] = {
        ...style,
        border: 0,
        padding: 0,
        margin: 0,
    };

    return (
        <fieldset className="spacing-sizes-control" style={fieldsetStyle}>
            <HStack
                className="spacing-sizes-control__header"
                style={{ marginBottom: "12px" }}
            >
                <BaseControl.VisualLabel
                    as="legend"
                    className="spacing-sizes-control__label"
                >
                    {label}
                </BaseControl.VisualLabel>
                <Button
                    label={
                        showCustomValueControl
                            ? __("Use size preset")
                            : __("Set custom size")
                    }
                    icon={settings}
                    onClick={() =>
                        setShowCustomValueControl(!showCustomValueControl)
                    }
                    isPressed={showCustomValueControl}
                    size="small"
                    className="spacing-sizes-control__custom-toggle"
                    iconSize={24}
                />
            </HStack>

            <VStack spacing={0.5}>
                <HStack className="spacing-sizes-control__wrapper">
                    {showCustomValueControl ? (
                        <>
                            <UnitControl
                                hideLabelFromVision
                                className="spacing-sizes-control__unit-control"
                                size="__unstable-large"
                                value={value}
                                onChange={(newValue?: string) => {
                                    if (
                                        newValue &&
                                        !isNaN(parseFloat(newValue))
                                    ) {
                                        onChange(newValue);
                                    }
                                }}
                            />
                            <RangeControl
                                min={0}
                                max={100}
                                step={1}
                                withInputField={false}
                                className="spacing-sizes-control__custom-value-range"
                                label={label}
                                hideLabelFromVision
                                value={numericValue || 0}
                                onChange={(next?: number) => {
                                    if (next !== undefined) {
                                        onChange(`${next}${selectedUnit}`);
                                    }
                                }}
                                __nextHasNoMarginBottom
                            />
                        </>
                    ) : (
                        <RangeControl
                            className="spacing-sizes-control__preset-range"
                            label={label}
                            hideLabelFromVision
                            value={presetIndex}
                            min={0}
                            max={spacingSizes.length - 1}
                            marks={spacingSizes.map((_, i) => ({
                                value: i,
                                label: undefined,
                            }))}
                            withInputField={false}
                            onChange={(index?: number) => {
                                if (index === undefined) return;
                                const slug = spacingSizes[index]?.slug;
                                if (slug === "0") {
                                    onChange("0");
                                } else {
                                    onChange(
                                        `var(--wp--preset--spacing--${slug})`
                                    );
                                }
                            }}
                            __nextHasNoMarginBottom
                        />
                    )}
                </HStack>
            </VStack>
        </fieldset>
    );
}

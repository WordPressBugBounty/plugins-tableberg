import { __ } from "@wordpress/i18n";
import {
    __experimentalColorGradientControl as ColorGradientControl,
    __experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
} from "@wordpress/block-editor";
import {
    Button,
    ColorIndicator,
    Dropdown,
    FlexItem,
    __experimentalHStack as HStack,
    __experimentalDropdownContentWrapper as DropdownContentWrapper,
} from "@wordpress/components";
import { reset as resetIcon } from "@wordpress/icons";
import { useRef } from "react";
import classNames from "classnames";

import "./color-dropdown-style.scss";

interface ColorDropdownProps {
    label: string;
    colorValue: string | undefined | null;
    gradientValue?: string | null;
    onColorChange: (newValue: string | undefined) => void;
    onGradientChange?: (newValue: string | undefined) => void;
    onDeselect?: () => void;
    allowGradient?: boolean;
    enableAlpha?: boolean;
}

const LabeledColorIndicator = ({
    colorValue,
    label,
}: {
    colorValue: string | undefined | null;
    label: string;
}) => (
    <HStack justify="flex-start">
        <ColorIndicator
            className="block-editor-panel-color-gradient-settings__color-indicator"
            colorValue={colorValue || ""}
        />
        <FlexItem
            className="block-editor-panel-color-gradient-settings__color-name"
            title={label}
        >
            {label}
        </FlexItem>
    </HStack>
);

function ColorDropdown({
    label,
    colorValue,
    gradientValue,
    onColorChange,
    onGradientChange,
    onDeselect,
    allowGradient = false,
    enableAlpha = true,
}: ColorDropdownProps) {
    const colorGradientSettings = useMultipleOriginColorsAndGradients();
    const colorButtonRef = useRef<HTMLButtonElement>(null);

    const lastColor = useRef(colorValue);
    const lastGradient = useRef(gradientValue);

    const value = colorValue ?? gradientValue;
    const clearable = !!value;

    const clearValue = () => {
        if (colorValue) {
            onColorChange(undefined);
        } else if (gradientValue && onGradientChange) {
            onGradientChange(undefined);
        }
        onDeselect?.();
    };

    const handleColorChange = (newColor: string | undefined) => {
        if (lastColor.current !== newColor) {
            lastColor.current = newColor;
            onColorChange(newColor);
        }
    };

    const handleGradientChange = (newGradient: string | undefined) => {
        if (onGradientChange && lastGradient.current !== newGradient) {
            lastGradient.current = newGradient;
            onGradientChange(newGradient);
        }
    };

    return (
        <HStack className="tableberg-color-dropdown">
            <Dropdown
                popoverProps={{
                    placement: "left-start",
                    offset: 36,
                    shift: true,
                }}
                className="block-editor-tools-panel-color-gradient-settings__dropdown"
                renderToggle={({ onToggle, isOpen }) => (
                    <Button
                        __next40pxDefaultSize
                        onClick={onToggle}
                        className={classNames(
                            "block-editor-panel-color-gradient-settings__dropdown",
                            { "is-open": isOpen }
                        )}
                        aria-expanded={isOpen}
                        ref={colorButtonRef}
                    >
                        <LabeledColorIndicator
                            colorValue={value}
                            label={label}
                        />
                    </Button>
                )}
                renderContent={() => (
                    <DropdownContentWrapper paddingSize="none">
                        <div className="block-editor-panel-color-gradient-settings__dropdown-content">
                            <ColorGradientControl
                                {...colorGradientSettings}
                                enableAlpha={enableAlpha}
                                label={label}
                                colorValue={colorValue}
                                onColorChange={handleColorChange}
                                gradientValue={
                                    allowGradient ? gradientValue : undefined
                                }
                                onGradientChange={
                                    allowGradient
                                        ? handleGradientChange
                                        : undefined
                                }
                                showTitle={false}
                                clearable={false}
                                __experimentalIsRenderedInSidebar
                            />
                        </div>
                    </DropdownContentWrapper>
                )}
            />
            {clearable && (
                <Button
                    __next40pxDefaultSize
                    label={__("Reset", "tableberg")}
                    className="block-editor-panel-color-gradient-settings__reset"
                    size="small"
                    icon={resetIcon}
                    onClick={() => {
                        clearValue();
                        colorButtonRef.current?.focus();
                    }}
                />
            )}
        </HStack>
    );
}

export default ColorDropdown;

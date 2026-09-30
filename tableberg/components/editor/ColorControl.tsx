/**
 * WordPress Dependencies
 */
import { useSelect } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import {
    useBlockEditContext,
    __experimentalColorGradientSettingsDropdown as ColorGradientSettingsDropdown,
    __experimentalUseMultipleOriginColorsAndGradients as useMultipleOriginColorsAndGradients,
    store as blockEditorStore,
} from "@wordpress/block-editor";
import {
    Color,
    Gradient,
} from "@wordpress/components/build-types/palette-edit/types";
import { useRef } from "react";

import { useColorPalettes, PaletteOrigin } from "./useColorPalettes";

interface ColorSettingsProps {
    label: string;
    value: string | undefined | null;
    gradientValue?: string | null;
    palette?: "theme" | "default";
    onChange: (newValue: string) => any;
    onGradientChange?: (newValue: string) => any;
    onDeselect: () => any;
    resetAllFilter?: () => any;
    allowGradient?: boolean;
}

function ColorSetting({
    value: colorValue,
    gradientValue,
    label,
    palette = "theme",
    onChange: onColorChange,
    onGradientChange,
    onDeselect,
    resetAllFilter,
    allowGradient = false,
}: ColorSettingsProps) {
    const { clientId } = useBlockEditContext();
    const colorGradientSettings = useMultipleOriginColorsAndGradients();

    const lastColor = useRef(colorValue);
    const lastGradient = useRef(gradientValue);

    const { defaultColors, themeColors, defaultGradients, themeGradients } =
        useSelect(select => {
            const colorSettings = (
                select(blockEditorStore) as BlockEditorStoreSelectors
            ).getSettings()?.__experimentalFeatures?.color;
            return {
                defaultColors: colorSettings.palette.default,
                themeColors: colorSettings.palette.theme,
                defaultGradients: colorSettings.gradients.default,
                themeGradients: colorSettings.gradients.theme,
            };
        }, []);

    // Colours are offered as origin groups (Theme, Default, Custom) so this
    // picker matches the border one. `palette` now only picks the gradient
    // set, which still has no grouped UI.
    const colorPalette = useColorPalettes();
    const gradientPalette =
        palette === "theme" ? themeGradients : defaultGradients;

    if (!resetAllFilter) {
        resetAllFilter = onDeselect;
    }

    interface Settings {
        clearable?: boolean;
        colorValue?: string | null;
        gradientValue?: string | null;
        // Either a flat palette or origin groups (Theme, Default, Custom).
        colors?: Color[] | PaletteOrigin[];
        gradients?: Gradient[];
        label: string;
        onColorChange: (newValue: string) => any;
        onGradientChange?: (newValue: string) => any;
        resetAllFilter?: () => any;
        onDeselect?: () => any;
    }

    let settings: Settings = {
        clearable: true,
        resetAllFilter: resetAllFilter,
        colorValue: colorValue,
        colors: colorPalette,
        label: label,
        onColorChange: val => {
            if (lastColor.current !== val) {
                lastColor.current = val;
                onColorChange(val);
            }
        },
        onDeselect: onDeselect,
    };

    if (allowGradient) {
        settings = {
            ...settings,
            gradientValue: gradientValue,
            gradients: gradientPalette,
            onGradientChange: val => {
                if (onGradientChange && lastGradient.current !== val) {
                    lastGradient.current = val;
                    onGradientChange(val);
                }
            },
        };
    }

    return (
        <ColorGradientSettingsDropdown
            {...colorGradientSettings}
            enableAlpha
            panelId={clientId}
            title={__("Color Settings", "tableberg")}
            popoverProps={{
                placement: "left start",
            }}
            settings={[settings]}
        />
    );
}

export default ColorSetting;

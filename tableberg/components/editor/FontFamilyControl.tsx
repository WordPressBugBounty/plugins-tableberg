import { __ } from "@wordpress/i18n";
import {
    useSettings,
    __experimentalFontFamilyControl as WPFontFamilyControl,
} from "@wordpress/block-editor";

import TypographyPanelItem, {
    TypographyControlProps,
} from "./TypographyPanelItem";

interface FontFamily {
    fontFamily: string;
    name?: string;
    fontFace?: Record<string, any>[];
}

/** Every font the site offers, whichever origin it comes from. */
export function useFontFamilies(): FontFamily[] {
    const [fontFamilies] = useSettings("typography.fontFamilies");

    return ["default", "theme", "custom"].flatMap(
        origin => fontFamilies?.[origin] ?? []
    );
}

export default function FontFamilyControl({
    label = __("Font", "tableberg"),
    value,
    onChange,
    onDeselect,
    resetAllFilter,
    isShownByDefault = true,
    isSingleColumn,
    panelId,
}: TypographyControlProps) {
    const fontFamilies = useFontFamilies();

    if (!fontFamilies.length) {
        return null;
    }

    return (
        <TypographyPanelItem
            label={label}
            hasValue={() => !!value}
            onDeselect={onDeselect ?? (() => onChange(""))}
            resetAllFilter={resetAllFilter}
            isShownByDefault={isShownByDefault}
            isSingleColumn={isSingleColumn}
            panelId={panelId}
        >
            <WPFontFamilyControl
                __next40pxDefaultSize
                __nextHasNoMarginBottom
                fontFamilies={fontFamilies}
                value={value}
                onChange={newValue => onChange(newValue || "")}
            />
        </TypographyPanelItem>
    );
}

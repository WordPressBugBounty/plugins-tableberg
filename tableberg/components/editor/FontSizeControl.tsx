import { __ } from "@wordpress/i18n";
import { useSettings } from "@wordpress/block-editor";
import { FontSizePicker } from "@wordpress/components";

import TypographyPanelItem, {
    TypographyControlProps,
} from "./TypographyPanelItem";

interface FontSize {
    name?: string;
    slug: string;
    size: string | number;
}

const PRESET_FONT_SIZE = /^var\(--wp--preset--font-size--([^)]+)\)$/;

/**
 * A theme size is stored as its preset variable, the way the editor's own
 * controls do, so the block follows the theme (fluid sizes included) instead
 * of freezing whatever the preset measured at the time. Custom sizes are
 * stored as typed.
 */
function toPickerValue(fontSize: string, fontSizes: FontSize[]) {
    const preset = fontSize.match(PRESET_FONT_SIZE);
    if (!preset) {
        return fontSize || undefined;
    }

    const match = fontSizes.find(size => size.slug === preset[1]);
    return match ? String(match.size) : undefined;
}

function fromPickerValue(
    newSize: string | number | undefined,
    selected?: FontSize
) {
    if (newSize === undefined || newSize === "") {
        return "";
    }

    return selected?.slug
        ? `var(--wp--preset--font-size--${selected.slug})`
        : String(newSize);
}

export default function FontSizeControl({
    label = __("Size", "tableberg"),
    value,
    onChange,
    onDeselect,
    resetAllFilter,
    isShownByDefault = true,
    isSingleColumn,
    panelId,
}: TypographyControlProps) {
    const [fontSizes, customFontSize] = useSettings(
        "typography.fontSizes",
        "typography.customFontSize"
    );
    const sizes: FontSize[] = Array.isArray(fontSizes) ? fontSizes : [];

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
            <FontSizePicker
                __next40pxDefaultSize
                withReset={false}
                fontSizes={sizes}
                disableCustomFontSizes={customFontSize === false}
                value={toPickerValue(value, sizes)}
                onChange={(newSize, selected) =>
                    onChange(fromPickerValue(newSize, selected))
                }
            />
        </TypographyPanelItem>
    );
}

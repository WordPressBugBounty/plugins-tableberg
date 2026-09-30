import { __ } from "@wordpress/i18n";
import { __experimentalFontAppearanceControl as WPFontAppearanceControl } from "@wordpress/block-editor";

import TypographyPanelItem from "./TypographyPanelItem";
import { useFontFamilies } from "./FontFamilyControl";

export interface FontAppearance {
    fontStyle: string;
    fontWeight: string;
}

interface Props {
    label?: string;
    value: FontAppearance;
    onChange: (newValue: FontAppearance) => void;
    /** The font the appearance belongs to, so its own faces are offered. */
    fontFamily?: string;
    onDeselect?: () => void;
    resetAllFilter?: () => void;
    isShownByDefault?: boolean;
    isSingleColumn?: boolean;
    panelId?: string;
}

const noAppearance: FontAppearance = { fontStyle: "", fontWeight: "" };

export default function FontAppearanceControl({
    label = __("Appearance", "tableberg"),
    value,
    onChange,
    fontFamily,
    onDeselect,
    resetAllFilter,
    isShownByDefault = false,
    isSingleColumn = true,
    panelId,
}: Props) {
    const fontFamilies = useFontFamilies();
    const fontFamilyFaces =
        fontFamilies.find(family => family.fontFamily === fontFamily)
            ?.fontFace ?? [];

    return (
        <TypographyPanelItem
            label={label}
            hasValue={() => !!value.fontStyle || !!value.fontWeight}
            onDeselect={onDeselect ?? (() => onChange({ ...noAppearance }))}
            resetAllFilter={resetAllFilter}
            isShownByDefault={isShownByDefault}
            isSingleColumn={isSingleColumn}
            panelId={panelId}
        >
            <WPFontAppearanceControl
                __next40pxDefaultSize
                fontFamilyFaces={fontFamilyFaces}
                value={{
                    fontStyle: value.fontStyle || undefined,
                    fontWeight: value.fontWeight || undefined,
                }}
                onChange={newValue =>
                    onChange({
                        fontStyle: newValue?.fontStyle || "",
                        fontWeight: newValue?.fontWeight || "",
                    })
                }
            />
        </TypographyPanelItem>
    );
}

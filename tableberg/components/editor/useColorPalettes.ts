import { __ } from "@wordpress/i18n";
import { store as blockEditorStore } from "@wordpress/block-editor";
import { useSelect } from "@wordpress/data";
import { useMemo } from "react";

export interface PaletteColor {
    name: string;
    slug?: string;
    color: string;
}

export interface PaletteOrigin {
    name: string;
    colors: PaletteColor[];
}

/**
 * Every colour origin the editor knows about, as palette groups.
 *
 * `useMultipleOriginColorsAndGradients` drops the Default palette whenever a
 * theme sets `defaultPalette: false`, and these controls have always shown
 * those core swatches. Building the list here keeps them while adding the
 * theme's own Styles palette next to them.
 */
export function useColorPalettes(): PaletteOrigin[] {
    const palette = useSelect(select => {
        const settings = (
            select(blockEditorStore) as BlockEditorStoreSelectors
        ).getSettings();

        return settings?.__experimentalFeatures?.color?.palette;
    }, []);

    return useMemo(() => {
        // `custom` is not in the editor's type for the palette, but it is
        // there at runtime once someone saves their own colours.
        const custom = (palette as { custom?: PaletteColor[] } | undefined)
            ?.custom;

        const origins: Array<[string, PaletteColor[] | undefined]> = [
            [__("Theme", "tableberg"), palette?.theme],
            [__("Default", "tableberg"), palette?.default],
            [__("Custom", "tableberg"), custom],
        ];

        return origins
            .filter(([, colors]) => !!colors?.length)
            .map(([name, colors]) => ({ name, colors: colors as PaletteColor[] }));
    }, [palette]);
}

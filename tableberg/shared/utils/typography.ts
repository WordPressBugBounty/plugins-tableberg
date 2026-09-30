import { StyleAttr } from "./styling-helpers";

/**
 * The typography options a block can offer, the same set the core blocks do.
 * Plain CSS values, so they can be dropped straight into a style attribute.
 */
export interface TypographyValue {
    fontFamily: string;
    fontSize: string;
    fontStyle: string;
    fontWeight: string;
    lineHeight: string;
    letterSpacing: string;
    textDecoration: string;
    textTransform: string;
}

export const defaultTypography: TypographyValue = {
    fontFamily: "",
    fontSize: "",
    fontStyle: "",
    fontWeight: "",
    lineHeight: "",
    letterSpacing: "",
    textDecoration: "",
    textTransform: "",
};

/** Fills in the missing properties of a stored (partial) typography value. */
export function getTypography(
    typography?: Partial<TypographyValue>
): TypographyValue {
    return { ...defaultTypography, ...(typography || {}) };
}

/**
 * Typography as inline styles. Empty values are left out so the theme keeps
 * deciding until the user picks something.
 */
export function getTypographyCss(
    typography?: Partial<TypographyValue>
): StyleAttr {
    const {
        fontFamily,
        fontSize,
        fontStyle,
        fontWeight,
        lineHeight,
        letterSpacing,
        textDecoration,
        textTransform,
    } = getTypography(typography);

    return {
        fontFamily: fontFamily || undefined,
        fontSize: fontSize || undefined,
        fontStyle: fontStyle || undefined,
        fontWeight: fontWeight || undefined,
        lineHeight: lineHeight || undefined,
        letterSpacing: letterSpacing || undefined,
        textDecoration: textDecoration || undefined,
        textTransform: (textTransform as StyleAttr["textTransform"]) || undefined,
    };
}

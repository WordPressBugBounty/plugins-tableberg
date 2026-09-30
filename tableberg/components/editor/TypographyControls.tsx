import {
    TypographyValue,
    getTypography,
} from "@tableberg/shared/utils/typography";

import FontFamilyControl from "./FontFamilyControl";
import FontSizeControl from "./FontSizeControl";
import FontAppearanceControl from "./FontAppearanceControl";
import LineHeightControl from "./LineHeightControl";
import LetterSpacingControl from "./LetterSpacingControl";
import TextDecorationControl from "./TextDecorationControl";
import TextTransformControl from "./TextTransformControl";

interface Props {
    value?: Partial<TypographyValue>;
    onChange: (updates: Partial<TypographyValue>) => void;
    panelId?: string;
}

/**
 * The whole typography group in one go: the same options the core blocks
 * offer, as ToolsPanelItems, so a block only has to put them in a ToolsPanel
 * and store the values. Individual controls are exported too, for a block
 * that wants just one of them.
 */
export default function TypographyControls({
    value,
    onChange,
    panelId,
}: Props) {
    const typography = getTypography(value);

    return (
        <>
            <FontFamilyControl
                panelId={panelId}
                value={typography.fontFamily}
                onChange={fontFamily => onChange({ fontFamily })}
            />
            <FontSizeControl
                panelId={panelId}
                value={typography.fontSize}
                onChange={fontSize => onChange({ fontSize })}
            />
            <FontAppearanceControl
                panelId={panelId}
                fontFamily={typography.fontFamily}
                value={{
                    fontStyle: typography.fontStyle,
                    fontWeight: typography.fontWeight,
                }}
                onChange={appearance => onChange(appearance)}
            />
            <LineHeightControl
                panelId={panelId}
                value={typography.lineHeight}
                onChange={lineHeight => onChange({ lineHeight })}
            />
            <TextTransformControl
                panelId={panelId}
                value={typography.textTransform}
                onChange={textTransform => onChange({ textTransform })}
            />
            <LetterSpacingControl
                panelId={panelId}
                value={typography.letterSpacing}
                onChange={letterSpacing => onChange({ letterSpacing })}
            />
            <TextDecorationControl
                panelId={panelId}
                value={typography.textDecoration}
                onChange={textDecoration => onChange({ textDecoration })}
            />
        </>
    );
}

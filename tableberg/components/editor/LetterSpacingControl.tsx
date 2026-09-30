import { __ } from "@wordpress/i18n";
import { __experimentalLetterSpacingControl as WPLetterSpacingControl } from "@wordpress/block-editor";

import TypographyPanelItem, {
    TypographyControlProps,
} from "./TypographyPanelItem";

export default function LetterSpacingControl({
    label = __("Letter spacing", "tableberg"),
    value,
    onChange,
    onDeselect,
    resetAllFilter,
    isShownByDefault = false,
    isSingleColumn = true,
    panelId,
}: TypographyControlProps) {
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
            <WPLetterSpacingControl
                __next40pxDefaultSize
                __unstableInputWidth="auto"
                value={value || undefined}
                onChange={newValue => onChange(newValue || "")}
            />
        </TypographyPanelItem>
    );
}

import { __ } from "@wordpress/i18n";
import { __experimentalTextTransformControl as WPTextTransformControl } from "@wordpress/block-editor";

import TypographyPanelItem, {
    TypographyControlProps,
} from "./TypographyPanelItem";

export default function TextTransformControl({
    label = __("Letter case", "tableberg"),
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
            <WPTextTransformControl
                value={value || undefined}
                onChange={newValue => onChange(newValue || "")}
            />
        </TypographyPanelItem>
    );
}

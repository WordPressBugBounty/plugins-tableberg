import { __ } from "@wordpress/i18n";
import { LineHeightControl as WPLineHeightControl } from "@wordpress/block-editor";

import TypographyPanelItem, {
    TypographyControlProps,
} from "./TypographyPanelItem";

export default function LineHeightControl({
    label = __("Line height", "tableberg"),
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
            <WPLineHeightControl
                __next40pxDefaultSize
                __unstableInputWidth="auto"
                value={value || undefined}
                onChange={newValue => onChange(newValue || "")}
            />
        </TypographyPanelItem>
    );
}

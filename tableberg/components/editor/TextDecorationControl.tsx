import { __ } from "@wordpress/i18n";
import { __experimentalTextDecorationControl as WPTextDecorationControl } from "@wordpress/block-editor";

import TypographyPanelItem, {
    TypographyControlProps,
} from "./TypographyPanelItem";

export default function TextDecorationControl({
    label = __("Decoration", "tableberg"),
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
            <WPTextDecorationControl
                value={value || undefined}
                onChange={newValue => onChange(newValue || "")}
            />
        </TypographyPanelItem>
    );
}

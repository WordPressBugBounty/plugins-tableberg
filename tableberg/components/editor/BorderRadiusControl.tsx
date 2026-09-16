/**
 * WordPress Dependencies
 */
import { __ } from "@wordpress/i18n";
import {
    useBlockEditContext,
    __experimentalBorderRadiusControl as RadiusControl,
} from "@wordpress/block-editor";
import { __experimentalToolsPanelItem as ToolsPanelItem } from "@wordpress/components";

interface BorderRadiusControlPropTypes {
    label: string;
    value: any;
    hasValue: () => boolean;
    onChange: (newBorder: any) => any;
    resetAllFilter?: () => any;
    onDeselect: () => any;
    isShownByDefault?: boolean;
}

function BorderRadiusControl({
    label,
    isShownByDefault = true,
    value,
    hasValue,
    onChange = () => {},
    resetAllFilter,
    onDeselect = () => {},
}: BorderRadiusControlPropTypes) {
    const { clientId } = useBlockEditContext();

    if (!resetAllFilter) {
        resetAllFilter = onDeselect;
    }

    const handleChange = (value: any) => {
        if (typeof value === "string") {
            onChange({
                topLeft: value,
                topRight: value,
                bottomLeft: value,
                bottomRight: value,
            });
            return;
        }
        onChange(value);
    };

    return (
        <ToolsPanelItem
            panelId={clientId}
            isShownByDefault={isShownByDefault}
            resetAllFilter={resetAllFilter}
            hasValue={hasValue}
            label={label}
            onDeselect={onDeselect}
        >
            <RadiusControl onChange={handleChange} values={value} />
        </ToolsPanelItem>
    );
}

export default BorderRadiusControl;

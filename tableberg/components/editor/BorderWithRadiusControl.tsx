import { __ } from "@wordpress/i18n";
import {
    useBlockEditContext,
    __experimentalBorderRadiusControl as RadiusControl,
} from "@wordpress/block-editor";
import { useColorPalettes } from "./useColorPalettes";
import {
    __experimentalToolsPanelItem as ToolsPanelItem,
    __experimentalBorderBoxControl as BorderBoxControl,
    PanelBody,
} from "@wordpress/components";
import { Border } from "@wordpress/components/build-types/border-control/types";
import { Borders } from "@wordpress/components/build-types/border-box-control/types";
import { CSSProperties } from "react";

interface BorderWithRadiusControlPropTypes {
    label: string;
    value: Border | Borders;
    onChange: (newBorder: Border | Borders | undefined) => any;
    radiusValue: any;
    onRadiusChange: (newRadius: any) => any;
    resetAllFilter?: () => any;
    onDeselect: () => any;
    isShownByDefault?: boolean;
    children?: any;
}

const objectifyRadius = (radius: CSSProperties["borderRadius"] | string) => {
    if (typeof radius === "string") {
        return {
            topLeft: radius,
            topRight: radius,
            bottomRight: radius,
            bottomLeft: radius,
        };
    }

    return radius;
};

function BorderControl({
    label,
    isShownByDefault = true,
    value,
    onChange = () => {},
    radiusValue = {},
    onRadiusChange = () => {},
    resetAllFilter,
    onDeselect = () => {},
    children,
}: BorderWithRadiusControlPropTypes) {
    const { clientId } = useBlockEditContext();

    // Theme, Default and Custom origins.
    const colors = useColorPalettes();

    if (!resetAllFilter) {
        resetAllFilter = onDeselect;
    }

    return (
        <ToolsPanelItem
            panelId={clientId}
            isShownByDefault={isShownByDefault}
            resetAllFilter={resetAllFilter}
            hasValue={() => true}
            label={label}
            onDeselect={onDeselect}
        >
            <PanelBody
                title={label}
                initialOpen={isShownByDefault}
                className="tableberg-border-with-radius-control-handle"
            >
                {children}
                <BorderBoxControl
                    enableAlpha
                    size={"__unstable-large"}
                    colors={colors}
                    label={label}
                    onChange={onChange}
                    value={value}
                />
                <RadiusControl
                    onChange={(val: any) =>
                        onRadiusChange(objectifyRadius(val))
                    }
                    values={radiusValue}
                />
            </PanelBody>
        </ToolsPanelItem>
    );
}

export default BorderControl;

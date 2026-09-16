/**
 * WordPress Dependencies
 */
import { __ } from "@wordpress/i18n";
import {
    useBlockEditContext,
    store as BlockEditorStore,
} from "@wordpress/block-editor";
import { useSelect } from "@wordpress/data";
import {
    __experimentalToolsPanelItem as ToolsPanelItem,
    BorderBoxControl,
} from "@wordpress/components";
import { Border as CSSBorder } from "@wordpress/components/build-types/border-control/types";
import {
    AnyBorder,
    Borders as CSSBorders,
} from "@wordpress/components/build-types/border-box-control/types";

type Borders = {
    top: string;
    right: string;
    bottom: string;
    left: string;
};

interface BorderControlPropTypes {
    label: string;
    value: Borders;
    hasValue: () => boolean;
    onChange: (newBorder: Borders) => any;
    resetAllFilter?: () => any;
    onDeselect: () => any;
    isShownByDefault?: boolean;
}

function getBorderStringFromObject(border?: CSSBorder) {
    if (!border) {
        return "";
    }

    if (!border.width) {
        border.width = "0";
    }
    if (!border.style) {
        border.style = "solid";
    }
    if (!border.color) {
        border.color = "black";
    }

    return `${border?.width} ${border?.style} ${border?.color}`;
}

function mutateOutgoingBorderValues(border: AnyBorder) {
    const newBorder: Borders = {
        top: "",
        right: "",
        bottom: "",
        left: "",
    };

    if (!border) {
        return newBorder;
    }

    const sides = ["top", "right", "bottom", "left"];

    if ("top" in border) {
        for (const side of sides) {
            const key = side as keyof CSSBorders;
            const val = border[key];
            newBorder[key] = getBorderStringFromObject(val);
        }
    } else {
        const singleBorder = border as CSSBorder;

        for (const side of sides) {
            const key = side as keyof CSSBorders;
            newBorder[key] = getBorderStringFromObject(singleBorder);
        }
    }

    return newBorder;
}

function mutateIncomingBorderValues(border: Borders): CSSBorders {
    const newBorder: CSSBorders = {};
    const sides = ["top", "right", "bottom", "left"] as const;

    for (const side of sides) {
        const borderString = border[side];
        if (borderString && borderString.trim()) {
            const parts = borderString.trim().split(/\s+/);

            newBorder[side] = {
                width: parts[0] || undefined,
                style: parts[1] || undefined,
                color: parts[2] || undefined,
            } as CSSBorder;
        }
    }

    return newBorder;
}

function BorderControl({
    label,
    isShownByDefault = true,
    value,
    hasValue,
    onChange,
    resetAllFilter,
    onDeselect = () => {},
}: BorderControlPropTypes) {
    const { clientId } = useBlockEditContext();

    const { defaultColors } = useSelect(select => {
        return {
            defaultColors: (
                select(BlockEditorStore) as BlockEditorStoreSelectors
            ).getSettings()?.__experimentalFeatures?.color?.palette?.default,
        };
    }, []);

    if (!resetAllFilter) {
        resetAllFilter = onDeselect;
    }

    return (
        <ToolsPanelItem
            panelId={clientId}
            isShownByDefault={isShownByDefault}
            resetAllFilter={resetAllFilter}
            hasValue={hasValue}
            label={label}
            onDeselect={onDeselect}
        >
            <BorderBoxControl
                enableAlpha
                size={"__unstable-large"}
                colors={defaultColors}
                label={label}
                onChange={newBorders => {
                    return onChange(mutateOutgoingBorderValues(newBorders));
                }}
                value={mutateIncomingBorderValues(value)}
            />
        </ToolsPanelItem>
    );
}

export default BorderControl;

import {
    useBlockEditContext,
    __experimentalSpacingSizesControl as SpacingSizesControl,
} from "@wordpress/block-editor";
import { __experimentalToolsPanelItem as ToolsPanelItem } from "@wordpress/components";

function mutateOutgoingPaddingValue(padding: Padding) {
    for (const side in padding) {
        const key = side as keyof Padding;
        const value = padding[key];

        const slug = value?.match(/var:preset\|spacing\|(.+)/);
        if (!slug) {
            continue;
        }
        padding[key] = `var(--wp--preset--spacing--${slug[1]})`;
    }

    return padding;
}

function mutateIncomingPaddingValue(padding: Padding) {
    const newPadding = { ...padding };

    for (const side in newPadding) {
        const key = side as keyof Padding;
        const value = newPadding[key];

        const slug = value?.match(/var\(--wp--preset--spacing--(.+)\)/);
        if (!slug) {
            continue;
        }
        newPadding[key] = `var:preset|spacing|${slug[1]}`;
    }

    return newPadding;
}

type Padding = {
    top: string;
    right: string;
    bottom: string;
    left: string;
};

interface Props {
    label: string;
    value: Padding;
    hasValue: () => boolean;
    onChange: (newPadding: Padding) => any;
    resetAllFilter?: () => any;
    onDeselect: () => any;
    isShownByDefault?: boolean;
}

const SpacingControl = ({
    label,
    value,
    hasValue,
    onChange = () => {},
    resetAllFilter,
    onDeselect = () => {},
}: Props) => {
    const { clientId } = useBlockEditContext();
    const sides = ["top", "right", "bottom", "left"];

    if (!resetAllFilter) {
        resetAllFilter = onDeselect;
    }

    return (
        <ToolsPanelItem
            panelId={clientId}
            isShownByDefault={true}
            resetAllFilter={resetAllFilter}
            className={"tools-panel-item-spacing"}
            label={label}
            onDeselect={onDeselect}
            hasValue={hasValue}
        >
            <SpacingSizesControl
                allowReset={true}
                label={label}
                values={mutateIncomingPaddingValue(value)}
                sides={sides}
                onChange={newValue => {
                    onChange(mutateOutgoingPaddingValue(newValue));
                }}
            />
        </ToolsPanelItem>
    );
};

export default SpacingControl;

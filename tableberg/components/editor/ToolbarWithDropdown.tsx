import { ToolbarGroup } from "@wordpress/components";
import {
    alignNone,
    positionLeft,
    positionCenter,
    positionRight,
    stretchFullWidth,
    stretchWide,
} from "@wordpress/icons";

interface ToolbarGroupControlProps {
    icon?: JSX.Element;
    title: string;
    value?: string;
    info?: string;
    isDisabled?: boolean;
    onClick?: () => void;
}

interface AlignmentToolbarProps {
    icon?: JSX.Element;
    title: string;
    onChange: (newAlign?: string) => void;
    value: string | undefined;
    controls?: ToolbarGroupControlProps[];
    controlset?: "alignment" | "all";
    disabled?: boolean;
}

const alignControls: ToolbarGroupControlProps[] = [
    {
        icon: alignNone,
        title: "None",
        value: undefined,
    },
    {
        icon: positionLeft,
        title: "Align left",
        value: "left",
    },
    {
        icon: positionCenter,
        title: "Align center",
        value: "center",
    },
    {
        icon: positionRight,
        title: "Align right",
        value: "right",
    },
];

const alignControlsWithWidth: ToolbarGroupControlProps[] = [
    {
        icon: alignNone,
        title: "None",
        value: undefined,
    },
    {
        icon: positionLeft,
        title: "Align left",
        value: "left",
    },
    {
        icon: positionCenter,
        title: "Align center",
        value: "center",
    },
    {
        icon: positionRight,
        title: "Align right",
        value: "right",
    },
    {
        icon: stretchWide,
        title: "Wide width",
        value: "wide",
    },
    {
        icon: stretchFullWidth,
        title: "Full Width",
        value: "full",
    },
];

export default function ToolbarWithDropdown({
    title,
    onChange,
    value,
    controls,
    controlset,
    disabled,
}: AlignmentToolbarProps) {
    const controlsets: Record<string, ToolbarGroupControlProps[]> = {
        alignment: alignControls,
        all: alignControlsWithWidth,
    };

    if (controlset) {
        controls = controlsets[controlset];
    }

    if (controls) {
        const activeControl =
            controls.find(i => i.value === value) || controls[0];

        return (
            <ToolbarGroup
                icon={activeControl?.icon}
                title={title}
                isCollapsed
                controls={controls.map(control => {
                    const controlIsDisabled =
                        !!disabled || !!control.isDisabled;

                    return {
                        ...control,
                        isDisabled: controlIsDisabled,
                        onClick: () => {
                            if (controlIsDisabled) {
                                return;
                            }

                            onChange(control.value);
                        },
                        isActive: value === control.value,
                    };
                })}
            />
        );
    }
}

import { WPCompleter } from "@wordpress/components/build-types/autocomplete/types";
import buttonBlockIcon from "@tableberg/shared/icons/button";
import imageBlockIcon from "@tableberg/shared/icons/image";
import StyledListIcon from "@tableberg/shared/icons/styled-list";
import RibbonIcon from "@tableberg/shared/icons/ribbon";
import { ElementTypes } from "./attributes";
import { getExtendedElementDefinitions } from "./extensions";

function OptionIcon(icon: JSX.Element) {
    return <span className="block-editor-block-icon has-colors">{icon}</span>;
}

type Option = {
    icon: JSX.Element;
    name: string;
    value: ElementTypes;
    disabled?: boolean;
};

const baseCellChildAutoCompleter: WPCompleter<Option> = {
    name: "cell-blocks",
    triggerPrefix: "/",
    className: "block-editor-autocompleters__block",
    options: [],
    getOptionLabel: option => [OptionIcon(option.icon), option.name],
    getOptionKeywords: option => [option.name],
    isOptionDisabled: option => option.disabled ?? false,
    getOptionCompletion: option => {
        return {
            action: "replace",
            value: option.value,
        };
    },
};

export function getCellChildAutoCompleter(): WPCompleter<Option> {
    return {
        ...baseCellChildAutoCompleter,
        options: [
            { icon: buttonBlockIcon, name: "Button", value: "button" },
            { icon: imageBlockIcon, name: "Image", value: "image" },
            { icon: StyledListIcon, name: "List", value: "list" },
            {
                icon: RibbonIcon,
                name: "Ribbon",
                value: "ribbon",
                disabled: true,
            },
            ...getExtendedElementDefinitions().map(definition => ({
                icon: definition.icon as JSX.Element,
                name: definition.autocompleteLabel || definition.title,
                value: definition.name as ElementTypes,
            })),
        ],
    };
}

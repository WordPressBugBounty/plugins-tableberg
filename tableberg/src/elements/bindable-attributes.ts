import { __ } from "@wordpress/i18n";
import { buttonBindableAttributes } from "../blocks/button/element";
import { textBindableAttributes } from "../blocks/text/element";
import { imageBindableAttributes } from "../blocks/image/element";
import { listBindableAttributes } from "../blocks/list/element";
import { BindableAttribute } from "../dynamic-data";
import { getExtendedElementDefinition } from "../extensions";

export function getElementBindableAttributes(
    elementType: string
): BindableAttribute[] {
    switch (elementType) {
        case "text":
            return textBindableAttributes;
        case "button":
            return buttonBindableAttributes;
        case "image":
            return imageBindableAttributes;
        case "list":
            return listBindableAttributes;
        default:
            return (
                getExtendedElementDefinition(elementType)?.bindableAttributes ||
                []
            );
    }
}

import { ElementBindings } from "../dynamic-data/types";
import { CellElement, CellKey, ElementTypes } from "../attributes";
import { textAttributeDefaults } from "../blocks/text/element";
import { buttonAttrDefaults } from "../blocks/button/element";
import { imageAttrDefaults } from "../blocks/image/element";
import { listAttrDefaults } from "../blocks/list/element";
import { createExtendedElement } from "../extensions";

export type { TextElementType, TextElementAttributes } from "../blocks/text/element";
export { TextElement, textAttributeDefaults } from "../blocks/text/element";

export type { ButtonElementType, ButtonElementAttributes } from "../blocks/button/element";
export { ButtonElement, buttonAttrDefaults } from "../blocks/button/element";

export type { ImageElementType, ImageElementAttributes } from "../blocks/image/element";
export { ImageElement, imageAttrDefaults } from "../blocks/image/element";

export type { ListElementType, ListElementAttributes } from "../blocks/list/element";
export { ListElement, listAttrDefaults } from "../blocks/list/element";

export interface ElementRendererProps<T> {
    attributes: T;
    bindings?: ElementBindings;
    cellCoords: CellKey;
    elementIndex: number;
}

export function getElementTextContent(element: CellElement): string {
    switch (element.name) {
        case "text":
        case "button":
            return element.attributes.content || "";
        default:
            return "";
    }
}

export function createElement(name: ElementTypes): CellElement | null {
    switch (name) {
        case "text":
            return {
                name: "text",
                attributes: { ...textAttributeDefaults },
            };
        case "button":
            return {
                name: "button",
                attributes: { ...buttonAttrDefaults },
            };
        case "image":
            return {
                name: "image",
                attributes: { ...imageAttrDefaults },
            };
        case "list":
            return {
                name: "list",
                attributes: { ...listAttrDefaults },
            };
        default:
            return createExtendedElement(name);
    }
}

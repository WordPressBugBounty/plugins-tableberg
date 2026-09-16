import { CSSProperties } from "react";
import { CellElement } from "./attributes";

export type ElementAlignment = "left" | "center" | "right";

export const DEFAULT_ELEMENT_ALIGNMENT: ElementAlignment = "left";

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null;
}

export function isElementAlignment(value: unknown): value is ElementAlignment {
    return value === "left" || value === "center" || value === "right";
}

export function elementAlignmentToJustifyContent(
    alignment: ElementAlignment
): CSSProperties["justifyContent"] {
    if (alignment === "center") {
        return "center";
    }

    if (alignment === "right") {
        return "flex-end";
    }

    return "flex-start";
}

export function getElementAlignment(element: CellElement): ElementAlignment {
    const elementName = element.name as string;
    const attrs: Record<string, unknown> = isRecord(element.attributes)
        ? element.attributes
        : {};

    if (elementName === "icon") {
        const rawStyles = attrs["styles"];
        const styles = isRecord(rawStyles) ? rawStyles : {};
        return isElementAlignment(styles.align)
            ? styles.align
            : DEFAULT_ELEMENT_ALIGNMENT;
    }

    return isElementAlignment(attrs.align)
        ? attrs.align
        : DEFAULT_ELEMENT_ALIGNMENT;
}

export function setElementAlignment(
    element: CellElement,
    alignment: ElementAlignment
): CellElement {
    const elementName = element.name as string;
    const attrs = isRecord(element.attributes)
        ? { ...element.attributes }
        : ({} as Record<string, unknown>);

    if (elementName === "icon") {
        const rawStyles = attrs["styles"];
        const styles = isRecord(rawStyles)
            ? { ...rawStyles }
            : ({} as Record<string, unknown>);

        return {
            ...element,
            attributes: {
                ...attrs,
                styles: {
                    ...styles,
                    align: alignment,
                },
            },
        } as CellElement;
    }

    return {
        ...element,
        attributes: {
            ...attrs,
            align: alignment,
        },
    } as CellElement;
}

export function getUniformElementsAlignment(
    elements: CellElement[]
): ElementAlignment | undefined {
    if (elements.length === 0) {
        return DEFAULT_ELEMENT_ALIGNMENT;
    }

    const first = getElementAlignment(elements[0]);

    for (let i = 1; i < elements.length; i++) {
        if (getElementAlignment(elements[i]) !== first) {
            return undefined;
        }
    }

    return first;
}

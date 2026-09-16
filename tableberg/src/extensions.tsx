import { ReactNode } from "react";
import { applyFilters } from "@wordpress/hooks";

import { CellElement, CellKey } from "./attributes";
import { BindableAttribute } from "./dynamic-data";

export interface ExtendedElementRendererProps {
    element: CellElement;
    cellCoords: CellKey;
    elementIndex: number;
}

export interface ExtendedElementDefinition {
    name: string;
    title: string;
    icon: ReactNode;
    blockName: string;
    create: () => CellElement;
    render: (props: ExtendedElementRendererProps) => ReactNode;
    bindableAttributes?: BindableAttribute[];
    autocompleteLabel?: string;
}

export function getExtendedElementDefinitions(): ExtendedElementDefinition[] {
    return applyFilters(
        "tableberg.extendedElementDefinitions",
        [] as ExtendedElementDefinition[]
    ) as ExtendedElementDefinition[];
}

export function getExtendedElementDefinition(
    name: string
): ExtendedElementDefinition | undefined {
    return getExtendedElementDefinitions().find(
        definition => definition.name === name
    );
}

export function createExtendedElement(name: string): CellElement | null {
    return getExtendedElementDefinition(name)?.create() ?? null;
}

export function renderExtendedElement(
    element: CellElement,
    cellCoords: CellKey,
    elementIndex: number
): ReactNode | null {
    return (
        getExtendedElementDefinition(element.name)?.render({
            element,
            cellCoords,
            elementIndex,
        }) ?? null
    );
}

export function getExtendedElementBlockName(
    element: CellElement
): string | undefined {
    return getExtendedElementDefinition(element.name)?.blockName;
}

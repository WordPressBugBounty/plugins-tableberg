import { useCallback } from "react";

export function useBlockCardUpdateShim() {
    return useCallback(
        (element: HTMLElement, title: string, description: string) => {
            const ownerDoc = element.ownerDocument;
            const parentDoc =
                ownerDoc.defaultView?.parent?.document || ownerDoc;

            const blockCardTitle = parentDoc.querySelector(
                ".block-editor-block-card__title"
            );
            if (blockCardTitle) {
                blockCardTitle.textContent = title;
            }

            const blockCardDescription = parentDoc.querySelector(
                ".block-editor-block-card__description"
            );
            if (blockCardDescription) {
                blockCardDescription.textContent = description;
            }
        },
        []
    );
}

import { useEffect, RefObject } from "react";

const TOOLBAR_CLASS = ".block-editor-block-toolbar";
const TABLEBERG_TOOLBAR_CLASSES = [
    ".tableberg-edit-toolbar",
    ".tableberg-edit-toolbar-mount",
].join(", ");

const POPOVER_CLASSES = [
    ".block-editor-block-popover",
    ".components-popover",
].join(", ");
const SIDEBAR_CLASS = ".interface-interface-skeleton__sidebar";

const BLOCK_INSERTER_CLASSES = [
    ".editor-inserter-sidebar",
    ".block-editor-inserter__menu",
].join(", ");
const INSERTER_BUTTON_CLASSES = [
    ".editor-document-tools__inserter-toggle",
    ".edit-post-header-toolbar__inserter-toggle",
].join(", ");
const INSERTER_POPOVER_CLASS = ".block-editor-inserter__popover";

const TOPLEFT_BUTTONS_CLASSES = [
    ".editor-document-tools",
    ".edit-post-header-toolbar",
].join(", ");

interface UseClickOutsideOptions {
    ref: RefObject<HTMLElement>;
    onClickOutside: () => void;
}

export function useClickOutside({
    ref,
    onClickOutside,
}: UseClickOutsideOptions): void {
    useEffect(() => {
        const ownerDocument = ref.current?.ownerDocument;

        if (!ownerDocument) {
            return;
        }

        function handleClickOutside(event: MouseEvent) {
            if (!ref.current) {
                return;
            }

            const targetNode = event.target as Node | null;

            if (!targetNode || ref.current.contains(targetNode)) {
                return;
            }

            const targetElement =
                targetNode instanceof Element
                    ? targetNode
                    : targetNode.parentElement;

            if (!targetElement) {
                onClickOutside();
                return;
            }

            const editorChrome = targetElement.closest(
                [
                    TOOLBAR_CLASS,
                    TABLEBERG_TOOLBAR_CLASSES,
                    POPOVER_CLASSES,
                    SIDEBAR_CLASS,
                    BLOCK_INSERTER_CLASSES,
                    INSERTER_BUTTON_CLASSES,
                    INSERTER_POPOVER_CLASS,
                    TOPLEFT_BUTTONS_CLASSES,
                ].join(", ")
            );

            if (editorChrome) {
                return;
            }

            onClickOutside();
        }

        ownerDocument.addEventListener("mousedown", handleClickOutside);

        return () =>
            ownerDocument.removeEventListener("mousedown", handleClickOutside);
    }, [onClickOutside, ref]);
}

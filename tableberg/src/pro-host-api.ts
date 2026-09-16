import { elementAlignmentToJustifyContent } from "./alignment";
import { DynamicDataPanel } from "./components/DynamicDataPanel";
import { ElementDeleteButton } from "./components/ElementDeleteButton";
import { ElementOptionsButton } from "./components/ElementOptionsButton";
import { useDynamicDataBindings } from "./dynamic-data/hooks/useDynamicData";
import { useBlockCardUpdateShim } from "./hooks/block-editor-compat";
import { useClickOutside } from "./hooks/useClickOutside";
import { registerNativeElementBlock } from "./blocks/element-bridge";
import { useTableStore } from "./store";
import { ListElement, listAttrDefaults } from "./blocks/list/element";

declare global {
    interface Window {
        TablebergProHost?: {
            DynamicDataPanel: typeof DynamicDataPanel;
            ElementDeleteButton: typeof ElementDeleteButton;
            ElementOptionsButton: typeof ElementOptionsButton;
            elementAlignmentToJustifyContent: typeof elementAlignmentToJustifyContent;
            useBlockCardUpdateShim: typeof useBlockCardUpdateShim;
            useClickOutside: typeof useClickOutside;
            useDynamicDataBindings: typeof useDynamicDataBindings;
            useTableStore: typeof useTableStore;
            ListElement: typeof ListElement;
            listAttrDefaults: typeof listAttrDefaults;
            registerNativeElementBlock: typeof registerNativeElementBlock;
        };
    }
}

if (!window.TablebergProHost) {
    window.TablebergProHost = {
        DynamicDataPanel,
        ElementDeleteButton,
        ElementOptionsButton,
        elementAlignmentToJustifyContent,
        useBlockCardUpdateShim,
        useClickOutside,
        useDynamicDataBindings,
        useTableStore,
        ListElement,
        listAttrDefaults,
        registerNativeElementBlock,
    };
}

import { BlockControls, InspectorControls } from "@wordpress/block-editor";
import { ToolbarButton, ToolbarGroup } from "@wordpress/components";
import { __ } from "@wordpress/i18n";
import { ToolbarWithDropdown } from "@tableberg/components";

import { CellKey } from "../../attributes";
import { useTableStore } from "../../store";
import { CustomHtmlElementAttributes } from ".";
import { ElementBindings } from "../../dynamic-data/types";
import { DynamicDataPanel } from "../../components/DynamicDataPanel";
import { ElementDeleteButton } from "../../components/ElementDeleteButton";
import { ElementOptionsBlockControls } from "../../components/ElementOptionsButton";

export function CustomHtmlElementControls({
    attributes,
    bindings,
    isPreview,
    setIsPreview,
    cellCoords,
    elementIndex,
}: {
    attributes: CustomHtmlElementAttributes;
    bindings?: ElementBindings;
    isPreview: boolean;
    setIsPreview: (isPreview: boolean) => void;
    cellCoords: CellKey;
    elementIndex: number;
}) {
    const contentIsBound = !!bindings?.content;
    const updateAttrs = useTableStore(
        state => state.updateSelectedElementAttrs
    );

    return (
        <>
            <BlockControls>
                <ToolbarGroup>
                    <ToolbarWithDropdown
                        title={__("Align HTML", "tableberg")}
                        value={attributes.align}
                        onChange={(newAlign?: string) => {
                            if (
                                newAlign !== "left" &&
                                newAlign !== "center" &&
                                newAlign !== "right"
                            ) {
                                return;
                            }

                            updateAttrs({
                                align: newAlign,
                            });
                        }}
                        controlset="alignment"
                    />
                    <ToolbarButton
                        className="components-tab-button"
                        isPressed={!isPreview}
                        onClick={() => setIsPreview(false)}
                        disabled={contentIsBound}
                    >
                        {__("HTML", "tableberg")}
                    </ToolbarButton>
                    <ToolbarButton
                        className="components-tab-button"
                        isPressed={isPreview}
                        onClick={() => setIsPreview(true)}
                    >
                        {__("Preview", "tableberg")}
                    </ToolbarButton>
                </ToolbarGroup>
                <ElementDeleteButton
                    cellCoords={cellCoords}
                    elementIndex={elementIndex}
                />
            </BlockControls>
            <ElementOptionsBlockControls
                cellCoords={cellCoords}
                elementIndex={elementIndex}
            />
            <InspectorControls>
                <DynamicDataPanel
                    elementType="custom-html"
                    bindings={bindings}
                />
            </InspectorControls>
        </>
    );
}

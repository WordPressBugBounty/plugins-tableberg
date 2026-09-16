import { ComponentType, useEffect, useMemo, useRef } from "react";
import {
    store as blockEditorStore,
    useBlockProps,
} from "@wordpress/block-editor";
import {
    BlockEditProps,
    createBlock,
    registerBlockType,
} from "@wordpress/blocks";
import { dispatch as dataDispatch, select as dataSelect } from "@wordpress/data";
import { create } from "zustand";

import { CellKey } from "../attributes";
import { TableStoreContext } from "../store";
import { ElementBindings } from "../dynamic-data/types";

/**
 * Runs an existing (store-coupled) element component as a real block's edit.
 *
 * The component sees a patched table store whose element-update actions
 * route into setAttributes, and whose selection mirrors the block's native
 * selection. Element components only touch a tiny store surface
 * (sortPreviewMode, isElementSelected, setSelectedElement,
 * updateCellElement and the selected-element update actions), so the bridge
 * fakes exactly that.
 */

const BRIDGE_COORDS = "0,0" as CellKey;

export interface BridgedElementProps {
    attributes: Record<string, unknown>;
    bindings?: ElementBindings;
    cellCoords: CellKey;
    elementIndex: number;
}

interface BridgeRefs {
    attributes: Record<string, unknown>;
    setAttributes: (attrs: Record<string, unknown>) => void;
    isSelected: boolean;
    clientId: string;
    elementName: string;
}

function syntheticCells(refs: { current: BridgeRefs }) {
    const { bindings, ...attributes } = refs.current.attributes;
    return {
        [BRIDGE_COORDS]: {
            elements: [
                {
                    name: refs.current.elementName,
                    attributes,
                    ...(bindings ? { bindings } : {}),
                },
            ],
        },
    };
}

function createBridgeStore(refs: { current: BridgeRefs }) {
    const be = () => dataDispatch(blockEditorStore) as any;

    return create(() => ({
        // Reads the reused components perform.
        sortPreviewMode: false,
        searchTerm: "",
        table: { search: undefined },
        cells: syntheticCells(refs),

        isElementSelected: () => refs.current.isSelected,
        // Native selection is the block's own selection; clicking the
        // element already selects the block, so these are no-ops.
        setSelectedElement: () => {},
        clearSelectedElement: () => {},

        updateCellElement: (
            _coords: CellKey,
            _index: number,
            updates: {
                attributes?: Record<string, unknown>;
                bindings?: ElementBindings;
            }
        ) => {
            const next: Record<string, unknown> = {
                ...(updates.attributes ?? {}),
            };
            if (updates.bindings !== undefined) {
                next.bindings = updates.bindings;
            }
            refs.current.setAttributes(next);
        },

        updateSelectedElementAttrs: (attrs: Record<string, unknown>) => {
            refs.current.setAttributes(attrs);
        },

        updateSelectedElementStyles: (styles: Record<string, unknown>) => {
            refs.current.setAttributes({
                styles: {
                    ...((refs.current.attributes.styles as object) ?? {}),
                    ...styles,
                },
            });
        },

        updateSelectedElementBindings: (
            bindings: ElementBindings | undefined
        ) => {
            refs.current.setAttributes({ bindings });
        },

        // Element structure ops route to native block operations.
        removeElementFromCell: () => {
            be().removeBlocks([refs.current.clientId]);
        },

        duplicateElementInCell: () => {
            const select = dataSelect(blockEditorStore) as any;
            const parent = select.getBlockRootClientId(refs.current.clientId);
            be().duplicateBlocks([refs.current.clientId]);
            void parent;
        },

        insertElementInCell: (
            _coords: CellKey,
            _index: number,
            element: {
                name: string;
                attributes?: Record<string, unknown>;
                bindings?: ElementBindings;
            }
        ) => {
            const select = dataSelect(blockEditorStore) as any;
            const parent = select.getBlockRootClientId(refs.current.clientId);
            if (!parent) {
                return;
            }
            const ownIndex = select.getBlockIndex(refs.current.clientId);
            const attrs: Record<string, unknown> = {
                ...(element.attributes ?? {}),
            };
            if (element.bindings) {
                attrs.bindings = element.bindings;
            }
            be().insertBlocks(
                createBlock(`tableberg/${element.name}`, attrs),
                ownIndex + 1,
                parent
            );
        },

        reorderElementsInCell: () => {
            // Native List View drag handles element reordering.
        },
    }));
}

export interface NativeElementBlockConfig {
    metadata: {
        name: string;
        title: string;
        [key: string]: unknown;
    };
    icon: unknown;
    /** The existing element component (free or pro). */
    component: ComponentType<BridgedElementProps>;
}

/**
 * Wraps a store-coupled element component as a block `edit`. Blocks that own
 * a block.json use this directly; blocks registered wholly from JS go through
 * registerNativeElementBlock below.
 */
export function createBridgedElementEdit(
    blockName: string,
    Component: ComponentType<BridgedElementProps>
) {
    const elementName = blockName.replace(/^tableberg\//, "");

    return function BridgedEdit(
        props: BlockEditProps<Record<string, unknown>> &
            Record<string, unknown>
    ) {
        const { attributes, setAttributes, isSelected, clientId } = props;

        const refs = useRef<BridgeRefs>({
            attributes,
            setAttributes,
            isSelected,
            clientId,
            elementName,
        });
        refs.current = {
            attributes,
            setAttributes,
            isSelected,
            clientId,
            elementName,
        };

        const bridgeStore = useMemo(() => createBridgeStore(refs), []);

        // Keep the synthetic cells map fresh for components reading it
        // (e.g. the element options toolbar).
        useEffect(() => {
            (bridgeStore as any).setState({ cells: syntheticCells(refs) });
        }, [attributes, bridgeStore]);

        const blockProps = useBlockProps();
        const { bindings, ...elementAttributes } = attributes;

        // Anything the pro plugin injected through `editor.BlockEdit` is
        // passed on to the element component. The block's own props are
        // left behind — the component works off the element interface.
        const proProps = Object.fromEntries(
            Object.entries(props).filter(([key]) => key.startsWith("Pro"))
        );

        return (
            <TableStoreContext.Provider value={bridgeStore as any}>
                <div {...blockProps}>
                    <Component
                        {...proProps}
                        attributes={elementAttributes}
                        bindings={bindings as ElementBindings | undefined}
                        cellCoords={BRIDGE_COORDS}
                        elementIndex={0}
                    />
                </div>
            </TableStoreContext.Provider>
        );
    };
}

export function registerNativeElementBlock(config: NativeElementBlockConfig) {
    registerBlockType(config.metadata.name, {
        ...(config.metadata as any),
        icon: config.icon as any,
        edit: createBridgedElementEdit(
            config.metadata.name,
            config.component
        ),
        save: () => null,
    } as any);
}

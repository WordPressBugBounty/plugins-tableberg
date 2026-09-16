import { __ } from "@wordpress/i18n";
import {
    PanelBody,
    TextControl,
    Button,
    Spinner,
    SelectControl,
} from "@wordpress/components";
import { useState, useEffect, useRef, useMemo, RefObject } from "react";
import { useSelect } from "@wordpress/data";
import { useQuery } from "@tanstack/react-query";
import { store as editorStore } from "@wordpress/editor";

import {
    BindingSource,
    ElementBindings,
    BindableAttribute,
} from "../../dynamic-data/types";
import { postFieldKeys } from "../../dynamic-data/sources";
import {
    useDynamicData,
    fetchAvailableMetaKeys,
} from "../../dynamic-data/hooks/useDynamicData";
import { getElementBindableAttributes } from "../../elements/bindable-attributes";
import { useTableStore } from "../../store";

interface DynamicDataPanelProps {
    elementType: string;
    bindings: ElementBindings | undefined;
    postId?: number;
}

export function DynamicDataPanel({
    elementType,
    bindings = {},
    postId: propPostId,
}: DynamicDataPanelProps) {
    const [isAdding, setIsAdding] = useState(false);
    const bindingDefinitions = useTableStore(state => state.bindings);
    const updateSelectedElementBindings = useTableStore(
        state => state.updateSelectedElementBindings
    );
    const createBindingDefinition = useTableStore(
        state => state.createBindingDefinition
    );
    const updateBindingDefinition = useTableStore(
        state => state.updateBindingDefinition
    );
    const removeBindingDefinition = useTableStore(
        state => state.removeBindingDefinition
    );

    const effectivePostId = useSelect(
        select => {
            if (propPostId) {
                return propPostId;
            }
            const editorSelect = select(editorStore) as {
                getCurrentPostId?: () => number | undefined;
            };
            return editorSelect.getCurrentPostId?.() ?? undefined;
        },
        [propPostId]
    );

    const bindableAttributes = getElementBindableAttributes(elementType);

    if (bindableAttributes.length === 0) {
        return;
    }

    const boundAttributes = bindableAttributes.filter(
        attr =>
            attr.path in bindings && !!bindingDefinitions[bindings[attr.path]]
    );
    const unboundAttributes = bindableAttributes.filter(
        attr => !(attr.path in bindings)
    );

    const handleAddBinding = (path: string, binding: BindingSource) => {
        const bindingId = createBindingDefinition(binding);
        const newBindings = {
            ...bindings,
            [path]: bindingId,
        };

        updateSelectedElementBindings(newBindings);
    };

    const handleUpdateBinding = (
        previousPath: string,
        nextPath: string,
        bindingId: string,
        binding: BindingSource
    ) => {
        updateBindingDefinition(bindingId, binding);

        const nextBindings = { ...bindings };
        if (previousPath !== nextPath) {
            delete nextBindings[previousPath];
        }
        nextBindings[nextPath] = bindingId;
        updateSelectedElementBindings(nextBindings);
    };

    const handleRemoveBinding = (path: string, bindingId: string) => {
        const newBindings = { ...bindings };
        delete newBindings[path];

        updateSelectedElementBindings(
            Object.keys(newBindings).length > 0 ? newBindings : undefined
        );
        removeBindingDefinition(bindingId);
    };

    return (
        <PanelBody
            title={__("Dynamic Data", "tableberg")}
            initialOpen={boundAttributes.length > 0}
        >
            {boundAttributes.map(attr => {
                const bindingId = bindings[attr.path];
                const binding = bindingDefinitions[bindingId];

                if (!bindingId || !binding) {
                    return null;
                }

                return (
                    <AttributeBinding
                        key={attr.path}
                        attribute={attr}
                        binding={binding}
                        bindableAttributes={bindableAttributes}
                        boundPaths={boundAttributes.map(a => a.path)}
                        onBindingChange={(newPath, newBinding) => {
                            handleUpdateBinding(
                                attr.path,
                                newPath,
                                bindingId,
                                newBinding
                            );
                        }}
                        onRemove={() =>
                            handleRemoveBinding(attr.path, bindingId)
                        }
                        postId={effectivePostId}
                    />
                );
            })}

            {isAdding && (
                <NewBindingForm
                    unboundAttributes={unboundAttributes}
                    onApply={(path, binding) => {
                        handleAddBinding(path, binding);
                        setIsAdding(false);
                    }}
                    onCancel={() => setIsAdding(false)}
                    postId={effectivePostId}
                />
            )}

            {!isAdding && unboundAttributes.length > 0 && (
                <div className="tableberg-dynamic-data__add">
                    <Button
                        variant="secondary"
                        onClick={() => setIsAdding(true)}
                    >
                        {__("Add Binding", "tableberg")}
                    </Button>
                </div>
            )}
        </PanelBody>
    );
}

interface NewBindingFormProps {
    unboundAttributes: BindableAttribute[];
    onApply: (path: string, binding: BindingSource) => void;
    onCancel: () => void;
    postId?: number;
}

function BindingFormFields({
    selectedPath,
    setSelectedPath,
    pathOptions,
    keyValue,
    setKeyValue,
    customPostId,
    setCustomPostId,
    fallback,
    setFallback,
    submitLabel,
    cancelLabel,
    onCancel,
    showRefresh,
    onRefresh,
    refreshLabel,
    isLoadingKeys,
    hasSuggestions,
    suggestions,
    isSuggestionsOpen,
    setIsSuggestionsOpen,
    fieldInputRef,
    previewValue,
    isDestructiveRemove,
    onRemove,
}: {
    selectedPath: string;
    setSelectedPath: (value: string) => void;
    pathOptions: Array<{ value: string; label: string }>;
    keyValue: string;
    setKeyValue: (value: string) => void;
    customPostId: string;
    setCustomPostId: (value: string) => void;
    fallback: string;
    setFallback: (value: string) => void;
    submitLabel: string;
    cancelLabel?: string;
    onCancel?: () => void;
    showRefresh?: boolean;
    onRefresh?: () => void;
    refreshLabel?: string;
    isLoadingKeys: boolean;
    hasSuggestions: boolean;
    suggestions: {
        postFields: Array<{ key: string; label?: string }>;
        metaKeys: Array<{ key: string; label?: string }>;
    };
    isSuggestionsOpen: boolean;
    setIsSuggestionsOpen: (value: boolean) => void;
    fieldInputRef: RefObject<HTMLDivElement | null>;
    previewValue?: string | null;
    isDestructiveRemove?: boolean;
    onRemove?: () => void;
}) {
    return (
        <>
            <SelectControl
                label={__("Attribute", "tableberg")}
                value={selectedPath}
                onChange={setSelectedPath}
                options={pathOptions}
            />

            <TextControl
                label={__("Post ID (optional)", "tableberg")}
                value={customPostId}
                onChange={setCustomPostId}
                placeholder={__("Current post", "tableberg")}
                type="number"
                help={__("Leave empty to use the current post", "tableberg")}
            />

            <div
                ref={fieldInputRef as RefObject<HTMLDivElement>}
                className="tableberg-dynamic-data-row__field-autocomplete"
            >
                <TextControl
                    label={__("Field", "tableberg")}
                    value={keyValue}
                    onChange={value => {
                        setKeyValue(value);
                        setIsSuggestionsOpen(true);
                    }}
                    onFocus={() => setIsSuggestionsOpen(true)}
                    placeholder={__("Search or type field key...", "tableberg")}
                    autoComplete="off"
                />
                {isSuggestionsOpen && !isLoadingKeys && hasSuggestions && (
                    <div className="tableberg-dynamic-data-row__suggestions">
                        {suggestions.postFields.length > 0 && (
                            <>
                                <div className="tableberg-dynamic-data-row__suggestions-group">
                                    {__("Post Fields", "tableberg")}
                                </div>
                                {suggestions.postFields.map(item => (
                                    <button
                                        key={item.key}
                                        type="button"
                                        className={`tableberg-dynamic-data-row__suggestion${keyValue === item.key ? " is-selected" : ""}`}
                                        onClick={() => {
                                            setKeyValue(item.key);
                                            setIsSuggestionsOpen(false);
                                        }}
                                    >
                                        <span className="tableberg-dynamic-data-row__suggestion-label">
                                            {item.label ?? item.key}
                                        </span>
                                        <span className="tableberg-dynamic-data-row__suggestion-key">
                                            {item.key}
                                        </span>
                                    </button>
                                ))}
                            </>
                        )}
                        {suggestions.metaKeys.length > 0 && (
                            <>
                                <div className="tableberg-dynamic-data-row__suggestions-group">
                                    {__("Custom Fields", "tableberg")}
                                </div>
                                {suggestions.metaKeys.map(item => (
                                    <button
                                        key={item.key}
                                        type="button"
                                        className={`tableberg-dynamic-data-row__suggestion${keyValue === item.key ? " is-selected" : ""}`}
                                        onClick={() => {
                                            setKeyValue(item.key);
                                            setIsSuggestionsOpen(false);
                                        }}
                                    >
                                        <span className="tableberg-dynamic-data-row__suggestion-label">
                                            {item.label ?? item.key}
                                        </span>
                                        {item.label && (
                                            <span className="tableberg-dynamic-data-row__suggestion-key">
                                                {item.key}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </>
                        )}
                    </div>
                )}
                {isSuggestionsOpen && isLoadingKeys && <Spinner />}
            </div>

            <TextControl
                label={__("Fallback Value", "tableberg")}
                value={fallback}
                onChange={setFallback}
                placeholder={__("Value if field is empty", "tableberg")}
            />

            {previewValue !== undefined && previewValue !== null && (
                <div className="tableberg-dynamic-data-row__preview">
                    <strong>{__("Preview:", "tableberg")}</strong>{" "}
                    <span>{String(previewValue)}</span>
                </div>
            )}

            <div className="tableberg-dynamic-data-row__actions">
                {showRefresh ? (
                    <Button
                        variant="secondary"
                        type="button"
                        icon="update"
                        onClick={onRefresh}
                    >
                        {refreshLabel || __("Refresh", "tableberg")}
                    </Button>
                ) : (
                    <Button
                        variant="primary"
                        type="submit"
                        disabled={!selectedPath || !keyValue}
                    >
                        {submitLabel}
                    </Button>
                )}
                {onRemove && (
                    <Button
                        variant="link"
                        type="button"
                        isDestructive={isDestructiveRemove}
                        onClick={onRemove}
                    >
                        {__("Remove", "tableberg")}
                    </Button>
                )}
                {onCancel && (
                    <Button variant="link" type="button" onClick={onCancel}>
                        {cancelLabel || __("Cancel", "tableberg")}
                    </Button>
                )}
            </div>
        </>
    );
}

function useBindingFormState({
    keyValue,
    postId,
}: {
    keyValue: string;
    postId?: number;
}) {
    const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
    const fieldInputRef = useRef<HTMLDivElement>(null);

    const { data: metaKeys = [], isLoading: isLoadingKeys } = useQuery({
        queryKey: ["metaKeys", postId],
        queryFn: () => fetchAvailableMetaKeys(postId),
        staleTime: Infinity,
    });

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                fieldInputRef.current &&
                !fieldInputRef.current.contains(event.target as Node)
            ) {
                setIsSuggestionsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const suggestions = useMemo(() => {
        const query = keyValue.toLowerCase();

        return {
            postFields: postFieldKeys.filter(
                item =>
                    item.key.toLowerCase().includes(query) ||
                    (item.label && item.label.toLowerCase().includes(query))
            ),
            metaKeys: metaKeys.filter(
                item =>
                    item.key.toLowerCase().includes(query) ||
                    (item.label && item.label.toLowerCase().includes(query))
            ),
        };
    }, [keyValue, metaKeys]);

    return {
        fieldInputRef,
        isSuggestionsOpen,
        setIsSuggestionsOpen,
        suggestions,
        hasSuggestions:
            suggestions.postFields.length > 0 ||
            suggestions.metaKeys.length > 0,
        isLoadingKeys,
    };
}

function createBindingSource(
    keyValue: string,
    customPostId: string,
    fallback: string
): BindingSource {
    const binding: BindingSource = { key: keyValue };

    if (customPostId) {
        const parsedId = parseInt(customPostId, 10);
        if (!isNaN(parsedId) && parsedId > 0) {
            binding.postId = parsedId;
        }
    }

    if (fallback) {
        binding.fallback = fallback;
    }

    return binding;
}

function NewBindingForm({
    unboundAttributes,
    onApply,
    onCancel,
    postId,
}: NewBindingFormProps) {
    const [selectedPath, setSelectedPath] = useState("");
    const [keyValue, setKeyValue] = useState("");
    const [customPostId, setCustomPostId] = useState("");
    const [fallback, setFallback] = useState("");

    const metaPostId = customPostId
        ? parseInt(customPostId, 10) || undefined
        : postId;

    const {
        fieldInputRef,
        isSuggestionsOpen,
        setIsSuggestionsOpen,
        suggestions,
        hasSuggestions,
        isLoadingKeys,
    } = useBindingFormState({
        keyValue,
        postId: metaPostId,
    });

    return (
        <div className="tableberg-dynamic-data-row">
            <form
                className="tableberg-dynamic-data-row__config"
                onSubmit={event => {
                    event.preventDefault();
                    if (!selectedPath || !keyValue) {
                        return;
                    }
                    onApply(
                        selectedPath,
                        createBindingSource(keyValue, customPostId, fallback)
                    );
                }}
            >
                <BindingFormFields
                    selectedPath={selectedPath}
                    setSelectedPath={setSelectedPath}
                    pathOptions={[
                        {
                            value: "",
                            label: __("Select attribute...", "tableberg"),
                        },
                        ...unboundAttributes.map(attribute => ({
                            value: attribute.path,
                            label: attribute.label,
                        })),
                    ]}
                    keyValue={keyValue}
                    setKeyValue={setKeyValue}
                    customPostId={customPostId}
                    setCustomPostId={setCustomPostId}
                    fallback={fallback}
                    setFallback={setFallback}
                    submitLabel={__("Apply Binding", "tableberg")}
                    cancelLabel={__("Cancel", "tableberg")}
                    onCancel={onCancel}
                    isLoadingKeys={isLoadingKeys}
                    hasSuggestions={hasSuggestions}
                    suggestions={suggestions}
                    isSuggestionsOpen={isSuggestionsOpen}
                    setIsSuggestionsOpen={setIsSuggestionsOpen}
                    fieldInputRef={fieldInputRef}
                />
            </form>
        </div>
    );
}

interface AttributeBindingProps {
    attribute: BindableAttribute;
    binding: BindingSource;
    bindableAttributes: BindableAttribute[];
    boundPaths: string[];
    onBindingChange: (path: string, binding: BindingSource) => void;
    onRemove: () => void;
    postId?: number;
}

function AttributeBinding({
    attribute,
    binding,
    bindableAttributes,
    boundPaths,
    onBindingChange,
    onRemove,
    postId,
}: AttributeBindingProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [selectedPath, setSelectedPath] = useState(attribute.path);
    const [keyValue, setKeyValue] = useState(binding.key);
    const [customPostId, setCustomPostId] = useState(
        binding.postId?.toString() ?? ""
    );
    const [fallback, setFallback] = useState(binding.fallback ?? "");

    const metaPostId = customPostId
        ? parseInt(customPostId, 10) || undefined
        : postId;

    const {
        fieldInputRef,
        isSuggestionsOpen,
        setIsSuggestionsOpen,
        suggestions,
        hasSuggestions,
        isLoadingKeys,
    } = useBindingFormState({
        keyValue,
        postId: metaPostId,
    });

    const hasUnsavedChanges =
        selectedPath !== attribute.path ||
        keyValue !== binding.key ||
        customPostId !== (binding.postId?.toString() ?? "") ||
        fallback !== (binding.fallback ?? "");

    const { data: previewValue, refresh } = useDynamicData(binding, postId);

    const summary = customPostId
        ? `${binding.key} (post #${customPostId})`
        : binding.key;

    return (
        <div className="tableberg-dynamic-data-row">
            <button
                type="button"
                className="tableberg-dynamic-data-row__header"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <span className="tableberg-dynamic-data-row__label">
                    {attribute.label}
                </span>
                <span className="tableberg-dynamic-data-row__summary">
                    {summary}
                </span>
            </button>

            {isExpanded && (
                <form
                    className="tableberg-dynamic-data-row__config"
                    onSubmit={event => {
                        event.preventDefault();
                        if (!keyValue) {
                            return;
                        }
                        onBindingChange(
                            selectedPath,
                            createBindingSource(
                                keyValue,
                                customPostId,
                                fallback
                            )
                        );
                    }}
                >
                    <BindingFormFields
                        selectedPath={selectedPath}
                        setSelectedPath={setSelectedPath}
                        pathOptions={bindableAttributes
                            .filter(
                                item =>
                                    item.path === attribute.path ||
                                    !boundPaths.includes(item.path)
                            )
                            .map(item => ({
                                value: item.path,
                                label: item.label,
                            }))}
                        keyValue={keyValue}
                        setKeyValue={setKeyValue}
                        customPostId={customPostId}
                        setCustomPostId={setCustomPostId}
                        fallback={fallback}
                        setFallback={setFallback}
                        submitLabel={__("Update", "tableberg")}
                        showRefresh={!hasUnsavedChanges}
                        onRefresh={() => {
                            void refresh();
                        }}
                        refreshLabel={__("Refresh", "tableberg")}
                        isLoadingKeys={isLoadingKeys}
                        hasSuggestions={hasSuggestions}
                        suggestions={suggestions}
                        isSuggestionsOpen={isSuggestionsOpen}
                        setIsSuggestionsOpen={setIsSuggestionsOpen}
                        fieldInputRef={fieldInputRef}
                        previewValue={previewValue}
                        isDestructiveRemove
                        onRemove={onRemove}
                    />
                </form>
            )}
        </div>
    );
}

export default DynamicDataPanel;

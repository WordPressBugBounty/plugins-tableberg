import { useCallback } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import apiFetch from "@wordpress/api-fetch";
import { useSelect } from "@wordpress/data";
import { store as editorStore } from "@wordpress/editor";
import { BindingSource, ElementBindings } from "../types";
import { useTableStore } from "../../store";

function resolvePostId(
    binding: BindingSource | undefined,
    contextPostId?: number
): number | undefined {
    if (!binding) {
        return undefined;
    }
    return binding.postId ?? contextPostId;
}

async function queryDynamicData(key: string, postId?: number) {
    const params = new URLSearchParams({ key });

    if (postId) {
        params.append("postId", postId.toString());
    }

    const response = await apiFetch<{
        success: boolean;
        value: string | null;
    }>({
        path: `/tableberg/v1/dynamic-data/preview?${params.toString()}`,
    });

    return response;
}

export function useDynamicData(
    binding: BindingSource | undefined,
    contextPostId?: number
) {
    const queryClient = useQueryClient();
    const postId = resolvePostId(binding, contextPostId);

    const query = useQuery({
        queryKey: ["dynamicData", binding?.key, postId],
        queryFn: () => (binding ? queryDynamicData(binding.key, postId) : null),
        enabled: !!binding && !!postId,
        staleTime: Infinity,
    });

    const refresh = useCallback(async () => {
        if (!binding) return;
        await queryClient.invalidateQueries({
            queryKey: ["dynamicData", binding.key, postId],
        });
    }, [binding, postId, queryClient]);

    return {
        data: query.data?.value ?? null,
        isLoading: query.isLoading,
        isCached: query.data?.value !== null && !query.isFetching,
        refresh,
    };
}

export function useDynamicDataBindings(bindings: ElementBindings | undefined) {
    const queryClient = useQueryClient();
    const bindingDefinitions = useTableStore(state => state.bindings);

    const currentPostId = useSelect(select => {
        const editorSelect = select(editorStore) as {
            getCurrentPostId?: () => number | undefined;
        };
        return editorSelect.getCurrentPostId?.() ?? undefined;
    }, []);

    const resolvedBindings = Object.entries(bindings || {}).reduce<
        Record<string, BindingSource>
    >((acc, [path, bindingId]) => {
        const binding = bindingDefinitions[bindingId];
        if (binding) {
            acc[path] = binding;
        }
        return acc;
    }, {});

    const query = useQuery({
        queryKey: ["dynamicDataBindings", currentPostId, resolvedBindings],
        queryFn: async () => {
            if (!bindings) return {};
            const newValues: Record<string, string | null> = {};
            await Promise.all(
                Object.entries(resolvedBindings).map(
                    async ([path, binding]) => {
                        try {
                            const postId = resolvePostId(
                                binding,
                                currentPostId
                            );
                            const response = await queryDynamicData(
                                binding.key,
                                postId
                            );
                            if (response.success) {
                                newValues[path] =
                                    response.value ?? binding.fallback ?? null;
                            }
                        } catch {}
                    }
                )
            );
            return newValues;
        },
        enabled: Object.keys(resolvedBindings).length > 0 && !!currentPostId,
        staleTime: Infinity,
    });

    const refreshAll = useCallback(async () => {
        if (!bindings) return;
        await queryClient.invalidateQueries({
            queryKey: ["dynamicDataBindings", currentPostId, resolvedBindings],
        });
    }, [bindings, currentPostId, queryClient, resolvedBindings]);

    return {
        values: (query.data as Record<string, string | null>) || {},
        isLoading: query.isLoading,
        isCached: Object.keys(query.data || {}).length > 0 && !query.isFetching,
        refreshAll,
    };
}

export async function fetchAvailableMetaKeys(
    postId?: number
): Promise<Array<{ key: string; label?: string }>> {
    const params = new URLSearchParams();
    if (postId) {
        params.append("postId", postId.toString());
    }

    const query = params.toString();
    const path = `/tableberg/v1/dynamic-data/meta-keys${query ? `?${query}` : ""}`;

    try {
        const response = await apiFetch<{
            keys: Array<{ key: string; label?: string }>;
        }>({ path });
        return response.keys;
    } catch {
        return [];
    }
}

export { useDynamicData as default };

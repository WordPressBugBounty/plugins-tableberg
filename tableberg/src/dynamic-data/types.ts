export interface BindingSource {
    key: string;
    postId?: number;
    fallback?: string;
}

export type ElementBindings = Record<string, string>;

export interface BindableAttribute {
    path: string;
    label: string;
}

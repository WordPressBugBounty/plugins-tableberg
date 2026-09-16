import { __ } from "@wordpress/i18n";

export const postFieldKeys = [
    { key: "post_title", label: __("Title", "tableberg") },
    { key: "post_excerpt", label: __("Excerpt", "tableberg") },
    { key: "post_content", label: __("Content", "tableberg") },
    { key: "post_date", label: __("Publish Date", "tableberg") },
    { key: "post_modified", label: __("Modified Date", "tableberg") },
    { key: "post_author", label: __("Author Name", "tableberg") },
    { key: "permalink", label: __("Permalink", "tableberg") },
    { key: "featured_image", label: __("Featured Image URL", "tableberg") },
];

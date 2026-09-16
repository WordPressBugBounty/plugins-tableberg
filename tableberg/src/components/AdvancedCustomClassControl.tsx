import { InspectorControls } from "@wordpress/block-editor";
import { TextControl } from "@wordpress/components";
import { __ } from "@wordpress/i18n";

export function AdvancedCustomClassControl({
    label,
    value,
    onChange,
}: {
    label?: string;
    value?: string;
    onChange: (value: string | undefined) => void;
}) {
    return (
        <InspectorControls group="advanced">
            <TextControl
                __next40pxDefaultSize
                autoComplete="off"
                label={label || __("Additional CSS class(es)", "tableberg")}
                value={value || ""}
                onChange={nextValue => {
                    const trimmedValue = nextValue.trim();

                    onChange(trimmedValue !== "" ? trimmedValue : undefined);
                }}
                help={__("Separate multiple classes with spaces.", "tableberg")}
            />
        </InspectorControls>
    );
}

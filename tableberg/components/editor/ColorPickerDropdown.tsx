import { Button, ColorIndicator, Dropdown } from "@wordpress/components";

import { ColorPalette } from "@wordpress/block-editor";
import { useColorPalettes } from "./useColorPalettes";
import { Color } from "@wordpress/components/build-types/palette-edit/types";

import "./color-picker-dropdown-style.scss";

export interface ColorPickerDropdownProps {
    label: string;
    value: string;
    onChange: (value?: string) => void;
    colors?: Color[];
}

const ColorPickerDropdown = (props: ColorPickerDropdownProps) => {
    // Callers that pass no palette (e.g. the search highlight colour) used to
    // get an empty swatch list. Fall back to the editor's own origins so the
    // theme's Styles palette shows up here too.
    const paletteColors = useColorPalettes();

    return (
        <Dropdown
            className="tableberg-dropdown-color-picker"
            contentClassName="tbdcp-picker"
            popoverProps={{ placement: "bottom-start" }}
            renderToggle={({ isOpen, onToggle }) => (
                <Button
                    className="tbdcp-dropdown-handle"
                    onClick={onToggle}
                    aria-expanded={isOpen}
                >
                    <ColorIndicator colorValue={props.value} />
                    <label className="tbdcp-label">{props.label}</label>
                </Button>
            )}
            renderContent={() => (
                <ColorPalette
                    value={props.value}
                    onChange={props.onChange}
                    colors={props.colors ?? paletteColors}
                />
            )}
        />
    );
};

export default ColorPickerDropdown;

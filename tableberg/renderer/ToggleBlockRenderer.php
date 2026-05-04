<?php

namespace Tableberg\Renderer;

class ToggleBlockRenderer {
    private function get_css_variable_from_spacing_preset($value) {
        if (!$value || !is_string($value)) {
            return $value;
        }
        if ('0' === $value) {
            return $value;
        }
        if (strpos($value, 'var:preset|spacing|') !== 0) {
            return $value;
        }
        $matches = [];
        preg_match('/var:preset\|spacing\|(.+)/', $value, $matches);
        if (empty($matches)) {
            return $value;
        }
        return "var(--wp--preset--spacing--{$matches[1]})";
    }

    public function render($attributes, $content) {
        $alignment_class = isset($attributes['alignment']) ? $attributes['alignment'] : 'left';
        $gap = isset($attributes['gap']) ? $this->get_css_variable_from_spacing_preset($attributes['gap']) : '0';
        $border_radius = isset($attributes['tabBorderRadius']) ? $this->get_css_variable_from_spacing_preset($attributes['tabBorderRadius']) : '0';
        $active_background = isset($attributes['activeTabBackgroundColor']) ? $attributes['activeTabBackgroundColor'] : '#ffffff';
        $inactive_background = isset($attributes['inactiveTabBackgroundColor']) ? $attributes['inactiveTabBackgroundColor'] : '#f0f0f0';
        $active_text = isset($attributes['activeTabTextColor']) ? $attributes['activeTabTextColor'] : '#ffffff';
        $inactive_text = isset($attributes['inactiveTabTextColor']) ? $attributes['inactiveTabTextColor'] : '#333333';

        $output = '<div
            class="tab-block"
            data-active-background-color="' . \esc_attr($active_background) . '"
            data-active-color="' . \esc_attr($active_text) . '"
            data-background-color="' . \esc_attr($inactive_background) . '"
            data-color="' . \esc_attr($inactive_text) . '"
        >';
        $output .= '<nav
            class="tab-headings ' . \esc_attr($alignment_class) . '"
            style="margin-bottom: ' . \esc_attr($gap) . ';"
        >';

        $default_active_tab_index = isset($attributes['defaultActiveTabIndex']) ? $attributes['defaultActiveTabIndex'] : 0;
        $tabs = isset($attributes['tabs']) && is_array($attributes['tabs']) ? $attributes['tabs'] : [];

        foreach ($tabs as $index => $title) {
            $active_class = ((int) $index === (int) $default_active_tab_index) ? 'active' : '';

            $output .= '<div
                    class="tab-heading ' . \esc_attr($active_class) . '"
                    data-index="' . \esc_attr($index) . '"
                    style="border-radius: ' . \esc_attr($border_radius) . ';"
                >
                    <p>' . \esc_html($title) . '</p>
                </div>';
        }

        $output .= '</nav>';

        $output .= '<div class="tab-content" style="display:block;">';
        $output .= $content;
        $output .= '</div>';

        $output .= '</div>';

        return $output;
    }
}

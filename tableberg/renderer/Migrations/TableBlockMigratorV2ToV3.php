<?php

namespace Tableberg\Renderer\Migrations;

class TableBlockMigratorV2ToV3 {
    public function migrate($attrs, $block = null) {
        if (!is_array($attrs)) {
            return $attrs;
        }

        $attrs = $this->downgrade_font_sizes($attrs);

        $attrs['rows'] = $this->indexed_map_to_array(
            isset($attrs['rows']) ? $attrs['rows'] : array()
        );
        $attrs['columns'] = $this->indexed_map_to_array(
            isset($attrs['columns']) ? $attrs['columns'] : array()
        );
        $attrs['version'] = 3;

        return $attrs;
    }

    private function indexed_map_to_array($value) {
        if (!is_array($value)) {
            return array();
        }

        if (array_values($value) === $value) {
            return $value;
        }

        $result = array();

        foreach ($value as $key => $entry) {
            if (!is_numeric($key)) {
                continue;
            }

            $index = (int) $key;

            while (count($result) < $index) {
                $result[] = null;
            }

            $result[$index] = $entry;
        }

        return $result;
    }

    private function downgrade_font_sizes($value) {
        if (!is_array($value)) {
            return $value;
        }

        foreach ($value as $key => $entry) {
            if (is_array($entry)) {
                $value[$key] = $this->downgrade_font_sizes($entry);
                continue;
            }

            if ($this->is_font_size_key($key)) {
                $value[$key] = $this->downgrade_font_size($entry);
            }
        }

        return $this->downgrade_implicit_element_font_size($value);
    }

    private function downgrade_implicit_element_font_size($value) {
        if (
            !isset($value['name']) ||
            !is_string($value['name']) ||
            !array_key_exists('attributes', $value)
        ) {
            return $value;
        }

        $name = $value['name'];
        if (!in_array($name, array('text', 'button', 'list', 'ribbon'), true)) {
            return $value;
        }

        if (!is_array($value['attributes'])) {
            $value['attributes'] = array();
        }

        $font_size_key = $name === 'ribbon' ? 'style' : 'styles';

        if (!isset($value['attributes'][$font_size_key]) || !is_array($value['attributes'][$font_size_key])) {
            $value['attributes'][$font_size_key] = array();
        }

        if (!array_key_exists('fontSize', $value['attributes'][$font_size_key])) {
            $value['attributes'][$font_size_key]['fontSize'] = '1rem';
        }

        return $value;
    }

    private function is_font_size_key($key) {
        return is_string($key) && strtolower(substr($key, -8)) === 'fontsize';
    }

    private function downgrade_font_size($value) {
        if (!is_string($value)) {
            return $value;
        }

        $font_sizes = array(
            '0.875rem' => '0.75rem',
            '1rem' => '0.875rem',
            '1.38rem' => '1rem',
            '1.75rem' => '1.38rem',
            '2.15rem' => '1.75rem',
        );

        return isset($font_sizes[$value]) ? $font_sizes[$value] : $value;
    }
}

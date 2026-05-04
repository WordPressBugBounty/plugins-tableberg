<?php

namespace Tableberg\Renderer\Migrations;

use Tableberg\Renderer\Table\Defaults;

class TableBlockMigratorV1ToV2 {
    public function migrate($attrs, $block = null) {
        if (!is_array($attrs)) {
            return $attrs;
        }

        $defaults = Defaults::get_defaults();
        $v1_defaults = $this->get_v1_defaults();

        $structure = $this->get_array($attrs, 'structure', $v1_defaults['structure']);
        $data = $this->get_array($attrs, 'data', $v1_defaults['data']);
        $table_config = $this->get_array($attrs, 'tableConfig', $v1_defaults['tableConfig']);
        $cell_styles = $this->get_array($attrs, 'cellStyles', $v1_defaults['cellStyles']);
        $bindings = $this->get_array($attrs, 'bindings', array());
        $binding_registry = array();
        $binding_ids_by_signature = array();
        $next_binding_index = 1;

        foreach ($bindings as $binding_id => $binding_definition) {
            if (!is_string($binding_id) || !is_array($binding_definition)) {
                continue;
            }

            $normalized_binding = $this->normalize_binding_definition($binding_definition);
            $binding_registry[$binding_id] = $normalized_binding;
            $binding_ids_by_signature[$this->get_binding_signature($normalized_binding)] = $binding_id;

            if (preg_match('/_(\d+)$/', $binding_id, $matches)) {
                $next_binding_index = max($next_binding_index, ((int) $matches[1]) + 1);
            }
        }

        $table = array_merge($defaults['table'], $table_config);
        $table['cellSpacing'] = array_merge(
            $defaults['table']['cellSpacing'],
            $this->get_array($table_config, 'cellSpacing', array())
        );
        $table['tableBorder'] = array_merge(
            $defaults['table']['tableBorder'],
            $this->get_array($table_config, 'tableBorder', array())
        );
        $table['pagination'] = array_merge(
            $defaults['table']['pagination'],
            $this->get_array($table_config, 'pagination', array())
        );
        $table['search'] = array_merge(
            $defaults['table']['search'],
            $this->get_array($table_config, 'search', array())
        );
        $table['responsive'] = array(
            'tablet' => array_merge(
                $defaults['table']['responsive']['tablet'],
                $this->get_array(
                    $this->get_array($table_config, 'responsive', array()),
                    'tablet',
                    array()
                )
            ),
            'mobile' => array_merge(
                $defaults['table']['responsive']['mobile'],
                $this->get_array(
                    $this->get_array($table_config, 'responsive', array()),
                    'mobile',
                    array()
                )
            ),
        );
        $table['rows'] = (int) $this->get_scalar($structure, 'rows', $defaults['table']['rows']);
        $table['cols'] = (int) $this->get_scalar($structure, 'cols', $defaults['table']['cols']);

        $default_cell_styles = $defaults['cellDefaults']['styles'];
        $cell_style_defaults = $cell_styles;
        unset($cell_style_defaults['cells']);

        $migrated_cell_defaults = array_merge($default_cell_styles, $cell_style_defaults);
        $migrated_cell_defaults['padding'] = array_merge(
            $default_cell_styles['padding'],
            $this->get_array($cell_styles, 'padding', array())
        );
        $migrated_cell_defaults['border'] = array_merge(
            $default_cell_styles['border'],
            $this->get_array($cell_styles, 'border', array())
        );
        $migrated_cell_defaults['borderRadius'] = array_merge(
            $default_cell_styles['borderRadius'],
            $this->get_array($cell_styles, 'borderRadius', array())
        );

        $cells = array();

        foreach ($this->get_array($structure, 'cells', array()) as $cell_entry) {
            if (!is_array($cell_entry) || count($cell_entry) < 2 || !is_array($cell_entry[0])) {
                continue;
            }

            $key = $this->coords_to_key($cell_entry[0]);
            $cells[$key] = isset($cells[$key]) ? $cells[$key] : array();
            $cells[$key]['span'] = is_array($cell_entry[1]) ? $cell_entry[1] : array();
        }

        foreach ($this->get_array($data, 'cells', array()) as $cell_entry) {
            if (!is_array($cell_entry) || count($cell_entry) < 2 || !is_array($cell_entry[0])) {
                continue;
            }

            $key = $this->coords_to_key($cell_entry[0]);
            $cells[$key] = isset($cells[$key]) ? $cells[$key] : array();
            $cells[$key]['elements'] = $this->migrate_elements(
                is_array($cell_entry[1]) ? $cell_entry[1] : array(),
                $binding_registry,
                $binding_ids_by_signature,
                $next_binding_index
            );
        }

        foreach ($this->get_array($cell_styles, 'cells', array()) as $cell_entry) {
            if (!is_array($cell_entry) || count($cell_entry) < 2 || !is_array($cell_entry[0])) {
                continue;
            }

            $key = $this->coords_to_key($cell_entry[0]);
            $cells[$key] = isset($cells[$key]) ? $cells[$key] : array();

            $style_overrides = is_array($cell_entry[1]) ? $cell_entry[1] : array();

            if (array_key_exists('ribbon', $style_overrides)) {
                $cells[$key]['ribbon'] = $style_overrides['ribbon'];
                unset($style_overrides['ribbon']);
            }

            if (!empty($style_overrides)) {
                $cells[$key]['styles'] = $style_overrides;
            }
        }

        return array(
            'version' => 2,
            'isExample' => isset($attrs['isExample']) ? (bool) $attrs['isExample'] : $defaults['isExample'],
            'table' => $table,
            'rows' => $this->get_array($structure, 'rowConfigs', array()),
            'columns' => $this->get_array($structure, 'columns', array()),
            'cells' => $cells,
            'bindings' => $binding_registry,
            'cellDefaults' => array(
                'styles' => $migrated_cell_defaults,
            ),
        );
    }

    private function migrate_elements(
        $elements,
        &$binding_registry,
        &$binding_ids_by_signature,
        &$next_binding_index
    ) {
        if (!is_array($elements)) {
            return array();
        }

        $migrated_elements = array();

        foreach ($elements as $element) {
            if (!is_array($element)) {
                $migrated_elements[] = $element;
                continue;
            }

            $element_bindings = isset($element['bindings']) && is_array($element['bindings'])
                ? $element['bindings']
                : null;

            if ($element_bindings === null) {
                $migrated_elements[] = $element;
                continue;
            }

            $migrated_bindings = array();

            foreach ($element_bindings as $path => $binding) {
                if (!is_string($path)) {
                    continue;
                }

                if (is_string($binding)) {
                    $migrated_bindings[$path] = $binding;
                    continue;
                }

                if (!is_array($binding)) {
                    continue;
                }

                $normalized_binding = $this->normalize_binding_definition($binding);
                $signature = $this->get_binding_signature($normalized_binding);

                if (isset($binding_ids_by_signature[$signature])) {
                    $binding_id = $binding_ids_by_signature[$signature];
                } else {
                    $binding_id = 'binding_' . $next_binding_index;
                    $next_binding_index++;

                    $binding_registry[$binding_id] = $normalized_binding;
                    $binding_ids_by_signature[$signature] = $binding_id;
                }

                $migrated_bindings[$path] = $binding_id;
            }

            if (count($migrated_bindings) > 0) {
                $element['bindings'] = $migrated_bindings;
            } else {
                unset($element['bindings']);
            }

            $migrated_elements[] = $element;
        }

        return $migrated_elements;
    }

    private function normalize_binding_definition($binding_definition) {
        $normalized = array(
            'key' => isset($binding_definition['key']) && is_string($binding_definition['key'])
                ? $binding_definition['key']
                : '',
        );

        if (array_key_exists('postId', $binding_definition) && is_numeric($binding_definition['postId'])) {
            $normalized['postId'] = (int) $binding_definition['postId'];
        }

        if (array_key_exists('fallback', $binding_definition) && is_string($binding_definition['fallback'])) {
            $normalized['fallback'] = $binding_definition['fallback'];
        }

        return $normalized;
    }

    private function get_binding_signature($binding_definition) {
        return wp_json_encode($binding_definition);
    }

    private function coords_to_key($coords) {
        $row = isset($coords[0]) ? (int) $coords[0] : 0;
        $col = isset($coords[1]) ? (int) $coords[1] : 0;

        return $row . ',' . $col;
    }

    private function get_array($array, $key, $default) {
        if (!is_array($array) || !isset($array[$key]) || !is_array($array[$key])) {
            return $default;
        }

        return $array[$key];
    }

    private function get_scalar($array, $key, $default) {
        if (!is_array($array) || !array_key_exists($key, $array)) {
            return $default;
        }

        return $array[$key];
    }

    private function get_v1_defaults() {
        return array(
            'structure' => array(
                'rows' => 0,
                'cols' => 0,
                'cells' => array(),
                'columns' => array(),
                'rowConfigs' => array(),
            ),
            'data' => array(
                'cells' => array(),
            ),
            'tableConfig' => array(
                'headerEnabled' => false,
                'footerEnabled' => false,
                'stickyHeader' => false,
                'caption' => '',
                'tableWidth' => 'auto',
                'tableAlignment' => 'left',
                'cellSpacing' => array(
                    'horizontal' => '0',
                    'vertical' => '0',
                ),
                'tableBorder' => array(
                    'top' => '',
                    'right' => '',
                    'bottom' => '',
                    'left' => '',
                ),
                'fixedColumnWidths' => true,
                'pagination' => array(
                    'enabled' => false,
                    'pageSize' => 10,
                    'showPageNumbers' => true,
                    'showPrevNext' => true,
                ),
                'search' => array(
                    'enabled' => false,
                    'placeholder' => 'Search...',
                    'highlightColor' => '',
                    'position' => 'left',
                ),
                'responsive' => array(
                    'tablet' => array(
                        'enabled' => false,
                        'maxWidth' => 1024,
                        'mode' => 'scroll',
                        'transpose' => false,
                        'stackCount' => 3,
                        'repeatFirstCol' => false,
                    ),
                    'mobile' => array(
                        'enabled' => false,
                        'maxWidth' => 700,
                        'mode' => 'scroll',
                        'transpose' => false,
                        'stackCount' => 1,
                        'repeatFirstCol' => false,
                    ),
                ),
            ),
            'cellStyles' => array(
                'cells' => array(),
                'padding' => array(
                    'top' => 'var(--wp--preset--spacing--20)',
                    'right' => 'var(--wp--preset--spacing--20)',
                    'bottom' => 'var(--wp--preset--spacing--20)',
                    'left' => 'var(--wp--preset--spacing--20)',
                ),
                'border' => array(
                    'top' => '1px solid black',
                    'right' => '1px solid black',
                    'bottom' => '1px solid black',
                    'left' => '1px solid black',
                ),
                'borderRadius' => array(
                    'topLeft' => '0px',
                    'topRight' => '0px',
                    'bottomRight' => '0px',
                    'bottomLeft' => '0px',
                ),
                'orientation' => 'vertical',
                'elementGap' => 'var(--wp--preset--spacing--20)',
                'wrap' => 'nowrap',
                'verticalAlign' => 'middle',
                'backgroundColor' => '',
            ),
        );
    }
}

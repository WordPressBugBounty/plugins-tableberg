<?php

namespace Tableberg\Renderer\Migrations;

class TableBlockMigratorV0ToV1 {
    public function migrate($attrs, $block = null) {
        if (!is_array($attrs)) {
            return $attrs;
        }

        $legacy_cells = $this->get_legacy_cell_blocks($block);

        $rows = (int) $this->get_scalar($attrs, 'rows', 0);
        $cols = (int) $this->get_scalar($attrs, 'cols', 0);

        foreach ($legacy_cells as $legacy_cell) {
            $legacy_cell_attrs = $this->get_block_attrs($legacy_cell);
            $row = (int) $this->get_scalar($legacy_cell_attrs, 'row', 0);
            $col = (int) $this->get_scalar($legacy_cell_attrs, 'col', 0);
            $rowspan = max(1, (int) $this->get_scalar($legacy_cell_attrs, 'rowspan', 1));
            $colspan = max(1, (int) $this->get_scalar($legacy_cell_attrs, 'colspan', 1));

            $rows = max($rows, $row + $rowspan);
            $cols = max($cols, $col + $colspan);
        }

        if (count($legacy_cells) === 0 && $rows > 0 && $cols > 0) {
            $legacy_cells = $this->create_synthetic_cells($rows, $cols);
        }

        $structure_cells = array();
        $data_cells = array();
        $cell_style_cells = array();

        foreach ($legacy_cells as $legacy_cell) {
            $legacy_cell_attrs = $this->get_block_attrs($legacy_cell);
            $row = (int) $this->get_scalar($legacy_cell_attrs, 'row', 0);
            $col = (int) $this->get_scalar($legacy_cell_attrs, 'col', 0);
            $rowspan = max(1, (int) $this->get_scalar($legacy_cell_attrs, 'rowspan', 1));
            $colspan = max(1, (int) $this->get_scalar($legacy_cell_attrs, 'colspan', 1));
            $coords = array($row, $col);

            if ($rowspan !== 1 || $colspan !== 1) {
                $structure_cells[] = array(
                    $coords,
                    array(
                        'rowSpan' => $rowspan,
                        'colSpan' => $colspan,
                    ),
                );
            }

            $migrated_cell = $this->migrate_legacy_cell(
                $legacy_cell,
                $attrs,
                $rows,
                $cols
            );

            $data_cells[] = array($coords, $migrated_cell['elements']);

            if (
                !empty($migrated_cell['styles']) ||
                $migrated_cell['ribbon'] !== null
            ) {
                $style_entry = $migrated_cell['styles'];

                if ($migrated_cell['ribbon'] !== null) {
                    $style_entry['ribbon'] = $migrated_cell['ribbon'];
                }

                $cell_style_cells[] = array($coords, $style_entry);
            }
        }

        return array(
            'version' => 1,
            'isExample' => isset($attrs['isExample']) ? (bool) $attrs['isExample'] : false,
            'structure' => array(
                'rows' => $rows,
                'cols' => $cols,
                'cells' => $structure_cells,
                'columns' => $this->migrate_columns($attrs, $cols),
                'rowConfigs' => $this->migrate_row_configs($attrs, $rows),
            ),
            'data' => array(
                'cells' => $data_cells,
            ),
            'tableConfig' => $this->migrate_table_config($attrs, $rows, $cols),
            'cellStyles' => array(
                'cells' => $cell_style_cells,
                'padding' => $this->get_legacy_cell_padding($attrs),
                'border' => $this->get_legacy_global_cell_border($attrs),
                'borderRadius' => $this->normalize_border_radius(
                    $this->get_scalar($attrs, 'cellBorderRadius', array())
                ),
                'orientation' => 'vertical',
                'elementGap' => $this->normalize_css_value(
                    $this->get_scalar($attrs, 'blockSpacing', '0')
                ),
                'wrap' => 'nowrap',
                'verticalAlign' => 'middle',
                'backgroundColor' => '',
            ),
            'bindings' => array(),
        );
    }

    private function migrate_table_config($attrs, $rows, $cols) {
        $table_dimensions = $this->map_table_dimensions(
            $this->get_scalar($attrs, 'tableWidth', ''),
            $this->get_scalar($attrs, 'tableAlignment', '')
        );
        $legacy_search_position = $this->get_scalar($attrs, 'searchPosition', 'left');
        $legacy_responsive = $this->get_array($attrs, 'responsive', array());
        $legacy_breakpoints = $this->get_array($legacy_responsive, 'breakpoints', array());

        return array(
            'headerEnabled' => $this->is_legacy_section_enabled(
                $this->get_scalar($attrs, 'enableTableHeader', '')
            ),
            'footerEnabled' => $this->is_legacy_section_enabled(
                $this->get_scalar($attrs, 'enableTableFooter', '')
            ),
            'stickyHeader' => !empty($attrs['stickyTopRow']),
            'caption' => (string) $this->get_scalar($attrs, 'caption', ''),
            'tableWidth' => $table_dimensions['tableWidth'],
            'tableAlignment' => $table_dimensions['tableAlignment'],
            'cellSpacing' => array(
                'horizontal' => $this->pick_spacing_side(
                    $this->get_scalar($attrs, 'cellSpacing', array()),
                    array('left', 'right'),
                    '0'
                ),
                'vertical' => $this->pick_spacing_side(
                    $this->get_scalar($attrs, 'cellSpacing', array()),
                    array('top', 'bottom'),
                    '0'
                ),
            ),
            'tableBorder' => $this->normalize_border_sides(
                $this->get_scalar($attrs, 'tableBorder', array())
            ),
            'fixedColumnWidths' => array_key_exists('fixedColWidth', $attrs)
                ? (bool) $attrs['fixedColWidth']
                : true,
            'pagination' => array(
                'enabled' => false,
                'pageSize' => 10,
                'showPageNumbers' => true,
                'showPrevNext' => true,
            ),
            'search' => array(
                'enabled' => !empty($attrs['search']),
                'placeholder' => (string) $this->get_scalar(
                    $attrs,
                    'searchPlaceholder',
                    'Search...'
                ),
                'highlightColor' => '',
                'position' => $legacy_search_position === 'right' ? 'right' : 'left',
            ),
            'responsive' => array(
                'tablet' => $this->migrate_responsive_breakpoint(
                    $this->get_array($legacy_breakpoints, 'tablet', array()),
                    array(
                        'enabled' => false,
                        'maxWidth' => 1024,
                        'mode' => 'scroll',
                        'transpose' => false,
                        'stackCount' => 3,
                        'repeatFirstCol' => false,
                    )
                ),
                'mobile' => $this->migrate_responsive_breakpoint(
                    $this->get_array($legacy_breakpoints, 'mobile', array()),
                    array(
                        'enabled' => false,
                        'maxWidth' => 700,
                        'mode' => 'scroll',
                        'transpose' => false,
                        'stackCount' => 1,
                        'repeatFirstCol' => false,
                    )
                ),
            ),
            'rows' => $rows,
            'cols' => $cols,
        );
    }

    private function migrate_columns($attrs, $cols) {
        $columns = array();
        $col_styles = $this->get_array($attrs, 'colStyles', array());
        $legacy_col_widths = $this->get_scalar($attrs, 'colWidths', array());

        for ($column = 0; $column < $cols; $column++) {
            $legacy_column = $this->get_array($col_styles, $column, array());
            $width = $this->normalize_css_value(
                $this->get_scalar(
                    $legacy_column,
                    'width',
                    is_array($legacy_col_widths) && isset($legacy_col_widths[$column])
                        ? $legacy_col_widths[$column]
                        : ''
                )
            );

            if ($width !== '') {
                $columns[$column] = array('width' => $width);
            }
        }

        return $columns;
    }

    private function migrate_row_configs($attrs, $rows) {
        $row_configs = array();
        $row_styles = $this->get_array($attrs, 'rowStyles', array());
        $legacy_row_heights = $this->get_scalar($attrs, 'rowHeights', array());

        for ($row = 0; $row < $rows; $row++) {
            $legacy_row = $this->get_array($row_styles, $row, array());
            $height = $this->normalize_css_value(
                $this->get_scalar(
                    $legacy_row,
                    'height',
                    is_array($legacy_row_heights) && isset($legacy_row_heights[$row])
                        ? $legacy_row_heights[$row]
                        : ''
                )
            );

            if ($height !== '') {
                $row_configs[$row] = array('height' => $height);
            }
        }

        return $row_configs;
    }

    private function migrate_responsive_breakpoint($legacy_breakpoint, $defaults) {
        $legacy_breakpoint = is_array($legacy_breakpoint) ? $legacy_breakpoint : array();
        $legacy_direction = $this->get_scalar($legacy_breakpoint, 'direction', null);

        return array(
            'enabled' => array_key_exists('enabled', $legacy_breakpoint)
                ? (bool) $legacy_breakpoint['enabled']
                : $defaults['enabled'],
            'maxWidth' => (int) $this->get_scalar(
                $legacy_breakpoint,
                'maxWidth',
                $defaults['maxWidth']
            ),
            'mode' => (string) $this->get_scalar(
                $legacy_breakpoint,
                'mode',
                $defaults['mode']
            ),
            'transpose' => $legacy_direction === null
                ? $defaults['transpose']
                : $legacy_direction === 'row',
            'stackCount' => max(
                1,
                (int) $this->get_scalar(
                    $legacy_breakpoint,
                    'stackCount',
                    $defaults['stackCount']
                )
            ),
            'repeatFirstCol' => array_key_exists('headerAsCol', $legacy_breakpoint)
                ? (bool) $legacy_breakpoint['headerAsCol']
                : $defaults['repeatFirstCol'],
        );
    }

    private function migrate_legacy_cell($cell_block, $table_attrs, $rows, $cols) {
        $legacy_cell_attrs = $this->get_block_attrs($cell_block);
        $elements = array();
        $ribbon = null;

        foreach ($this->get_block_inner_blocks($cell_block) as $inner_block) {
            $migrated_block = $this->migrate_legacy_inner_block(
                $inner_block,
                $legacy_cell_attrs,
                $table_attrs
            );

            if (!empty($migrated_block['elements'])) {
                $elements = array_merge($elements, $migrated_block['elements']);
            }

            if ($ribbon === null && $migrated_block['ribbon'] !== null) {
                $ribbon = $migrated_block['ribbon'];
            }
        }

        $styles = $this->build_cell_style_overrides(
            $legacy_cell_attrs,
            $table_attrs,
            $rows,
            $cols
        );

        return array(
            'elements' => $elements,
            'styles' => $styles,
            'ribbon' => $ribbon,
        );
    }

    private function build_cell_style_overrides($cell_attrs, $table_attrs, $rows, $cols) {
        $styles = array();
        $background_color = $this->resolve_cell_background_color(
            $cell_attrs,
            $table_attrs,
            $rows
        );

        if ($background_color !== '') {
            $styles['backgroundColor'] = $background_color;
        }

        $border = $this->resolve_cell_border($cell_attrs, $table_attrs, $rows, $cols);
        if ($this->has_any_non_empty_value($border)) {
            $styles['border'] = $border;
        }

        $border_radius = $this->resolve_cell_border_radius(
            $cell_attrs,
            $table_attrs,
            $rows,
            $cols
        );
        if ($this->has_any_non_empty_value($border_radius)) {
            $styles['borderRadius'] = $border_radius;
        }

        if (!empty($cell_attrs['isHorizontal'])) {
            $styles['orientation'] = 'horizontal';
        }

        $wrap_items = array_key_exists('wrapItems', $cell_attrs)
            ? (bool) $cell_attrs['wrapItems']
            : true;
        if (!empty($cell_attrs['isHorizontal']) || array_key_exists('wrapItems', $cell_attrs)) {
            $styles['wrap'] = $wrap_items ? 'wrap' : 'nowrap';
        }

        $vertical_align = $this->map_vertical_align(
            $this->get_scalar($cell_attrs, 'vAlign', 'center')
        );
        if ($vertical_align !== 'middle') {
            $styles['verticalAlign'] = $vertical_align;
        }

        $global_gap = $this->normalize_css_value(
            $this->get_scalar($table_attrs, 'blockSpacing', '0')
        );
        $cell_gap = $this->normalize_css_value(
            $this->get_scalar($cell_attrs, 'blockSpacing', '')
        );

        if ($cell_gap !== '' && $cell_gap !== $global_gap) {
            $styles['elementGap'] = $cell_gap;
        }

        return $styles;
    }

    private function resolve_cell_background_color($cell_attrs, $table_attrs, $rows) {
        $background_color = $this->get_background_value(
            $this->get_array(
                $this->get_array($table_attrs, 'colStyles', array()),
                (int) $this->get_scalar($cell_attrs, 'col', 0),
                array()
            )
        );

        $row = (int) $this->get_scalar($cell_attrs, 'row', 0);
        if ($this->is_header_cell($cell_attrs, $table_attrs)) {
            $header_background = $this->normalize_css_value(
                $this->get_scalar($table_attrs, 'headerBackgroundColor', '')
            );
            if ($header_background !== '') {
                $background_color = $header_background;
            }
        } elseif ($this->is_footer_cell($cell_attrs, $table_attrs, $rows)) {
            $footer_background = $this->normalize_css_value(
                $this->get_scalar($table_attrs, 'footerBackgroundColor', '')
            );
            if ($footer_background !== '') {
                $background_color = $footer_background;
            }
        } else {
            $row_background = $this->normalize_css_value(
                $this->get_scalar(
                    $table_attrs,
                    $this->is_odd_data_row($row, $table_attrs)
                        ? 'oddRowBackgroundColor'
                        : 'evenRowBackgroundColor',
                    ''
                )
            );
            if ($row_background !== '') {
                $background_color = $row_background;
            }
        }

        $row_background = $this->get_background_value(
            $this->get_array(
                $this->get_array($table_attrs, 'rowStyles', array()),
                $row,
                array()
            )
        );
        if ($row_background !== '') {
            $background_color = $row_background;
        }

        $cell_background = $this->get_background_value($cell_attrs);
        if ($cell_background !== '') {
            $background_color = $cell_background;
        }

        return $background_color;
    }

    private function resolve_cell_border($cell_attrs, $table_attrs, $rows, $cols) {
        $row = (int) $this->get_scalar($cell_attrs, 'row', 0);
        $col = (int) $this->get_scalar($cell_attrs, 'col', 0);
        $rowspan = max(1, (int) $this->get_scalar($cell_attrs, 'rowspan', 1));
        $colspan = max(1, (int) $this->get_scalar($cell_attrs, 'colspan', 1));
        $touches_first_row = $row === 0;
        $touches_last_row = $row + $rowspan >= $rows;
        $touches_first_col = $col === 0;
        $touches_last_col = $col + $colspan >= $cols;

        $border = $this->get_inner_border_for_cell($cell_attrs, $table_attrs, $rows, $cols);

        $col_style = $this->get_array(
            $this->get_array($table_attrs, 'colStyles', array()),
            $col,
            array()
        );
        $col_border = $this->normalize_border_sides(
            $this->get_scalar($col_style, 'border', array())
        );
        if ($col_border['left'] !== '') {
            $border['left'] = $col_border['left'];
        }
        if ($col_border['right'] !== '') {
            $border['right'] = $col_border['right'];
        }
        if ($touches_first_row && $col_border['top'] !== '') {
            $border['top'] = $col_border['top'];
        }
        if ($touches_last_row && $col_border['bottom'] !== '') {
            $border['bottom'] = $col_border['bottom'];
        }

        $row_style = $this->get_array(
            $this->get_array($table_attrs, 'rowStyles', array()),
            $row,
            array()
        );
        $row_border = $this->normalize_border_sides(
            $this->get_scalar($row_style, 'border', array())
        );
        $border['top'] = $row_border['top'] !== '' ? $row_border['top'] : $border['top'];
        $border['bottom'] = $row_border['bottom'] !== ''
            ? $row_border['bottom']
            : $border['bottom'];
        if ($touches_first_col && $row_border['left'] !== '') {
            $border['left'] = $row_border['left'];
        }
        if ($touches_last_col && $row_border['right'] !== '') {
            $border['right'] = $row_border['right'];
        }

        $cell_border = $this->normalize_border_sides(
            $this->get_scalar($cell_attrs, 'border', array())
        );

        return array_merge($border, array_filter($cell_border, function ($value) {
            return $value !== '';
        }));
    }

    private function get_inner_border_for_cell($cell_attrs, $table_attrs, $rows, $cols) {
        if (!$this->is_legacy_inner_border_enabled($table_attrs)) {
            return $this->get_empty_border_sides();
        }

        $row = (int) $this->get_scalar($cell_attrs, 'row', 0);
        $col = (int) $this->get_scalar($cell_attrs, 'col', 0);
        $rowspan = max(1, (int) $this->get_scalar($cell_attrs, 'rowspan', 1));
        $colspan = max(1, (int) $this->get_scalar($cell_attrs, 'colspan', 1));
        $touches_first_row = $row === 0;
        $touches_last_row = $row + $rowspan >= $rows;
        $touches_first_col = $col === 0;
        $touches_last_col = $col + $colspan >= $cols;

        $border = $this->get_legacy_inner_border($table_attrs);

        $inner_border_type = $this->get_scalar($table_attrs, 'innerBorderType', '');
        if ($inner_border_type === 'row') {
            if (!$touches_first_col) {
                $border['left'] = '';
            }
            if (!$touches_last_col) {
                $border['right'] = '';
            }
        } elseif ($inner_border_type === 'col') {
            if (!$touches_first_row) {
                $border['top'] = '';
            }
            if (!$touches_last_row) {
                $border['bottom'] = '';
            }
        }

        if (!empty($table_attrs['hideCellOutsideBorders'])) {
            if ($touches_first_row) {
                $border['top'] = '';
            }
            if ($touches_last_row) {
                $border['bottom'] = '';
            }
            if ($touches_first_col) {
                $border['left'] = '';
            }
            if ($touches_last_col) {
                $border['right'] = '';
            }
        }

        return $border;
    }

    private function get_legacy_global_cell_border($attrs) {
        if (!$this->is_legacy_inner_border_enabled($attrs)) {
            return $this->get_empty_border_sides();
        }

        return $this->get_legacy_inner_border($attrs);
    }

    private function get_legacy_cell_padding($attrs) {
        $cell_padding = $this->normalize_spacing(
            $this->get_scalar($attrs, 'cellPadding', array())
        );

        $default_padding = array(
            'top' => 'var(--wp--preset--spacing--20)',
            'right' => 'var(--wp--preset--spacing--20)',
            'bottom' => 'var(--wp--preset--spacing--20)',
            'left' => 'var(--wp--preset--spacing--20)',
        );

        foreach ($default_padding as $side => $default_value) {
            if ($cell_padding[$side] === '') {
                $cell_padding[$side] = $default_value;
            }
        }

        return $cell_padding;
    }

    private function is_legacy_inner_border_enabled($attrs) {
        if (!is_array($attrs) || !array_key_exists('enableInnerBorder', $attrs)) {
            return true;
        }

        return (bool) $attrs['enableInnerBorder'];
    }

    private function get_legacy_inner_border($attrs) {
        $legacy_inner_border = $this->get_scalar(
            $attrs,
            'innerBorder',
            array(
                'color' => '#000000',
                'width' => '1px',
            )
        );

        if (!is_array($legacy_inner_border) || empty($legacy_inner_border)) {
            $legacy_inner_border = array(
                'color' => '#000000',
                'width' => '1px',
            );
        }

        return $this->normalize_border_sides($legacy_inner_border);
    }

    private function resolve_cell_border_radius($cell_attrs, $table_attrs, $rows, $cols) {
        $row = (int) $this->get_scalar($cell_attrs, 'row', 0);
        $col = (int) $this->get_scalar($cell_attrs, 'col', 0);
        $rowspan = max(1, (int) $this->get_scalar($cell_attrs, 'rowspan', 1));
        $colspan = max(1, (int) $this->get_scalar($cell_attrs, 'colspan', 1));
        $touches_first_row = $row === 0;
        $touches_last_row = $row + $rowspan >= $rows;
        $touches_first_col = $col === 0;
        $touches_last_col = $col + $colspan >= $cols;

        $border_radius = $this->get_empty_border_radius();

        $col_style = $this->get_array(
            $this->get_array($table_attrs, 'colStyles', array()),
            $col,
            array()
        );
        $col_radius = $this->normalize_border_radius(
            $this->get_scalar($col_style, 'borderRadius', array())
        );
        if ($touches_first_row) {
            $border_radius['topLeft'] = $col_radius['topLeft'];
            $border_radius['topRight'] = $col_radius['topRight'];
        }
        if ($touches_last_row) {
            $border_radius['bottomLeft'] = $col_radius['bottomLeft'];
            $border_radius['bottomRight'] = $col_radius['bottomRight'];
        }

        $row_style = $this->get_array(
            $this->get_array($table_attrs, 'rowStyles', array()),
            $row,
            array()
        );
        $row_radius = $this->normalize_border_radius(
            $this->get_scalar($row_style, 'borderRadius', array())
        );
        if ($touches_first_col) {
            if ($row_radius['topLeft'] !== '') {
                $border_radius['topLeft'] = $row_radius['topLeft'];
            }
            if ($row_radius['bottomLeft'] !== '') {
                $border_radius['bottomLeft'] = $row_radius['bottomLeft'];
            }
        }
        if ($touches_last_col) {
            if ($row_radius['topRight'] !== '') {
                $border_radius['topRight'] = $row_radius['topRight'];
            }
            if ($row_radius['bottomRight'] !== '') {
                $border_radius['bottomRight'] = $row_radius['bottomRight'];
            }
        }

        $cell_radius = $this->normalize_border_radius(
            $this->get_scalar($cell_attrs, 'borderRadius', array())
        );

        return array_merge($border_radius, array_filter($cell_radius, function ($value) {
            return $value !== '';
        }));
    }

    private function migrate_legacy_inner_block($block, $legacy_cell_attrs, $table_attrs) {
        $block_name = $this->get_block_name($block);
        $block_attrs = $this->get_block_attrs($block);

        switch ($block_name) {
            case 'core/paragraph':
                return array(
                    'elements' => array($this->migrate_paragraph_element(
                        $block,
                        $block_attrs,
                        $legacy_cell_attrs,
                        $table_attrs
                    )),
                    'ribbon' => null,
                );

            case 'tableberg/button':
                return array(
                    'elements' => array($this->migrate_button_element(
                        $block_attrs,
                        $legacy_cell_attrs,
                        $table_attrs
                    )),
                    'ribbon' => null,
                );

            case 'tableberg/image':
                return array(
                    'elements' => array($this->migrate_image_element(
                        $block_attrs,
                        $legacy_cell_attrs
                    )),
                    'ribbon' => null,
                );

            case 'core/list':
                return array(
                    'elements' => array($this->migrate_core_list_element(
                        $block,
                        $block_attrs,
                        $legacy_cell_attrs,
                        $table_attrs
                    )),
                    'ribbon' => null,
                );

            case 'tableberg/styled-list':
                return array(
                    'elements' => array($this->migrate_styled_list_element(
                        $block,
                        $block_attrs,
                        $legacy_cell_attrs,
                        $table_attrs
                    )),
                    'ribbon' => null,
                );

            case 'tableberg/icon':
                return array(
                    'elements' => array($this->migrate_icon_element(
                        $block_attrs,
                        $legacy_cell_attrs
                    )),
                    'ribbon' => null,
                );

            case 'tableberg/star-rating':
                return array(
                    'elements' => array($this->migrate_star_rating_element(
                        $block_attrs,
                        $legacy_cell_attrs,
                        $table_attrs
                    )),
                    'ribbon' => null,
                );

            case 'tableberg/html':
                return array(
                    'elements' => array($this->migrate_custom_html_element(
                        $block_attrs,
                        $legacy_cell_attrs
                    )),
                    'ribbon' => null,
                );

            case 'tableberg/ribbon':
                return array(
                    'elements' => array(),
                    'ribbon' => $this->migrate_ribbon($block_attrs),
                );

            case 'tableberg/dynamic-field':
                return $this->migrate_dynamic_field_block(
                    $block,
                    $legacy_cell_attrs,
                    $table_attrs
                );
        }

        $inner_blocks = $this->get_block_inner_blocks($block);
        if (!empty($inner_blocks)) {
            $elements = array();
            $ribbon = null;

            foreach ($inner_blocks as $inner_block) {
                $migrated_inner_block = $this->migrate_legacy_inner_block(
                    $inner_block,
                    $legacy_cell_attrs,
                    $table_attrs
                );

                if (!empty($migrated_inner_block['elements'])) {
                    $elements = array_merge($elements, $migrated_inner_block['elements']);
                }

                if ($ribbon === null && $migrated_inner_block['ribbon'] !== null) {
                    $ribbon = $migrated_inner_block['ribbon'];
                }
            }

            return array(
                'elements' => $elements,
                'ribbon' => $ribbon,
            );
        }

        $html = $this->extract_block_html($block);
        if ($html === '') {
            return array(
                'elements' => array(),
                'ribbon' => null,
            );
        }

        return array(
            'elements' => array(array(
                'name' => 'custom-html',
                'attributes' => array(
                    'content' => $html,
                    'align' => $this->resolve_element_alignment(null, $legacy_cell_attrs),
                ),
            )),
            'ribbon' => null,
        );
    }

    private function migrate_dynamic_field_block($block, $legacy_cell_attrs, $table_attrs) {
        $elements = array();
        $ribbon = null;

        foreach ($this->get_block_inner_blocks($block) as $inner_block) {
            $migrated_inner_block = $this->migrate_legacy_inner_block(
                $inner_block,
                $legacy_cell_attrs,
                $table_attrs
            );

            if (!empty($migrated_inner_block['elements'])) {
                $elements = array_merge($elements, $migrated_inner_block['elements']);
            }

            if ($ribbon === null && $migrated_inner_block['ribbon'] !== null) {
                $ribbon = $migrated_inner_block['ribbon'];
            }
        }

        return array(
            'elements' => $elements,
            'ribbon' => $ribbon,
        );
    }

    private function migrate_paragraph_element($block, $attrs, $legacy_cell_attrs, $table_attrs) {
        return array(
            'name' => 'text',
            'attributes' => array(
                'content' => $this->extract_legacy_paragraph_content($block, $attrs),
                'align' => $this->resolve_legacy_text_alignment(
                    $attrs,
                    $legacy_cell_attrs,
                    $table_attrs
                ),
                'styles' => array(
                    'textColor' => $this->extract_text_color(
                        $attrs,
                        $this->normalize_css_value(
                            $this->get_scalar($table_attrs, 'fontColor', '')
                        )
                    ),
                    'linkColor' => $this->extract_link_color(
                        $attrs,
                        $this->normalize_css_value(
                            $this->get_scalar($table_attrs, 'linkColor', '')
                        )
                    ),
                    'backgroundColor' => $this->extract_background_color($attrs),
                    'fontSize' => $this->extract_legacy_paragraph_font_size(
                        $block,
                        $attrs,
                        $this->normalize_css_value(
                            $this->get_scalar($table_attrs, 'fontSize', '')
                        )
                    ),
                ),
            ),
        );
    }

    private function extract_legacy_paragraph_font_size($block, $attrs, $fallback) {
        $font_size = $this->extract_font_size($attrs, '');
        if ($font_size !== '') {
            return $font_size;
        }

        $html = $this->extract_block_html($block);
        if ($html === '') {
            $html = $this->extract_block_html_from_attrs($attrs);
        }

        $html_font_size = $this->extract_first_tag_style_value($html, 'p', 'font-size');
        if ($html_font_size !== null && $html_font_size !== '') {
            return $html_font_size;
        }

        $html_font_size_slug = $this->extract_first_tag_class_font_size_slug($html, 'p');
        if ($html_font_size_slug !== null && $html_font_size_slug !== '') {
            return $this->map_legacy_font_size_slug($html_font_size_slug);
        }

        return $fallback;
    }

    private function resolve_legacy_text_alignment($attrs, $legacy_cell_attrs, $table_attrs) {
        $align = $this->get_scalar($attrs, 'align', null);
        if ($this->map_text_alignment($align, '') !== '') {
            return $this->resolve_element_alignment($align, $legacy_cell_attrs);
        }

        $table_rows = max(1, (int) $this->get_scalar($table_attrs, 'rows', 0));
        if (
            $this->is_header_cell($legacy_cell_attrs, $table_attrs) ||
            $this->is_footer_cell($legacy_cell_attrs, $table_attrs, $table_rows)
        ) {
            return 'center';
        }

        return $this->resolve_element_alignment($align, $legacy_cell_attrs);
    }

    private function extract_legacy_paragraph_content($block, $attrs) {
        $content = $this->get_scalar($attrs, 'content', null);
        if (is_string($content) && $content !== '') {
            return $content;
        }

        $html = $this->extract_block_html($block);
        if ($html === '') {
            $html = $this->extract_block_html_from_attrs($attrs);
        }
        if ($html === '') {
            return '';
        }

        $inner_html = $this->extract_first_tag_inner_html($html, 'p');
        if ($inner_html !== null) {
            return $inner_html;
        }

        return $html;
    }

    private function migrate_button_element($attrs, $legacy_cell_attrs, $table_attrs) {
        return array(
            'name' => 'button',
            'attributes' => array(
                'content' => (string) $this->get_scalar($attrs, 'text', ''),
                'id' => (string) $this->get_scalar($attrs, 'id', ''),
                'align' => $this->resolve_element_alignment(
                    $this->get_scalar($attrs, 'align', null),
                    $legacy_cell_attrs
                ),
                'link' => array(
                    'url' => (string) $this->get_scalar($attrs, 'url', ''),
                    'target' => $this->get_scalar($attrs, 'linkTarget', '') === '_blank'
                        ? '_blank'
                        : '_self',
                ),
                'styles' => array(
                    'backgroundColor' => $this->normalize_css_value(
                        $this->get_scalar($attrs, 'backgroundColor', '#000000')
                    ),
                    'textColor' => $this->normalize_css_value(
                        $this->get_scalar($attrs, 'textColor', '#ffffff')
                    ),
                    'backgroundHoverColor' => $this->normalize_css_value(
                        $this->get_scalar($attrs, 'backgroundHoverColor', '')
                    ),
                    'textHoverColor' => $this->normalize_css_value(
                        $this->get_scalar($attrs, 'textHoverColor', '')
                    ),
                    'textAlign' => $this->map_text_alignment(
                        $this->get_scalar($attrs, 'textAlign', 'center'),
                        'center'
                    ),
                    'width' => $this->map_button_width(
                        $this->get_scalar($attrs, 'width', null)
                    ),
                    'padding' => $this->normalize_spacing(
                        $this->get_scalar($attrs, 'padding', array())
                    ),
                    'borderRadius' => $this->normalize_border_radius(
                        $this->get_nested_value($attrs, array('style', 'border', 'radius'), array())
                    ),
                    'fontSize' => $this->extract_font_size(
                        $attrs,
                        $this->normalize_css_value(
                            $this->get_scalar($table_attrs, 'fontSize', '')
                        )
                    ),
                ),
            ),
        );
    }

    private function migrate_image_element($attrs, $legacy_cell_attrs) {
        $media = $this->get_array($attrs, 'media', array());

        return array(
            'name' => 'image',
            'attributes' => array(
                'media' => array(
                    'id' => is_numeric($this->get_scalar($media, 'id', null))
                        ? (int) $media['id']
                        : null,
                    'url' => (string) $this->get_scalar($media, 'url', ''),
                    'alt' => (string) $this->get_scalar($media, 'alt', ''),
                    'title' => (string) $this->get_scalar($media, 'title', ''),
                    'sizes' => $this->get_array($media, 'sizes', array()),
                ),
                'height' => $this->normalize_css_value(
                    $this->get_scalar($attrs, 'height', '')
                ),
                'width' => $this->normalize_css_value(
                    $this->get_scalar($attrs, 'width', '')
                ),
                'alt' => (string) $this->get_scalar(
                    $attrs,
                    'alt',
                    $this->get_scalar($media, 'alt', '')
                ),
                'align' => $this->resolve_element_alignment(
                    $this->get_scalar($attrs, 'align', null),
                    $legacy_cell_attrs
                ),
                'aspectRatio' => (string) $this->get_scalar($attrs, 'aspectRatio', ''),
                'scale' => (string) $this->get_scalar($attrs, 'scale', ''),
                'sizeSlug' => (string) $this->get_scalar($attrs, 'sizeSlug', 'large'),
                'caption' => (string) $this->get_scalar($attrs, 'caption', ''),
                'href' => (string) $this->get_scalar($attrs, 'href', ''),
                'linkTarget' => (string) $this->get_scalar($attrs, 'linkTarget', '_self'),
                'border' => $this->normalize_border_sides(
                    $this->get_scalar($attrs, 'border', array())
                ),
                'borderRadius' => $this->normalize_border_radius(
                    $this->get_scalar($attrs, 'borderRadius', array())
                ),
            ),
        );
    }

    private function migrate_core_list_element($block, $attrs, $legacy_cell_attrs, $table_attrs) {
        $items = $this->parse_core_list_items($block, $attrs);

        return array(
            'name' => 'list',
            'attributes' => array(
                'align' => $this->resolve_element_alignment(
                    $this->get_scalar($attrs, 'align', null),
                    $legacy_cell_attrs
                ),
                'items' => $items,
                'listType' => 'basic',
                'listStyle' => $this->resolve_core_list_style($attrs),
                'icon' => null,
                'styles' => array(
                    'itemSpacing' => '0',
                    'iconColor' => '',
                    'iconSize' => '',
                    'iconSpacing' => '',
                    'fontSize' => $this->extract_font_size(
                        $attrs,
                        $this->normalize_css_value(
                            $this->get_scalar($table_attrs, 'fontSize', '')
                        )
                    ),
                    'textColor' => $this->extract_text_color(
                        $attrs,
                        $this->normalize_css_value(
                            $this->get_scalar($table_attrs, 'fontColor', '')
                        )
                    ),
                    'linkColor' => $this->extract_link_color(
                        $attrs,
                        $this->normalize_css_value(
                            $this->get_scalar($table_attrs, 'linkColor', '')
                        )
                    ),
                    'backgroundColor' => $this->extract_background_color($attrs),
                ),
            ),
        );
    }

    private function parse_core_list_items($block, $attrs) {
        $items = array();
        $this->append_core_list_items($this->get_block_inner_blocks($block), 0, $items);

        if (!empty($items)) {
            return $items;
        }

        return $this->parse_list_items_from_html(
            (string) $this->get_scalar($attrs, 'values', $this->extract_block_html($block))
        );
    }

    private function append_core_list_items($blocks, $indent_level, &$items) {
        foreach ($blocks as $block) {
            if (!is_array($block)) {
                continue;
            }

            $block_name = $this->get_block_name($block);

            if ($block_name === 'core/list') {
                $this->append_core_list_items(
                    $this->get_block_inner_blocks($block),
                    $indent_level,
                    $items
                );
                continue;
            }

            if ($block_name !== 'core/list-item') {
                continue;
            }

            $block_attrs = $this->get_block_attrs($block);
            $items[] = array(
                'content' => $this->extract_core_list_item_content($block, $block_attrs),
                'indentLevel' => $indent_level,
            );

            foreach ($this->get_block_inner_blocks($block) as $inner_block) {
                if ($this->get_block_name($inner_block) !== 'core/list') {
                    continue;
                }

                $this->append_core_list_items(
                    $this->get_block_inner_blocks($inner_block),
                    $indent_level + 1,
                    $items
                );
            }
        }
    }

    private function extract_core_list_item_content($block, $attrs) {
        $content = $this->get_scalar($attrs, 'content', null);
        if (is_string($content) && $content !== '') {
            return $content;
        }

        $html = $this->extract_block_html($block);
        if ($html === '') {
            return '';
        }

        $inner_html = $this->extract_first_tag_inner_html($html, 'li', array('ul', 'ol'));
        if ($inner_html !== null) {
            return trim($inner_html);
        }

        return trim($html);
    }

    private function migrate_styled_list_element($block, $attrs, $legacy_cell_attrs, $table_attrs) {
        $first_item_attrs = $this->get_first_styled_list_item_attrs($block);
        $icon = $this->migrate_legacy_icon_payload(
            $this->get_scalar($attrs, 'icon', null)
        );
        if ($icon === null) {
            $icon = $this->migrate_legacy_icon_payload(
                $this->get_scalar($first_item_attrs, 'icon', null)
            );
        }
        if ($icon === null && (!array_key_exists('icon', $attrs) || empty($attrs['icon']))) {
            $icon = $this->get_default_legacy_icon_payload();
        }

        $parent_icon_color = $this->normalize_css_value(
            $this->get_scalar($attrs, 'iconColor', '')
        );
        $parent_icon_size = $this->normalize_css_value(
            $this->get_scalar($attrs, 'iconSize', '')
        );
        $parent_icon_spacing = $this->normalize_css_value(
            $this->get_scalar($attrs, 'iconSpacing', '')
        );
        $item_icon_spacing = $this->normalize_css_value(
            $this->get_scalar($first_item_attrs, 'iconSpacing', '')
        );
        $parent_font_size = $this->extract_font_size(
            $attrs,
            $this->normalize_css_value(
                $this->get_scalar($table_attrs, 'fontSize', '')
            )
        );
        $parent_text_color = $this->normalize_css_value(
            $this->get_scalar($attrs, 'textColor', '')
        );

        return array(
            'name' => 'list',
            'attributes' => array(
                'align' => $this->resolve_element_alignment(
                    $this->get_scalar($attrs, 'alignment', null),
                    $legacy_cell_attrs
                ),
                'items' => $this->parse_styled_list_items($block),
                'listType' => 'styled',
                'listStyle' => 'none',
                'icon' => $icon,
                'styles' => array(
                    'itemSpacing' => $this->normalize_css_value(
                        $this->get_scalar($attrs, 'itemSpacing', '')
                    ),
                    'iconColor' => $parent_icon_color !== ''
                        ? $parent_icon_color
                        : $this->normalize_css_value(
                            $this->get_scalar($first_item_attrs, 'iconColor', '')
                        ),
                    'iconSize' => $parent_icon_size !== ''
                        ? $parent_icon_size
                        : $this->normalize_css_value(
                            $this->get_scalar($first_item_attrs, 'iconSize', '')
                        ),
                    'iconSpacing' => $parent_icon_spacing !== ''
                        ? $parent_icon_spacing
                        : ($item_icon_spacing !== ''
                            ? $item_icon_spacing
                            : 'var(--wp--preset--spacing--20)'),
                    'fontSize' => $parent_font_size !== ''
                        ? $parent_font_size
                        : $this->extract_font_size(
                            $first_item_attrs,
                            $this->normalize_css_value(
                                $this->get_scalar($table_attrs, 'fontSize', '')
                            )
                        ),
                    'textColor' => $parent_text_color !== ''
                        ? $parent_text_color
                        : $this->normalize_css_value(
                            $this->get_scalar($first_item_attrs, 'textColor', '')
                        ),
                    'linkColor' => $this->normalize_css_value(
                        $this->get_scalar($table_attrs, 'linkColor', '')
                    ),
                    'backgroundColor' => $this->normalize_css_value(
                        $this->get_scalar($attrs, 'backgroundColor', '')
                    ),
                ),
            ),
        );
    }

    private function get_first_styled_list_item_attrs($block) {
        foreach ($this->get_block_inner_blocks($block) as $inner_block) {
            $block_name = $this->get_block_name($inner_block);

            if ($block_name === 'tableberg/styled-list-item') {
                return $this->get_block_attrs($inner_block);
            }

            if ($block_name === 'tableberg/styled-list') {
                $nested_attrs = $this->get_first_styled_list_item_attrs($inner_block);
                if (!empty($nested_attrs)) {
                    return $nested_attrs;
                }
            }
        }

        return array();
    }

    private function migrate_icon_element($attrs, $legacy_cell_attrs) {
        $icon = $this->migrate_legacy_icon_payload(
            $this->get_scalar($attrs, 'icon', null)
        );
        if ($icon === null) {
            $icon = $this->get_default_legacy_icon_payload();
        }

        return array(
            'name' => 'icon',
            'attributes' => array(
                'icon' => $icon,
                'size' => $this->normalize_css_value(
                    $this->get_scalar($attrs, 'size', '40px')
                ),
                'behavior' => $this->get_scalar($attrs, 'behavior', 'paragraph') === 'char'
                    ? 'char'
                    : 'paragraph',
                'link' => array(
                    'url' => (string) $this->get_scalar($attrs, 'linkUrl', ''),
                    'target' => $this->get_scalar($attrs, 'linkTarget', '') === '_blank'
                        ? '_blank'
                        : '_self',
                ),
                'styles' => array(
                    'align' => $this->resolve_element_alignment(
                        $this->get_scalar($attrs, 'justify', null),
                        $legacy_cell_attrs
                    ),
                    'rotation' => (int) $this->get_scalar($attrs, 'rotation', 0),
                    'color' => $this->normalize_css_value(
                        $this->get_scalar($attrs, 'color', '')
                    ),
                    'colorHover' => $this->normalize_css_value(
                        $this->get_scalar($attrs, 'colorHover', '')
                    ),
                    'background' => $this->normalize_css_value(
                        $this->get_scalar($attrs, 'background', '')
                    ),
                    'backgroundHover' => $this->normalize_css_value(
                        $this->get_scalar($attrs, 'backgroundHover', '')
                    ),
                    'padding' => $this->normalize_spacing(
                        $this->get_scalar($attrs, 'padding', array())
                    ),
                    'border' => $this->normalize_border_sides(
                        $this->get_scalar($attrs, 'border', array())
                    ),
                    'borderRadius' => $this->normalize_border_radius(
                        $this->get_scalar($attrs, 'borderRadius', array())
                    ),
                ),
            ),
        );
    }

    private function migrate_star_rating_element($attrs, $legacy_cell_attrs, $table_attrs) {
        return array(
            'name' => 'star-rating',
            'attributes' => array(
                'starCount' => (int) $this->get_scalar($attrs, 'starCount', 5),
                'starSize' => (int) $this->get_scalar($attrs, 'starSize', 20),
                'starColor' => $this->normalize_css_value(
                    $this->get_scalar($attrs, 'starColor', '#FF912C')
                ),
                'selectedStars' => (float) $this->get_scalar($attrs, 'selectedStars', 0),
                'enableText' => !empty($attrs['enableText']),
                'reviewText' => (string) $this->get_scalar($attrs, 'reviewText', ''),
                'reviewTextAlign' => $this->map_text_alignment(
                    $this->get_scalar($attrs, 'reviewTextAlign', 'left'),
                    'left'
                ),
                'reviewTextColor' => $this->normalize_css_value(
                    $this->get_scalar($attrs, 'reviewTextColor', '')
                ),
                'reviewTextLinkColor' => $this->normalize_css_value(
                    $this->get_scalar($table_attrs, 'linkColor', '')
                ),
                'reviewTextFontSize' => $this->extract_font_size(
                    $attrs,
                    $this->normalize_css_value(
                        $this->get_scalar($table_attrs, 'fontSize', '')
                    )
                ),
                'align' => $this->resolve_element_alignment(
                    $this->get_scalar($attrs, 'starAlign', null),
                    $legacy_cell_attrs
                ),
            ),
        );
    }

    private function migrate_custom_html_element($attrs, $legacy_cell_attrs) {
        return array(
            'name' => 'custom-html',
            'attributes' => array(
                'content' => (string) $this->get_scalar($attrs, 'content', ''),
                'align' => $this->resolve_element_alignment(null, $legacy_cell_attrs),
            ),
        );
    }

    private function migrate_ribbon($attrs) {
        $type = $this->get_scalar($attrs, 'type', 'side');
        if (!in_array($type, array('badge', 'bookmark', 'corner', 'side', 'icon'), true)) {
            $type = 'side';
        }

        $ribbon_attrs = $this->get_default_ribbon_attrs($type);
        $individual = $this->get_array($attrs, 'individual', array());

        $ribbon_attrs['text'] = (string) $this->get_scalar(
            $attrs,
            'text',
            $ribbon_attrs['text']
        );
        $ribbon_attrs['style']['color'] = $this->normalize_css_value(
            $this->get_scalar($attrs, 'color', $ribbon_attrs['style']['color'])
        );
        $ribbon_attrs['style']['background'] = $this->normalize_css_value(
            $this->get_scalar($attrs, 'background', $ribbon_attrs['style']['background'])
        );
        $ribbon_attrs['style']['bgGradient'] = $this->normalize_css_value(
            $this->get_scalar($attrs, 'bgGradient', $ribbon_attrs['style']['bgGradient'])
        );
        $ribbon_attrs['style']['fontSize'] = $this->normalize_css_value(
            $this->get_scalar($attrs, 'fontSize', $ribbon_attrs['style']['fontSize'])
        );

        if (isset($individual['side']) && is_string($individual['side'])) {
            $ribbon_attrs['originX'] = $individual['side'] === 'right' ? 'right' : 'left';
        }
        if (isset($individual['originY']) && is_string($individual['originY'])) {
            $ribbon_attrs['originY'] = $individual['originY'];
        }
        foreach (array('x', 'y', 'height', 'width', 'iconSize', 'shape') as $key) {
            if (isset($individual[$key]) && is_string($individual[$key])) {
                $ribbon_attrs[$key] = $individual[$key];
            }
        }
        if (isset($individual['rotate']) && is_numeric($individual['rotate'])) {
            $ribbon_attrs['rotate'] = (int) $individual['rotate'];
        }

        return array(
            'enabled' => true,
            'type' => $type,
            'attrs' => $ribbon_attrs,
        );
    }

    private function get_default_ribbon_attrs($type) {
        $attrs = array(
            'text' => 'New',
            'originX' => 'left',
            'originY' => 'top',
            'x' => '-1px',
            'y' => '-3px',
            'rotate' => 0,
            'height' => '70px',
            'width' => '30px',
            'iconSize' => '20px',
            'shape' => 'up',
            'icon' => null,
            'style' => array(
                'color' => '#ffffff',
                'background' => '#671FEB',
                'bgGradient' => '',
                'fontSize' => '1.38rem',
                'padding' => array(
                    'top' => 'var(--wp--preset--spacing--20)',
                    'right' => 'var(--wp--preset--spacing--40)',
                    'bottom' => 'var(--wp--preset--spacing--20)',
                    'left' => 'var(--wp--preset--spacing--40)',
                ),
                'borderRadius' => array(
                    'topLeft' => '4px',
                    'topRight' => '4px',
                    'bottomRight' => '4px',
                    'bottomLeft' => '4px',
                ),
            ),
        );

        switch ($type) {
            case 'bookmark':
                $attrs['x'] = '20px';
                $attrs['originX'] = 'right';
                break;

            case 'corner':
                $attrs['y'] = '50px';
                break;

            case 'icon':
                $attrs['x'] = '20px';
                $attrs['originX'] = 'right';
                $attrs['icon'] = array(
                    'iconName' => 'star',
                    'svg' => array(
                        'viewBox' => '0 0 576 512',
                        'path' => 'M259.3 17.8L194 150.2 47.9 171.5c-26.2 3.8-36.7 36.1-17.7 54.6l105.7 103-25 145.5c-4.5 26.3 23.2 46 46.4 33.7L288 439.6l130.7 68.7c23.2 12.2 50.9-7.4 46.4-33.7l-25-145.5 105.7-103c19-18.5 8.5-50.8-17.7-54.6L382 150.2 316.7 17.8c-11.7-23.6-45.6-23.9-57.4 0z',
                    ),
                );
                break;

            case 'side':
                $attrs['y'] = '10px';
                break;
        }

        return $attrs;
    }

    private function parse_styled_list_items($block) {
        $items = array();
        $this->append_styled_list_items($this->get_block_inner_blocks($block), 0, $items);

        return $items;
    }

    private function append_styled_list_items($blocks, $indent_level, &$items) {
        foreach ($blocks as $block) {
            if (!is_array($block)) {
                continue;
            }

            $block_name = $this->get_block_name($block);
            if ($block_name === 'tableberg/styled-list') {
                $this->append_styled_list_items(
                    $this->get_block_inner_blocks($block),
                    $indent_level,
                    $items
                );
                continue;
            }

            if ($block_name !== 'tableberg/styled-list-item') {
                continue;
            }

            $block_attrs = $this->get_block_attrs($block);
            $items[] = array(
                'content' => (string) $this->get_scalar($block_attrs, 'text', ''),
                'indentLevel' => $indent_level,
            );

            foreach ($this->get_block_inner_blocks($block) as $inner_block) {
                if ($this->get_block_name($inner_block) !== 'tableberg/styled-list') {
                    continue;
                }

                $this->append_styled_list_items(
                    $this->get_block_inner_blocks($inner_block),
                    $indent_level + 1,
                    $items
                );
            }
        }
    }

    private function parse_list_items_from_html($html) {
        if (!is_string($html) || trim($html) === '') {
            return array();
        }

        $items = array();

        if (preg_match_all('/<li\b[^>]*>(.*?)<\/li>/is', $html, $matches)) {
            foreach ($matches[1] as $item_html) {
                $items[] = array(
                    'content' => trim($this->strip_nested_list_markup($item_html)),
                    'indentLevel' => 0,
                );
            }
        }

        if (!empty($items)) {
            return $items;
        }

        return array(array(
            'content' => $html,
            'indentLevel' => 0,
        ));
    }

    private function resolve_core_list_style($attrs) {
        if (!empty($attrs['ordered'])) {
            return 'decimal';
        }

        $class_name = (string) $this->get_scalar($attrs, 'className', '');

        if (strpos($class_name, 'is-style-circle') !== false) {
            return 'circle';
        }

        if (strpos($class_name, 'is-style-square') !== false) {
            return 'square';
        }

        if (strpos($class_name, 'no-bullet') !== false) {
            return 'none';
        }

        return 'disc';
    }

    private function resolve_element_alignment($align, $legacy_cell_attrs) {
        $mapped_align = $this->map_text_alignment($align, '');
        if ($mapped_align !== '') {
            return $mapped_align;
        }

        $justify_content = $this->get_scalar($legacy_cell_attrs, 'justifyContent', 'left');
        if ($justify_content === 'right') {
            return 'right';
        }
        if ($justify_content === 'center') {
            return 'center';
        }

        return 'left';
    }

    private function extract_text_color($attrs, $fallback) {
        $style_color = $this->get_nested_value($attrs, array('style', 'color', 'text'), null);
        if (is_string($style_color) && $style_color !== '') {
            return $this->normalize_css_value($style_color);
        }

        $text_color_slug = $this->get_scalar($attrs, 'textColor', null);
        if (is_string($text_color_slug) && $text_color_slug !== '') {
            return $this->preset_slug_to_css_var('color', $text_color_slug);
        }

        return $fallback;
    }

    private function extract_link_color($attrs, $fallback) {
        $link_color = $this->get_nested_value(
            $attrs,
            array('style', 'elements', 'link', 'color', 'text'),
            null
        );
        if (is_string($link_color) && $link_color !== '') {
            return $this->normalize_css_value($link_color);
        }

        return $fallback;
    }

    private function extract_background_color($attrs) {
        $background_color = $this->get_nested_value($attrs, array('style', 'color', 'background'), null);
        if (is_string($background_color) && $background_color !== '') {
            return $this->normalize_css_value($background_color);
        }

        $background_slug = $this->get_scalar($attrs, 'backgroundColor', null);
        if (is_string($background_slug) && $background_slug !== '') {
            return $this->preset_slug_to_css_var('color', $background_slug);
        }

        return '';
    }

    private function extract_font_size($attrs, $fallback) {
        $font_size = $this->get_nested_value($attrs, array('style', 'typography', 'fontSize'), null);
        if (is_string($font_size) && $font_size !== '') {
            return $this->normalize_css_value($font_size);
        }

        $font_size_slug = $this->get_scalar($attrs, 'fontSize', null);
        if (is_string($font_size_slug) && $font_size_slug !== '') {
            return $this->map_legacy_font_size_slug($font_size_slug);
        }

        return $fallback;
    }

    private function get_background_value($attrs) {
        $background = $this->normalize_css_value($this->get_scalar($attrs, 'background', ''));
        if ($background !== '') {
            return $background;
        }

        return $this->extract_background_color($attrs);
    }

    private function map_vertical_align($align) {
        if ($align === 'top') {
            return 'top';
        }

        if ($align === 'bottom') {
            return 'bottom';
        }

        return 'middle';
    }

    private function map_text_alignment($align, $default) {
        if (in_array($align, array('left', 'center', 'right'), true)) {
            return $align;
        }

        return $default;
    }

    private function map_button_width($width) {
        if ($width === null || $width === '' || $width === 0 || $width === '0') {
            return 'auto';
        }

        if (is_numeric($width)) {
            $width = (string) max(1, min(100, (int) $width)) . '%';
        }

        if (!is_string($width)) {
            return 'auto';
        }

        return $width;
    }

    private function map_table_dimensions($legacy_table_width, $legacy_table_alignment) {
        $table_width = $this->normalize_css_value(
            is_string($legacy_table_width) ? $legacy_table_width : ''
        );
        $table_alignment = $this->map_text_alignment($legacy_table_alignment, 'left');

        if ($table_width === '') {
            $table_width = in_array($legacy_table_alignment, array('wide', 'full'), true)
                ? $legacy_table_alignment
                : 'auto';
        }

        if (!in_array($table_width, array('auto', 'wide', 'full'), true) && $table_alignment === '') {
            $table_alignment = 'left';
        }

        return array(
            'tableWidth' => $table_width,
            'tableAlignment' => $table_alignment === '' ? 'left' : $table_alignment,
        );
    }

    private function is_legacy_section_enabled($value) {
        return is_string($value) && $value !== '';
    }

    private function is_header_cell($cell_attrs, $table_attrs) {
        return $this->is_legacy_section_enabled(
            $this->get_scalar($table_attrs, 'enableTableHeader', '')
        ) && (int) $this->get_scalar($cell_attrs, 'row', 0) === 0;
    }

    private function is_footer_cell($cell_attrs, $table_attrs, $rows) {
        return $this->is_legacy_section_enabled(
            $this->get_scalar($table_attrs, 'enableTableFooter', '')
        ) && (int) $this->get_scalar($cell_attrs, 'row', 0) + 1 === $rows;
    }

    private function is_odd_data_row($row, $table_attrs) {
        $has_header = $this->is_legacy_section_enabled(
            $this->get_scalar($table_attrs, 'enableTableHeader', '')
        );

        return (($row + ($has_header ? 0 : 1)) % 2) === 1;
    }

    private function pick_spacing_side($spacing, $sides, $default) {
        if (!is_array($spacing)) {
            return $default;
        }

        foreach ($sides as $side) {
            if (isset($spacing[$side]) && $spacing[$side] !== '') {
                return $this->normalize_css_value($spacing[$side]);
            }
        }

        return $default;
    }

    private function normalize_spacing($spacing) {
        $normalized = array(
            'top' => '',
            'right' => '',
            'bottom' => '',
            'left' => '',
        );

        if (is_string($spacing) && $spacing !== '') {
            $spacing = array(
                'top' => $spacing,
                'right' => $spacing,
                'bottom' => $spacing,
                'left' => $spacing,
            );
        }

        if (!is_array($spacing)) {
            return $normalized;
        }

        foreach ($normalized as $side => $value) {
            if (isset($spacing[$side])) {
                $normalized[$side] = $this->normalize_css_value($spacing[$side]);
            }
        }

        return $normalized;
    }

    private function normalize_border_sides($border) {
        $normalized = $this->get_empty_border_sides();

        if (is_string($border) && $border !== '') {
            foreach (array_keys($normalized) as $side) {
                $normalized[$side] = $border;
            }
            return $normalized;
        }

        if (!is_array($border)) {
            return $normalized;
        }

        $has_split_sides = false;
        foreach (array_keys($normalized) as $side) {
            if (isset($border[$side])) {
                $has_split_sides = true;
                break;
            }
        }

        if ($has_split_sides) {
            foreach (array_keys($normalized) as $side) {
                $normalized[$side] = $this->normalize_single_border(
                    isset($border[$side]) ? $border[$side] : null
                );
            }
            return $normalized;
        }

        $single_border = $this->normalize_single_border($border);
        foreach (array_keys($normalized) as $side) {
            $normalized[$side] = $single_border;
        }

        return $normalized;
    }

    private function normalize_single_border($border) {
        if (is_string($border)) {
            return $border;
        }

        if (!is_array($border)) {
            return '';
        }

        $width = isset($border['width']) ? trim((string) $border['width']) : '';
        if ($width === '') {
            return '';
        }

        $style = isset($border['style']) ? trim((string) $border['style']) : '';
        $color = isset($border['color']) ? trim((string) $border['color']) : '';

        if ($style === '') {
            $style = 'solid';
        }

        return trim($width . ' ' . $style . ' ' . $color);
    }

    private function normalize_border_radius($radius) {
        $normalized = $this->get_empty_border_radius();

        if (is_string($radius) && $radius !== '') {
            foreach (array_keys($normalized) as $corner) {
                $normalized[$corner] = $radius;
            }
            return $normalized;
        }

        if (!is_array($radius)) {
            return $normalized;
        }

        foreach (array_keys($normalized) as $corner) {
            if (isset($radius[$corner])) {
                $normalized[$corner] = $this->normalize_css_value($radius[$corner]);
            }
        }

        return $normalized;
    }

    private function migrate_legacy_icon_payload($icon) {
        if (!is_array($icon)) {
            return null;
        }

        $migrated_icon = array(
            'iconName' => (string) $this->get_scalar($icon, 'iconName', ''),
        );

        $url = $this->get_scalar($icon, 'url', null);
        if (is_string($url) && $url !== '') {
            $migrated_icon['url'] = $url;
        }

        $svg = $this->extract_legacy_icon_svg($icon);
        if ($svg !== null) {
            $migrated_icon['svg'] = $svg;
        }

        if (
            $migrated_icon['iconName'] === '' &&
            !isset($migrated_icon['svg']) &&
            !isset($migrated_icon['url'])
        ) {
            return null;
        }

        return $migrated_icon;
    }

    private function get_default_legacy_icon_payload() {
        return array(
            'iconName' => 'check',
            'svg' => array(
                'viewBox' => '0 0 512 512',
                'path' => 'M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z',
            ),
        );
    }

    private function extract_legacy_icon_svg($icon) {
        $svg = $this->get_array($icon, 'svg', array());
        if (
            isset($svg['viewBox']) &&
            is_string($svg['viewBox']) &&
            isset($svg['path']) &&
            is_string($svg['path'])
        ) {
            return array(
                'viewBox' => $svg['viewBox'],
                'path' => $svg['path'],
            );
        }

        $legacy_svg = $this->get_nested_value($icon, array('icon', 'props'), null);
        if (!is_array($legacy_svg)) {
            return null;
        }

        $path = $this->get_nested_value($legacy_svg, array('children', 'props', 'd'), null);
        $view_box = $this->get_scalar($legacy_svg, 'viewBox', null);

        if (!is_string($path) || $path === '' || !is_string($view_box) || $view_box === '') {
            return null;
        }

        return array(
            'viewBox' => $view_box,
            'path' => $path,
        );
    }

    private function extract_block_html($block) {
        if (!is_array($block)) {
            return '';
        }

        if (isset($block['innerHTML']) && is_string($block['innerHTML'])) {
            return trim($block['innerHTML']);
        }

        if (!isset($block['innerContent']) || !is_array($block['innerContent'])) {
            return '';
        }

        $html = '';
        foreach ($block['innerContent'] as $content) {
            if (is_string($content)) {
                $html .= $content;
            }
        }

        return trim($html);
    }

    private function extract_block_html_from_attrs($attrs) {
        $html = $this->get_scalar($attrs, 'originalContent', null);
        if (is_string($html) && trim($html) !== '') {
            return trim($html);
        }

        $html = $this->get_scalar($attrs, '__unstableOriginalContent', null);
        if (is_string($html) && trim($html) !== '') {
            return trim($html);
        }

        return '';
    }

    private function extract_first_tag_inner_html($html, $tag_name, $excluded_tags = array()) {
        if (!is_string($html) || trim($html) === '') {
            return null;
        }

        $pattern = '/<' . preg_quote($tag_name, '/') . '\b[^>]*>(.*)<\/' . preg_quote($tag_name, '/') . '>/is';
        if (preg_match($pattern, $html, $matches)) {
            return trim($this->strip_tag_markup($matches[1], $excluded_tags));
        }

        return null;
    }

    private function extract_first_tag_style_value($html, $tag_name, $css_property) {
        if (!is_string($html) || trim($html) === '') {
            return null;
        }

        $pattern = '/<' . preg_quote($tag_name, '/') . '\b[^>]*style=["\']([^"\']*)["\'][^>]*>/i';
        if (preg_match($pattern, $html, $matches)) {
            return $this->extract_style_declaration_value($matches[1], $css_property);
        }

        return null;
    }

    private function extract_style_declaration_value($style, $css_property) {
        if (!is_string($style) || trim($style) === '') {
            return null;
        }

        $pattern = '/(?:^|;)\s*' . preg_quote($css_property, '/') . '\s*:\s*([^;]+)\s*(?:;|$)/i';
        if (!preg_match($pattern, $style, $matches)) {
            return null;
        }

        return trim($matches[1]);
    }

    private function extract_first_tag_class_font_size_slug($html, $tag_name) {
        if (!is_string($html) || trim($html) === '') {
            return null;
        }

        $class_name = null;
        $pattern = '/<' . preg_quote($tag_name, '/') . '\b[^>]*class=["\']([^"\']*)["\'][^>]*>/i';
        if (preg_match($pattern, $html, $matches)) {
            $class_name = $matches[1];
        }

        if (!is_string($class_name) || $class_name === '') {
            return null;
        }

        if (preg_match('/(?:^|\s)has-([a-z0-9-]+)-font-size(?:\s|$)/i', $class_name, $matches)) {
            return strtolower($matches[1]);
        }

        return null;
    }

    private function strip_nested_list_markup($html) {
        return preg_replace('/<(ul|ol)\b[^>]*>.*?<\/\1>/is', '', $html);
    }

    private function strip_tag_markup($html, $tag_names = array()) {
        if (!is_string($html) || empty($tag_names)) {
            return $html;
        }

        foreach ($tag_names as $tag_name) {
            $html = preg_replace(
                '/<' . preg_quote($tag_name, '/') . '\b[^>]*>.*?<\/' . preg_quote($tag_name, '/') . '>/is',
                '',
                $html
            );
        }

        return $html;
    }

    private function normalize_css_value($value) {
        if (!is_string($value)) {
            return '';
        }

        $value = trim($value);
        if ($value === '') {
            return '';
        }

        if (preg_match('/^var:preset\|([^|]+)\|(.+)$/', $value, $matches)) {
            if ($matches[1] === 'spacing' && $matches[2] === '10') {
                return 'var(--wp--preset--spacing--20)';
            }

            return 'var(--wp--preset--' . $matches[1] . '--' . $matches[2] . ')';
        }

        return $value;
    }

    private function preset_slug_to_css_var($group, $slug) {
        return 'var(--wp--preset--' . $group . '--' . $slug . ')';
    }

    private function map_legacy_font_size_slug($slug) {
        $built_in_font_sizes = array(
            's' => '0.75rem',
            'small' => '0.75rem',
            'm' => '0.875rem',
            'normal' => '0.875rem',
            'medium' => '0.875rem',
            'l' => '1rem',
            'large' => '1rem',
            'xl' => '1.38rem',
            'x-large' => '1.38rem',
            'xlarge' => '1.38rem',
            'xxl' => '1.75rem',
            'xx-large' => '1.75rem',
            'xxlarge' => '1.75rem',
            'huge' => '1.75rem',
        );

        $slug = strtolower((string) $slug);

        if (isset($built_in_font_sizes[$slug])) {
            return $built_in_font_sizes[$slug];
        }

        return $this->preset_slug_to_css_var('font-size', $slug);
    }

    private function has_any_non_empty_value($values) {
        if (!is_array($values)) {
            return false;
        }

        foreach ($values as $value) {
            if (is_string($value) && trim($value) !== '') {
                return true;
            }
        }

        return false;
    }

    private function create_synthetic_cells($rows, $cols) {
        $cells = array();

        for ($row = 0; $row < $rows; $row++) {
            for ($col = 0; $col < $cols; $col++) {
                $cells[] = array(
                    'blockName' => 'tableberg/cell',
                    'attrs' => array(
                        'row' => $row,
                        'col' => $col,
                        'rowspan' => 1,
                        'colspan' => 1,
                    ),
                    'innerBlocks' => array(),
                );
            }
        }

        return $cells;
    }

    private function get_legacy_cell_blocks($block) {
        $cells = array();

        foreach ($this->get_block_inner_blocks($block) as $inner_block) {
            if ($this->get_block_name($inner_block) !== 'tableberg/cell') {
                continue;
            }

            $cells[] = $inner_block;
        }

        return $cells;
    }

    private function get_block_name($block) {
        if (!is_array($block) || !isset($block['blockName']) || !is_string($block['blockName'])) {
            return '';
        }

        return $block['blockName'];
    }

    private function get_block_attrs($block) {
        if (!is_array($block) || !isset($block['attrs']) || !is_array($block['attrs'])) {
            return array();
        }

        return $block['attrs'];
    }

    private function get_block_inner_blocks($block) {
        if (!is_array($block) || !isset($block['innerBlocks']) || !is_array($block['innerBlocks'])) {
            return array();
        }

        return $block['innerBlocks'];
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

    private function get_nested_value($array, $keys, $default) {
        if (!is_array($array)) {
            return $default;
        }

        $current = $array;
        foreach ($keys as $key) {
            if (!is_array($current) || !array_key_exists($key, $current)) {
                return $default;
            }

            $current = $current[$key];
        }

        return $current;
    }

    private function get_empty_border_sides() {
        return array(
            'top' => '',
            'right' => '',
            'bottom' => '',
            'left' => '',
        );
    }

    private function get_empty_border_radius() {
        return array(
            'topLeft' => '',
            'topRight' => '',
            'bottomRight' => '',
            'bottomLeft' => '',
        );
    }
}

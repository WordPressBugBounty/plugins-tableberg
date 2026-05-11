<?php

/**
 * Block Defaults
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: packages/tableberg/src/attributes.ts
 *
 * @package Tableberg
 */

namespace Tableberg\Renderer\Table;

/**
 * Table Block Defaults
 */
class Defaults {
    /**
     * Get default attribute values for the table block
     *
     * @return array
     */
    public static function get_defaults() {
        return [
            'version' => 0,
            'isExample' => false,
            'table' => [
                'rows' => 0,
                'cols' => 0,
                'className' => '',
                'headerEnabled' => false,
                'footerEnabled' => false,
                'stickyHeader' => false,
                'caption' => '',
                'tableWidth' => 'auto',
                'tableAlignment' => 'left',
                'cellSpacing' => [
                    'horizontal' => '0',
                    'vertical' => '0',
                ],
                'tableBorder' => [
                    'top' => '',
                    'right' => '',
                    'bottom' => '',
                    'left' => '',
                ],
                'fixedColumnWidths' => true,
                'pagination' => [
                    'enabled' => false,
                    'pageSize' => 10,
                    'showPageNumbers' => true,
                    'showPrevNext' => true,
                ],
                'search' => [
                    'enabled' => false,
                    'placeholder' => 'Search...',
                    'highlightColor' => '',
                    'position' => 'left',
                ],
                'responsive' => [
                    'tablet' => [
                        'enabled' => false,
                        'maxWidth' => 1024,
                        'mode' => 'scroll',
                        'transpose' => false,
                        'stackCount' => 3,
                        'repeatFirstCol' => false,
                    ],
                    'mobile' => [
                        'enabled' => false,
                        'maxWidth' => 700,
                        'mode' => 'scroll',
                        'transpose' => false,
                        'stackCount' => 1,
                        'repeatFirstCol' => false,
                    ],
                ],
            ],
            'rows' => [],
            'columns' => [],
            'cells' => [],
            'bindings' => [],
            'cellDefaults' => [
                'styles' => [
                    'padding' => [
                        'top' => 'var(--wp--preset--spacing--20)',
                        'right' => 'var(--wp--preset--spacing--20)',
                        'bottom' => 'var(--wp--preset--spacing--20)',
                        'left' => 'var(--wp--preset--spacing--20)',
                    ],
                    'border' => [
                        'top' => '1px solid black',
                        'right' => '1px solid black',
                        'bottom' => '1px solid black',
                        'left' => '1px solid black',
                    ],
                    'borderRadius' => [
                        'topLeft' => '0px',
                        'topRight' => '0px',
                        'bottomRight' => '0px',
                        'bottomLeft' => '0px',
                    ],
                    'orientation' => 'vertical',
                    'elementGap' => 'var(--wp--preset--spacing--20)',
                    'wrap' => 'nowrap',
                    'verticalAlign' => 'middle',
                    'backgroundColor' => '',
                ],
            ],
        ];
    }
}

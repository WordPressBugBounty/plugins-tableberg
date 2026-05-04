<?php

/**
 * List Element Defaults
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: packages/tableberg/src/elements/list/index.tsx
 *
 * @package Tableberg
 */

namespace Tableberg\Renderer\ListEl;

class Defaults {
    /**
     * @return array<string, mixed>
     */
    public static function get_defaults() {
        return [
            'align' => 'left',
            'items' => [
                [
                    'content' => '',
                    'indentLevel' => 0,
                ],
            ],
            'listType' => 'basic',
            'listStyle' => 'disc',
            'icon' => [
                'iconName' => 'check',
                'svg' => [
                    'viewBox' => '0 0 24 24',
                    'path' => 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z',
                ],
            ],
            'styles' => [
                'itemSpacing' => '0',
                'iconColor' => '#000000',
                'iconSize' => '15px',
                'iconSpacing' => 'var(--wp--preset--spacing--20)',
                'fontSize' => '1.38rem',
                'textColor' => '#000000',
                'linkColor' => '',
                'backgroundColor' => '',
            ],
        ];
    }
}

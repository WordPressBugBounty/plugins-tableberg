<?php

/**
 * Button Element Defaults
 *
 * AUTO-GENERATED FILE - DO NOT EDIT MANUALLY
 * Generated from: packages/tableberg/src/elements/button/index.tsx
 *
 * @package Tableberg
 */

namespace Tableberg\Renderer\Button;

class Defaults {
    /**
     * @return array<string, mixed>
     */
    public static function get_defaults() {
        return [
            'content' => '',
            'id' => '',
            'align' => 'left',
            'link' => [
                'url' => '',
                'target' => '_self',
            ],
            'styles' => [
                'backgroundColor' => 'var(--wp--preset--color--contrast)',
                'textColor' => 'var(--wp--preset--color--base)',
                'backgroundHoverColor' => '',
                'textHoverColor' => '',
                'textAlign' => 'center',
                'width' => 'auto',
                'padding' => [
                    'top' => 'var(--wp--preset--spacing--20)',
                    'right' => 'var(--wp--preset--spacing--20)',
                    'bottom' => 'var(--wp--preset--spacing--20)',
                    'left' => 'var(--wp--preset--spacing--20)',
                ],
                'borderRadius' => [
                    'topLeft' => '4px',
                    'topRight' => '4px',
                    'bottomRight' => '4px',
                    'bottomLeft' => '4px',
                ],
                'fontSize' => '1.38rem',
            ],
        ];
    }
}

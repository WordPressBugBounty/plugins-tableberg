<?php

namespace Tableberg\Renderer\Attrs;

use function Tableberg\Renderer\getOrNull;

class SvgIconAttrs {
    /** @var StringAttr */
    public $viewBox;

    /** @var StringAttr */
    public $path;

    /**
     * @param array<string, mixed>|null $data
     * @param array<string, mixed> $defaults
     * @param string $fallbackViewBox
     * @param string $fallbackPath
     * @return self
     */
    public static function from_array(
        $data,
        $defaults = [],
        $fallbackViewBox = '0 0 24 24',
        $fallbackPath = ''
    ) {
        $data = is_array($data) ? $data : [];

        $defaultViewBox = getOrNull($defaults['viewBox']);
        $defaultPath = getOrNull($defaults['path']);

        $instance = new self();
        $instance->viewBox = new StringAttr(
            getOrNull($data['viewBox']),
            $defaultViewBox
        );
        $instance->path = new StringAttr(
            getOrNull($data['path']),
            $defaultPath
        );

        return $instance;
    }
}

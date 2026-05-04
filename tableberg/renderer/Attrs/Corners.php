<?php

namespace Tableberg\Renderer\Attrs;

use function Tableberg\Renderer\getOrNull;

class Corners {
    /** @var StringAttr */
    public $topLeft;

    /** @var StringAttr */
    public $topRight;

    /** @var StringAttr */
    public $bottomRight;

    /** @var StringAttr */
    public $bottomLeft;

    /**
     * @param array|null $data
     * @param array<string, string> $defaults
     * @return self
     */
    public static function from_array($data, $defaults) {
        $data = is_array($data) ? $data : [];

        $instance = new self();
        $defaultTopLeft = getOrNull($defaults['topLeft']);
        $defaultTopRight = getOrNull($defaults['topRight']);
        $defaultBottomRight = getOrNull($defaults['bottomRight']);
        $defaultBottomLeft = getOrNull($defaults['bottomLeft']);

        $instance->topLeft = new StringAttr(
            getOrNull($data['topLeft']),
            $defaultTopLeft
        );
        $instance->topRight = new StringAttr(
            getOrNull($data['topRight']),
            $defaultTopRight
        );
        $instance->bottomRight = new StringAttr(
            getOrNull($data['bottomRight']),
            $defaultBottomRight
        );
        $instance->bottomLeft = new StringAttr(
            getOrNull($data['bottomLeft']),
            $defaultBottomLeft
        );

        return $instance;
    }
}

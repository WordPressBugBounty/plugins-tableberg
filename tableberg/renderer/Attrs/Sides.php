<?php

namespace Tableberg\Renderer\Attrs;

use function Tableberg\Renderer\getOrNull;

class Sides {
    /** @var StringAttr */
    public $top;

    /** @var StringAttr */
    public $right;

    /** @var StringAttr */
    public $bottom;

    /** @var StringAttr */
    public $left;

    /**
     * @param array|null $data
     * @param array<string, string> $defaults
     * @return self
     */
    public static function from_array($data, $defaults) {
        $data = is_array($data) ? $data : [];

        $instance = new self();
        $defaultTop = getOrNull($defaults['top']);
        $defaultRight = getOrNull($defaults['right']);
        $defaultBottom = getOrNull($defaults['bottom']);
        $defaultLeft = getOrNull($defaults['left']);

        $instance->top = new StringAttr(getOrNull($data['top']), $defaultTop);
        $instance->right = new StringAttr(
            getOrNull($data['right']),
            $defaultRight
        );
        $instance->bottom = new StringAttr(
            getOrNull($data['bottom']),
            $defaultBottom
        );
        $instance->left = new StringAttr(getOrNull($data['left']), $defaultLeft);

        return $instance;
    }
}

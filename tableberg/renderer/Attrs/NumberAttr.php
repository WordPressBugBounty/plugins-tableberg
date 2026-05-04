<?php

namespace Tableberg\Renderer\Attrs;

class NumberAttr {
    /** @var int|float */
    private $value;

    /**
     * @param int|float $value
     * @param int|float $default
     */
    public function __construct($value, $default) {
        if ($value === null || $value === '') {
            $this->value = $default;
        } else {
            $this->value = is_float($default) ? (float) $value : (int) $value;
        }
    }

    /** @return int|float */
    public function value() {
        return $this->value;
    }

    /** @return string */
    public function asAttr() {
        return esc_attr((string) $this->value);
    }
}

<?php

namespace Tableberg\Renderer\Attrs;

class BoolAttr {
    /** @var bool */
    private $value;

    /**
     * @param bool $value
     * @param bool $default
     */
    public function __construct($value, $default) {
        $this->value = ($value === null) ? $default : (bool) $value;
    }

    /** @return bool */
    public function value() {
        return $this->value;
    }

    /** @return string */
    public function asAttr() {
        return $this->value ? 'true' : 'false';
    }
}

<?php

namespace Tableberg\Renderer\Attrs;

class StringAttr {
    /** @var string */
    private $value;

    /**
     * @param string $value
     * @param string $default
     * @param array|null $allowed
     */
    public function __construct($value, $default, $allowed = null) {
        if ($value === null || $value === '') {
            $this->value = $default;
        } elseif ($allowed !== null && !in_array($value, $allowed, true)) {
            $this->value = $default;
        } else {
            $this->value = (string) $value;
        }
    }

    /** @return string */
    public function asAttr() {
        return esc_attr($this->value);
    }

    /** @return string */
    public function asUrl() {
        return esc_url($this->value);
    }

    /** @return string */
    public function asHtml() {
        return wp_kses_post($this->value);
    }

    /** @return string */
    public function asText() {
        return esc_html($this->value);
    }

    /** @return bool */
    public function isEmpty() {
        return $this->value === '';
    }

    /** @return bool */
    public function isNotEmpty() {
        return $this->value !== '';
    }

    /**
     * @param mixed $other
     * @return bool
     */
    public function equals($other) {
        return $this->value === (string) $other;
    }

    /** @return string */
    public function dangerouslyUseRawValue() {
        return $this->value;
    }

    /**
     * @param array<string, mixed>|null $value
     * @param string $default
     * @return array<string, StringAttr|array>|null
     */
    public static function fromNestedArray($value, $default = '') {
        if (!is_array($value)) {
            return null;
        }

        $result = [];

        foreach ($value as $key => $item) {
            if ($item === null) {
                continue;
            }

            if (is_array($item)) {
                $nested = self::fromNestedArray($item, $default);
                if (is_array($nested) && !empty($nested)) {
                    $result[$key] = $nested;
                }
                continue;
            }

            $result[$key] = new self($item, $default);
        }

        return !empty($result) ? $result : null;
    }
}

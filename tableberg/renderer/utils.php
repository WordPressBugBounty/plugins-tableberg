<?php

namespace Tableberg\Renderer;

/**
 * @param mixed $value
 * @return mixed|null
 */
function getOrNull(&$value) {
    return isset($value) ? $value : null;
}

/**
 * @param mixed $value
 * @return array<mixed>|null
 */
function getArrayOrNull(&$value) {
    $maybeValue = getOrNull($value);
    return is_array($maybeValue) ? $maybeValue : null;
}

/**
 * @param mixed $value
 * @return string|null
 */
function getStringOrNull(&$value) {
    $maybeValue = getOrNull($value);
    return is_string($maybeValue) ? $maybeValue : null;
}

/**
 * @param mixed $value
 * @return bool|null
 */
function getBoolOrNull(&$value) {
    $maybeValue = getOrNull($value);
    return is_bool($maybeValue) ? $maybeValue : null;
}

/**
 * @param float $value
 * @param float $min
 * @param float $max
 * @return float
 */
function clamp($value, $min, $max) {
    return max($min, min($value, $max));
}

/**
 * Check whether a value is undefined.
 *
 * @param mixed $value Value to check.
 * @return bool
 */
function is_undefined($value) {
    return null === $value || !isset($value);
}

/**
 * Generate CSS string from styles array.
 *
 * @param array $styles Styles array.
 * @return string
 */
function generate_css_string($styles) {
    $css_string = '';

    foreach ($styles as $key => $value) {
        if (
            !is_undefined($value) &&
            false !== $value &&
            (
                !is_string($value) ||
                (
                    trim($value) !== '' &&
                    trim($value) !== 'undefined undefined undefined'
                )
            )
        ) {
            $css_string .= $key . ': ' . $value . '; ';
        }
    }

    return $css_string;
}

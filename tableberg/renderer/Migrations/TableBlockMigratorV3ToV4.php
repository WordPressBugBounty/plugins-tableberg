<?php

namespace Tableberg\Renderer\Migrations;

/**
 * Migrates a v3 (faux-block era) table block into the v4 native-blocks
 * format. Unlike the attr-only migrators, this replaces the WHOLE parsed
 * block: slim v4 attrs + a real innerBlocks tree (rows -> cells -> elements).
 *
 * v3 shim innerBlocks (cell/element comments carrying only coords) are
 * discarded — the attrs are canonical and the tree is rebuilt from them.
 */
class TableBlockMigratorV3ToV4 {
    const ELEMENT_NAMES = [
        'text',
        'button',
        'image',
        'list',
        'styled-list',
        'icon',
        'star-rating',
        'custom-html',
    ];

    /**
     * @param array $block Parsed tableberg/table block with v3 attrs.
     * @return array Parsed block in v4 shape.
     */
    public function migrate_block($block) {
        if (!is_array($block) || !isset($block['attrs']) || !is_array($block['attrs'])) {
            return $block;
        }

        $attrs = $block['attrs'];

        $table = isset($attrs['table']) && is_array($attrs['table'])
            ? $attrs['table']
            : [];
        $rowsCount = isset($table['rows']) && is_numeric($table['rows'])
            ? (int) $table['rows']
            : 0;
        $colsCount = isset($table['cols']) && is_numeric($table['cols'])
            ? (int) $table['cols']
            : 0;

        $cells = isset($attrs['cells']) && is_array($attrs['cells'])
            ? $attrs['cells']
            : [];
        $rowConfigs = isset($attrs['rows']) && is_array($attrs['rows'])
            ? $attrs['rows']
            : [];

        $covered = $this->compute_covered_positions($cells, $rowsCount, $colsCount);

        $rowBlocks = [];
        for ($row = 0; $row < $rowsCount; $row++) {
            $cellBlocks = [];

            for ($col = 0; $col < $colsCount; $col++) {
                if (isset($covered["{$row},{$col}"])) {
                    continue;
                }

                $cell = isset($cells["{$row},{$col}"]) && is_array($cells["{$row},{$col}"])
                    ? $cells["{$row},{$col}"]
                    : [];

                $cellBlocks[] = $this->build_cell_block($cell);
            }

            $rowAttrs = [];
            $rowConfig = isset($rowConfigs[$row]) && is_array($rowConfigs[$row])
                ? $rowConfigs[$row]
                : [];
            if (isset($rowConfig['height']) && is_string($rowConfig['height']) && $rowConfig['height'] !== '') {
                $rowAttrs['height'] = $rowConfig['height'];
            }

            $rowBlocks[] = $this->make_block('tableberg/row', $rowAttrs, $cellBlocks);
        }

        // Slim v4 attrs: the cells map and per-row configs now live in the
        // innerBlocks tree.
        $newAttrs = $attrs;
        unset($newAttrs['cells']);
        unset($newAttrs['rows']);
        $newAttrs['version'] = 4;

        return $this->make_block('tableberg/table', $newAttrs, $rowBlocks);
    }

    /**
     * @param array $cell v3 cell entry.
     * @return array Parsed tableberg/cell block.
     */
    private function build_cell_block($cell) {
        $cellAttrs = [];

        foreach (['span', 'styles', 'ribbon', 'className'] as $key) {
            if (isset($cell[$key])) {
                $cellAttrs[$key] = $cell[$key];
            }
        }

        $elementBlocks = [];
        $elements = isset($cell['elements']) && is_array($cell['elements'])
            ? $cell['elements']
            : [];

        foreach ($elements as $element) {
            if (
                !is_array($element) ||
                !isset($element['name']) ||
                !in_array($element['name'], self::ELEMENT_NAMES, true)
            ) {
                continue;
            }

            $elementAttrs = isset($element['attributes']) && is_array($element['attributes'])
                ? $element['attributes']
                : [];

            if (isset($element['bindings']) && is_array($element['bindings']) && !empty($element['bindings'])) {
                $elementAttrs['bindings'] = $element['bindings'];
            }

            $elementBlocks[] = $this->make_block(
                'tableberg/' . $element['name'],
                $elementAttrs,
                []
            );
        }

        return $this->make_block('tableberg/cell', $cellAttrs, $elementBlocks);
    }

    /**
     * Positions covered by a rowSpan/colSpan anchor (excluding the anchor).
     *
     * @param array $cells
     * @param int $rowsCount
     * @param int $colsCount
     * @return array<string, bool>
     */
    private function compute_covered_positions($cells, $rowsCount, $colsCount) {
        $covered = [];

        foreach ($cells as $key => $cell) {
            if (!is_array($cell) || !isset($cell['span']) || !is_array($cell['span'])) {
                continue;
            }

            $coords = explode(',', (string) $key);
            if (count($coords) !== 2) {
                continue;
            }
            $row = (int) $coords[0];
            $col = (int) $coords[1];

            $rowSpan = isset($cell['span']['rowSpan']) && is_numeric($cell['span']['rowSpan'])
                ? max(1, (int) $cell['span']['rowSpan'])
                : 1;
            $colSpan = isset($cell['span']['colSpan']) && is_numeric($cell['span']['colSpan'])
                ? max(1, (int) $cell['span']['colSpan'])
                : 1;

            for ($dr = 0; $dr < $rowSpan; $dr++) {
                for ($dc = 0; $dc < $colSpan; $dc++) {
                    if ($dr === 0 && $dc === 0) {
                        continue;
                    }
                    $r = $row + $dr;
                    $c = $col + $dc;
                    if ($r >= $rowsCount || $c >= $colsCount) {
                        continue;
                    }
                    $covered["{$r},{$c}"] = true;
                }
            }
        }

        return $covered;
    }

    /**
     * @param string $name
     * @param array $attrs
     * @param array $innerBlocks
     * @return array
     */
    private function make_block($name, $attrs, $innerBlocks) {
        return [
            'blockName' => $name,
            'attrs' => $attrs,
            'innerBlocks' => $innerBlocks,
            'innerHTML' => '',
            'innerContent' => array_fill(0, count($innerBlocks), null),
        ];
    }
}

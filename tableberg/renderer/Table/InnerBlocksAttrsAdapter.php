<?php

namespace Tableberg\Renderer\Table;

/**
 * Adapts a v4 native-blocks table (rows -> cells -> elements innerBlocks)
 * into the v3-shaped attrs array that TableRenderer::render() consumes.
 * This keeps the whole PHP renderer working unchanged for both formats.
 */
class InnerBlocksAttrsAdapter {
    const ELEMENT_PREFIX = 'tableberg/';

    /**
     * @param array $attributes v4 table block attrs.
     * @param array $innerBlocks Parsed inner blocks (tableberg/row list).
     * @return array v3-shaped attrs array.
     */
    public static function to_attrs($attributes, $innerBlocks) {
        $attrs = is_array($attributes) ? $attributes : [];
        $innerBlocks = is_array($innerBlocks) ? $innerBlocks : [];

        $cells = [];
        $rowConfigs = [];
        // Positions occupied by a rowSpan/colSpan anchor.
        $covered = [];
        $colsCount = 0;

        $row = 0;
        foreach ($innerBlocks as $rowBlock) {
            if (
                !is_array($rowBlock) ||
                !isset($rowBlock['blockName']) ||
                $rowBlock['blockName'] !== 'tableberg/row'
            ) {
                continue;
            }

            $rowAttrs = isset($rowBlock['attrs']) && is_array($rowBlock['attrs'])
                ? $rowBlock['attrs']
                : [];
            // Pass every row attribute through untouched (not just `height`)
            // so pro-registered keys survive without this adapter needing to
            // know their names.
            $rowConfigs[$row] = empty($rowAttrs) ? null : $rowAttrs;

            $col = 0;
            $rowInner = isset($rowBlock['innerBlocks']) && is_array($rowBlock['innerBlocks'])
                ? $rowBlock['innerBlocks']
                : [];

            foreach ($rowInner as $cellBlock) {
                if (
                    !is_array($cellBlock) ||
                    !isset($cellBlock['blockName']) ||
                    $cellBlock['blockName'] !== 'tableberg/cell'
                ) {
                    continue;
                }

                // Advance past positions covered by spans from earlier rows.
                while (isset($covered["{$row},{$col}"])) {
                    $col++;
                }

                $cellAttrs = isset($cellBlock['attrs']) && is_array($cellBlock['attrs'])
                    ? $cellBlock['attrs']
                    : [];

                // Everything the cell block carries is passed straight
                // through, not just the keys this file knows about. Pro
                // registers its own cell attributes, and they have to reach
                // its renderer without free having to name them here.
                $cellEntry = $cellAttrs;

                $cellEntry['elements'] = self::to_elements(
                    isset($cellBlock['innerBlocks']) && is_array($cellBlock['innerBlocks'])
                        ? $cellBlock['innerBlocks']
                        : []
                );

                $cells["{$row},{$col}"] = $cellEntry;

                $rowSpan = 1;
                $colSpan = 1;
                if (isset($cellAttrs['span']) && is_array($cellAttrs['span'])) {
                    if (isset($cellAttrs['span']['rowSpan']) && is_numeric($cellAttrs['span']['rowSpan'])) {
                        $rowSpan = max(1, (int) $cellAttrs['span']['rowSpan']);
                    }
                    if (isset($cellAttrs['span']['colSpan']) && is_numeric($cellAttrs['span']['colSpan'])) {
                        $colSpan = max(1, (int) $cellAttrs['span']['colSpan']);
                    }
                }

                for ($dr = 0; $dr < $rowSpan; $dr++) {
                    for ($dc = 0; $dc < $colSpan; $dc++) {
                        if ($dr === 0 && $dc === 0) {
                            continue;
                        }
                        $covered[($row + $dr) . ',' . ($col + $dc)] = true;
                    }
                }

                $col += $colSpan;
                if ($col > $colsCount) {
                    $colsCount = $col;
                }
            }

            // Trailing covered positions still widen the row.
            while (isset($covered["{$row},{$col}"])) {
                $col++;
                if ($col > $colsCount) {
                    $colsCount = $col;
                }
            }

            $row++;
        }

        $table = isset($attrs['table']) && is_array($attrs['table'])
            ? $attrs['table']
            : [];
        $table['rows'] = $row;
        $table['cols'] = $colsCount;

        $adapted = $attrs;
        $adapted['version'] = 3;
        $adapted['table'] = $table;
        $adapted['rows'] = $rowConfigs;
        $adapted['cells'] = $cells;

        return $adapted;
    }

    /**
     * @param array $elementBlocks Parsed element blocks inside a cell.
     * @return array v3 cell elements array.
     */
    private static function to_elements($elementBlocks) {
        $elements = [];

        foreach ($elementBlocks as $elementBlock) {
            if (
                !is_array($elementBlock) ||
                !isset($elementBlock['blockName']) ||
                strpos($elementBlock['blockName'], self::ELEMENT_PREFIX) !== 0
            ) {
                continue;
            }

            $name = substr($elementBlock['blockName'], strlen(self::ELEMENT_PREFIX));
            $attrs = isset($elementBlock['attrs']) && is_array($elementBlock['attrs'])
                ? $elementBlock['attrs']
                : [];

            $element = ['name' => $name];

            if (isset($attrs['bindings']) && is_array($attrs['bindings']) && !empty($attrs['bindings'])) {
                $element['bindings'] = $attrs['bindings'];
                unset($attrs['bindings']);
            }

            $element['attributes'] = $attrs;

            $elements[] = $element;
        }

        return $elements;
    }
}

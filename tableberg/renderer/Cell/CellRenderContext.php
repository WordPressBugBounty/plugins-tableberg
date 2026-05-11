<?php

namespace Tableberg\Renderer\Cell;

use function Tableberg\Renderer\getArrayOrNull;
use function Tableberg\Renderer\getStringOrNull;

class CellRenderContext {
    /** @var string */
    public $className;

    /** @var bool */
    public $hasCellCoords;

    /** @var int */
    public $row;

    /** @var int */
    public $col;

    /** @var int */
    public $rowSpan;

    /** @var int */
    public $colSpan;

    /** @var string */
    public $tag;

    /** @var string */
    public $paddingTop;

    /** @var string */
    public $paddingRight;

    /** @var string */
    public $paddingBottom;

    /** @var string */
    public $paddingLeft;

    /** @var string */
    public $backgroundColor;

    /** @var string */
    public $orientation;

    /** @var string */
    public $elementGap;

    /** @var string */
    public $wrap;

    /** @var string */
    public $verticalAlign;

    /** @var string */
    public $borderTop;

    /** @var string */
    public $borderRight;

    /** @var string */
    public $borderBottom;

    /** @var string */
    public $borderLeft;

    /** @var string */
    public $borderTopLeftRadius;

    /** @var string */
    public $borderTopRightRadius;

    /** @var string */
    public $borderBottomRightRadius;

    /** @var string */
    public $borderBottomLeftRadius;

    /** @var array<int, \Tableberg\Renderer\Table\CellElement> */
    public $elements;

    /** @var array<string, \Tableberg\Renderer\Attrs\StringAttr|array>|null */
    public $cellStyleOverride;

    /** @var array<string, mixed>|null */
    public $ribbon;

    /** @var string|null */
    public $sortableType;

    /** @var string|null */
    public $width;

    /** @var string|null */
    public $height;

    /** @var bool */
    public $stickyHeader;

    /**
     * @param mixed $row
     * @param mixed $col
     * @param mixed $rowSpan
     * @param mixed $colSpan
     * @param mixed $tag
     * @param mixed $globalCellStyles
     * @param array<int, \Tableberg\Renderer\Table\CellElement> $elements
     * @param array<string, \Tableberg\Renderer\Attrs\StringAttr|array>|null $cellStyleOverride
     * @param array<string, mixed>|null $ribbon
     * @param string|null $sortableType
     * @param string|null $width
     * @param string|null $height
     * @param bool $stickyHeader
     * @param string|null $className
     * @return self
     */
    public static function create(
        $row,
        $col,
        $rowSpan,
        $colSpan,
        $tag,
        $globalCellStyles,
        $elements,
        $cellStyleOverride,
        $ribbon,
        $sortableType = null,
        $width = null,
        $height = null,
        $stickyHeader = false,
        $className = null
    ) {
        $instance = new self();

        $instance->hasCellCoords = is_numeric($row) && is_numeric($col);
        $instance->row = $instance->hasCellCoords ? (int) $row : 0;
        $instance->col = $instance->hasCellCoords ? (int) $col : 0;

        $instance->rowSpan = is_numeric($rowSpan) ? (int) $rowSpan : 1;
        $instance->colSpan = is_numeric($colSpan) ? (int) $colSpan : 1;
        if ($instance->rowSpan < 1) {
            $instance->rowSpan = 1;
        }
        if ($instance->colSpan < 1) {
            $instance->colSpan = 1;
        }

        $instance->tag = $tag === 'th' ? 'th' : 'td';

        $globalCellStyles = is_array($globalCellStyles) ? $globalCellStyles : [];
        $globalPadding = getArrayOrNull($globalCellStyles['padding']) ?? [];
        $globalBorder = getArrayOrNull($globalCellStyles['border']) ?? [];
        $globalBorderRadius = getArrayOrNull($globalCellStyles['borderRadius']) ?? [];

        $instance->paddingTop = getStringOrNull($globalPadding['top']) ?? '';
        $instance->paddingRight = getStringOrNull($globalPadding['right']) ?? '';
        $instance->paddingBottom = getStringOrNull($globalPadding['bottom']) ?? '';
        $instance->paddingLeft = getStringOrNull($globalPadding['left']) ?? '';

        $orientation = getStringOrNull($globalCellStyles['orientation']) ?? 'vertical';
        if (!in_array($orientation, ['vertical', 'horizontal'], true)) {
            $orientation = 'vertical';
        }
        $instance->orientation = $orientation;

        $instance->elementGap =
            getStringOrNull($globalCellStyles['elementGap'])
            ?? 'var(--wp--preset--spacing--20)';

        $wrap = getStringOrNull($globalCellStyles['wrap']) ?? 'wrap';
        if (!in_array($wrap, ['wrap', 'nowrap'], true)) {
            $wrap = 'wrap';
        }
        $instance->wrap = $wrap;

        $verticalAlign = getStringOrNull($globalCellStyles['verticalAlign']) ?? 'middle';
        if (!in_array($verticalAlign, ['top', 'middle', 'bottom'], true)) {
            $verticalAlign = 'middle';
        }
        $instance->verticalAlign = $verticalAlign;

        $instance->borderTop = getStringOrNull($globalBorder['top']) ?? '';
        $instance->borderRight = getStringOrNull($globalBorder['right']) ?? '';
        $instance->borderBottom = getStringOrNull($globalBorder['bottom']) ?? '';
        $instance->borderLeft = getStringOrNull($globalBorder['left']) ?? '';

        $instance->borderTopLeftRadius = getStringOrNull($globalBorderRadius['topLeft']) ?? '';
        $instance->borderTopRightRadius = getStringOrNull($globalBorderRadius['topRight']) ?? '';
        $instance->borderBottomRightRadius = getStringOrNull($globalBorderRadius['bottomRight']) ?? '';
        $instance->borderBottomLeftRadius = getStringOrNull($globalBorderRadius['bottomLeft']) ?? '';

        $instance->backgroundColor = getStringOrNull($globalCellStyles['backgroundColor']) ?? '';

        $instance->elements = is_array($elements) ? $elements : [];
        $instance->cellStyleOverride = getArrayOrNull($cellStyleOverride);

        $instance->ribbon = getArrayOrNull($ribbon);

        $sortableType = getStringOrNull($sortableType);
        if (in_array($sortableType, ['text', 'number', 'date'], true)) {
            $instance->sortableType = $sortableType;
        } else {
            $instance->sortableType = null;
        }

        $instance->width = getStringOrNull($width);
        $instance->height = getStringOrNull($height);
        $instance->stickyHeader = (bool) $stickyHeader;
        $instance->className = trim((string) (getStringOrNull($className) ?? ''));

        return $instance;
    }
}

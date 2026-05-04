<?php

namespace Tableberg\Renderer\Table;

use Tableberg\Renderer\Attrs\NumberAttr;
use Tableberg\Renderer\Attrs\BoolAttr;
use Tableberg\Renderer\Attrs\StringAttr;
use Tableberg\Renderer\Attrs\Sides;
use Tableberg\Renderer\Attrs\Corners;

use function Tableberg\Renderer\getOrNull;

class TableAttrs {
    /** @var NumberAttr */
    public $version;

    /** @var BoolAttr */
    public $isExample;

    /** @var TableConfig */
    public $table;

    /** @var array<int, RowConfig> */
    public $rows;

    /** @var array<int, ColumnConfig> */
    public $columns;

    /** @var array<string, CellData> */
    public $cells;

    /** @var array<string, array<string, mixed>> */
    public $bindings;

    /** @var CellDefaults */
    public $cellDefaults;

    /**
     * @param array $data
     * @return self
     */
    public static function from_array($data) {
        $data = is_array($data) ? $data : [];
        $defaults = Defaults::get_defaults();

        $instance = new self();
        $instance->version = new NumberAttr(
            getOrNull($data['version']),
            $defaults['version']
        );
        $instance->isExample = new BoolAttr(getOrNull($data['isExample']), $defaults['isExample']);
        $instance->table = TableConfig::from_array(getOrNull($data['table']));
        $instance->rows = self::parse_row_configs(getOrNull($data['rows']));
        $instance->columns = self::parse_columns(getOrNull($data['columns']));
        $instance->cells = self::parse_cells(getOrNull($data['cells']));
        $instance->bindings = self::parse_bindings(getOrNull($data['bindings']));
        $instance->cellDefaults = CellDefaults::from_array(getOrNull($data['cellDefaults']));

        return $instance;
    }

    /** @return array<int, RowConfig> */
    private static function parse_row_configs($data) {
        if (!is_array($data)) {
            return [];
        }

        $row_configs = [];

        foreach ($data as $row => $row_config) {
            $row_configs[(int) $row] = RowConfig::from_array($row_config);
        }

        return $row_configs;
    }

    /** @return array<int, ColumnConfig> */
    private static function parse_columns($data) {
        if (!is_array($data)) {
            return [];
        }

        $columns = [];

        foreach ($data as $column => $column_config) {
            $columns[(int) $column] = ColumnConfig::from_array(
                $column_config,
                'text',
                true
            );
        }

        return $columns;
    }

    /** @return array<string, CellData> */
    private static function parse_cells($data) {
        if (!is_array($data)) {
            return [];
        }

        $cells = [];

        foreach ($data as $key => $cell) {
            if (!is_string($key)) {
                continue;
            }

            $cells[$key] = CellData::from_array($cell);
        }

        return $cells;
    }

    /** @return array<string, array<string, mixed>> */
    private static function parse_bindings($data) {
        if (!is_array($data)) {
            return [];
        }

        $bindings = [];

        foreach ($data as $key => $binding) {
            if (!is_string($key) || !is_array($binding)) {
                continue;
            }

            $bindings[$key] = $binding;
        }

        return $bindings;
    }
}

class Data {
    /** @var array<int, array{array{int, int}, array<int, CellElement>}> */
    public $cells;

    /** @return self */
    public static function from_array($data) {
        $data = is_array($data) ? $data : [];
        $defaults = Defaults::get_defaults();
        $d = $defaults['data'];

        $instance = new self();
        $instance->cells = self::parse_cells(getOrNull($data['cells']), $d['cells']);

        return $instance;
    }

    /** @return array<int, array{array{int, int}, array<int, CellElement>}> */
    private static function parse_cells($data, $default) {
        if (!is_array($data)) {
            return $default;
        }

        $cells = [];

        foreach ($data as $cell) {
            if (!is_array($cell[0])) {
                continue;
            }

            $coords = [(int) $cell[0][0], (int) $cell[0][1]];
            $elements = [];

            if (is_array($cell[1])) {
                foreach ($cell[1] as $element) {
                    $elements[] = CellElement::from_array($element);
                }
            }

            $cells[] = [$coords, $elements];
        }

        return $cells;
    }
}

class PaginationConfig {
    /** @var BoolAttr */
    public $enabled;

    /** @var NumberAttr */
    public $pageSize;

    /** @var BoolAttr */
    public $showPageNumbers;

    /** @var BoolAttr */
    public $showPrevNext;

    /** @return self */
    public static function from_array($data) {
        $data = is_array($data) ? $data : [];
        $defaults = Defaults::get_defaults();
        $d = $defaults['tableConfig']['pagination'];

        $instance = new self();
        $instance->enabled = new BoolAttr(getOrNull($data['enabled']), $d['enabled']);
        $instance->pageSize = new NumberAttr(getOrNull($data['pageSize']), $d['pageSize']);
        $instance->showPageNumbers = new BoolAttr(getOrNull($data['showPageNumbers']), $d['showPageNumbers']);
        $instance->showPrevNext = new BoolAttr(getOrNull($data['showPrevNext']), $d['showPrevNext']);

        return $instance;
    }
}

class SearchConfig {
    /** @var BoolAttr */
    public $enabled;

    /** @var StringAttr */
    public $placeholder;

    /** @var StringAttr */
    public $highlightColor;

    /** @var StringAttr */
    public $position;

    /** @return self */
    public static function from_array($data) {
        $data = is_array($data) ? $data : [];
        $defaults = Defaults::get_defaults();
        $d = $defaults['tableConfig']['search'];

        $instance = new self();
        $instance->enabled = new BoolAttr(getOrNull($data['enabled']), $d['enabled']);
        $instance->placeholder = new StringAttr(getOrNull($data['placeholder']), $d['placeholder']);
        $instance->highlightColor = new StringAttr(getOrNull($data['highlightColor']), $d['highlightColor']);
        $instance->position = new StringAttr(getOrNull($data['position']), $d['position'], ['left', 'right']);

        return $instance;
    }
}

class ResponsiveBreakpointConfig {
    /** @var BoolAttr */
    public $enabled;

    /** @var NumberAttr */
    public $maxWidth;

    /** @var StringAttr */
    public $mode;

    /** @var BoolAttr */
    public $transpose;

    /** @var NumberAttr */
    public $stackCount;

    /** @var BoolAttr */
    public $repeatFirstCol;

    /**
     * @param array|null $data
     * @param array<string, mixed> $defaults
     * @return self
     */
    public static function from_array($data, $defaults) {
        $data = is_array($data) ? $data : [];

        $instance = new self();
        $instance->enabled = new BoolAttr(getOrNull($data['enabled']), $defaults['enabled']);
        $instance->maxWidth = new NumberAttr(getOrNull($data['maxWidth']), $defaults['maxWidth']);
        $instance->mode = new StringAttr(
            getOrNull($data['mode']),
            $defaults['mode'],
            ['', 'scroll', 'stack']
        );
        $transposeInput = getOrNull($data['transpose']);
        $legacyDirectionInput = getOrNull($data['direction']);
        if ($transposeInput === null && is_string($legacyDirectionInput)) {
            $transposeInput = $legacyDirectionInput === 'row';
        }

        $instance->transpose = new BoolAttr(
            $transposeInput,
            $defaults['transpose']
        );
        $instance->stackCount = new NumberAttr(
            getOrNull($data['stackCount']),
            $defaults['stackCount']
        );

        $repeatFirstColInput = getOrNull($data['repeatFirstCol']);
        if ($repeatFirstColInput === null) {
            $repeatFirstColInput = getOrNull($data['headerAsCol']);
        }

        $instance->repeatFirstCol = new BoolAttr(
            $repeatFirstColInput,
            $defaults['repeatFirstCol']
        );

        return $instance;
    }
}

class ResponsiveConfig {
    /** @var ResponsiveBreakpointConfig */
    public $tablet;

    /** @var ResponsiveBreakpointConfig */
    public $mobile;

    /** @return self */
    public static function from_array($data) {
        $data = is_array($data) ? $data : [];
        $defaults = Defaults::get_defaults()['tableConfig']['responsive'];

        $instance = new self();
        $instance->tablet = ResponsiveBreakpointConfig::from_array(
            getOrNull($data['tablet']),
            $defaults['tablet']
        );
        $instance->mobile = ResponsiveBreakpointConfig::from_array(
            getOrNull($data['mobile']),
            $defaults['mobile']
        );

        return $instance;
    }
}

class CellSpacingConfig {
    /** @var StringAttr */
    public $horizontal;

    /** @var StringAttr */
    public $vertical;

    /** @return self */
    public static function from_array($data) {
        $data = is_array($data) ? $data : [];
        $defaults = Defaults::get_defaults()['tableConfig']['cellSpacing'];

        $instance = new self();
        $instance->horizontal = new StringAttr(
            getOrNull($data['horizontal']),
            $defaults['horizontal']
        );
        $instance->vertical = new StringAttr(
            getOrNull($data['vertical']),
            $defaults['vertical']
        );

        return $instance;
    }
}

class CellDefaults {
    /** @var CellStyles */
    public $styles;

    /** @return self */
    public static function from_array($data) {
        $data = is_array($data) ? $data : [];

        $instance = new self();
        $instance->styles = CellStyles::from_array(getOrNull($data['styles']));

        return $instance;
    }
}

class CellData {
    /** @var Span */
    public $span;

    /** @var array<int, CellElement> */
    public $elements;

    /** @var array<string, mixed>|null */
    public $styles;

    /** @var array<string, mixed>|null */
    public $ribbon;

    /** @return self */
    public static function from_array($data) {
        $data = is_array($data) ? $data : [];

        $instance = new self();
        $instance->span = Span::from_array(getOrNull($data['span']));
        $instance->elements = [];

        $elements = getOrNull($data['elements']);
        if (is_array($elements)) {
            foreach ($elements as $element) {
                $instance->elements[] = CellElement::from_array($element);
            }
        }

        $styles = getOrNull($data['styles']);
        $instance->styles = is_array($styles) ? $styles : null;

        $ribbon = getOrNull($data['ribbon']);
        $instance->ribbon = is_array($ribbon) ? $ribbon : null;

        return $instance;
    }
}

class TableConfig {
    /** @var NumberAttr */
    public $rows;

    /** @var NumberAttr */
    public $cols;

    /** @var BoolAttr */
    public $headerEnabled;

    /** @var BoolAttr */
    public $footerEnabled;

    /** @var BoolAttr */
    public $stickyHeader;

    /** @var StringAttr */
    public $caption;

    /** @var StringAttr */
    public $tableWidth;

    /** @var StringAttr */
    public $tableAlignment;

    /** @var CellSpacingConfig */
    public $cellSpacing;

    /** @var Sides */
    public $tableBorder;

    /** @var BoolAttr */
    public $fixedColumnWidths;

    /** @var PaginationConfig */
    public $pagination;

    /** @var SearchConfig */
    public $search;

    /** @var ResponsiveConfig */
    public $responsive;

    /** @return self */
    public static function from_array($data) {
        $data = is_array($data) ? $data : [];
        $defaults = Defaults::get_defaults();
        $d = $defaults['tableConfig'];

        $instance = new self();
        $instance->rows = new NumberAttr(getOrNull($data['rows']), $d['rows']);
        $instance->cols = new NumberAttr(getOrNull($data['cols']), $d['cols']);
        $instance->headerEnabled = new BoolAttr(getOrNull($data['headerEnabled']), $d['headerEnabled']);
        $instance->footerEnabled = new BoolAttr(getOrNull($data['footerEnabled']), $d['footerEnabled']);
        $instance->stickyHeader = new BoolAttr(getOrNull($data['stickyHeader']), $d['stickyHeader']);
        $instance->caption = new StringAttr(getOrNull($data['caption']), $d['caption']);
        $instance->tableWidth = new StringAttr(
            getOrNull($data['tableWidth']),
            $d['tableWidth']
        );
        $instance->tableAlignment = new StringAttr(
            getOrNull($data['tableAlignment']),
            $d['tableAlignment'],
            ['left', 'center', 'right']
        );
        $instance->cellSpacing = CellSpacingConfig::from_array(getOrNull($data['cellSpacing']));
        $instance->tableBorder = Sides::from_array(
            getOrNull($data['tableBorder']),
            $d['tableBorder']
        );
        $instance->fixedColumnWidths = new BoolAttr(
            getOrNull($data['fixedColumnWidths']),
            $d['fixedColumnWidths']
        );
        $instance->pagination = PaginationConfig::from_array(getOrNull($data['pagination']));
        $instance->search = SearchConfig::from_array(getOrNull($data['search']));
        $instance->responsive = ResponsiveConfig::from_array(getOrNull($data['responsive']));

        return $instance;
    }
}

class CellStyles {
    /** @var Sides */
    public $padding;

    /** @var StringAttr */
    public $orientation;

    /** @var StringAttr */
    public $elementGap;

    /** @var StringAttr */
    public $wrap;

    /** @var StringAttr */
    public $verticalAlign;

    /** @var StringAttr */
    public $backgroundColor;

    /** @var Sides */
    public $border;

    /** @var Corners */
    public $borderRadius;

    /** @var array<int, array{array{int, int}, array<string, mixed>}> */
    public $cells;

    /** @return self */
    public static function from_array($data) {
        $data = is_array($data) ? $data : [];
        $defaults = Defaults::get_defaults();
        $d = $defaults['cellStyles'];

        $instance = new self();
        $instance->padding = Sides::from_array(getOrNull($data['padding']), $d['padding']);
        $instance->orientation = new StringAttr(
            getOrNull($data['orientation']),
            $d['orientation'],
            ['vertical', 'horizontal']
        );
        $instance->elementGap = new StringAttr(
            getOrNull($data['elementGap']),
            $d['elementGap']
        );
        $instance->wrap = new StringAttr(
            getOrNull($data['wrap']),
            $d['wrap'],
            ['wrap', 'nowrap']
        );
        $instance->verticalAlign = new StringAttr(
            getOrNull($data['verticalAlign']),
            $d['verticalAlign'],
            ['top', 'middle', 'bottom']
        );
        $instance->backgroundColor = new StringAttr(getOrNull($data['backgroundColor']), $d['backgroundColor']);
        $instance->border = Sides::from_array(getOrNull($data['border']), $d['border']);
        $instance->borderRadius = Corners::from_array(getOrNull($data['borderRadius']), $d['borderRadius']);
        $instance->cells = is_array(getOrNull($data['cells'])) ? $data['cells'] : $d['cells'];

        return $instance;
    }
}

class Span {
    /** @var NumberAttr */
    public $rowSpan;

    /** @var NumberAttr */
    public $colSpan;

    /**
     * @param array|null $data
     * @param array<string, int> $defaults
     * @return self
     */
    public static function from_array($data, $defaults = ['rowSpan' => 1, 'colSpan' => 1]) {
        $data = is_array($data) ? $data : [];

        $defaultRowSpan = $defaults['rowSpan'];
        $defaultColSpan = $defaults['colSpan'];

        $instance = new self();
        $instance->rowSpan = new NumberAttr(getOrNull($data['rowSpan']), $defaultRowSpan);
        $instance->colSpan = new NumberAttr(getOrNull($data['colSpan']), $defaultColSpan);

        return $instance;
    }
}

class ColumnConfig {
    /** @var StringAttr|null */
    public $sortable;

    /** @var StringAttr|null */
    public $width;

    /**
     * @param array|null $data
     * @param string $defaultSortable
     * @param bool $allowNull
     * @return self
     */
    public static function from_array($data, $defaultSortable = 'text', $allowNull = false) {
        $data = is_array($data) ? $data : [];
        $sortable = getOrNull($data['sortable']);
        $width = getOrNull($data['width']);

        $instance = new self();

        if ($allowNull && ($sortable === null || $sortable === '')) {
            $instance->sortable = null;
        } else {
            $instance->sortable = new StringAttr(
                $sortable,
                $defaultSortable,
                ['text', 'number', 'date']
            );
        }

        if ($width === null || $width === '') {
            $instance->width = null;
        } else {
            $instance->width = new StringAttr($width, '');
        }

        return $instance;
    }
}

class RowConfig {
    /** @var StringAttr|null */
    public $height;

    /**
     * @param array|null $data
     * @return self
     */
    public static function from_array($data) {
        $data = is_array($data) ? $data : [];
        $height = getOrNull($data['height']);

        $instance = new self();

        if ($height === null || $height === '') {
            $instance->height = null;
        } else {
            $instance->height = new StringAttr($height, '');
        }

        return $instance;
    }
}

class CellElement {
    /** @var StringAttr */
    public $name;

    /** @var array<string, mixed> */
    public $attributes;

    /** @var array<string, mixed>|null */
    public $bindings;

    /**
     * @param array|null $data
     * @param string $defaultName
     * @param array<int, string>|null $allowedNames
     * @return self
     */
    public static function from_array($data, $defaultName = 'text', $allowedNames = null) {
        $data = is_array($data) ? $data : [];

        if (!is_array($allowedNames)) {
            $allowedNames = [
                'text',
                'button',
                'image',
                'list',
                'icon',
                'star-rating',
                'custom-html',
            ];
        }

        $instance = new self();
        $instance->name = new StringAttr(getOrNull($data['name']), $defaultName, $allowedNames);
        $attributes = getOrNull($data['attributes']);
        $instance->attributes = is_array($attributes) ? $attributes : [];
        $bindings = getOrNull($data['bindings']);
        $instance->bindings = is_array($bindings) ? $bindings : null;

        return $instance;
    }
}

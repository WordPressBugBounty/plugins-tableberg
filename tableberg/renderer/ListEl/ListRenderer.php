<?php

namespace Tableberg\Renderer\ListEl;

use Tableberg\Renderer\Attrs\SvgIconAttrs;

class ListRenderer {
    /**
     * @param array<string, mixed>|null $attributes
     * @return string
     */
    public function render($attributes) {
        $attrs = ListAttrs::from_array($attributes);

        $listType = $attrs->listType->equals('styled') && !$this->isProActive()
            ? 'basic'
            : $attrs->listType->asText();

        $isDecimal = $attrs->listStyle->equals('decimal');
        $listTag = $isDecimal ? 'ol' : 'ul';

        $listTree = $this->build_list_tree($attrs->items);

        if ($listType === 'styled') {
            $listStyles = [
                'list-style-type:none',
                'margin:0',
                'padding-left:0',
            ];

            return
                "<div class='tableberg-list'>
                    <$listTag style='{$this->style_attr($listStyles)}'>
                        {$this->render_styled_list_items($listTree, $attrs, $listTag)}
                    </$listTag>
                </div>";
        }

        $listStyles = [
            'margin:0',
            'padding-left:20px',
        ];

        return
            "<div class='tableberg-list'>
                <$listTag style='{$this->style_attr($listStyles)}'>
                    {$this->render_basic_list_items($listTree, $attrs, $listTag)}
                </$listTag>
            </div>";
    }

    /**
     * @return bool
     */
    private function isProActive() {
        if (!function_exists('tp_fs')) {
            return false;
        }

        $fs = call_user_func('tp_fs');

        return is_object($fs) && $fs->can_use_premium_code();
    }

    /**
     * @param array<int, ListItemAttrs> $items
     * @return array<int, ListItemNode>
     */
    private function build_list_tree($items) {
        $root = [];
        $stack = [];

        foreach ($items as $index => $item) {
            if (!$item instanceof ListItemAttrs) {
                continue;
            }

            $node = ListItemNode::create($item, (int) $index);
            $level = (int) $item->indentLevel->value();

            while (!empty($stack) && $stack[count($stack) - 1]['level'] >= $level) {
                array_pop($stack);
            }

            if (empty($stack)) {
                $root[] = $node;
            } else {
                $stack[count($stack) - 1]['node']->children[] = $node;
            }

            $stack[] = [
                'node' => $node,
                'level' => $level,
            ];
        }

        return $root;
    }

    /**
     * @param array<int, ListItemNode> $nodes
     * @param ListAttrs $attrs
     * @param string $listTag
     * @return string
     */
    private function render_basic_list_items($nodes, $attrs, $listTag) {
        $html = '';

        foreach ($nodes as $node) {
            if (!$node instanceof ListItemNode) {
                continue;
            }

            $itemContent = $this->render_list_item_content(
                $node->item->content->asHtml(),
                $attrs->styles
            );

            $childrenHtml = '';
            if (!empty($node->children)) {
                $nestedStyles = ['margin:0'];

                $childrenHtml =
                    "<$listTag style='{$this->style_attr($nestedStyles)}'>
                        {$this->render_basic_list_items($node->children, $attrs, $listTag)}
                    </$listTag>";
            }

            $html .=
                "<li>
                    {$itemContent}
                    {$childrenHtml}
                </li>";
        }

        return $html;
    }

    /**
     * @param array<int, ListItemNode> $nodes
     * @param ListAttrs $attrs
     * @param string $listTag
     * @return string
     */
    private function render_styled_list_items($nodes, $attrs, $listTag) {
        $html = '';

        $isDecimal = $attrs->listStyle->equals('decimal');

        foreach ($nodes as $node) {
            if (!$node instanceof ListItemNode) {
                continue;
            }

            $innerStyle = $this->style_attr($this->styled_item_styles($attrs->styles));
            $iconStyle = $this->style_attr($this->icon_styles($attrs->styles));
            $decimalNumberStyle = $this->style_attr(array_merge(
                ['min-width:20px'],
                $this->icon_styles($attrs->styles)
            ));

            $iconHtml = '';

            if ($isDecimal) {
                $number = $node->index + 1;

                $iconHtml =
                    "<span style='{$decimalNumberStyle}'>
                        {$number}.
                    </span>";
            } elseif (
                $attrs->icon instanceof ListIconAttrs
                && !$attrs->icon->iconName->equals('none')
            ) {
                $svg = $this->render_icon($attrs);

                if ($svg !== '') {
                    $iconHtml =
                        "<span style='{$iconStyle}'>
                            {$svg}
                        </span>";
                }
            }

            $itemContent = $this->render_list_item_content(
                $node->item->content->asHtml(),
                $attrs->styles,
                ['flex:1']
            );

            $childrenHtml = '';
            if (!empty($node->children)) {
                $nestedStyles = [
                    'list-style-type:none',
                    'margin:0',
                    'margin-top:4px',
                ];

                $childrenHtml =
                    "<$listTag style='{$this->style_attr($nestedStyles)}'>
                        {$this->render_styled_list_items($node->children, $attrs, $listTag)}
                    </$listTag>";
            }

            $html .=
                "<li>
                    <div style='{$innerStyle}'>
                        {$iconHtml}
                        {$itemContent}
                    </div>
                    {$childrenHtml}
                </li>";
        }

        return $html;
    }

    /**
     * @param string $content
     * @param ListStyles $styles
     * @param array<int, string> $additionalStyles
     * @return string
     */
    private function render_list_item_content($content, $styles, $additionalStyles = []) {
        $textStyles = $this->text_styles($styles);

        foreach ($additionalStyles as $style) {
            if (!is_string($style) || $style === '') {
                continue;
            }

            $textStyles[] = $style;
        }

        return
            "<span style='{$this->style_attr($textStyles)}'>
                {$content}
            </span>";
    }

    /**
     * @param ListStyles $styles
     * @return array<int, string>
     */
    private function styled_item_styles($styles) {
        $styleValues = [
            'display:flex',
            'padding:4px 0',
        ];

        if ($styles->iconSpacing->isNotEmpty()) {
            $styleValues[] = 'gap:' . $styles->iconSpacing->asAttr();
        }

        if ($styles->itemSpacing->isNotEmpty()) {
            $styleValues[] = 'margin:0 0 ' . $styles->itemSpacing->asAttr() . ' 0';
        } else {
            $styleValues[] = 'margin:0 0 4px 0';
        }

        return $styleValues;
    }

    /**
     * @param ListStyles $styles
     * @return array<int, string>
     */
    private function icon_styles($styles) {
        $styleValues = [
            'display:flex',
            'align-items:center',
            'justify-content:center',
        ];

        if ($styles->iconColor->isNotEmpty()) {
            $styleValues[] = 'color:' . $styles->iconColor->asAttr();
        }

        if ($styles->iconSize->isNotEmpty()) {
            $styleValues[] = 'font-size:' . $styles->iconSize->asAttr();
            $styleValues[] = 'min-width:' . $styles->iconSize->asAttr();
        }

        return $styleValues;
    }

    /**
     * @param ListStyles $styles
     * @return array<int, string>
     */
    private function text_styles($styles) {
        $styleValues = [];

        if ($styles->fontSize->isNotEmpty()) {
            $styleValues[] = 'font-size:' . $styles->fontSize->asAttr();
        }

        if ($styles->textColor->isNotEmpty()) {
            $styleValues[] = 'color:' . $styles->textColor->asAttr();
        }

        if ($styles->linkColor->isNotEmpty()) {
            $styleValues[] = '--tableberg-list-link-color:' . $styles->linkColor->asAttr();
        }

        if ($styles->backgroundColor->isNotEmpty()) {
            $styleValues[] = 'background-color:' . $styles->backgroundColor->asAttr();
            $styleValues[] = 'padding:2px 8px';
            $styleValues[] = 'border-radius:4px';
        }

        return $styleValues;
    }

    /**
     * @param ListAttrs $attrs
     * @return string
     */
    private function render_icon($attrs) {
        if (!$attrs->icon instanceof ListIconAttrs) {
            return '';
        }

        if ($attrs->icon->iconName->equals('none')) {
            return '';
        }

        $svg = $attrs->icon->svg;
        if (!$svg instanceof SvgIconAttrs && $attrs->icon->iconName->equals('check')) {
            $checkSvgViewbox = '0 0 24 24';
            $checkSvgPath = 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z';

            $svg = SvgIconAttrs::from_array(
                [],
                [],
                $checkSvgViewbox,
                $checkSvgPath
            );
        }

        if (!$svg instanceof SvgIconAttrs) {
            return '';
        }

        $iconSize = $this->parse_icon_size(
            $attrs->styles->iconSize->asText()
        );
        $viewBox = $svg->viewBox->asAttr();
        $path = $svg->path->asAttr();

        return
            "<svg
                width='{$iconSize}'
                height='{$iconSize}'
                viewBox='{$viewBox}'
                fill='currentColor'
            >
                <path d='{$path}' />
            </svg>";
    }

    /**
     * @param string $rawValue
     * @return int
     */
    private function parse_icon_size($rawValue) {
        $size = (int) $rawValue;
        if ($size > 0) {
            return $size;
        }

        return 15;
    }

    /**
     * @param array<int, string> $styles
     * @return string
     */
    private function style_attr($styles) {
        return implode(';', $styles);
    }
}

class ListItemNode {
    /** @var ListItemAttrs */
    public $item;

    /** @var int */
    public $index;

    /** @var array<int, ListItemNode> */
    public $children;

    /**
     * @param ListItemAttrs $item
     * @param int $index
     * @return self
     */
    public static function create($item, $index) {
        $instance = new self();
        $instance->item = $item;
        $instance->index = $index;
        $instance->children = [];

        return $instance;
    }
}

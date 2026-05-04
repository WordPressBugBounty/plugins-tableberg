<?php

namespace Tableberg\Renderer\Image;

use Tableberg\Renderer\Attrs\Corners;
use Tableberg\Renderer\Attrs\NumberAttr;
use Tableberg\Renderer\Attrs\Sides;
use Tableberg\Renderer\Attrs\StringAttr;

use function Tableberg\Renderer\getOrNull;

class ImageAttrs {
    /** @var MediaAttrs */
    public $media;

    /** @var StringAttr */
    public $height;

    /** @var StringAttr */
    public $width;

    /** @var StringAttr */
    public $alt;

    /** @var StringAttr */
    public $align;

    /** @var StringAttr */
    public $aspectRatio;

    /** @var StringAttr */
    public $scale;

    /** @var StringAttr */
    public $sizeSlug;

    /** @var StringAttr */
    public $caption;

    /** @var StringAttr */
    public $href;

    /** @var StringAttr */
    public $linkTarget;

    /** @var Sides */
    public $border;

    /** @var Corners */
    public $borderRadius;

    /**
     * @param array<string, mixed>|null $data
     * @return self
     */
    public static function from_array($data) {
        $data = is_array($data) ? $data : [];
        $defaults = Defaults::get_defaults();

        $instance = new self();
        $instance->media = MediaAttrs::from_array(getOrNull($data['media']));
        $instance->height = new StringAttr(getOrNull($data['height']), $defaults['height']);
        $instance->width = new StringAttr(getOrNull($data['width']), $defaults['width']);
        $instance->alt = new StringAttr(getOrNull($data['alt']), $defaults['alt']);
        $instance->align = new StringAttr(
            getOrNull($data['align']),
            $defaults['align'],
            ['left', 'center', 'right']
        );
        $instance->aspectRatio = new StringAttr(
            getOrNull($data['aspectRatio']),
            $defaults['aspectRatio']
        );
        $instance->scale = new StringAttr(getOrNull($data['scale']), $defaults['scale']);
        $instance->sizeSlug = new StringAttr(getOrNull($data['sizeSlug']), $defaults['sizeSlug']);
        $instance->caption = new StringAttr(getOrNull($data['caption']), $defaults['caption']);
        $instance->href = new StringAttr(getOrNull($data['href']), $defaults['href']);
        $instance->linkTarget = new StringAttr(
            getOrNull($data['linkTarget']),
            $defaults['linkTarget'],
            ['_blank', '_self']
        );
        $instance->border = Sides::from_array(getOrNull($data['border']), $defaults['border']);
        $instance->borderRadius = Corners::from_array(
            getOrNull($data['borderRadius']),
            $defaults['borderRadius']
        );

        return $instance;
    }
}

class MediaSizeAttrs {
    /** @var StringAttr */
    public $url;

    /** @var NumberAttr */
    public $width;

    /** @var NumberAttr */
    public $height;

    /** @var StringAttr */
    public $orientation;

    /**
     * @param array<string, mixed>|null $data
     * @return self
     */
    public static function from_array($data) {
        $data = is_array($data) ? $data : [];

        $instance = new self();
        $instance->url = new StringAttr(getOrNull($data['url']), '');
        $instance->width = new NumberAttr(getOrNull($data['width']), 0);
        $instance->height = new NumberAttr(getOrNull($data['height']), 0);
        $instance->orientation = new StringAttr(getOrNull($data['orientation']), '');

        return $instance;
    }
}

class MediaAttrs {
    /** @var NumberAttr */
    public $id;

    /** @var StringAttr */
    public $url;

    /** @var StringAttr */
    public $alt;

    /** @var array<string, MediaSizeAttrs> */
    public $sizes;

    /**
     * @param array<string, mixed>|null $data
     * @return self
     */
    public static function from_array($data) {
        $data = is_array($data) ? $data : [];

        $instance = new self();
        $instance->id = new NumberAttr(getOrNull($data['id']), 0);
        $instance->url = new StringAttr(getOrNull($data['url']), '');
        $instance->alt = new StringAttr(getOrNull($data['alt']), '');
        $instance->sizes = [];

        $rawSizes = getOrNull($data['sizes']);
        if (is_array($rawSizes)) {
            foreach ($rawSizes as $slug => $sizeData) {
                if (!is_string($slug) || !is_array($sizeData)) {
                    continue;
                }

                $instance->sizes[$slug] = MediaSizeAttrs::from_array($sizeData);
            }
        }

        return $instance;
    }
}

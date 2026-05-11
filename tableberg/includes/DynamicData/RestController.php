<?php

namespace Tableberg\DynamicData;

use WP_REST_Server;
use WP_REST_Request;
use WP_REST_Response;
use WP_Error;

class RestController
{
    private $namespace = 'tableberg/v1';

    private static $post_field_keys = array(
        'post_title',
        'post_excerpt',
        'post_content',
        'post_date',
        'post_modified',
        'post_author',
        'post_status',
        'permalink',
        'featured_image',
    );

    public function register_routes()
    {
        register_rest_route(
            $this->namespace,
            '/dynamic-data/preview',
            [
                'methods' => WP_REST_Server::READABLE,
                'callback' => [$this, 'get_preview'],
                'permission_callback' => [$this, 'check_edit_permission'],
                'args' => [
                    'key' => [
                        'required' => true,
                        'type' => 'string',
                        'sanitize_callback' => 'sanitize_text_field',
                    ],
                    'postId' => [
                        'required' => false,
                        'type' => 'integer',
                        'sanitize_callback' => 'absint',
                    ],
                ],
            ]
        );

        register_rest_route(
            $this->namespace,
            '/dynamic-data/meta-keys',
            [
                'methods' => WP_REST_Server::READABLE,
                'callback' => [$this, 'get_meta_keys'],
                'permission_callback' => [$this, 'check_edit_permission'],
                'args' => [
                    'postId' => [
                        'required' => false,
                        'type' => 'integer',
                        'sanitize_callback' => 'absint',
                    ],
                ],
            ]
        );
    }

    public function check_edit_permission()
    {
        if (!current_user_can('edit_posts')) {
            return new WP_Error(
                'rest_forbidden',
                __('You do not have permission to access dynamic data.', 'tableberg'),
                ['status' => 403]
            );
        }
        return true;
    }

    public function get_preview(WP_REST_Request $request)
    {
        $key = $request->get_param('key');
        $post_id = $request->get_param('postId') ?: $this->get_current_post_id();

        $value = null;

        if ($post_id) {
            $value = in_array($key, self::$post_field_keys, true)
                ? $this->get_post_field_value($key, $post_id)
                : $this->get_post_meta_value($key, $post_id);
        }

        return new WP_REST_Response([
            'success' => true,
            'value' => $value !== null ? (string) $value : null,
        ]);
    }

    public function get_meta_keys(WP_REST_Request $request)
    {
        $post_id = $request->get_param('postId') ?: $this->get_current_post_id();

        if (!$post_id) {
            return new WP_REST_Response([
                'keys' => [
                    ['key' => '_thumbnail_id', 'label' => __('Featured Image ID', 'tableberg')],
                ],
            ]);
        }

        $meta = get_post_meta($post_id);
        $keys = [];

        $allowed_private = ['_thumbnail_id', '_wp_page_template'];

        if (is_array($meta)) {
            foreach (array_keys($meta) as $key) {
                if (strpos($key, '_') === 0 && !in_array($key, $allowed_private, true)) {
                    continue;
                }

                $keys[] = ['key' => $key];
            }
        }

        return new WP_REST_Response([
            'keys' => $keys,
        ]);
    }

    private function get_post_field_value(string $key, int $post_id)
    {
        $post = get_post($post_id);

        if (!$post) {
            return null;
        }

        switch ($key) {
            case 'post_title':
                return get_the_title($post);

            case 'post_excerpt':
                return has_excerpt($post) ? get_the_excerpt($post) : null;

            case 'post_content':
                return apply_filters('the_content', $post->post_content);

            case 'post_date':
                return get_the_date('', $post);

            case 'post_modified':
                return get_the_modified_date('', $post);

            case 'post_author':
                return get_the_author_meta('display_name', $post->post_author);

            case 'post_status':
                return $post->post_status;

            case 'permalink':
                return get_permalink($post);

            case 'featured_image':
                $thumbnail_id = get_post_thumbnail_id($post);
                if ($thumbnail_id) {
                    $image = wp_get_attachment_image_src($thumbnail_id, 'full');
                    return $image ? $image[0] : null;
                }
                return null;

            default:
                return apply_filters(
                    'tableberg/dynamic_data/post_field_value',
                    null,
                    $key,
                    $post_id,
                    $post
                );
        }
    }

    private function get_post_meta_value(string $key, int $post_id)
    {
        $value = get_post_meta($post_id, $key, true);

        if ($value === '' || $value === false) {
            return null;
        }

        return $value;
    }

    private function get_current_post_id()
    {
        $post = get_post();
        return $post ? $post->ID : null;
    }
}

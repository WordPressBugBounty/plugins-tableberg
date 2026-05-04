<?php

namespace Tableberg\Renderer\Migrations;

class BlockContentMigrator {
    public function __construct() {
        add_action('rest_api_init', [$this, 'register_rest_hooks']);
        add_filter('render_block_data', [$this, 'migrate_parsed_block']);
    }

    public function migrate_parsed_block($parsed_block) {
        if (!is_array($parsed_block)) {
            return $parsed_block;
        }

        if (
            !isset($parsed_block['blockName']) ||
            $parsed_block['blockName'] !== 'tableberg/table' ||
            !isset($parsed_block['attrs']) ||
            !is_array($parsed_block['attrs'])
        ) {
            return $parsed_block;
        }

        $migrated_attrs = $this->migrate_table_block_attrs(
            $parsed_block['attrs'],
            $parsed_block
        );

        if ($migrated_attrs === $parsed_block['attrs']) {
            return $parsed_block;
        }

        $parsed_block['attrs'] = $migrated_attrs;

        return $parsed_block;
    }

    public function register_rest_hooks() {
        $post_types = get_post_types(['show_in_rest' => true], 'names');

        foreach ($post_types as $post_type) {
            add_filter(
                'rest_prepare_' . $post_type,
                [$this, 'migrate_rest_response'],
                10,
                3
            );
        }
    }

    public function migrate_rest_response($response, $post, $request) {
        if (!($response instanceof \WP_REST_Response)) {
            return $response;
        }

        if (!($request instanceof \WP_REST_Request)) {
            return $response;
        }

        if ('edit' !== $request->get_param('context')) {
            return $response;
        }

        $data = $response->get_data();

        if (!is_array($data)) {
            return $response;
        }

        if (
            !isset($data['content']) ||
            !is_array($data['content']) ||
            !isset($data['content']['raw']) ||
            !is_string($data['content']['raw'])
        ) {
            return $response;
        }

        $migrated_content = $this->migrate_content($data['content']['raw']);

        if ($migrated_content === $data['content']['raw']) {
            return $response;
        }

        $data['content']['raw'] = $migrated_content;
        $response->set_data($data);

        return $response;
    }

    private function migrate_content($content) {
        if (!is_string($content) || strpos($content, 'wp:tableberg/table') === false) {
            return $content;
        }

        list($migrated_blocks, $did_migrate) = $this->migrate_blocks(
            parse_blocks($content)
        );

        if (!$did_migrate) {
            return $content;
        }

        return serialize_blocks($migrated_blocks);
    }

    private function migrate_blocks($blocks) {
        if (!is_array($blocks)) {
            return [$blocks, false];
        }

        $did_migrate = false;

        foreach ($blocks as $index => $block) {
            if (!is_array($block)) {
                continue;
            }

            if (
                isset($block['blockName']) &&
                $block['blockName'] === 'tableberg/table' &&
                isset($block['attrs']) &&
                is_array($block['attrs'])
            ) {
                $migrated_attrs = $this->migrate_table_block_attrs(
                    $block['attrs'],
                    $block
                );

                if ($migrated_attrs !== $block['attrs']) {
                    $blocks[$index]['attrs'] = $migrated_attrs;
                    $did_migrate = true;
                }
            }

            if (isset($block['innerBlocks']) && is_array($block['innerBlocks'])) {
                list($inner_blocks, $inner_migrated) = $this->migrate_blocks(
                    $block['innerBlocks']
                );
                $blocks[$index]['innerBlocks'] = $inner_blocks;
                $did_migrate = $did_migrate || $inner_migrated;
            }
        }

        return [$blocks, $did_migrate];
    }

    private function migrate_table_block_attrs($attrs, $block) {
        $table_block_migrator = new TableBlockMigrator();

        return $table_block_migrator->migrate($attrs, $block);
    }
}

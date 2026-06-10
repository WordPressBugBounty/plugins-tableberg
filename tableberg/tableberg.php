<?php

/**
 * Plugin Name:       Tableberg
 * Plugin URI:        https://tableberg.com/
 * Description:       Table Block by Tableberg - Create Better Tables With Block Editor
 * Version:           1.0.3
 * Requires at least: 6.1
 * Requires PHP:      7.0
 * Author:            Tableberg
 * Author URI:        https://tableberg.com/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       tableberg
 *
 * @package Tableberg
 */

if (!defined('ABSPATH')) {
    exit;
}
if (!defined('TABLEBERG_VERSION')) {
    define('TABLEBERG_VERSION', '0.6.11');
}
if (!defined('TABLEBERG_DIR_PATH')) {
    define('TABLEBERG_DIR_PATH', plugin_dir_path(__FILE__));
}

if (!defined('TABLEBERG_URL')) {
    define('TABLEBERG_URL', plugin_dir_url(__FILE__));
}
if (!defined('TABLEBERG_PLUGIN_FILE')) {
    define('TABLEBERG_PLUGIN_FILE', __FILE__);
}

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/renderer/utils.php';

if (!function_exists('tab_fs')) {
    function tab_fs() {
        global $tab_fs;

        if (!isset($tab_fs)) {
            require_once __DIR__ . '/vendor/freemius/wordpress-sdk/start.php';

            $tab_fs = fs_dynamic_init(
                [
                    'id' => '14649',
                    'slug' => 'tableberg',
                    'type' => 'plugin',
                    'public_key' => 'pk_8043aa788c004c4b385af8384c74b',
                    'is_premium' => false,
                    'has_addons' => true,
                    'has_paid_plans' => false,
                    'is_org_compliant' => true,
                    'menu' => [
                        'slug' => 'tableberg-settings',
                        'first-path' => 'admin.php?page=tableberg-settings&route=welcome',
                    ],
                ]
            );
        }

        return $tab_fs;
    }

    tab_fs();
    do_action('tab_fs_loaded');
}

use Tableberg\Constants;
use Tableberg\Renderer\Migrations\BlockContentMigrator;
use Tableberg\Renderer\Table\TableRenderer;
use Tableberg\Renderer\ToggleBlockRenderer;

if (!class_exists('Tableberg')) {
    class Tableberg {
        public function __construct() {
            new Tableberg\Admin\Tableberg_Admin();
            add_action('init', [$this, 'register_blocks']);

            $restController = new Tableberg\DynamicData\RestController();
            add_action('rest_api_init', [$restController, 'register_routes']);

            $migrator = new BlockContentMigrator();
            add_action('rest_api_init', [$migrator, 'register_rest_hooks']);
            add_filter('render_block_data', [$migrator, 'migrate_parsed_block']);

            register_activation_hook(__FILE__, [$this, 'activate_plugin']);
            register_deactivation_hook(__FILE__, [$this, 'deactivate_plugin']);
        }

        public function register_blocks() {
            $renderer = new TableRenderer();

            register_block_type_from_metadata(
                TABLEBERG_DIR_PATH . 'build/block.json',
                [
                    'render_callback' => [$renderer, 'render'],
                ]
            );

            $toggleBlockRenderer = new ToggleBlockRenderer();

            register_block_type_from_metadata(
                TABLEBERG_DIR_PATH . 'build/blocks/toggle/block.json',
                [
                    'render_callback' => [
                        $toggleBlockRenderer, 'render',
                    ],
                ]
            );
        }

        public function activate_plugin() {
            set_transient('_welcome_redirect_tableberg', true, 60);

            update_option('tableberg_version', TABLEBERG_VERSION);
            update_option('tableberg_installDate', date('Y-m-d h:i:s'));

            add_option('tableberg_review_notify', 'no');
        }

        public function deactivate_plugin() {
            delete_transient('_welcome_redirect_tableberg');

            delete_option('tableberg_version');
            delete_option('tableberg_installDate');
        }
    }

    new Tableberg();
}

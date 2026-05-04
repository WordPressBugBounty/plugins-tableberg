<?php

namespace Tableberg;

use Tableberg\Patterns\RegisterPatterns;

class Assets {
    public function register_blocks_assets() {
        self::pass_data_to_js('tableberg-script');

        $tableberg_patterns = RegisterPatterns::get_all_registered_tableberg_patterns();
        $tableberg_pattern_categories = RegisterPatterns::get_all_registered_tableberg_pattern_categories();

        wp_localize_script('tableberg-script', 'tablebergPatterns', $tableberg_patterns);
        wp_localize_script('tableberg-script', 'tablebergPatternCategories', $tableberg_pattern_categories);

    }

    public function register_admin_assets() {
        wp_enqueue_script(
            'tableberg-admin-script',
            TABLEBERG_URL . 'includes/Admin/assets/tableberg-admin.build.js',
            [
                'lodash',
                'react',
                'wp-block-editor',
                'wp-blocks',
                'wp-components',
                'wp-data',
                'wp-element',
                'wp-i18n',
                'wp-primitives',
            ],
            TABLEBERG_VERSION,
            true
        );

        self::pass_data_to_js('tableberg-admin-script');

        $frontend_script_data = apply_filters('tableberg/filter/admin_settings_menu_data', []);
        wp_localize_script('tableberg-admin-script', 'tablebergAdminMenuData', $frontend_script_data);
        wp_enqueue_style(
            'tableberg-admin-style',
            TABLEBERG_URL . 'includes/Admin/assets/tableberg-admin-style.css',
            [],
            TABLEBERG_VERSION,
            'all'
        );
    }


    private static function pass_data_to_js(string $handle) {
        $data = [
            'plugin_url' => TABLEBERG_URL,
        ];
        global $tp_fs;
        if (isset($tp_fs)) {
            $data['IS_PRO'] = $tp_fs->is__premium_only()
                && $tp_fs->can_use_premium_code();
        } else {
            $data['IS_PRO'] = false;
        }
        wp_localize_script($handle, 'TABLEBERG_CFG', $data);
    }
}

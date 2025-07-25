<?php

/**
 * Version control manager
 *
 * @package Tableberg
 */

namespace Tableberg;

use Tableberg\includes\Version_Control_Upgrader_Skin;
use Exception;
use Plugin_Upgrader;
use Tableberg\includes\Version_Sync_Base;

require_once TABLEBERG_DIR_PATH . 'includes/Version_Sync_Base.php';
use Tableberg\includes\traits\Ajax_Response_Trait;

require_once TABLEBERG_DIR_PATH . 'includes/traits/Ajax_Response_Trait.php';
use Tableberg\includes\traits\Manager_Base_Trait;

require_once TABLEBERG_DIR_PATH . 'includes/traits/Manager_Base_Trait.php';
use WP_Error;

use function activate_plugin;
use function add_filter;
use function check_ajax_referer;
use function current_user_can;
use function get_admin_url;
use function get_plugin_data;
use function is_wp_error;
use function plugins_api;
use function wp_create_nonce;

/**
 * Manager responsible for version related operations.
 */
class Version_Control extends Version_Sync_Base {
    use Manager_Base_Trait;
    use Ajax_Response_Trait;

    const VERSION_ROLLBACK_AJAX_ACTION = 'tableberg_version_control';

    /**
     * Main process that will be called during initialization of manager.
     *
     * @return void
     */
    protected function init_process() {
        add_filter('tableberg/filter/admin_settings_menu_data', array( $this, 'add_settings_menu_data' ));
        add_action('wp_ajax_' . self::VERSION_ROLLBACK_AJAX_ACTION, array( $this, 'ajax_version_rollback' ));

        // subscribe to version sync.
        $this->subscribe_to_version_sync();
    }

    /**
     * Handle ajax version rollback requests.
     *
     * @return void
     */
    public function ajax_version_rollback() {
        if (current_user_can('manage_options') && check_ajax_referer(
            self::VERSION_ROLLBACK_AJAX_ACTION,
            'nonce',
            false
        )) {

            try {
                if (! isset($_POST['version'])) {
                    throw new Exception(esc_html__('Invalid request body.', 'tableberg'));
                }

                $target_version         = $_POST['version'];
                $current_plugin_version = $this->current_plugin_version();

                if ($target_version === $current_plugin_version) {
                    throw new Exception(esc_html__('You are on the same plugin version.', 'tableberg'));
                }

                $available_versions = $this->get_plugin_versions_info();

                if (! in_array($target_version, array_keys($available_versions))) {
                    throw new Exception(esc_html__('Target version is out of bounds.', 'tableberg'));
                }

                require_once ABSPATH . 'wp-admin/includes/file.php';
                require_once ABSPATH . 'wp-admin/includes/misc.php';
                require_once ABSPATH . 'wp-admin/includes/class-wp-upgrader.php';
                require_once ABSPATH . 'wp-admin/includes/class-plugin-upgrader.php';
                require_once ABSPATH . 'wp-admin/includes/plugin-install.php';

                $plugin_remote_info = plugins_api(
                    'plugin_information',
                    array(
                        'slug' => $this->get_version_slug(),
                    )
                );

                $download_url = $available_versions[ $target_version ];
                $upgrader     = new Plugin_Upgrader(new Version_Control_Upgrader_Skin(array(), $plugin_remote_info));

                add_filter(
                    'upgrader_package_options',
                    function ($options) use ($target_version) {
                        $options['abort_if_destination_exists'] = false;
                        $options['hook_extra']                  = array_merge(
                            $options['hook_extra'],
                            array(
                                'plugin'  => 'tableberg/tableberg.php',
                                'version' => $target_version,
                            )
                        );

                        return $options;
                    }
                );
                $install_result = $upgrader->install($download_url, array( 'overwrite_package' => true ));
                if (is_wp_error($install_result) || false === $install_result) {
                    throw new Exception(
                        esc_html__(
                            'An error occurred during rollback operation, try again later.',
                            'tableberg'
                        )
                    );
                } else {
                    activate_plugin('tableberg/tableberg.php');
                    $this->set_message(
                        sprintf(
                            esc_html__('Plugin version %1$s installed successfully.', 'tableberg'),
                            esc_html($target_version)
                        )
                    );
                }
            } catch (Exception $e) {
                $this->set_error($e->getMessage());
            }
        } else {
            $this->set_error(esc_html__('You are not authorized to use this ajax endpoint.', 'tableberg'));
        }

        $this->send_json();
    }

    /**
     * Get plugin versions info.
     *
     * @return array versions info
     */
    private function get_plugin_versions_info() {
        require_once ABSPATH . 'wp-admin/includes/plugin-install.php';

        $plugin_remote_info = plugins_api(
            'plugin_information',
            array(
                'slug' => 'tableberg',
            )
        );

        if (is_wp_error($plugin_remote_info)) {
            $all_versions = array();
        } if (!isset($plugin_remote_info->versions)) {
            $all_versions = array();
        } if ($plugin_remote_info->versions == null) {
            $all_versions = array();
        } else {
            $all_versions = $plugin_remote_info->versions;
            unset($all_versions['trunk']);
        }

        return array_slice(array_reverse($all_versions, true), 0, 5, true);
    }

    /**
     * Current version of our plugin.
     *
     * @return string version
     */
    private function current_plugin_version() {
        return get_plugin_data(trailingslashit(TABLEBERG_DIR_PATH) . 'tableberg.php')['Version'];
    }

    /**
     * Add version control related data to settings menu frontend.
     *
     * @param array $data data.
     *
     * @return array filtered data
     */
    public function add_settings_menu_data($data) {
        $current_version = $this->current_plugin_version();

        $versions = array_keys($this->get_plugin_versions_info());

        $data['versionControl'] = array(
            'currentVersion' => $current_version,
            'versions'       => $versions,
            'ajax'           => array(
                'versionRollback' => array(
                    'url'    => get_admin_url(null, 'admin-ajax.php'),
                    'action' => self::VERSION_ROLLBACK_AJAX_ACTION,
                    'nonce'  => wp_create_nonce(self::VERSION_ROLLBACK_AJAX_ACTION),
                ),
            ),
        );

        return $data;
    }

    /**
     * Get slug of plugin/addon used in its distribution API.
     *
     * @return string slug
     */
    public function get_version_slug() {
        return 'tableberg';
    }

    /**
     * Get text domain of the plugin.
     *
     * It will be used for ajax upgraders to identify our plugin since slug is not supplied in plugin info property of that upgrader skin.
     *
     * @return string
     */
    public function get_text_domain() {
        return 'tableberg';
    }

    /**
     * Parse version number from package url.
     *
     * @param string $package package url.
     *
     * @return string|null version number
     */
    public function parse_version_from_package($package) {
        $parsed_version = null;
        $match          = array();

        preg_match('/^.+(?:tableberg)\.(.+)(?:\..+)$/', $package, $match);

        if ($match[1]) {
            $parsed_version = $match[1];
        }

        return $parsed_version;
    }

    /**
     * Plugin __FILE__
     *
     * @return string plugin file
     */
    public function plugin_file() {
        return TABLEBERG_PLUGIN_FILE;
    }

    /**
     * Callback hook for version sync manager when a subscriber attempted an installation operation.
     *
     * @param string $slug subscriber slug.
     * @param string $version version to install.
     *
     * @return false|WP_Error false to permit install(I know, but it is what it is) or WP_Error to cancel it
     */
    public function version_sync_logic($slug, $version) {
        $final_status = false;

        if ('tableberg-pro' === $slug) {
            $final_status = $this->generic_sync_logic($slug, $version);
        }

        return $final_status;
    }

    /**
     * Plugin specific logic for fetching versions and their info.
     *
     * Use plugin version for keys and info for their values. Use 'url' property key for download link.
     *
     * @return array|WP_Error versions array
     */
    protected function get_plugin_versions() {
        require_once ABSPATH . 'wp-admin/includes/plugin-install.php';

        $versions = new WP_Error(
            501,
            esc_html__(
                'An error occurred while fetching tableberg versions, please try again later',
                'tableberg'
            )
        );

        $info = (array) plugins_api('plugin_information', array( 'slug' => $this->get_version_slug() ));

        if (isset($info['versions'])) {
            $versions = array_reduce(
                array_keys($info['versions']),
                function ($carry, $key) use ($info) {
                    $carry[ $key ] = array( 'url' => $info['versions'] [ $key ] );

                    return $carry;
                },
                array()
            );
        }

        return $versions;
    }
}

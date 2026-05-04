<?php

namespace Tableberg\Admin;

use Tableberg;

class Tableberg_Admin {
    private $plugin_url;

    public function __construct() {

        $this->plugin_name = 'tableberg';
        $this->plugin_url  = TABLEBERG_URL;

        add_action('wp_ajax_tableberg_toggle_control', [$this, 'update_toggle_control']);
        add_action('wp_ajax_tableberg_block_properties', [$this, 'update_block_properties']);

        add_action('admin_menu', [$this, 'register_admin_menus']);
        add_action('admin_enqueue_scripts', [$this, 'enqueue_admin_script']);
        add_action('admin_notices', [$this, 'tableberg_review_notice']);
        add_action('wp_ajax_TablebergReviewNoticeHide', [$this, 'tableberg_hide_review_notify']);
        add_filter('tableberg/filter/admin_settings_menu_data', [$this, 'add_settings_menu_data'], 1, 1);
    }

    private function update_block_properties() {
        if (
            check_ajax_referer('block_properties') &&
            isset($_POST['value']) &&
            isset($_POST['property_name']) &&
            current_user_can('manage_options')
        ) {
            $value            = sanitize_text_field(wp_unslash($_POST['value']));
            $property_name    = sanitize_text_field(wp_unslash($_POST['property_name']));
            $saved_properties = get_option('tableberg_block_properties', false);
            if ($saved_properties) {
                foreach ($saved_properties as $key => $property) {
                    if ($property['name'] === $property_name) {
                        $saved_properties[$key]['value'] = (int) $value;
                    }
                }
            }

            update_option('tableberg_block_properties', $saved_properties);
        }

        die();
    }

    private function update_toggle_control() {

        if (
            check_ajax_referer('toggle_control') &&
            isset($_POST['enable']) &&
            isset($_POST['toggle_name']) &&
            current_user_can('manage_options')
        ) {
            $enable      = sanitize_text_field(wp_unslash($_POST['enable']));
            $toggle_name = sanitize_text_field(wp_unslash($_POST['toggle_name']));
            update_option($toggle_name, $enable);
        }
        die();
    }

    public function add_settings_menu_data($data) {
        $data['assets'] = [
            'logo' => trailingslashit($this->plugin_url) . 'includes/Admin/images/logos/menu-icon-colored.svg',
            'logoTransparent' => trailingslashit($this->plugin_url) . 'includes/Admin/images/logos/menu-icon-colored-transparent.svg',
        ];

        $data['individual_control'] = [
            'data' => get_option('tableberg_individual_control', false),
            'ajax' => [
                'toggleControl' => [
                    'url'    => admin_url('admin-ajax.php'),
                    'action' => 'tableberg_toggle_control',
                    'nonce'  => wp_create_nonce('toggle_control'),
                ],
            ],
        ];
        $data['global_control']     = [
            'data' => get_option('tableberg_global_control', false),
            'ajax' => [
                'toggleControl' => [
                    'url'    => admin_url('admin-ajax.php'),
                    'action' => 'tableberg_toggle_control',
                    'nonce'  => wp_create_nonce('toggle_control'),
                ],
            ],
        ];
        $data['block_properties']   = [
            'data' => get_option('tableberg_block_properties', false),
            'ajax' => [
                'blockProperties' => [
                    'url'    => admin_url('admin-ajax.php'),
                    'action' => 'tableberg_block_properties',
                    'nonce'  => wp_create_nonce('block_properties'),
                ],
            ],
        ];

        global $tp_fs;
        if (isset($tp_fs)) {
            $data['misc'] = [
                'pro_status' => $tp_fs->is__premium_only()
                    && $tp_fs->can_use_premium_code(),
            ];
        } else {
            $data['misc'] = [
                'pro_status' => false,
            ];
        }

        $data = array_merge($data, $this->welcome_page());
        return $data;
    }

    public function enqueue_admin_script() {
        $tableberg_assets = new Tableberg\Assets();
        $tableberg_assets->register_admin_assets();
    }

    public static function welcome_page() {
        return [
            'welcome' => [
                'title' => 'Welcome to Tableberg!',
                'content' => 'Elevate Your Content with Seamless Tables - The Ultimate WordPress Block Editor Plugin for Effortless Table Creation!',
            ],
            'documentation' => [
                'title' => 'Documentation',
                'content' => 'Elevate your space with Tableberg: a sleek, modern table block for style and functionality. Crafted for timeless elegance and versatility.',
            ],
            'support' => [
                'title' => 'Support',
                'content' => "Visit our Tableberg Support Page for quick solutions and assistance. We're here to ensure your Tableberg experience is seamless and satisfying.",
            ],
            'community' => [
                'title' => 'Join Community',
                'content' => 'Join the vibrant Tableberg community. Connect, share, and discover endless possibilities together. Elevate your experience with like-minded enthusiasts now!',
            ],
            'upgrade' => [
                'title' => 'Upgrade to Tableberg PRO!',
                'content' => 'Elevate Your Content with Seamless Tables - The Ultimate WordPress Block Editor Plugin for Effortless Table Creation!',
            ],
        ];
    }

    public function main_menu_template_cb() {
        ?>
<div id="tableberg-admin-menu"></div>
<?php
    }

    public function register_admin_menus() {
        global $menu_page;
        global $menu_page_slug;

        $menu_page_slug = 'tableberg-settings';
        $menu_page      = add_menu_page(
            __('Tableberg Settings', 'tableberg'),
            __('Tableberg', 'tableberg'),
            'manage_options',
            $menu_page_slug,
            [$this, 'main_menu_template_cb'],
            plugin_dir_url(__FILE__) . 'images/logos/menu-icon.svg'
        );
    }

    public static function tableberg_review_notice() {
        $install_date = get_option('tableberg_installDate');
        $display_date = date('Y-m-d h:i:s');
        $datetime1    = new \DateTime($install_date);
        $datetime2    = new \DateTime($display_date);
        $diff_interval = round(($datetime2->format('U') - $datetime1->format('U')) / (60 * 60 * 24));

        if ($diff_interval >= 21 && get_option('tableberg_review_notify') == 'no') {
            ?>
             <div class="tableberg-review-notice notice notice-info" style="display: inline-block; position: relative; padding:0.5rem 1.5rem">
                 <button type="button" class="notice-dismiss Tableberg_HideReview_Notice" style="position: absolute; top: 2px; right: 2px;">
                     <span class="screen-reader-text"><?php esc_html_e('Dismiss this notice.', 'tableberg'); ?></span>
                 </button>
                 <p style="font-size: 14px; line-height: 2;padding-right:2rem">
                     <?php
                    echo wp_kses_post(__(
                        'Hello! Seems like you\'ve been using <strong>Tableberg</strong> for a while on your website. That\'s awesome!<br>If you can spare a few moments to rate it on wordpress.org, it would help us a lot (and boost my motivation).<br>Imtiaz Rayhan, developer of Tableberg',
                        'tableberg'
                    ));
            ?>
                 </p>
                 <ul style="list-style-type: none; padding: 0;">
                     <li>
                         <a style="margin-right: 5px; margin-bottom: 5px;" class="button-primary" href="https://wordpress.org/support/plugin/tableberg/reviews/" target="_blank"><?php esc_html_e('Ok, I will gladly help!', 'tableberg'); ?></a>
                         <a class="Tableberg_HideReview_Notice button" href="javascript:void(0);"><?php esc_html_e('No, thanks', 'tableberg'); ?></a>
                     </li>
                 </ul>
             </div>
             <script>
                 jQuery(document).ready(function($) {
                     $('.Tableberg_HideReview_Notice').click(function() {
                         var data = {
                             'action': 'TablebergReviewNoticeHide'
                         };
                         $.ajax({
                             url: "<?php echo esc_url(admin_url('admin-ajax.php')); ?>",
                             type: "post",
                             data: data,
                             dataType: "json",
                             async: true,
                             success: function(notice_hide) {
                                 if (notice_hide == "success") {
                                     $('.tableberg-review-notice').slideUp('fast');
                                 }
                             }
                         });
                     });
                 });
             </script>
             <?php
        }
    }


    public function tableberg_hide_review_notify() {
        update_option('tableberg_review_notify', 'yes');
        echo wp_json_encode(['success']);
        exit;
    }
}

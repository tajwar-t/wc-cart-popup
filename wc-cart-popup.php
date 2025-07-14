<?php
/*
Plugin Name: WooCommerce Cart Popup
Description: Displays a centered popup with a loading spinner and product image when a product is added to the WooCommerce cart using AJAX. Success message, heading, and image are shown only after loading completes.
Version: 1.0.6
Author: Tajwar
License: GPL-2.0+
*/

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Check if WooCommerce is active
 */
if (!in_array('woocommerce/woocommerce.php', apply_filters('active_plugins', get_option('active_plugins'))) && !class_exists('WooCommerce')) {
    add_action('admin_notices', function() {
        echo '<div class="error"><p>WooCommerce Cart Popup requires WooCommerce to be installed and active.</p></div>';
    });
    return;
}

/**
 * Enqueue scripts and styles for the cart popup
 */
function wc_cart_popup_enqueue_scripts() {
    // Enqueue jQuery
    wp_enqueue_script('jquery');

    // Enqueue custom script
    wp_enqueue_script(
        'wc-cart-popup',
        plugins_url('js/wc-cart-popup.js', __FILE__),
        array('jquery'),
        time(),
        true
    );

    // Localize script to pass AJAX URL and nonce
    wp_localize_script(
        'wc-cart-popup',
        'wcCartPopup',
        array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('wc_cart_popup_nonce'),
            'debug' => true // Enable debug mode for console logs
        )
    );

    // Enqueue styles
    wp_enqueue_style(
        'wc-cart-popup-style',
        plugins_url('css/wc-cart-popup.css', __FILE__),
        array(),
        time()
    );
}
add_action('wp_enqueue_scripts', 'wc_cart_popup_enqueue_scripts');

/**
 * Handle AJAX request to add product to cart
 */
function wc_cart_popup_add_to_cart_ajax() {
    error_log('WCCartPopup: AJAX request received');

    check_ajax_referer('wc_cart_popup_nonce', 'nonce');

    $product_id = isset($_POST['product_id']) ? absint($_POST['product_id']) : 0;
    $quantity = isset($_POST['quantity']) ? absint($_POST['quantity']) : 1;

    if ($product_id) {
        $added = WC()->cart->add_to_cart($product_id, $quantity);

        if ($added) {
            // Get product image URL
            $product = wc_get_product($product_id);
            $image_id = $product->get_image_id();
            $image_url = $image_id ? wp_get_attachment_image_url($image_id, 'thumbnail') : wc_placeholder_img_src('thumbnail');

            wp_send_json_success(array(
                'message' => __('Product added to cart!', 'woocommerce'),
                'cart_count' => WC()->cart->get_cart_contents_count(),
                'product_name' => get_the_title($product_id),
                'product_image' => $image_url
            ));
        } else {
            wp_send_json_error(array(
                'message' => __('Failed to add product to cart.', 'woocommerce')
            ));
        }
    } else {
        wp_send_json_error(array(
            'message' => __('Invalid product ID.', 'woocommerce')
        ));
    }

    wp_die();
}
add_action('wp_ajax_wc_cart_popup_add', 'wc_cart_popup_add_to_cart_ajax');
add_action('wp_ajax_nopriv_wc_cart_popup_add', 'wc_cart_popup_add_to_cart_ajax');

/**
 * Add popup HTML to footer
 */
function wc_cart_popup_html() {
    ?>
    <div class="wc-cart-overlay" id="wcCartOverlay"></div>
    <div class="wc-cart-popup" id="wcCartPopup">
        <button class="wc-cart-close" onclick="closeCartPopup()">×</button>
        <div class="wc-cart-spinner" id="wcCartSpinner"></div>
        <h3 id="wcCartSuccess"><?php esc_html_e('Success!', 'woocommerce'); ?></h3>
        <img id="wcCartProductImage" alt="Product Image">
        <p id="wcCartMessage"></p>
        <div class="wc-cart-actions">
            <button class="wc-cart-continue" onclick="closeCartPopup()"><?php esc_html_e('Continue Shopping', 'woocommerce'); ?></button>
            <a href="<?php echo esc_url(wc_get_cart_url()); ?>" class="wc-cart-view-cart"><?php esc_html_e('View Cart', 'woocommerce'); ?></a>
        </div>
    </div>
    <?php
}
add_action('wp_footer', 'wc_cart_popup_html');
?>
# **WooCommerce Cart Popup**

**Plugin Name**: WooCommerce Cart Popup  
**Version**: 1.0.6  
**Author**: Tajwar  
**License**: GPL-2.0+  
**Requires**: WordPress 5.0+, WooCommerce 3.0+  
**Tested Up To**: WordPress 6.6, WooCommerce 9.0

## **Description**

WooCommerce Cart Popup enhances the shopping experience by displaying a sleek, centered popup when a product is added to the cart via AJAX. The popup provides visual feedback with a loading spinner, product image, success message, and action buttons, ensuring a user-friendly and responsive interface across all devices.

## **Features**

* **Centered Popup**: Displays a popup centered on the screen using CSS `position: fixed`, `top: 50%`, `left: 50%`, and `transform: translate(-50%, -50%)` for consistent positioning across all screen sizes.  
* **Loading Spinner**: Shows a spinning loader during the AJAX request to indicate processing.  
* **Product Image**: Displays the product’s thumbnail (100x100px, rounded corners) after the AJAX request completes successfully.  
* **Success Message**: Shows a customizable success message in the format "1x **Product Name** added to the cart\!" with the quantity and product name in bold.  
* **Action Buttons**: Includes "Continue Shopping" and "View Cart" buttons with uniform styling (uppercase text, 45px height, flex alignment) and hover effects.  
* **Close Button**: A prominent close button (`×`) in the top-right corner to dismiss the popup.  
* **Responsive Design**: Adapts to all screen sizes with media queries for mobile devices (`<600px` and `<400px`), adjusting popup width, image size, font sizes, and button layout.  
* **Debugging Support**: Includes console logs for troubleshooting (e.g., button clicks, AJAX requests, computed styles for centering).  
* **Theme Compatibility**: Uses high-specificity selectors (`body #wcCartPopup`) to minimize conflicts with themes.  
* **Variable Product Support**: Handles both simple and variable products, extracting product or variation IDs from buttons or forms.

## **Installation**

1. **Download and Upload**:

   * Download the plugin zip file or clone the repository.  
   * Upload the `wc-cart-popup` folder to `wp-content/plugins/` via FTP or use the WordPress admin panel to upload the zip file (`Plugins > Add New > Upload Plugin`).  
2. **Activate**:

   * Navigate to `Plugins` in the WordPress admin dashboard.  
   * Activate the **WooCommerce Cart Popup** plugin.  
3. **Verify Dependencies**:

   * Ensure WooCommerce is installed and active. If not, an admin notice will prompt you to install WooCommerce.  
4. **Clear Caches**:

   * Clear any WordPress caching plugins (e.g., WP Super Cache, W3 Total Cache).  
   * Clear your browser cache to ensure the plugin’s CSS and JavaScript load correctly.

## **Usage**

1. **Adding Products**:

   * On any WooCommerce product page (simple or variable), click the "Add to Cart" button (e.g., `<button type="submit" name="add-to-cart" value="27" class="single_add_to_cart_button">Add to cart</button>`).  
   * The plugin captures clicks on buttons with classes like `.add_to_cart_button`, `.ajax_add_to_cart`, `.single_add_to_cart_button`, or attributes like `name="add-to-cart"`.  
2. **Popup Behavior**:

   * Upon clicking "Add to Cart":  
     * A centered overlay (`#wcCartOverlay`) darkens the background.  
     * The popup (`#wcCartPopup`) appears with a loading spinner and close button.  
     * The product image, success heading ("Success\!"), success message ("1x **Product Name** added to the cart\!"), and action buttons are hidden during loading.  
     * After the AJAX request completes successfully, the spinner hides, and the product image, success heading, message, and buttons ("Continue Shopping" and "View Cart") appear.  
   * If the AJAX request fails, the popup closes, and an alert displays the error (e.g., "Invalid product ID").  
3. **Closing the Popup**:

   * Click the close button (`×`) or the "Continue Shopping" button to dismiss the popup.  
   * The "View Cart" button redirects to the WooCommerce cart page.  
4. **Responsive Experience**:

   * On mobile devices (`<600px`), the popup width reduces to 85%, the product image shrinks to 80x80px, and buttons stack vertically.  
   * On very small screens (`<400px`), the popup width further reduces to 90% with smaller padding.

## **Troubleshooting**

If the popup doesn’t appear, appears misaligned, or the image/message doesn’t show:

1. **Check Console Logs**:

   * Open Developer Tools (F12 \> Console) and click "Add to Cart".  
   * Look for logs like:  
     * `WCCartPopup: Adding product ID 27 to cart with quantity 1`  
     * `WCCartPopup: Computed styles - display: block, position: fixed, top: 50%, left: 50%, transform: matrix(...)`  
     * `WCCartPopup: Product image src https://.../product.jpg`  
   * Check for errors like `WCCartPopup: AJAX error`.  
2. **Verify CSS/JS Loading**:

   * In Developer Tools (F12 \> Network), confirm `wc-cart-popup.css` and `wc-cart-popup.js` load (status 200).  
   * Inspect `#wcCartPopup` in the Elements tab to ensure it has the `show` class and styles (`display: block`, `top: 50%`, etc.).  
3. **Theme Conflicts**:

   * Test with the **Storefront** theme to rule out conflicts.  
   * Ensure `footer.php` includes `<?php wp_footer(); ?>`.  
4. **Debug Log**:

Enable debugging in `wp-config.php`:  
define('WP\_DEBUG', true);

define('WP\_DEBUG\_LOG', true);

define('WP\_DEBUG\_DISPLAY', false);

*   
  * Check `wp-content/debug.log` for errors like `WCCartPopup`.  
5. **Product Image Issues**:

   * If the product image doesn’t appear, ensure the product has a featured image in WooCommerce.  
   * Check the console for `WCCartPopup: Product image src`.  
6. **Variable Products**:

   * For variable products, ensure the `<form class="cart">` includes `variation_id` or `product_id` inputs.

## **File Structure**

wc-cart-popup/

├── wc-cart-popup.php    \# Main plugin file (handles HTML, AJAX, and enqueues)

├── js/

│   └── wc-cart-popup.js \# JavaScript for AJAX and popup logic

├── css/

│   └── wc-cart-popup.css \# Styles for popup, buttons, and responsive design

├── README.md            \# This file

## **Support**

For issues or feature requests, please contact the author or open an issue on the plugin’s repository (if available). Provide console logs, theme name, and details about the product type (simple or variable) for faster resolution.

## **License**

This plugin is licensed under the [GPL-2.0+ License](https://www.gnu.org/licenses/gpl-2.0.html).


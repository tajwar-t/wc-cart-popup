jQuery(document).ready(function($) {
    // Debug log
    if (wcCartPopup.debug) {
        console.log('WCCartPopup: Script loaded');
    }

    // Prevent duplicate AJAX calls
    let isProcessing = false;

    // Use event delegation to handle dynamically loaded buttons
    $(document.body).on('click', '.add_to_cart_button, .ajax_add_to_cart, .single_add_to_cart_button', function(e) {
        e.preventDefault();

        if (isProcessing) {
            if (wcCartPopup.debug) {
                console.log('WCCartPopup: AJAX request already in progress, skipping');
            }
            return;
        }

        var $this = $(this);

        // Log button HTML for debugging
        if (wcCartPopup.debug) {
            console.log('WCCartPopup: Button clicked', $this.prop('outerHTML'));
        }

        // Prioritize value attribute for buttons with name="add-to-cart"
        var product_id = null;
        if ($this.attr('name') === 'add-to-cart') {
            product_id = $this.val();
        }

        // Fallback: Check data attributes
        if (!product_id) {
            product_id = $this.data('product_id') || $this.data('product-id') || $this.attr('data-product_id') || $this.attr('data-product-id');
        }

        // Fallback: Parse product ID from href
        if (!product_id) {
            var href = $this.attr('href');
            if (href && href.includes('add-to-cart=')) {
                var match = href.match(/add-to-cart=(\d+)/);
                if (match) {
                    product_id = match[1];
                }
            }
        }

        // Fallback: Check for product ID in form (for variable products)
        if (!product_id) {
            var $form = $this.closest('form.cart');
            if ($form.length) {
                product_id = $form.find('input[name="product_id"]').val() || $form.find('input[name="add-to-cart"]').val();
            }
        }

        // Fallback: Check for variation ID
        if (!product_id) {
            var variation_id = $this.closest('form.cart').find('input[name="variation_id"]').val();
            if (variation_id) {
                product_id = variation_id;
            }
        }

        var quantity = $this.data('quantity') || $this.closest('form.cart').find('input[name="quantity"]').val() || 1;

        if (!product_id) {
            console.error('WCCartPopup: No product ID found for button', $this.prop('outerHTML'));
            alert('Error: Unable to add product to cart. Product ID not found.');
            return;
        }

        if (wcCartPopup.debug) {
            console.log('WCCartPopup: Adding product ID ' + product_id + ' to cart with quantity ' + quantity);
        }

        isProcessing = true;

        // Show spinner and popup, hide product image, success heading, message, and actions
        $('#wcCartSpinner').addClass('show');
        $('#wcCartPopup').addClass('show');
        $('#wcCartOverlay').addClass('show');
        $('#wcCartProductImage').removeClass('show');
        $('#wcCartSuccess').removeClass('show');
        $('#wcCartMessage').removeClass('show');
        $('.wc-cart-actions').removeClass('show');

        if (wcCartPopup.debug) {
            console.log('WCCartPopup: Showing spinner and popup, hiding product image, success heading, message, and actions');
            // Log computed styles to diagnose centering
            setTimeout(function() {
                var popupStyles = window.getComputedStyle(document.getElementById('wcCartPopup'));
                console.log('WCCartPopup: Computed styles - display:', popupStyles.display, 
                            'position:', popupStyles.position, 
                            'top:', popupStyles.top, 
                            'left:', popupStyles.left, 
                            'transform:', popupStyles.transform);
            }, 100);
        }

        $.ajax({
            url: wcCartPopup.ajax_url,
            type: 'POST',
            data: {
                action: 'wc_cart_popup_add',
                product_id: product_id,
                quantity: quantity,
                nonce: wcCartPopup.nonce
            },
            beforeSend: function() {
                if (wcCartPopup.debug) {
                    console.log('WCCartPopup: Sending AJAX request');
                }
            },
            success: function(response) {
                if (wcCartPopup.debug) {
                    console.log('WCCartPopup: AJAX response', response);
                }

                // Hide spinner
                $('#wcCartSpinner').removeClass('show');

                if (response.success) {
                    // Show product image, success heading, message, and actions
                    $('#wcCartProductImage').attr('src', response.data.product_image).addClass('show');
                    $('#wcCartSuccess').addClass('show');
                    $('#wcCartMessage').html('<span>' + quantity + 'x </span><strong>' + response.data.product_name + '</strong> added to the cart!').addClass('show');
                    $('.wc-cart-actions').addClass('show');
                    // Ensure popup and overlay remain visible
                    $('#wcCartPopup').addClass('show');
                    $('#wcCartOverlay').addClass('show');
                    // Debug visibility
                    if (wcCartPopup.debug) {
                        console.log('WCCartPopup: Added show class to popup, overlay, product image, success heading, message, and actions');
                        console.log('WCCartPopup: Popup display style', $('#wcCartPopup').css('display'));
                        console.log('WCCartPopup: Overlay display style', $('#wcCartOverlay').css('display'));
                        console.log('WCCartPopup: Product image display style', $('#wcCartProductImage').css('display'));
                        console.log('WCCartPopup: Product image src', $('#wcCartProductImage').attr('src'));
                        console.log('WCCartPopup: Success heading display style', $('#wcCartSuccess').css('display'));
                        console.log('WCCartPopup: Success message display style', $('#wcCartMessage').css('display'));
                        console.log('WCCartPopup: Actions display style', $('.wc-cart-actions').css('display'));
                    }
                    // Update cart count if element exists
                    if ($('.cart-count').length) {
                        $('.cart-count').text(response.data.cart_count);
                    }
                } else {
                    // Hide popup and overlay on error
                    $('#wcCartPopup').removeClass('show');
                    $('#wcCartOverlay').removeClass('show');
                    alert(response.data.message);
                }
            },
            error: function(xhr, status, error) {
                if (wcCartPopup.debug) {
                    console.error('WCCartPopup: AJAX error', error, xhr.responseText);
                }
                // Hide spinner, popup, and overlay on error
                $('#wcCartSpinner').removeClass('show');
                $('#wcCartPopup').removeClass('show');
                $('#wcCartOverlay').removeClass('show');
                alert('Error adding product to cart: ' + error);
            },
            complete: function() {
                isProcessing = false;
                if (wcCartPopup.debug) {
                    console.log('WCCartPopup: AJAX request completed');
                }
            }
        });
    });
});

function closeCartPopup() {
    jQuery('#wcCartPopup').removeClass('show');
    jQuery('#wcCartOverlay').removeClass('show');
    jQuery('#wcCartSpinner').removeClass('show');
    jQuery('#wcCartProductImage').removeClass('show');
    jQuery('#wcCartSuccess').removeClass('show');
    jQuery('#wcCartMessage').removeClass('show');
    jQuery('.wc-cart-actions').removeClass('show');
    if (wcCartPopup.debug) {
        console.log('WCCartPopup: Closed popup');
    }
}
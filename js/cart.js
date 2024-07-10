function loadCart() {
    console.log('Loading cart...')
    console.log('JWT Token:', localStorage.getItem('token'))
    $.ajax({
        url: "http://localhost:8080/api/cart",
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        success: function (response) {
            console.log('Cart loaded successfully:', response)
            if (response && response.items) {
                updateCartUI(response)
            } else {
                console.error('Unexpected response structure:', response)
                $('#cart-items').append('<tr><td colspan="6">Error loading cart. Unexpected data structure</td></tr>')
            }
        },
        error: function (xhr, status, error) {
            console.error('Error loading cart:', error)
            console.error('Status:', xhr.status)
            console.error('Response:', xhr.responseText)
            if (xhr.status === 401) {
                alert('Please login to view your cart')
                window.location.href = 'login.html'
            } else {
                $('#cart-items').append('<tr><td colspan="6">Error loading cart. Please try again later</td></tr>')
            }
        }
    })
}

function updateCartUI(cartDto) {
    let cartItems = $('#cart-items')
    cartItems.empty()
    let total = 0

    if (!cartDto || !cartDto.items || cartDto.items.length === 0) {
        cartItems.append('<tr><td colspan="6">Your cart is empty</td></tr>')
        $('#total-amount').text('0.00')
        return;
    }

    cartDto.items.forEach(function (item) {
        console.log('Processing item:', item)  // Debug log
        if (!item.productId) {
            console.error('Invalid item structure:', item)
            return
        }

        let itemTotal = item.price * item.stockQuantity
        total += itemTotal
        cartItems.append(`
            <tr data-product-id="${item.productId}">
                <td>
                    <input type="checkbox" class="item-checkbox" data-product-id="${item.productId}">
                </td>
                <td>
                    <img src="${item.avatar}" width="100">
                    ${item.productName}
                </td>
                <td class="item-price">$${parseFloat(item.price).toFixed(2)}</td>
                <td>
                    <button class="decrease-quantity">-</button>
                    <input type="number" class="quantity-input" value="${item.stockQuantity}" min="1" max="${item.quantity}" data-last-valid-quantity="${item.stockQuantity}">
                    <button class="increase-quantity">+</button>
                </td>
                <td class="item-total">$${itemTotal.toFixed(2)}</td>
                <td>
                    <button class="delete-item">Delete</button>
                </td>
            </tr>
        `);
    });

    $('#total-amount').text(total.toFixed(2))
    attachEventListenersCart()
}

function attachEventListenersCart() {
    $('.decrease-quantity').on('click', function () {
        updateQuantityCartItem($(this).closest('tr'), -1)
    })
    $('.increase-quantity').on('click', function () {
        updateQuantityCartItem($(this).closest('tr'), 1)
    })
    $('.quantity-input').on('change', function () {
        validateQuantityInput($(this))
        updateQuantityCartItem($(this).closest('tr'), 0)
    })

    $('.delete-item').on('click', deleteItem)
    $('#delete-all').on('click', deleteAll)
    $('.item-checkbox').on('change', updateBuyButton)
    $('#buy-selected').on('click', buySelected)
}

function updateQuantityCartItem(row, change) {
    let input = row.find('.quantity-input');
    let currentValue = parseInt(input.val()) || 0;
    let newValue = currentValue + change;
    let maxValue = parseInt(input.attr('max'));
    let lastValidQuantity = parseInt(input.attr('data-last-valid-quantity')) || currentValue;

    if (change === 0) {
        newValue = validateQuantityInput(input);
    } else {
        if (newValue < 1) {
            if (confirm('Do you want to delete this product from your cart?')) {
                deleteItem.call(row.find('.delete-item'));
            } else {
                input.val(lastValidQuantity);
                updateItemTotal(row);
            }
            return;
        }

        if (newValue > maxValue) {
            newValue = maxValue;
        }
    }

    updateCartOnServer(row.data('product-id'), newValue, input, lastValidQuantity);
}

function validateQuantityInput(input) {
    let value = parseInt(input.val()) || 0
    let min = parseInt(input.attr('min')) || 1;
    let max = parseInt(input.attr('max')) || Number.MAX_SAFE_INTEGER;
    let lastValidQuantity = parseInt(input.attr('data-last-valid-quantity')) || min;

    if (value < min) {
        return min
    } else if (value > max) {
        return lastValidQuantity;
    } else {
        return value;
    }
}

function updateCartOnServer(productId, quantity, input, lastValidQuantity) {
    $.ajax({
        url: "http://localhost:8080/api/cart/update",
        method: "POST",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
            'Content-Type': 'application/json',
        },
        data: JSON.stringify({
            productId: productId,
            quantity: quantity
        }),
        success: function (response) {
            console.log('Cart updated successfully: ', response);
            input.val(quantity)
            input.attr('data-last-valid-quantity', quantity)
            updateItemTotal(input.closest('tr'))
        },
        error: function (xhr, status, error) {
            console.error('Error updating cart... ', error)
            if (xhr.status === 401) {
                alert('Please login to update your cart!')
                window.location.href = 'login.html'
            } else {
                let errorMessage = 'Error updating cart. Please try again later'
                let maxQuantity = lastValidQuantity
                try {
                    let errorResponse = xhr.responseText
                    if (errorResponse.includes("Maximum available quantity is")) {
                        maxQuantity = parseInt(errorResponse.split("Maximum available quantity is")[1].trim())
                        errorMessage = `Not enough stock available. Maximum available quantity is ${maxQuantity}`
                } else {
                        errorMessage = errorResponse;
                    }
                } catch (e) {
                    console.error('Error parsing error response:', e)
                }
                alert(errorMessage)
                input.val(maxQuantity)
                input.attr('data-last-valid-quantity', maxQuantity)
                updateItemTotal(input.closest('tr'))
            }
        }
    })
}

function updateItemTotal(row) {
    let price = parseFloat(row.find('.item-price').text().replace('$', ''))
    let quantity = parseInt(row.find('.quantity-input').val()) || 0
    let newTotal = price * quantity
    row.find('.item-total').text('$' + newTotal.toFixed(2))
    updateCartTotal()
    row.find('.quantity-input').attr('data-last-valid-quantity', quantity)
}

function updateCartTotal() {
    let total = 0
    $('.item-total').each(function () {
        total += parseFloat($(this).text().replace('$', ''))
    })
    $('#total-amount').text(total.toFixed(2))
}

function updateBuyButton() {
    let checkedItems = $('.item-checkbox:checked')
    let buyButton = $('#buy-selected')

    if (checkedItems.length > 0) {
        buyButton.removeClass('buy-button-disabled').prop('disabled', false)
    } else {
        buyButton.addClass('buy-button-disabled').prop('disabled', true)
    }
}

function buySelected() {
    let selectedProductId = $('.item-checkbox:checked').map(function () {
        return $(this).data('product-id');
    }).get()

    if (selectedProductId.length === 0) {
        alert('Please select at least one product to buy')
        return
    }

    redirectToPayment(selectedProductId)
}

function redirectToPayment(productIds) {
    let queryString = productIds.map(id => `productId=${id}`).join('&')
    window.location.href = `payment.html?${queryString}`
}

function deleteItem() {
    let row = $(this).closest('tr');
    let productId = row.data('productId');
    let productName = row.find('td:first-child').text().trim();

    if (confirm(`Are you sure you want to delete ${productName} item from your cart?`)) {
        $.ajax({
            url: 'http://localhost:8080/api/cart/remove',
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token'),
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({productId: productId}),
            success: function (res) {
                row.remove()
                updateCartTotal()
                if ($('#cart-items tr').length === 0) {
                    $('#cart-items').append('<tr><td colspan="5">Your Cart Is Empty</td></tr>>')
                }
            },
            error: function (xhr, status, error) {
                console.error('Error removing item from cart: ', error)
                alert('Error removing item from cart. Please try again later')
            }
        })
    }
}

function deleteAll() {
    if (confirm('Are you sure you want to delete all items from your cart?')) {
        $.ajax({
            url: 'http://localhost:8080/api/cart/remove-all',
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            success: function (response) {
                $('#cart-items').empty().append('<tr><td colspan="5">Your cart is empty</td></tr>');
                updateCartTotal()
            },
            error: function (xhr, status, error) {
                console.error('Error removing item from cart: ', error)
                alert('Error removing item from cart. Please try again later')
            }
        })
    }
}

$(document).ready(function () {
    if (!localStorage.getItem('token')) {
        alert('Please login to view your cart')
        window.location.href = 'login.html'
    } else {
        loadCart();
    }
});
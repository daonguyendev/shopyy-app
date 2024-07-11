$(document).ready(function() {
    const urlParams = new URLSearchParams(window.location.search);
    const productIds = urlParams.getAll('productId');

    if (productIds.length === 0) {
        $('#selected-products tbody').html('<tr><td colspan="4">No products selected</td></tr>');
        return;
    }

    $.ajax({
        url: "http://localhost:8080/api/cart",
        method: "GET",
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token'),
        },
        success: function(response) {
            if (response && response.items) {
                displaySelectedProducts(response.items, productIds);
            } else {
                $('#selected-products tbody').html('<tr><td colspan="4">Error loading products</td></tr>');
            }
        },
        error: function(xhr, status, error) {
            console.error('Error loading cart:', error);
            $('#selected-products tbody').html('<tr><td colspan="4">Error loading products</td></tr>');
        }
    });
});

function displaySelectedProducts(cartItems, selectedProductIds) {
    let tableBody = $('#selected-products tbody');
    let total = 0;

    cartItems.forEach(function(item) {
        if (selectedProductIds.includes(item.productId.toString())) {
            let itemTotal = item.price * item.stockQuantity;
            total += itemTotal;

            tableBody.append(`
                        <tr>
                            <td>
                                <img src="${item.avatar}" width="100">
                                ${item.productName}
                            </td>
                            <td>$${parseFloat(item.price).toFixed(2)}</td>
                            <td>${item.stockQuantity}</td>
                            <td>$${itemTotal.toFixed(2)}</td>
                        </tr>
                    `);
        }
    });

    $('#total').text(total.toFixed(2));
}
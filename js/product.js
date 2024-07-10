
$(document).ready(function(){
  productHome();
  loadColors();
  loadSizes();
  loadSubCategories();
});

function loadColors() {
  $.ajax({
    url: `http://localhost:8080/api/colors`, 
    type: "GET",
    crossDomain: true,
    contentType: "application/json",
    dataType: "json",
    success: function (response) {
      localStorage.setItem("colors", JSON.stringify(response));
      response?.forEach((color) => {
        select.append(new Option(color.colorName, color.id));
      });
    },
    error: (e) => {
      console.log(e);
    },
  });
}

function loadSizes() {
  $.ajax({
    url: `http://localhost:8080/api/sizes`, 
    type: "GET",
    crossDomain: true,
    contentType: "application/json",
    dataType: "json",
    success: function (response) {
      localStorage.setItem("sizes", JSON.stringify(response));
      response?.forEach((size) => {
        select.append(new Option(size.sizeName, size.id));
      });
    },
    error: (e) => {
      console.log(e);
    },
  });
}

function loadSubCategories() {
  $.ajax({
    url: `http://localhost:8080/api/subCategory`, 
    type: "GET",
    crossDomain: true,
    contentType: "application/json",
    dataType: "json",
    success: function (response) {
      localStorage.setItem("subCategories", JSON.stringify(response?.content));
      response?.content?.forEach((subCategory) => {
        select.append(new Option(subCategory.name, subCategory.id));
      });
    },
    error: (e) => {
      console.log(e);
    },
  });
}

async function successHandler() {
  try {
    const data = await $.ajax({
      type: "GET",
      url: "http://localhost:8080/api/products",
    });
    productHome();
  } catch (error) {
    console.error("Error while fetching products:", error);
  }
}

let currentPage = 0;
const pageSize = 5;

function getProduct(product) {
    const colors = product.colors && product.colors.length > 0 ? product.colors.map(color => color.colorName).join(", ") : "";
    const sizes = product.sizes && product.sizes.length > 0 ? product.sizes.map(size => size.sizeName).join(", ") : "";
    const subCategory = product.subCategory ? product.subCategory.name : "";

    return `<tr>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td>${product.description}</td>
                <td class="stock-quantity">${product.quantity}</td>
                <td><img src="${product.avatar}" width="100"></td>
                <td>${colors}</td>
                <td>${sizes}</td>
                <td>${subCategory}</td>
                <td>
                    <div class="quantity-control">
                        <button class="decrease-quantity" data-product-id="${product.id}">-</button>
                        <input type="number" class="quantity-input" value="1" min="1" max="${product.quantity}" data-product-id="${product.id}">
                        <button class="increase-quantity" data-product-id="${product.id}">+</button>
                    </div>
                </td>
                <td>
                    <button class="add-to-cart" data-product-id="${product.id}">Add to Cart</button>
                </td>
                <td><button class="deleteProduct" onclick="deleteProduct(${product.id})">Delete</button></td>
                <td><button type="button" data-toggle="modal" data-target="#exampleModalLong" onclick='showFormUpdate(${product.id})'>Update</button></td>
                <td><button type="button" onclick='view(${product.id})'>Views</button></td>
            </tr>`;
}

function attachEventListenersProductList() {
    $(document).on('click', '.decrease-quantity', decreaseQuantityProductList);
    $(document).on('click', '.increase-quantity', increaseQuantityProductList);
    $(document).on('change', '.quantity-input', validateQuantityProductList);
    $(document).on('click', '.add-to-cart', addToCart);
}

function decreaseQuantityProductList() {
    let input = $(this).siblings('.quantity-input');
    let currentValue = parseInt(input.val());
    if (currentValue > 1) {
        input.val(currentValue - 1);
    }
}

function increaseQuantityProductList() {
    let input = $(this).siblings('.quantity-input');
    let currentValue = parseInt(input.val());
    let maxValue = parseInt(input.attr('max'));
    if (currentValue < maxValue) {
        input.val(currentValue + 1);
    }
}

function validateQuantityProductList() {
    let value = parseInt($(this).val());
    let min = parseInt($(this).attr('min'));
    let max = parseInt($(this).attr('max'));
    if (value < min) {
        $(this).val(min);
    } else if (value > max) {
        $(this).val(max);
    }
}

function addToCart() {
    let productId = $(this).data('product-id');
    let quantity = parseInt($(this).closest('tr').find('.quantity-input').val())
    let stockQuantityElement = $(this).closest('tr').find('.stock-quantity')
    let currentStockQuantity = parseInt(stockQuantityElement.text())

    $.ajax({
        url: 'http://localhost:8080/api/cart/add',
        method: 'POST',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        },
        data: JSON.stringify({
            productId: productId,
            quantity: quantity
        }),
        success: function (response) {
            alert('Product added to cart successfully');
            let newStockQuantity = currentStockQuantity - quantity
            stockQuantityElement.text(newStockQuantity)

            let quantityInput = $(`input.quantity-input[data-product-id="${productId}"]`)
            quantityInput.attr('max', newStockQuantity)

            if (parseInt(quantityInput.val()) > newStockQuantity) {
                quantityInput.val(newStockQuantity)
            }
        },
        error: function (xhr, status, error) {
            if (xhr.status === 401) {
                alert('Phiên đăng nhập của bạn đã hết hạn. Vui lòng đăng nhập lại');
                window.location.href = 'login.html';
            } else {
                alert('Error adding product to cart: ' + xhr.responseText);
            }
        }
    });
}

$(document).ready(function() {
    attachEventListenersProductList();
});

function productHome(search = "") {
  $.ajax({
      type: "GET",
      url: `http://localhost:8080/api/products?page=${currentPage}&size=${pageSize}&search=${search}`,
      success: function (data) {
          let content = "";
          data.content.forEach((product) => {
              content += getProduct(product);
          });

          // Thêm nội dung mới vào danh sách hiện tại
          $("#display-list").append(content);

          // Kiểm tra xem có cần ẩn nút "Xem Thêm" hay không
          if (currentPage >= data.totalPages - 1) {
              $("#load-more").hide();
          } else {
              $("#load-more").show();
          }

          currentPage++;
          attachEventListenersProductList()
      },
      error: function (xhr, status, error) {
          console.error("Error while fetching products:", error);
      }
  });
}

function deleteProduct(id) {
  $.ajax({
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    type: "DELETE",
    url: `http://localhost:8080/api/products/${id}`,
    success: function () {
      $(`#product-${id}`).remove();
      window.location.href = "http://127.0.0.1:5500/html/product.html";
      alert("The product has been successfully deleted");
    },
  });
}

function handleSearch() {
  const keyword = $("#search-input").val();
  currentPage = 0; 
  searchProducts(keyword); 
  loadProductsSortedBySubCategory(keyword)
}

function loadMore() {
  const keyword = $("#search-input").val();
  searchProducts(keyword); 
}

function searchProducts(keyword) {
  $.ajax({
      type: "GET",
      url: `http://localhost:8080/api/products/search?keyword=${keyword}&page=${currentPage}&size=${pageSize}`,
      success: function (data) {
          if (currentPage === 0) {
              $("#display-list").find("tr:gt(0)").remove(); 
          }
          let content = "";
          data.content.forEach((product) => {
              const colors = product.colors && product.colors.length > 0 ? product.colors.map(color => color.colorName).join(", ") : "";
              const sizes = product.sizes && product.sizes.length > 0 ? product.sizes.map(size => size.sizeName).join(", ") : "";
              const subCategory = product.subCategory ? product.subCategory.name : "";

              content += `<tr>
                              <td>${product.name}</td>
                              <td>${product.price}</td>
                              <td>${product.description}</td>
                              <td>${product.quantity}</td>
                              <td>${colors}</td>
                              <td>${sizes}</td>
                              <td>${subCategory}</td>
                          </tr>`;
          });
          $("#display-list").append(content);
          currentPage++;

          if (currentPage >= data.totalPages) {
              $("#load-more").hide(); 
          } else {
              $("#load-more").show(); 
          }
      },
      error: function (xhr, status, error) {
          console.error("Error while fetching products:", error);
      }
  });
}

function loadProductsSortedBySubCategory() {
  $.ajax({
      type: "GET",
      url: `http://localhost:8080/api/products/by-subcategory?page=${currentPage}&size=${pageSize}`,
      success: function (data) {
          if (currentPage === 0) {
              $("#display-list").find("tr:gt(0)").remove();
          }
          let content = "";
          data.content.forEach((product) => {
              const colors = product.colors && product.colors.length > 0 ? product.colors.map(color => color.colorName).join(", ") : "";
              const sizes = product.sizes && product.sizes.length > 0 ? product.sizes.map(size => size.sizeName).join(", ") : "";
              const subCategory = product.subCategory ? product.subCategory.name : "";
              
              content += `<tr>
                              <td>${product.name}</td>
                              <td>${product.price}</td>
                              <td>${product.description}</td>
                              <td>${product.quantity}</td>
                              <td>${colors}</td>
                              <td>${sizes}</td>
                              <td>${subCategory}</td>
                          </tr>`;
          });
          $("#display-list").append(content);
          currentPage++;
          if (currentPage >= data.totalPages) {
              $("#load-more").hide();
          } else {
              $("#load-more").show();
          }
      },
      error: function (xhr, status, error) {
          console.error("Error while fetching products:", error);
      }
  });
}

function loadMore() {
  loadProductsSortedBySubCategory();
}

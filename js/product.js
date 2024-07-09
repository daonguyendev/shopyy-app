
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
      },
      error: function (xhr, status, error) {
          console.error("Error while fetching products:", error);
      }
  });
}

function getProduct(product) {
    const colors = product.colors && product.colors.length > 0 ? product.colors.map(color => color.colorName).join(", ") : "";
    const sizes = product.sizes && product.sizes.length > 0 ? product.sizes.map(size => size.sizeName).join(", ") : "";
    const subCategory = product.subCategory ? product.subCategory.name : "";

    return `<tr>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td>${product.description}</td>
                <td>${product.quantity}</td>
                <td><img src="${product.avatar}" width="100"></td>
                <td>${colors}</td>
                <td>${sizes}</td>
                <td>${subCategory}</td>
                <td><button class="deleteProduct" onclick="deleteProduct(${product.id})">Delete</button></td>
                <td><button type="button" data-toggle="modal" data-target="#exampleModalLong" onclick='showFormUpdate(${product.id})'>Update</button></td>
                <td><button type="button" onclick='view(${product.id})'>Views</button></td>
            </tr>`;
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

$(document).ready(function () {
    productHome();
  });
  
  
  
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
      },
    });
  }
  
  function getProduct(product) {
    return `<tr>
                  <td >${product.name}</td>
                  <td>${product.price}</td>
                  <td class="d-flex col-5 justify-content-center btn btn-outline-primary"><img src="${product.img}" width="100"></td>
                    <td><button class="d-flex col-5 align-items-center btn btn-outline-secondary" onclick="deleteProduct(${product.id})">BUY</button></td>
                    <td><button class="d-flex col-5 align-items-center btn btn-outline-secondary" onclick="getProductDetail(${product.id})">SEE DETAILS</button></td>
              </tr>`;
  }
  

  function createProductRow(product) {
    return `<tr>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td class="d-flex col-5 justify-content-center"><img src="${product.img}" width="100"></td>
                <td><button class="d-flex col-5 align-items-center btn btn-outline-secondary" onclick="deleteProduct(${product.id})">BUY</button></td>
                <td><button class="d-flex col-5 align-items-center btn btn-outline-secondary" onclick="getProductDetail(${product.id})">SEE DETAILS</button></td>
            </tr>`;
}
  function handleSearch() {
    const query = $("#search-input").val();
    $.ajax({
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "GET",
      url: `http://localhost:8080/api/products/search?keyword=${query}`,
      success: function (data) {
        const table = $("#display-list");
        table.find("tr:gt(0)").remove();
        data.content.forEach((product) => {
          const row = `<tr>
                    <td>${product.name}</td>
                    <td>${product.price}</td>
                    <td class="d-flex col-5 justify-content-center btn btn-outline-primary"><img src="${product.image}" alt="Product Image" style="width: 50px; height: 50px;"></td>
                    <td><button class="d-flex col-5 align-items-center btn btn-outline-secondary" onclick="deleteProduct(${product.id})">BUY</button></td>
                    <td><button class="d-flex col-5 align-items-center btn btn-outline-secondary" onclick="getProductDetail(${product.id})">SEE DETAILS</button></td>
                </tr>`;
          table.append(row);
        });
      },
      error: function (xhr, status, error) {
        console.error(xhr.responseText);
      },
    });
  }
  

function arrangePrice(order) {
    console.log(order);
    $.ajax({
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        method: "GET",
        url: `http://localhost:8080/api/products/price?value=${order}`,
        success: function (data) {
          const table = $("#display-list");
          table.find("tr:gt(0)").remove();
          data.content.forEach((product) => {
            const row = `<tr>
                      <td>${product.name}</td>
                      <td>${product.price}</td>
                      <td class="d-flex col-5 justify-content-center btn btn-outline-primary"><img src="${product.image}" alt="Product Image" style="width: 50px; height: 50px;"></td>
                      <td><button class="d-flex col-5 align-items-center btn btn-outline-secondary" onclick="deleteProduct(${product.id})">BUY</button></td>
                      <td><button class="d-flex col-5 align-items-center btn btn-outline-secondary" onclick="getProductDetail(${product.id})">SEE DETAILS</button></td>
                  </tr>`;
            table.append(row);
          });
        },
        error: function (error) {
            console.error('Error fetching products:', error);
        }
    });
}

function getProductDetail(id) {
  localStorage.setItem("productId", id);
  window.location.href = "http://127.0.0.1:5500/html/product-detail.html";
}
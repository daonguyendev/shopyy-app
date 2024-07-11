let currentPage = 0;
const pageSize = 5;

async function successHandler() {
  try {
    const data = await $.ajax({
      type: "GET",
      url: "http://localhost:8080/api/category",
    });
    categoryHome();
  } catch (error) {
    console.error("Error while fetching categories:", error);
  }
}

function categoryHome(search = "") {
  $.ajax({
    type: "GET",
    url: `http://localhost:8080/api/category?page=${currentPage}&size=${pageSize}&search=${search}`,
    success: function (data) {
      let content = "";
      data.content.forEach((category) => {
        content += getCategory(category);
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
      console.error("Error while fetching categories:", error);
    },
  });
}

function getCategory(category) {
  return `<tr>
                <td>${category.name}</td>
                <td><button class="d-flex col-5 justify-content-end btn btn-outline-success" class="deleteCategory" onclick="deleteCategory(${category.id})">Delete</button></td>
                <td><button class="d-flex col-5 justify-content-around btn btn-outline-warning" type="button" data-toggle="modal" data-target="#exampleModalLong" onclick='showFormUpdate(${category.id})'>Update</button></td>
            </tr>`;
}

$(document).ready(function () {
  categoryHome();

  $("#search-button").click(function () {
    currentPage = 0;
    $("#display-list").find("tr:gt(0)").remove();
    categoryHome($("#search-input").val());
  });
  checkFormCreate();

});


function deleteCategory(id) {
  $.ajax({
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    type: "DELETE",
    url: `http://localhost:8080/api/category/${id}`,
    success: function () {
      $(`#category-${id}`).remove();
      location.reload();
      alert("The category has been successfully deleted");
    },
  });
}


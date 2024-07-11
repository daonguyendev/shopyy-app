$(document).ready(function () {
    subCategoryHome();
    loadCategory();
    loadCategorys();
  $("#search-button").click(function () {
    currentPage = 0;
    $("#display-list").find("tr:gt(0)").remove();
    subCategoryHome($("#search-input").val());
  });
  checkFormCreate();

});


let currentPage = 0;
const pageSize = 5;

async function successHandler() {
  try {
    const data = await $.ajax({
      type: "GET",
      url: "http://localhost:8080/api/subCategory",
    });
    subCategoryHome();
  } catch (error) {
    console.error("Error while fetching sub categories:", error);
  }
}

function subCategoryHome(search = "") {
  $.ajax({
    type: "GET",
    url: `http://localhost:8080/api/subCategory?page=${currentPage}&size=${pageSize}&search=${search}`,
    success: function (data) {
      let content = "";
      data.content.forEach((subCategory) => {
        content += getSubCategory(subCategory);
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

function getSubCategory(subCategory) {
  return `<tr>
                <td>${subCategory.name}</td>
                <td><button class="d-flex col-5 justify-content-end btn btn-outline-success" class="deleteSubCategory" onclick="deleteSubCategory(${subCategory.id})">Delete</button></td>
                <td><button class="d-flex col-5 justify-content-around btn btn-outline-warning" type="button" data-toggle="modal" data-target="#exampleModalLong" onclick='showFormUpdate(${subCategory.id})'>Update</button></td>
            </tr>`;
}



function deleteSubCategory(id) {
    $.ajax({
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        type: "DELETE",
        url: `http://localhost:8080/api/subCategory/${id}`, 
        success: function () {
            $(`#subCategory-${id}`).remove(); 
            alert("The subcategory has been successfully deleted");
            location.reload();
        },
        error: function (xhr, status, error) {
            console.error(xhr.responseText);
            alert("An error occurred while trying to delete the subcategory");
        },
    });
}

function loadCategory() {
    $.ajax({
      url: `http://localhost:8080/api/category`, 
      type: "GET",
      crossDomain: true,
      contentType: "application/json",
      dataType: "json",
      success: function (response) {
        localStorage.setItem("category", JSON.stringify(response?.content));
        response?.content?.forEach((category) => {
          select.append(new Option(category.name, category.id));
        });
      },
      error: (e) => {
        console.log(e);
      },
    });
  }


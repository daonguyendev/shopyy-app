$(document).ready(() => {
    $("#exampleModalLong").on("show.bs.modal", function(event) {
        const button = $(event.relatedTarget);
        const subCategoryId = button.data("id");
        if (subCategoryId) {
            showFormUpdate(subCategoryId);
        }
    });
});

function getDataAddNewCategory() {
    $("#exampleModalLong").modal("show");
    loadCategory();
  }

function loadCategorys() {
    $.ajax({
      url: `http://localhost:8080/api/category`,
      type: "GET",
      crossDomain: true,
      contentType: "application/json",
      dataType: "json",
      success: function (response) {
        console.log("Phản hồi từ API Category:", response);
        localStorage.setItem("Categories", JSON.stringify(response?.content));
        console.log("nhảy vào Category");
        console.log(response);
  
        if (localStorage.getItem("category") != null) {
          let category = JSON.parse(localStorage.getItem("category"));
          let select = $("#category");
          select.empty();
          category?.forEach((category) => {
            select.append(new Option(category.name, category.id));
          });
        }
      },
      error: (e) => {
        console.log(e);
      },
    });
  }

function showFormUpdate(subCategoryId) {
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/api/subCategory/${subCategoryId}`,
        success: function(subCategory) {
            $("#subCategoryId").val(subCategory.id);
            $("#updateName").val(subCategory.name);
            $("#category").val(subCategory.category.id);
            loadCategories();
        },
        error: function(xhr, status, error) {
            console.error("Error while fetching subcategory:", error);
        },
    });
}

function validateInput() {
    const name = $("#updateName").val();
    const nameError = $("#name_error");

    if (!name || name.trim() === "") {
        nameError.text("Please enter a subcategory name");
        return false;
    } else {
        nameError.text("");
        return true;
    }
}

function updateCategory() {
    if (!validateInput()) {
        return;
    }

    const id = $("#subCategoryId").val();
    const name = $("#updateName").val();
    const categoryId = $("#category").val();

    const formData = {
        'id': id,
        'name': name,
        'category': categoryId
    };
    console.log(formData);

    $.ajax({
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        type: "PUT",
        url: `http://localhost:8080/api/subCategory`,
        data: JSON.stringify(formData),
        success: function(res) {
            $("#exampleModalLong").modal('hide');
            alert(res?.message);
            location.reload();
        },
        error: function(xhr, status, error) {
            console.error(xhr.responseText);
        },
    });
}

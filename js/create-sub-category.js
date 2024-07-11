$(document).ready(() => {
    $("#exampleModal").on("show.bs.modal", getDataAddNewCategory);
  });
  

function getDataAddNewCategory() {
    $("#exampleModal").modal("show");
    loadCategory();
  }


  function loadCategory() {
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


  function addnewSubCategory() {
    const name = $("#createSubCategory").val();
    const categoryId = $("#category").val(); 
    const nameError = $("#name_error");
    const categoryError = $("#category_error");

    if (!name || name.trim() === "") {
        nameError.text("Please enter a subcategory name");
        return;
    } else {
        nameError.text("");
    }

    if (!categoryId || categoryId.trim() === "") {
        categoryError.text("Please select a category");
        return;
    } else {
        categoryError.text("");
    }

    const formData = {
        name: name,
        category: categoryId
    };
    console.log(formData);

    $.ajax({
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        type: "POST",
        url: "http://localhost:8080/api/subCategory",
        data: JSON.stringify(formData),
        success: function (res) {
            $("#exampleModal").click();
            alert(res?.message);
            location.reload();
        },
        error: function (xhr, status, error) {
            console.error(xhr.responseText);
        },
    });
}
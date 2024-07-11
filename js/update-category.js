function showFormUpdate(categoryId) {
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/api/category/${categoryId}`,
        success: function (category) {
            $("#category-id").val(category.id);
            $("#update-name").val(category.name);
            $("#exampleModalLong").modal('show');
            checkFormUpdate(); // Call checkFormUpdate() here
        },
        error: function (xhr, status, error) {
            console.error("Error while fetching category:", error);
        },
    });
}

function validateInput() {
    const name = $("#update-category").val();
    const nameError = $("#name_error");
  
    if (!name || name.trim() === "") {
      nameError.text("Please enter a category name");
      return false;
    } else {
      nameError.text("");
      return true;
    }
  }

function checkFormUpdate() {
    const updateCategory = document.getElementById("updateCategory");
    console.log(updateCategory);

    const name_error = document.getElementById("name_error");

    updateCategory.addEventListener("submit", (e) => {
        e.preventDefault(); 
        let valid = true;

        const name = document.getElementById("update-name");

        if (name.value.trim() === "") {
            valid = false;
            name_error.innerHTML = "Name cannot be blank";
        } else {
            name_error.innerHTML = "";
        }

        if (valid) {
            updateCategory();
        }
    });
}

function updateCategory() {
    const id = $("#category-id").val();
    const name = $("#update-name").val();

    const formData = {
        'id': id,
        'name': name
    };
    console.log(formData);

    $.ajax({
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        type: "PUT",
        url: `http://localhost:8080/api/category`,
        data: JSON.stringify(formData),
        success: function (res) {
            $("#exampleModalLong").click();
            alert(res?.message);
            location.reload();
        },
        error: function (xhr, status, error) {
            console.error(xhr.responseText);
        },
    });
}
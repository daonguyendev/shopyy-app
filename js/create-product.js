

$(document).ready(() => {
  $("#exampleModal").on("show.bs.modal", getDataAddNewProduct);
  checkFormCreate();
});

function getDataAddNewProduct() {
  $("#exampleModal").modal("show");
  loadColor();
  loadSize();
  loadSubCategorie();
}

function loadSubCategorie() {
  $.ajax({
    url: `http://localhost:8080/api/subCategory`,
    type: "GET",
    crossDomain: true,
    contentType: "application/json",
    dataType: "json",
    success: function (response) {
      console.log("Phản hồi từ API subCategory:", response);
      localStorage.setItem("subCategories", JSON.stringify(response?.content));
      console.log("nhảy vào subCategory");
      console.log(response);

      if (localStorage.getItem("subCategories") != null) {
        let subCategories = JSON.parse(localStorage.getItem("subCategories"));
        let select = $("#create-sub-category");
        select.empty();
        subCategories?.forEach((subCategory) => {
          select.append(new Option(subCategory.name, subCategory.id));
        });
      }
    },
    error: (e) => {
      console.log(e);
    },
  });
}

function loadColor() {
  $.ajax({
    url: `http://localhost:8080/api/colors`,
    type: "GET",
    crossDomain: true,
    contentType: "application/json",
    dataType: "json",
    success: function (response) {
      localStorage.setItem("colors", JSON.stringify(response));

      if (localStorage.getItem("colors") != null) {
        let colors = JSON.parse(localStorage.getItem("colors"));
        let select = $("#create-color");
        select.empty();
        colors?.forEach((color) => {
          select.append(new Option(color.colorName, color.id));
        });
      }
    },
    error: (e) => {
      console.log(e);
    },
  });
}

function loadSize() {
  $.ajax({
    url: `http://localhost:8080/api/sizes`,
    type: "GET",
    crossDomain: true,
    contentType: "application/json",
    dataType: "json",
    success: function (response) {
      localStorage.setItem("sizes", JSON.stringify(response));

      if (localStorage.getItem("sizes") != null) {
        let sizes = JSON.parse(localStorage.getItem("sizes"));
        let select = $("#create-size");
        select.empty();
        sizes?.forEach((size) => {
          select.append(new Option(size.sizeName, size.id));
        });
      }
    },
    error: (e) => {
      console.log(e);
    },
  });
}

function checkFormCreate() {
  const addProduct = document.getElementById("addProduct");
  const name = document.getElementById("create-name");
  const price = document.getElementById("create-price");
  const description = document.getElementById("create-description");
  const quantity = document.getElementById("create-quantity");
  const image = document.getElementById("create-image");
  const color = document.getElementById("create-color");
  const size = document.getElementById("create-size");
  const sub = document.getElementById("create-sub-category");

  const name_error = document.getElementById("name_error");
  const price_error = document.getElementById("price_error");
  const description_error = document.getElementById("description_error");
  const quantity_error = document.getElementById("quantity_error");
  const image_error = document.getElementById("image_error");
  const color_error = document.getElementById("color_error");
  const size_error = document.getElementById("size_error");
  const sub_error = document.getElementById("sub_error");

  addProduct.addEventListener("submit", (e) => {
    e.preventDefault(); // Ngăn chặn hành động mặc định của form
    let valid = true;

    if (name.value.trim() === "") {
      valid = false;
      name_error.innerHTML = "Name cannot be blank";
    } else {
      name_error.innerHTML = "";
    }

    if (price.value.trim() === "") {
      valid = false;
      price_error.innerHTML = "Price cannot be blank";
    } else if (isNaN(price.value) || Number(price.value) <= 0) {
      valid = false;
      price_error.innerHTML = "Price must be a positive number";
    } else {
      price_error.innerHTML = "";
    }

    if (description.value.trim() === "") {
      valid = false;
      description_error.innerHTML = "Description cannot be blank";
    } else {
      description_error.innerHTML = "";
    }

    if (quantity.value.trim() === "") {
      valid = false;
      quantity_error.innerHTML = "Quantity cannot be blank";
    } else {
      quantity_error.innerHTML = "";
    }

    if (image.value.trim() === "") {
      valid = false;
      image_error.innerHTML = "Image cannot be blank";
    } else {
      image_error.innerHTML = "";
    }

    if (color.value.trim() === "") {
      valid = false;
      color_error.innerHTML = "Color cannot be blank";
    } else {
      color_error.innerHTML = "";
    }

    if (size.value.trim() === "") {
      valid = false;
      size_error.innerHTML = "Size cannot be blank";
    } else {
      size_error.innerHTML = "";
    }

    if (sub.value.trim() === "") {
      valid = false;
      sub_error.innerHTML = "Sub Category cannot be blank";
    } else {
      sub_error.innerHTML = "";
    }

    if (valid) {
      addnewProduct();
    }
  });
}




function addnewProduct() {
  if (checkFormCreate) {

      const name = $("#create-name").val();
      const price = $("#create-price").val();
      const description = $("#create-description").val();
      const quantity = $("#create-quantity").val();
      // const image = $("#create-image")[0].files[0]
      const image = JSON.parse(localStorage.getItem("tempImage"));

      const color = $("#create-color").val();
      const size = $("#create-size").val();
      const subCategory = $("#create-sub-category").val();

      const formData = {
        name: name,
        price: price,
        description: description,
        quantity: quantity,
        image: image,
        color: color,
        size: size,
        subCategory: subCategory,
      };
      console.log(formData);

      $.ajax({
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        type: "POST",
        url: "http://localhost:8080/api/products",
        data: JSON.stringify(formData),        
        success: function (res) {
          $("#exampleModal").click();
          alert(res?.message);
          location.reload();
        },
        error: function (xhr, status, error) {
          console.error(xhr.responseText, "lỗi gì");
        },
      });
  }
}



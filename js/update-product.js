$(document).ready(() => {
  $("#exampleModalLong").on("show.bs.modal", getDataUpdateProduct);
  checkFormUpdate();
});

function getDataUpdateProduct() {
  $("#exampleModalLong").modal("show");
  loadColors();
  loadSizes();
  loadSubCategories();
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

      if (localStorage.getItem("subCategories") != null) {
        let subCategories = JSON.parse(localStorage.getItem("subCategories"));
        let select = $("#update-sub-category");
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

function loadColors() {
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
        let select = $("#update-color");
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

function loadSizes() {
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
        let select = $("#update-size");
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

function checkFormUpdate() {
  const updateProduct = document.getElementById("updateProduct");
  const name = document.getElementById("update-name");
  const price = document.getElementById("update-price");
  const description = document.getElementById("update-description");
  const quantity = document.getElementById("update-quantity");
  const image = document.getElementById("update-image");
  const color = document.getElementById("update-color");
  const size = document.getElementById("update-size");
  const sub = document.getElementById("update-sub-category");

  const name_error = document.getElementById("name_error");
  const price_error = document.getElementById("price_error");
  const description_error = document.getElementById("description_error");
  const quantity_error = document.getElementById("quantity_error");
  const image_error = document.getElementById("image_error");
  const color_error = document.getElementById("color_error");
  const size_error = document.getElementById("size_error");
  const sub_error = document.getElementById("sub_error");

  updateProduct.addEventListener("submit", (e) => {
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
      updateProduct();
    }
  });
}

function updateProduct() {
  if (checkFormUpdate) {
    let tempImage = localStorage.getItem("tempImage");
    let formData = null;
    if (tempImage) {
      const id = $("#product-id").val();
      const name = $("#update-name").val();
      const price = $("#update-price").val();
      const description = $("#update-description").val();
      const quantity = $("#update-quantity").val();
      const image = JSON.parse(tempImage);
      const color = $("#update-color").val();
      const size = $("#update-size").val();
      const subCategory = $("#update-sub-category").val();

      formData = {
        'id': id,
        'name': name,
        'price': price,
        'description': description,
        'quantity': quantity,
        'image': image,
        'color': color,
        'size': size,
        'subCategory': subCategory,
      }
    }
    console.log(formData);

    $.ajax({
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      type: "PUT",
      url: "http://localhost:8080/api/products",
      data: JSON.stringify(formData),
      success: function (res) {
        $("#exampleModalLong").click();
        alert(res?.message);
        window.location.href = "http://127.0.0.1:5500/html/product.html";
        localStorage.removeItem("tempImage");
      },
      error: function (xhr, status, error) {
        console.error(xhr.responseText);
      },
    });
  } else {
    alert("No image found in localStorage");
  }
}

function showFormUpdate(id) {
  console.log("asd,", id);

  $.ajax({
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    type: "GET",
    url: `http://localhost:8080/api/products`,
    success: function (res) {
      $("#exampleModalLong").click();
      getDataUpdateProduct();
      $("product-id").val(res.id);
      $("#update-name").val(res.name);
      $("#update-price").val(res.price);
      $("#update-description").val(res.description);
      $("#update-quantity").val(res.quantity);
      $("#update-image").val("");
      $("#update-color").val(res.color);
      $("#update-size").val(res.select);
      $("#update-sub-category").val(res.subCategory);
    },
    error: function (error) {
      console.error("Error searching product:", error);
    },
  });
}

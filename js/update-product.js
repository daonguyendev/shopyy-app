$(document).ready(() => {
  $("#exampleModalLong").on("show.bs.modal", getDataUpdateProduct);
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
          localStorage.setItem("subCategories", JSON.stringify(response.content));

          if (localStorage.getItem("subCategories") != null) {
              let subCategories = JSON.parse(localStorage.getItem("subCategories"));
              let select = $("#update-sub-category");
              select.empty();
              subCategories.forEach((subCategory) => {
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
              colors.forEach((color) => {
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
              sizes.forEach((size) => {
                  select.append(new Option(size.sizeName, size.id));
              });
          }
      },
      error: (e) => {
          console.log(e);
      },
  });
}

function updateProduct() {
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
          id: id,
          name: name,
          price: price,
          description: description,
          quantity: quantity,
          image: image,
          color: color,
          size: size,
          subCategory: subCategory,
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
              alert(res.message);
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
  $.ajax({
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    type: "GET",
    url: `http://localhost:8080/api/products/${id}`,
    success: function (res) {
      console.log(res);
      
      $("#exampleModalLong").modal("show");
      getDataUpdateProduct();
      
      $("#product-id").val(res.id);
      $("#update-name").val(res.name);
      $("#update-price").val(res.price);
      $("#update-description").val(res.description);
      $("#update-quantity").val(res.quantity);
      
      $("#update-color").val(res.color.id);
      $("#update-size").val(res.size.id);
      $("#update-sub-category").val(res.subCategory.id);
    },
    error: function (error) {
      console.error("Error searching product:", error);
    },
  });
}
function addnewCategory() {
  const name = $("#create-category").val();
  const nameError = $("#name_error");

  if (!name || name.trim() === "") {
    nameError.text("Please enter a category name");
    return;
  } else {
    nameError.text("");
  }

  const formData = {
    name: name,
  };
  console.log(formData);

  $.ajax({
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    type: "POST",
    url: "http://localhost:8080/api/category",
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
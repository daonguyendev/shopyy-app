function togglePasswordVisibility() {
    const eyeIcon = document.querySelector(".eye-icon");
    const passwordField = document.getElementById("password");
    const type = passwordField.getAttribute("type") === "password" ? "text" : "password";
    passwordField.setAttribute("type", type)
    eyeIcon.textContent = type === "password" ? "visibility" : "visibility_off";
}

function auth() {
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let user = {
        "username": username,
        "password": password
    }

    $.ajax({
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        method: "POST",
        data: JSON.stringify(user),
        url: "http://localhost:8080/api/auth/login",
        error: function (xhr, status, error) {
            if (xhr.status == 400) {
                Swal.fire({
                    title: 'Login Failed',
                    text: 'Invalid auth information. Please check again!',
                    icon: 'warning',
                    confirmButtonText: 'OK',
                });
            }
        },
        success: function (data) {
            console.log(data)
            localStorage.setItem("token", JSON.stringify(data));
            localStorage.setItem("username", username);
            updateNavLinks();
            // window.location.href = "product.html"
        }
    });
}

function updateNavLinks() {
    const username = localStorage.getItem("username");

    if (username) {
        $('#auth-link').hide();
        $('#logout-link').show();
        $('#user-info').html(`<span> ${username}</span> <button onclick="logout()">Logout</button>`);
    } else {
        $('#auth-link').show();
        $('#logout-link').hide();
        $('#user-info').html('<a href="/auth.html">Login</a>');
    }
}

$(document).ready(function () {
    updateNavLinks();
});

function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    updateNavLinks();
    window.location.href = "auth.html";
}

//Register

$(document).ready(() => {
    $("#exampleModal").on("show.bs.modal", getDataRegister);

    $("#register").on("submit", (e) => {
        e.preventDefault();
        checkFormRegister();
    });
});

function getDataRegister() {
    $("#exampleModal").modal("show");
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function isDateInPast(dateString) {
    const today = new Date();
    const dob = new Date(dateString);
    return dob < today;
}

function checkFormRegister() {
    const register = document.getElementById("register");
    const name = document.getElementById("create-name");
    const username = document.getElementById("create-username");
    const password = document.getElementById("create-password");
    const email = document.getElementById("create-email");
    const phone = document.getElementById("create-phone");
    const gender = document.getElementById("create-gender");
    const dob = document.getElementById("create-dob");
    const avatar = document.getElementById("create-avatar");

    const name_error = document.getElementById("name_error");
    const username_error = document.getElementById("username_error");
    const password_error = document.getElementById("password");
    const email_error = document.getElementById("email_error");
    const phone_error = document.getElementById("phone_error");
    const dob_error = document.getElementById("dob_error");
    const avatar_error = document.getElementById("avatar_error");

    // register.addEventListener("submit", (e) => {
    //     e.preventDefault();
        let valid = true;

        if (name.value.trim() === "") {
            valid = false;
            name_error.innerHTML = "Full Name cannot be blank";
        } else if (!/^[a-zA-Z ]+$/.test(name.value.trim())) {
            valid = false;
            name_error.innerHTML = "Full Name cannot contain numbers or special characters";
        } else {
            name_error.innerHTML = "";
        }

        if (username.value.trim() === "") {
            valid = false;
            username_error.innerHTML = "Username cannot be blank";
        } else {

        }

        if (password.value.trim() === "") {
            valid = false;
            password_error.innerHTML = "Password cannot be blank";
        } else {
            if (!/^[a-zA-Z0-9]+$/.test(password.value.trim())) {
                valid = false;
                password_error.innerHTML = "Password cannot contain special characters";
            } else {
                password_error.innerHTML = "";
            }
        }

        if (email.value.trim() === "") {
            valid = false;
            email_error.innerHTML = "Email cannot be blank";
        } else if (!isValidEmail(email.value.trim())) {
            valid = false;
            email_error.innerHTML = "Invalid email format";
        } else {
            email_error.innerHTML = "";
        }

        if (phone.value.trim() === "") {
            valid = false;
            phone_error.innerHTML = "Phone cannot be blank";
        } else if (!phone.value.trim().startsWith('0')) {
            valid = false;
            phone_error.innerHTML = "Phone number must start with 0";
        } else if (!phone.value.trim().match(/^\d{10}$/)) {
            valid = false;
            phone_error.innerHTML = "Phone number must be 10 digits";
        } else {
            phone_error.innerHTML = "";
        }

        if (dob.value.trim() === "") {
            valid = false;
            dob_error.innerHTML = "Date of Birth cannot be blank";
        } else if (!isDateInPast(dob.value.trim())) {
            valid = false;
            dob_error.innerHTML = "Date of Birth must be in the past";
        } else {
            dob_error.innerHTML = "";
        }

        if (avatar.value.trim() === "") {
            valid = false;
            avatar_error.innerHTML = "Avatar cannot be blank";
        } else {
            avatar_error.innerHTML = "";
        }

        if (valid) {
            register();
        }
    // });
}

function register() {
    if (checkFormRegister()) {
        const name = $("#create-name").val();
        const username = $("#create-username").val();
        const password = $("#create-password").val();
        const email = $("#create-email").val();
        const phone = $("#create-phone").val();
        const gender = $("#create-gender").val();
        const dob = $("#create-dob").val();
        const avatar = $("#create-avatar")[0].files[0];

        const formData = {
            fullName: name,
            username: username,
            password: password,
            email: email,
            phoneNumber: phone,
            gender: gender,
            dob: dob,
            avatar: avatar,
        };
        console.log(formData);

        $.ajax({
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            type: "POST",
            url: "http://localhost:8080/api/auth/register",
            data: JSON.stringify(formData),
            success: function (res) {
                $("#exampleModal").modal("hide");
                Swal.fire({
                    title: 'Thành công!',
                    text: res.message,
                    icon: 'success',
                    confirmButtonText: 'OK'
                }).then((result) => {
                    if (result.isConfirmed) {
                        location.reload();
                    }
                });
            },
            error: function (xhr, status, error) {
                console.error(xhr.responseText, "Lỗi khi đăng ký");
                Swal.fire({
                    title: 'Lỗi!',
                    text: 'Đã xảy ra lỗi khi đăng ký.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            },
        });
    }
}
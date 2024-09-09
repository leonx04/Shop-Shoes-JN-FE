function switchToRegister() {
    document.querySelector('.login-form').style.display = 'none';
    document.querySelector('.register-form').style.display = 'block';
    document.title = 'Register - Shop Shoes JN';  // Thay đổi tiêu đề tab thành Register
}

function switchToLogin() {
    document.querySelector('.register-form').style.display = 'none';
    document.querySelector('.login-form').style.display = 'block';
    document.title = 'Login - Shop Shoes JN';  // Thay đổi tiêu đề tab thành Login
}

function clearErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(errorElement => errorElement.textContent = '');
}

function validateRegisterForm() {
    let valid = true;
    clearErrors();

    // Validate register form fields
    const name = document.getElementById('registerName').value.trim();
    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value.trim();
    const email = document.getElementById('registerEmail').value.trim();

    if (name === '') {
        valid = false;
        document.getElementById('registerNameError').textContent = 'Name chưa được nhập dữ liệu.';
    }
    if (username === '') {
        valid = false;
        document.getElementById('registerUsernameError').textContent = 'Username chưa được nhập dữ liệu.';
    }
    if (password === '') {
        valid = false;
        document.getElementById('registerPasswordError').textContent = 'Password chưa được nhập dữ liệu.';
    }
    if (email === '') {
        valid = false;
        document.getElementById('registerEmailError').textContent = 'Email chưa được nhập dữ liệu.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
        valid = false;
        document.getElementById('registerEmailError').textContent = 'Email sai định dạng.';
    }

    return valid;
}

function validateLoginForm() {
    let valid = true;
    clearErrors();

    // Validate login form fields
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value.trim();

    if (username === '') {
        valid = false;
        document.getElementById('loginUsernameError').textContent = 'Username chưa được nhập dữ liệu.';
    }
    if (password === '') {
        valid = false;
        document.getElementById('loginPasswordError').textContent = 'Password chưa được nhập dữ liệu.';
    }

    return valid;
}

function register() {
    if (!validateRegisterForm()) {
        return;
    }

    const name = document.getElementById('registerName').value;
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const email = document.getElementById('registerEmail').value;

    axios.post('http://localhost:8080/api/register', {
        name: name,
        username: username,
        password: password,
        email: email
    })
        .then(function (response) {
            document.getElementById('successMessage').innerText = 'Đăng ký tài khoản mới thành công!';
            $('#successModal').modal('show');
            switchToLogin();
        })
        .catch(function (error) {
            document.getElementById('errorMessage').innerText = 'Đăng ký tài khoản mới thất bại : ' + (error.response ? error.response.data : error.message);
            $('#errorModal').modal('show');
        });
}

function login() {
    if (!validateLoginForm()) {
        return;
    }

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    axios.post('http://localhost:8080/api/login', {
        username: username,
        password: password
    })
        .then(function (response) {
            alert('Đăng nhập thành công !');
            window.location.href = "http://127.0.0.1:5500/index.html";
        })
        .catch(function (error) {
            document.getElementById('loginErrorMessage').innerText = 'Đăng nhập thất bại : ' + (error.response ? error.response.data : error.message);
            $('#loginErrorModal').modal('show');
        });
}
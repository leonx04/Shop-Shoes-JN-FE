// DOM elements for the forms and spinner
const loginForm = document.querySelector('.login-form');
const registerForm = document.querySelector('.register-form');
const loadingSpinner = document.getElementById('loadingSpinner');

// Toggle between login and register forms
function switchToRegister() {
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    document.title = 'Register - Shop Shoes JN';
}

function switchToLogin() {
    registerForm.style.display = 'none';
    loginForm.style.display = 'block';
    document.title = 'Login - Shop Shoes JN';
}

// Clear error messages
function clearErrors() {
    document.querySelectorAll('.error-message').forEach(errorElement => {
        errorElement.textContent = '';
    });
}

// Validate the registration form
function validateRegisterForm() {
    let valid = true;
    clearErrors();

    const name = document.getElementById('registerName').value.trim();
    const username = document.getElementById('registerUsername').value.trim();
    const password = document.getElementById('registerPassword').value.trim();
    const email = document.getElementById('registerEmail').value.trim();

    const passwordPattern = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

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
    } else if (!passwordPattern.test(password)) {
        valid = false;
        document.getElementById('registerPasswordError').textContent = 'Password phải có cả chữ và số, tối thiểu 8 ký tự.';
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

// Validate the login form
function validateLoginForm() {
    let valid = true;
    clearErrors();

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

// Show and hide loading spinner
function showLoading() {
    loadingSpinner.classList.remove('d-none');
}

function hideLoading() {
    loadingSpinner.classList.add('d-none');
}

// Register user
function register() {
    if (!validateRegisterForm()) {
        return;
    }

    const name = document.getElementById('registerName').value;
    const username = document.getElementById('registerUsername').value;
    const password = document.getElementById('registerPassword').value;
    const email = document.getElementById('registerEmail').value;

    showLoading();
    axios.post('http://localhost:8080/api/register', {
        name, username, password, email
    })
        .then(function (response) {
            document.getElementById('successMessage').innerText = 'Đăng ký tài khoản mới thành công!';
            $('#successModal').modal('show');
            switchToLogin();
        })
        .catch(function (error) {
            document.getElementById('errorMessage').innerText = 'Đăng ký tài khoản mới thất bại: ' + (error.response ? error.response.data : error.message);
            $('#errorModal').modal('show');
        })
        .finally(function () {
            hideLoading();
        });
}

// Login user
function login() {
    if (!validateLoginForm()) {
        return;
    }

    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    showLoading();
    axios.post('http://localhost:8080/api/login', {
        username, password
    })
        .then(function (response) {
            window.location.href = "http://127.0.0.1:5500/index.html";
        })
        .catch(function (error) {
            document.getElementById('loginErrorMessage').innerText = 'Đăng nhập thất bại: ' + (error.response ? error.response.data : error.message);
            $('#loginErrorModal').modal('show');
        })
        .finally(function () {
            hideLoading();
        });
}

// Toggle password visibility
document.querySelectorAll('.toggle-password').forEach(icon => {
    icon.addEventListener('click', function () {
        const input = document.querySelector(this.getAttribute('toggle'));
        const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
        input.setAttribute('type', type);
        this.classList.toggle('fa-eye-slash');
    });
});

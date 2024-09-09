const API_BASE_URL = 'http://localhost:8080/api/auth';
let userEmail = '';
let otpCountdown;
let otpExpirationTime;

// DOM elements
const requestOtpForm = document.getElementById('requestOtpForm');
const verifyOtpForm = document.getElementById('verifyOtpForm');
const resetPasswordForm = document.getElementById('resetPasswordForm');
const otpStatus = document.getElementById('otpStatus');
const resendOtpButton = document.getElementById('resendOtp');
const alertModal = new bootstrap.Modal(document.getElementById('alertModal'));
const modalMessage = document.getElementById('modalMessage');
const formTitle = document.getElementById('formTitle');

// Lấy DOM element cho spinner loading
const loadingSpinner = document.getElementById('loadingSpinner');

// Function to update page title and form title
function updateTitle(title) {
    document.title = title;
    if (formTitle) {
        formTitle.textContent = title;
    }
}

// Show modal alert
function showAlert(message) {
    modalMessage.textContent = message;
    alertModal.show();
}

// Hiện spinner loading
function showLoading() {
    loadingSpinner.classList.remove('d-none');
}

// Ẩn spinner loading
function hideLoading() {
    loadingSpinner.classList.add('d-none');
}

// Validate email
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Validate password
function validatePassword(password) {
    return password.length >= 8;
}

// Start OTP countdown
function startOtpCountdown() {
    let countdown = 50;
    const otpInput = document.getElementById('otp');
    const verifyOtpButton = document.querySelector('#verifyOtpForm button[type="submit"]');

    otpStatus.textContent = `OTP còn hiệu lực trong ${countdown} giây.`;
    resendOtpButton.disabled = true;
    otpInput.disabled = false;
    verifyOtpButton.disabled = false;

    otpCountdown = setInterval(() => {
        countdown--;
        otpStatus.textContent = `OTP còn hiệu lực trong ${countdown} giây.`;

        if (countdown <= 0) {
            clearInterval(otpCountdown);
            otpStatus.textContent = 'OTP đã hết hạn. Vui lòng gửi lại.';
            resendOtpButton.disabled = false;
            otpInput.disabled = true;
            verifyOtpButton.disabled = true;
        }
    }, 1000);

    otpExpirationTime = new Date().getTime() + 50000; // 50 seconds from now
}

// Handle OTP request
async function handleOtpRequest(email) {
    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/forgot-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `email=${encodeURIComponent(email)}`
        });

        if (response.ok) {
            userEmail = email;
            showAlert('Mã OTP đã được gửi đến email của bạn.');
            requestOtpForm.style.display = 'none';
            verifyOtpForm.style.display = 'block';
            updateTitle('Nhập mã OTP');
            startOtpCountdown();
        } else {
            const data = await response.json();
            if (data?.message) {
                showAlert(data.message);
            } else {
                showAlert('Không tìm thấy tài khoản với email này.');
            }
        }
    } catch (error) {
        showAlert('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    } finally {
        hideLoading();
    }
}

requestOtpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();

    if (!validateEmail(email)) {
        showAlert('Vui lòng nhập một địa chỉ email hợp lệ.');
        return;
    }

    await handleOtpRequest(email);
});

verifyOtpForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const otp = document.getElementById('otp').value.trim();

    if (otp.length !== 6 || isNaN(otp)) {
        showAlert('Vui lòng nhập mã OTP 6 chữ số hợp lệ.');
        return;
    }

    if (new Date().getTime() > otpExpirationTime) {
        showAlert('OTP đã hết hạn. Vui lòng yêu cầu mã OTP mới.');
        return;
    }

    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/validate-otp`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `email=${encodeURIComponent(userEmail)}&otp=${encodeURIComponent(otp)}`
        });

        if (response.ok) {
            showAlert('Mã OTP hợp lệ. Vui lòng đặt mật khẩu mới.');
            verifyOtpForm.style.display = 'none';
            resetPasswordForm.style.display = 'block';
            updateTitle('Đặt lại mật khẩu');
            clearInterval(otpCountdown);
        } else {
            throw new Error('Mã OTP không hợp lệ hoặc đã hết hạn.');
        }
    } catch (error) {
        showAlert(error.message);
    } finally {
        hideLoading();
    }
});

resetPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value.trim();
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (!validateEmail(email)) {
        showAlert('Vui lòng nhập một địa chỉ email hợp lệ.');
        return;
    }

    if (!validatePassword(newPassword)) {
        showAlert('Mật khẩu phải có ít nhất 8 ký tự.');
        return;
    }

    if (newPassword !== confirmPassword) {
        showAlert('Mật khẩu xác nhận không khớp.');
        return;
    }

    try {
        showLoading();
        const response = await fetch(`${API_BASE_URL}/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `email=${encodeURIComponent(email)}&newPassword=${encodeURIComponent(newPassword)}`
        });
    
        if (response.ok) {
            const data = await response.json();
            showAlert(data.message);
            document.getElementById('alertModal').addEventListener('hidden.bs.modal', () => {
                window.location.href = 'http://127.0.0.1:5500/app/login/login.html'; 
            });
        } else {
            const data = await response.json();
            showAlert(data.message);
        }
    } catch (error) {
        showAlert('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    } finally {
        hideLoading();
    }
});

resendOtpButton.addEventListener('click', async () => {
    if (new Date().getTime() > otpExpirationTime) {
        await handleOtpRequest(userEmail);
    } else {
        showAlert('Vui lòng chờ đến khi mã OTP hết hạn trước khi yêu cầu mã mới.');
    }
});

// Initialize the page title
updateTitle('Quên mật khẩu');
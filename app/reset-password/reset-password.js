const API_BASE_URL = 'http://localhost:8080/api/auth';
let userEmail = '';
let otpCountdown;

// DOM elements
const requestOtpForm = document.getElementById('requestOtpForm');
const verifyOtpForm = document.getElementById('verifyOtpForm');
const resetPasswordForm = document.getElementById('resetPasswordForm');
const otpStatus = document.getElementById('otpStatus');
const resendOtpButton = document.getElementById('resendOtp');
const alertModal = new bootstrap.Modal(document.getElementById('alertModal'));
const modalMessage = document.getElementById('modalMessage');
const formTitle = document.getElementById('formTitle');

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
    let countdown = 30;
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
}

// Handle OTP request
async function handleOtpRequest(email) {
    try {
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
            throw new Error('Lỗi khi gửi OTP');
        }
    } catch (error) {
        showAlert('Đã xảy ra lỗi. Vui lòng thử lại sau.');
    }
}

// Event listeners
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

    if (document.getElementById('otp').disabled) {
        showAlert('OTP đã hết hạn. Vui lòng yêu cầu mã OTP mới.');
        return;
    }

    try {
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
    }
});

resetPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const otp = document.getElementById('otp').value.trim();
    
    if (!validatePassword(newPassword)) {
        showAlert('Mật khẩu phải có ít nhất 8 ký tự.');
        return;
    }

    if (newPassword !== confirmPassword) {
        showAlert('Mật khẩu xác nhận không khớp.');
        return;
    }

    try {
        const response = await fetch(`${API_BASE_URL}/reset-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `email=${encodeURIComponent(userEmail)}&otp=${encodeURIComponent(otp)}&newPassword=${encodeURIComponent(newPassword)}`
        });

        if (response.ok) {
            showAlert('Mật khẩu đã được đặt lại thành công. Vui lòng đăng nhập bằng mật khẩu mới.');
            document.getElementById('alertModal').addEventListener('hidden.bs.modal', () => {
                window.location.href = 'http://127.0.0.1:5500/app/login/login.html'; 
            });
        } else {
            throw new Error('Không thể đặt lại mật khẩu. Vui lòng thử lại.');
        }
    } catch (error) {
        showAlert(error.message);
    }
});

resendOtpButton.addEventListener('click', async () => {
    const otpInput = document.getElementById('otp');
    const verifyOtpButton = document.querySelector('#verifyOtpForm button[type="submit"]');
    
    otpInput.disabled = false;
    verifyOtpButton.disabled = false;
    otpInput.value = '';
    
    await handleOtpRequest(userEmail);
});

// Initialize the page title
updateTitle('Quên mật khẩu');
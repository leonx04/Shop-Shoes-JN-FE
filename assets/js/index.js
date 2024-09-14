// DOM elements
const loginButton = document.getElementById('loginButton');
const logoutButton = document.getElementById('logoutButton');
const usernameDisplay = document.getElementById('usernameDisplay');

// Function to check if the token is valid (not expired)
function isTokenValid(token) {
    if (!token) return false;
    
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) return false;
    
    const payload = JSON.parse(atob(tokenParts[1]));
    const expirationTime = payload.exp * 1000; // Convert to milliseconds
    return Date.now() < expirationTime;
}

// Function to update UI based on login status
function updateUI(isLoggedIn = '') {
    if (isLoggedIn) {
        loginButton.style.display = 'none';
        logoutButton.style.display = 'block';
    } else {
        loginButton.style.display = 'block';
        logoutButton.style.display = 'none';
        usernameDisplay.style.display = 'none';
    }
}

// Function to check login status
function checkLoginStatus() {
    const token = localStorage.getItem('jwtToken');
    const username = localStorage.getItem('username');
    
    if (token && isTokenValid(token)) {
        updateUI(true);
    } else {
        // If token is invalid or doesn't exist, clear localStorage
        localStorage.removeItem('jwtToken');
        localStorage.removeItem('username');
        updateUI(false);
    }
}

// Function to handle logout
function logout() {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('username');
    updateUI(false);
    // Redirect to home page or login page if needed
    // window.location.href = 'index.html';
}

// Event listener for logout button
logoutButton.addEventListener('click', logout);

// Check login status when the page loads
document.addEventListener('DOMContentLoaded', checkLoginStatus);

// Existing back to top functionality
const backToTopBtn = document.getElementById("backToTopBtn");

window.onscroll = function() {
    scrollFunction();
};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        backToTopBtn.style.display = "block";
    } else {
        backToTopBtn.style.display = "none";
    }
}

backToTopBtn.onclick = function() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
};

// User database (localStorage based)
let users = [];

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
    checkAuth();
    setupPasswordStrength();
});

// Load users from localStorage
function loadUsers() {
    const saved = localStorage.getItem('users');
    if (saved) {
        users = JSON.parse(saved);
    } else {
        // Demo users
        users = [
            {
                id: '1',
                fullname: 'Free User',
                email: 'free@demo.com',
                password: 'demo123',
                isPro: false,
                createdAt: new Date().toISOString()
            },
            {
                id: '2',
                fullname: 'Pro User',
                email: 'pro@demo.com',
                password: 'demo123',
                isPro: true,
                createdAt: new Date().toISOString(),
                proExpiry: 'lifetime'
            }
        ];
        saveUsers();
    }
}

// Save users
function saveUsers() {
    localStorage.setItem('users', JSON.stringify(users));
}

// Handle Login
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember')?.checked || false;
    
    // Show loading
    const loginBtn = document.getElementById('loginBtn');
    const btnText = loginBtn.querySelector('.btn-text');
    const btnLoader = loginBtn.querySelector('.btn-loader');
    btnText.classList.add('hidden');
    btnLoader.classList.remove('hidden');
    loginBtn.disabled = true;
    
    // Simulate API call
    setTimeout(() => {
        // Find user
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            // Login successful
            const session = {
                userId: user.id,
                email: user.email,
                fullname: user.fullname,
                isPro: user.isPro,
                proExpiry: user.proExpiry || null,
                loggedIn: true,
                loginTime: new Date().toISOString()
            };
            
            if (remember) {
                localStorage.setItem('currentUser', JSON.stringify(session));
            } else {
                sessionStorage.setItem('currentUser', JSON.stringify(session));
            }
            
            showNotification('Login successful! Redirecting...', 'success');
            
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 1500);
        } else {
            // Login failed
            btnText.classList.remove('hidden');
            btnLoader.classList.add('hidden');
            loginBtn.disabled = false;
            
            showNotification('Invalid email or password!', 'error');
        }
    }, 1500);
}

// Handle Signup
function handleSignup(event) {
    event.preventDefault();
    
    const fullname = document.getElementById('fullname').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const terms = document.getElementById('terms').checked;
    
    // Validation
    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters!', 'error');
        return;
    }
    
    if (!terms) {
        showNotification('Please accept Terms of Service!', 'error');
        return;
    }
    
    // Check if user exists
    if (users.find(u => u.email === email)) {
        showNotification('Email already registered!', 'error');
        return;
    }
    
    // Show loading
    const signupBtn = document.getElementById('signupBtn');
    const btnText = signupBtn.querySelector('.btn-text');
    const btnLoader = signupBtn.querySelector('.btn-loader');
    btnText.classList.add('hidden');
    btnLoader.classList.remove('hidden');
    signupBtn.disabled = true;
    
    // Create user
    setTimeout(() => {
        const newUser = {
            id: Date.now().toString(),
            fullname: fullname,
            email: email,
            password: password,
            isPro: false,
            createdAt: new Date().toISOString(),
            checksToday: 0,
            totalChecks: 0
        };
        
        users.push(newUser);
        saveUsers();
        
        // Auto login
        const session = {
            userId: newUser.id,
            email: newUser.email,
            fullname: newUser.fullname,
            isPro: false,
            loggedIn: true
        };
        
        localStorage.setItem('currentUser', JSON.stringify(session));
        
        showNotification('Account created successfully!', 'success');
        
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 1500);
    }, 1500);
}

// Handle Forgot Password
function handleForgotPassword(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const forgotForm = document.getElementById('forgotForm');
    const successMsg = document.getElementById('resetSuccess');
    
    // Check if email exists
    const user = users.find(u => u.email === email);
    
    if (user) {
        // In real app, send email here
        console.log('Reset link sent to:', email);
        
        // Show success message
        forgotForm.classList.add('hidden');
        successMsg.classList.remove('hidden');
    } else {
        showNotification('Email not found!', 'error');
    }
}

// Handle Reset Password
function handleResetPassword(event) {
    event.preventDefault();
    
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmNewPassword').value;
    
    if (newPassword !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }
    
    showNotification('Password reset successful!', 'success');
    
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
}

// Demo Login
function demoLogin(type) {
    const demoEmail = type === 'pro' ? 'pro@demo.com' : 'free@demo.com';
    
    document.getElementById('email').value = demoEmail;
    document.getElementById('password').value = 'demo123';
    
    // Auto submit
    setTimeout(() => {
        document.getElementById('loginForm').dispatchEvent(new Event('submit'));
    }, 500);
}

// Social Login
function socialLogin(provider) {
    showNotification(`Login with ${provider} coming soon!`, 'info');
}

// Check if user is authenticated
function checkAuth() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser') || 'null');
    
    // Protected pages
    const protectedPages = ['dashboard.html', 'profile.html'];
    const currentPage = window.location.pathname.split('/').pop();
    
    if (protectedPages.includes(currentPage) && !currentUser) {
        window.location.href = 'login.html';
    }
}

// Logout
function logout() {
    localStorage.removeItem('currentUser');
    sessionStorage.removeItem('currentUser');
    window.location.href = 'index.html';
}

// Toggle Password Visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const type = input.type === 'password' ? 'text' : 'password';
    input.type = type;
}

// Password Strength Meter
function setupPasswordStrength() {
    const passwordInput = document.getElementById('password');
    if (!passwordInput) return;
    
    passwordInput.addEventListener('input', function() {
        const strength = checkPasswordStrength(this.value);
        updateStrengthMeter(strength);
    });
}

function checkPasswordStrength(password) {
    let strength = 0;
    
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/)) strength++;
    if (password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    
    return strength;
}

function updateStrengthMeter(strength) {
    const bar = document.querySelector('.strength-bar');
    const text = document.querySelector('.strength-text');
    
    if (!bar || !text) return;
    
    bar.classList.remove('weak', 'medium', 'strong');
    
    if (strength <= 2) {
        bar.classList.add('weak');
        text.textContent = 'Weak password';
    } else if (strength <= 4) {
        bar.classList.add('medium');
        text.textContent = 'Medium password';
    } else {
        bar.classList.add('strong');
        text.textContent = 'Strong password';
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notification
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();
    
    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = message;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Hide after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification styles
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        background: white;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transform: translateX(400px);
        transition: transform 0.3s;
        z-index: 9999;
    }
    
    .notification.show {
        transform: translateX(0);
    }
    
    .notification-success {
        background: var(--secondary);
        color: white;
    }
    
    .notification-error {
        background: var(--danger);
        color: white;
    }
    
    .notification-info {
        background: var(--primary);
        color: white;
    }
`;

document.head.appendChild(style);

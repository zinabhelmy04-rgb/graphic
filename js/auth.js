const AUTH_CONFIG = {
    validEmail: 'zenaibhelmy@gmail.com',
    validPassword: '123456',
    storageKey: 'graphic_app_auth'
};

function isLoggedIn() {
    const auth = localStorage.getItem(AUTH_CONFIG.storageKey);
    return auth === 'true';
}

function login(email, password) {
    if (email === AUTH_CONFIG.validEmail && password === AUTH_CONFIG.validPassword) {
        localStorage.setItem(AUTH_CONFIG.storageKey, 'true');
        return true;
    }
    return false;
}

// تسجيل الخروج
function logout() {
    localStorage.removeItem(AUTH_CONFIG.storageKey);
    window.location.href = 'login.html';
}

// التحقق من المصادقة في الصفحات المحمية
function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
    }
}

// معالج نموذج تسجيل الدخول
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        // إذا كان مسجل بالفعل، انتقل للرئيسية
        if (isLoggedIn()) {
            window.location.href = 'index.html';
        }
        
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const errorEl = document.getElementById('login-error');
            
            if (login(email, password)) {
                window.location.href = 'index.html';
            } else {
                errorEl.textContent = 'البريد الإلكتروني أو كلمة المرور غير صحيحة';
            }
        });
    }
    
    // زر تسجيل الخروج في كل الصفحات
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
});
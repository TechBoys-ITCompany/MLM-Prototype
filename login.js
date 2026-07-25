// ==========================================
// LOGIN PAGE LOGIC & THEME TOGGLE
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // ------------------------------------------
    // 1. Theme Toggle Logic
    // ------------------------------------------
    const themeToggleBtn = document.getElementById('themeToggleBtn');
    const themeIcon = themeToggleBtn?.querySelector('i');
    
    // Check saved local storage theme preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            if (currentTheme === 'light') {
                document.documentElement.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
                if (themeIcon) {
                    themeIcon.classList.remove('fa-sun');
                    themeIcon.classList.add('fa-moon');
                }
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                if (themeIcon) {
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                }
            }
        });
    }

    // ------------------------------------------
    // 2. Form Authentication Logic
    // ------------------------------------------
    const loginForm = document.getElementById('loginForm');
    const loginBtn = document.getElementById('loginBtn');
    const loginLoader = document.getElementById('loginLoader');
    const btnText = loginBtn ? loginBtn.querySelector('.btn-text') : null;
    const loginError = document.getElementById('loginError');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const usernameInput = document.getElementById('username').value.trim();
            const passwordInput = document.getElementById('password').value.trim();

            // Hide previous errors
            if (loginError) loginError.classList.add('hidden');

            // Basic validation check
            if (!usernameInput || !passwordInput) {
                showError('Please fill in all fields.');
                return;
            }

            // Show loading state on button
            setLoading(true);

            // Simulate authentication delay (or replace with your backend API / Firebase call)
            setTimeout(() => {
                // Mock credential check (admin / admin123)
                if (usernameInput === 'admin' && passwordInput === 'admin123') {
                    localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('user', usernameInput);
                    
                    // Redirect to dashboard
                    window.location.href = 'dashboard.html';
                } else {
                    setLoading(false);
                    showError('Invalid credentials. Use admin / admin123');
                }
            }, 800);
        });
    }

    function setLoading(isLoading) {
        if (!loginBtn) return;
        if (isLoading) {
            loginBtn.setAttribute('disabled', 'true');
            if (btnText) btnText.style.opacity = '0.7';
            if (loginLoader) loginLoader.classList.remove('hidden');
        } else {
            loginBtn.removeAttribute('disabled');
            if (btnText) btnText.style.opacity = '1';
            if (loginLoader) loginLoader.classList.add('hidden');
        }
    }

    function showError(message) {
        if (loginError) {
            loginError.textContent = message;
            loginError.classList.remove('hidden');
        } else {
            alert(message);
        }
    }
});
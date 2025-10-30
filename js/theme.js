// ======================= DARK MODE TOGGLE =======================
function toggleDarkMode() {
    const body = document.body;
    const btn = document.querySelector('.theme-toggle-btn');
    const isDark = body.classList.contains('dark-mode');

    // Add animation direction
    btn.classList.remove(isDark ? 'sun-to-moon' : 'moon-to-sun');
    btn.classList.add(isDark ? 'moon-to-sun' : 'sun-to-moon');

    // Toggle mode
    body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
}

// Load dark mode preference on page load
document.addEventListener('DOMContentLoaded', function() {
    const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
    if (darkModeEnabled) {
        document.body.classList.add('dark-mode');
    }
});

// ======================= DARK MODE LOAD STATE =======================
window.addEventListener('DOMContentLoaded', () => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    const body = document.body;
    const btn = document.querySelector('.theme-toggle-btn');

    if (isDark) {
        body.classList.add('dark-mode');
        btn.classList.remove('moon-to-sun');
        btn.classList.add('sun-to-moon');
    } else {
        body.classList.remove('dark-mode');
        btn.classList.remove('sun-to-moon');
        btn.classList.add('moon-to-sun');
    }
});

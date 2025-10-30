function switchLanguage(lang) {
    document.querySelectorAll('[data-lang-vi]').forEach(el => {
        const key = lang === 'vi' ? 'data-lang-vi' : 'data-lang-en';
        if (el.textContent) {
            el.textContent = el.getAttribute(key);
        } else if (el.placeholder) {
            el.placeholder = el.getAttribute(key);
        } else if (el.value) {
            el.value = el.getAttribute(key);
        }
    });

    if (lang === 'vi') {
        document.title = 'Tạo tài khoản - ByteNest';
    } else {
        document.title = 'Create Account - ByteNest';
    }
}

document.getElementById('create-account-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const currentLang = document.documentElement.lang;
    const message = currentLang === 'vi' 
        ? 'Tài khoản đã được tạo thành công!' 
        : 'Account created successfully!';
    
    alert(message);
});

document.addEventListener('DOMContentLoaded', () => {
    const defaultLang = 'vi';
    switchLanguage(defaultLang); 
    document.documentElement.lang = defaultLang;
});

const originalSwitchLanguage = switchLanguage;
switchLanguage = function(lang) {
    originalSwitchLanguage(lang);
    document.documentElement.lang = lang;
}

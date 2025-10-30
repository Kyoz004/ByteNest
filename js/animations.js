// ======================= PAGE LOAD & ANIMATIONS =======================
window.addEventListener('load', () => {
    const loading = document.getElementById('loading-screen');
    if (loading) {

        // ---- SỬA ĐỔI TẠI ĐÂY ----
        // Đợi 2 giây (2000ms) SAU KHI trang load xong rồi mới bắt đầu mờ đi.
        // Điều này cho phép animation của logo (mất 0.8s delay + 2s chạy) có thời gian hiển thị.
        setTimeout(() => {

            // Bây giờ mới bắt đầu hiệu ứng mờ đi (fade-out)
            loading.style.opacity = '0';
            loading.style.transform = 'scale(1.05)';
            
            // Xóa element sau khi hiệu ứng mờ đi hoàn tất (CSS là 0.8s-1s)
            // Bạn đã để 1200ms là hợp lý, vì nó lớn hơn transition 1s
            setTimeout(() => {
                loading.remove();
            }, 1200); 

        }, 2000); // <-- Đây là độ trễ 2 giây. Bạn có thể điều chỉnh (vd: 2500ms)
        // ---- KẾT THÚC SỬA ĐỔI ----
    }

    // --- Popup sau load ---
    if (typeof showPopup === 'function') showPopup();

    // --- Fade-in sections ---
    const sections = document.querySelectorAll('section, .fade-in');
    const sectionObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                sectionObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    sections.forEach(sec => sectionObserver.observe(sec));

    // --- Lazy load images + fade ---
    const images = document.querySelectorAll('img');
    const imgObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.6s ease';
                setTimeout(() => (img.style.opacity = '1'), 100);
                imgObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imgObserver.observe(img));
});

// ======================= PARALLAX HERO =======================
window.addEventListener('scroll', () => {
    const hero = document.querySelector('.hero');
    if (hero) {
        const scrollY = window.pageYOffset;
        hero.style.backgroundPositionY = `${scrollY * 0.5}px`;
    }
});

// ======================= SCROLL ANIMATIONS =======================
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
        }
    });
}, observerOptions);

document.querySelectorAll('.product-card, .category-card, .service-card').forEach(el => {
    el.style.opacity = '0';
    observer.observe(el);
});

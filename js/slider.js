// ======================= MODERN HERO SLIDER =======================
const heroSlides = document.querySelectorAll('.hero-slide');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const dots = document.querySelectorAll('.dot');
let currentSlideIndex = 0;
let slideInterval;

// Khởi tạo slider
function initHeroSlider() {
    // Set background cho mỗi slide từ data-background
    heroSlides.forEach((slide, index) => {
        const bgUrl = slide.getAttribute('data-background');
        slide.style.backgroundImage = `url('${bgUrl}')`;
        slide.style.backgroundSize = 'cover';
        slide.style.backgroundPosition = 'center';
        slide.style.backgroundRepeat = 'no-repeat';
        
        // Ẩn tất cả slides trừ slide đầu tiên
        if (index === 0) {
            slide.classList.add('active');
        } else {
            slide.classList.remove('active');
        }
    });
    
    // Bắt đầu auto slide
    startAutoSlide();
}

// Hiển thị slide theo index
function showSlide(index) {
    // Xóa class active từ slide và dot hiện tại
    heroSlides[currentSlideIndex].classList.remove('active');
    if (dots[currentSlideIndex]) {
        dots[currentSlideIndex].classList.remove('active');
    }
    
    // Tính index mới (xử lý vòng lặp)
    currentSlideIndex = (index + heroSlides.length) % heroSlides.length;
    
    // Thêm class active cho slide và dot mới
    heroSlides[currentSlideIndex].classList.add('active');
    if (dots[currentSlideIndex]) {
        dots[currentSlideIndex].classList.add('active');
    }
}

// Slide tiếp theo
function nextSlide() {
    showSlide(currentSlideIndex + 1);
}

// Slide trước đó
function prevSlide() {
    showSlide(currentSlideIndex - 1);
}

// Tự động chuyển slide
function startAutoSlide() {
    slideInterval = setInterval(nextSlide, 6000); // Chuyển sau 6 giây
}

// Dừng auto slide
function stopAutoSlide() {
    clearInterval(slideInterval);
}

// Event listeners cho nút điều hướng
if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
        prevSlide();
        stopAutoSlide();
        startAutoSlide(); // Restart auto slide
    });
    
    nextBtn.addEventListener('click', () => {
        nextSlide();
        stopAutoSlide();
        startAutoSlide(); // Restart auto slide
    });
}

// Event listeners cho dots
dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
        showSlide(index);
        stopAutoSlide();
        startAutoSlide(); // Restart auto slide
    });
});

// Khởi động slider khi trang load
if (heroSlides.length > 0) {
    initHeroSlider();
}

// Dừng auto slide khi hover vào slider
const heroSection = document.querySelector('.hero');
if (heroSection) {
    heroSection.addEventListener('mouseenter', stopAutoSlide);
    heroSection.addEventListener('mouseleave', startAutoSlide);
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevSlide();
        stopAutoSlide();
        startAutoSlide();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
        stopAutoSlide();
        startAutoSlide();
    }
});

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

if (heroSection) {
    heroSection.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroSection.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }, { passive: true });
}

function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) {
            // Swipe left - next slide
            nextSlide();
        } else {
            // Swipe right - previous slide
            prevSlide();
        }
        stopAutoSlide();
        startAutoSlide();
    }
}

// Pause autoplay when page is not visible
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopAutoSlide();
    } else {
        startAutoSlide();
    }
});

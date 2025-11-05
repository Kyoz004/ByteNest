// ======================= POPUP MANAGEMENT =======================
function showPopup() {
    const popup = document.getElementById('salePopup');
    // Kiểm tra xem 'popup' có tồn tại không trước khi sử dụng
    if (popup) {
        const hasSeen = sessionStorage.getItem('hasSeenPopup');
        if (!hasSeen) {
            setTimeout(() => {
                popup.classList.add('active');
                sessionStorage.setItem('hasSeenPopup', 'true');
            }, 2000);
        }
    }
}

function closePopup() {
    const popup = document.getElementById('salePopup');
    if (popup) {
        popup.classList.remove('active');
    }
}

// ======================= MOBILE MENU =======================
// Enhanced mobile menu with overlay click, ESC-to-close, aria updates and basic focus management
const _mobileState = {
    isOpen: false,
    previouslyFocused: null,
    escHandler: null,
    overlayClickHandler: null
};

function openMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    const menuBtns = document.querySelectorAll('.mobile-menu-btn');
    if (!mobileNav || _mobileState.isOpen) return;

    // Save previously focused element to restore focus when closing
    _mobileState.previouslyFocused = document.activeElement;

    mobileNav.classList.add('open');
    _mobileState.isOpen = true;

    // Set accessibility attributes
    menuBtns.forEach(b => b.setAttribute('aria-expanded', 'true'));
    mobileNav.setAttribute('aria-hidden', 'false');

    // Focus the first focusable element inside the mobile nav
    const focusable = mobileNav.querySelector('a, button, input, [tabindex]:not([tabindex="-1"])');
    if (focusable) focusable.focus();

    // ESC handler
    _mobileState.escHandler = function(e) {
        if (e.key === 'Escape' || e.key === 'Esc') closeMobileMenu();
    };
    document.addEventListener('keydown', _mobileState.escHandler);

    // Clicking backdrop (the overlay) should close the menu when clicking outside the nav panel
    _mobileState.overlayClickHandler = function(e) {
        // If click target is the container itself (not its children), close
        if (e.target && e.target.id === 'mobileNav') closeMobileMenu();
    };
    mobileNav.addEventListener('click', _mobileState.overlayClickHandler);
}

function closeMobileMenu() {
    const mobileNav = document.getElementById('mobileNav');
    const menuBtns = document.querySelectorAll('.mobile-menu-btn');
    if (!mobileNav || !_mobileState.isOpen) return;

    mobileNav.classList.remove('open');
    _mobileState.isOpen = false;

    // Restore accessibility attributes
    menuBtns.forEach(b => b.setAttribute('aria-expanded', 'false'));
    mobileNav.setAttribute('aria-hidden', 'true');

    // Remove temporary handlers
    if (_mobileState.escHandler) {
        document.removeEventListener('keydown', _mobileState.escHandler);
        _mobileState.escHandler = null;
    }
    if (_mobileState.overlayClickHandler) {
        mobileNav.removeEventListener('click', _mobileState.overlayClickHandler);
        _mobileState.overlayClickHandler = null;
    }

    // Restore focus
    if (_mobileState.previouslyFocused && typeof _mobileState.previouslyFocused.focus === 'function') {
        _mobileState.previouslyFocused.focus();
    }
}

function toggleMobileMenu() {
    if (_mobileState.isOpen) closeMobileMenu();
    else openMobileMenu();
}

function toggleMobileSubmenu(event) {
    event.preventDefault();
    const dropdown = event.target.closest('.mobile-dropdown');
    if (dropdown) {
        dropdown.classList.toggle('active');
    }
}

// ======================= CHẠY KHI HTML TẢI XONG =======================
document.addEventListener('DOMContentLoaded', () => {

    // --- LOGIC 1: PROMO BAR ---
    const promoBar = document.querySelector('.promo-bar');
    const closePromoBtn = document.querySelector('.close-promo-btn');
    
    // SỬA LỖI 1: Bỏ class ".header-main"
    const header = document.querySelector('header'); 

    // Xử lý khi bấm nút đóng
    if (promoBar && closePromoBtn) {
        closePromoBtn.addEventListener('click', () => {
            promoBar.classList.add('hidden');
            if (header) {
                header.style.top = '0';
            }
        });
    }

    // Quan sát promo bar để tự động đẩy header xuống (Chống "gap")
    if (promoBar && header) {
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const height = entry.contentRect.height;
                // Luôn đặt 'top' của header bằng chiều cao của promo-bar
                // Khi promo-bar bị ẩn (height=0), top sẽ là '0px'
                header.style.top = `${height}px`;
            }
        });
        
        // Bắt đầu quan sát
        resizeObserver.observe(promoBar);
        
        // Kích hoạt một lần lúc tải trang để set vị trí ban đầu
        // (Bỏ setTimeout, không cần thiết nếu observer chạy ngay)
        const initialHeight = promoBar.clientHeight;
        if (initialHeight > 0) {
            header.style.top = `${initialHeight}px`;
        }
    }

    // --- LOGIC 2: SCROLL-TO-TOP BUTTON ---
    // (Đã gộp vào chung 1 event listener)
    const scrollTopBtn = document.getElementById('scrollTopBtn');

    if (scrollTopBtn) {
        // 1. Logic: Hiển thị/ẩn nút khi cuộn trang
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });

        // 2. Logic: Cuộn mượt lên đầu khi bấm nút
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// ======================= SMOOTH SCROLL (Để bên ngoài) =======================
// (Code này nên chạy sau DOMContentLoaded, nhưng để riêng cũng không sao)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ======================= SIMPLE I18N (CLIENT) =======================
   - Add data-i18n="key" to elements whose textContent/innerHTML should be translated
   - Add data-i18n-ATTR="key" to elements to translate attributes (e.g., data-i18n-placeholder)
   - Use setLanguage(lang) and toggleLanguage() to switch languages
*/

const I18N = {
    defaultLang: 'vi',
    supported: ['vi', 'en'],
    dict: {
        vi: {
            // Stats Section
            'stats.customers': '15K+',
            'stats.customers.desc': 'Khách hàng tin tưởng',
            'stats.products': '5000+',
            'stats.products.desc': 'Sản phẩm đa dạng',
            'stats.rating': '98%',
            'stats.rating.desc': 'Đánh giá 5 sao',
            'stats.support': '24/7',
            'stats.support.desc': 'Hỗ trợ khách hàng',

            // Category Grid
            'category.pc.title': 'PC',
            'category.pc.desc': 'Build sẵn | Theo yêu cầu',
            'category.laptop.title': 'Laptop',
            'category.laptop.desc': 'Gaming | Văn phòng | Đồ họa',
            'category.keyboard.title': 'Bàn phím cơ',
            'category.keyboard.desc': 'Mechanical | Custom',
            'category.mouse.title': 'Chuột Gaming',
            'category.mouse.desc': 'RGB | Wireless | Pro',
            'category.headphone.title': 'Tai nghe | TWS',
            'category.headphone.desc': 'Có dây | Không dây',
            'category.components.pc.title': 'Linh kiện PC',
            'category.components.pc.desc': 'CPU | RAM | VGA | SSD',
            'category.components.laptop.title': 'Linh kiện Laptop',
            'category.components.laptop.desc': 'RAM | SSD | PIN',
            'category.accessories.title': 'Phụ kiện khác',
            'category.accessories.desc': 'Webcam | Hub | Cáp',
            'category.monitor.title': 'Màn hình',
            'category.monitor.desc': 'IPS | 144Hz | Arm Màn',

            // Testimonials Section
            'testimonials.title': 'Khách hàng nói gì về chúng tôi',
            'testimonials.subtitle': 'Những phản hồi tích cực từ khách hàng tin tưởng ByteNest',
            'testimonial.1.text': '"Mua laptop gaming tại ByteNest, giá tốt hơn thị trường, ship nhanh và có bảo hành chu đáo. Rất hài lòng với dịch vụ!"',
            'testimonial.1.name': 'Nguyễn Văn A',
            'testimonial.1.role': 'Streamer',
            'testimonial.2.text': '"Đội ngũ tư vấn rất nhiệt tình, tìm được bộ PC build giá tốt mà hiệu năng mạnh. Cảm ơn ByteNest!"',
            'testimonial.2.name': 'Trần Thị B',
            'testimonial.2.role': 'Designer',
            'testimonial.3.text': '"Keychron Q1 mua tại đây, chất lượng tuyệt vời! Đúng như quảng cáo, cảm giác gõ rất tốt."',
            'testimonial.3.name': 'Lê Minh C',
            'testimonial.3.role': 'Developer',

            // Categories Page
            'categories.title': 'Danh mục sản phẩm',
            'categories.subtitle': 'Đa dạng sản phẩm công nghệ chính hãng & xách tay',

            // Navigation & Common
            'nav.products': 'Sản phẩm',
            'nav.services': 'Dịch vụ',
            'nav.solutions': 'Giải pháp',
            'nav.blog': 'ByteBlog',
            'nav.contact': 'Liên hệ',
            'nav.home': 'Trang chủ',
            'nav.close': 'Đóng',
            'search.placeholder': 'Tìm kiếm sản phẩm, dịch vụ...',
            'lang.toggle_title': 'Ngôn ngữ',
            'theme.toggle_title': 'Chế độ tối',
            'cart.title': 'Giỏ hàng',
            'account.title': 'Tài khoản',

            // Hero Section
            'hero.badge': '✨ New Collection 2025',
            'hero.title': '<span class="gradient-text">One-Stop</span><br>Tech Solution',
            'hero.subtitle': 'Giải pháp công nghệ toàn diện - Từ sản phẩm đến dịch vụ',
            'cta.explore': 'Khám phá sản phẩm',
            'cta.book': 'Đặt lịch sửa chữa',

            // Banner Slides
            'banner.products.badge': '🔥 Hot Deals',
            'banner.products.title': 'Sản phẩm',
            'banner.products.subtitle': 'Mới nhất 2025',
            'banner.products.desc': 'Khám phá ngay bộ sưu tập sản phẩm công nghệ đỉnh cao',
            'banner.products.cta': 'Xem ngay',
            'banner.services.badge': '⚡ Fast Service',
            'banner.services.title': 'Dịch vụ',
            'banner.services.subtitle': 'Chuyên nghiệp',
            'banner.services.desc': 'Sửa chữa và bảo trì thiết bị công nghệ của bạn',
            'banner.services.cta': 'Đặt lịch ngay',

            // Homepage Sections
            'section.featured.title': 'Sản phẩm nổi bật',
            'section.featured.subtitle': 'Khám phá những sản phẩm công nghệ hot nhất hiện tại',
            'section.categories.title': 'Danh mục sản phẩm',
            'section.categories.subtitle': 'Đa dạng sản phẩm công nghệ chính hãng & xách tay',
            'section.testimonials.title': 'Khách hàng nói gì về chúng tôi',
            'section.testimonials.subtitle': 'Những phản hồi tích cực từ khách hàng tin tưởng ByteNest',

            // Featured Products
            'featured.badge.new': 'NEW',
            'featured.badge.hot': 'HOT',
            'featured.badge.sale': 'SALE',
            'featured.badge.best': 'BEST',
            'featured.category.laptop': 'LAPTOP',
            'featured.category.keyboard': 'BÀN PHÍM',
            'featured.category.mouse': 'CHUỘT',
            'featured.category.cpu': 'CPU',
            'featured.product1.title': 'Laptop ASUS ROG Strix G15 (2025)',
            'featured.product2.title': 'Bàn phím Monsgeek M1 V5',
            'featured.product3.title': 'Chuột Logitech G Pro X Superlight 2',
            'featured.product4.title': 'AMD Ryzen 7 7800X3D',
            'featured.addtocart': 'Thêm giỏ hàng',
            'featured.quickview': 'Xem nhanh',

            // Features
            'feature.genuine': 'Chính hãng 100%',
            'feature.genuine.desc': 'Cam kết sản phẩm chính hãng, bảo hành toàn diện',
            'feature.shipping': 'Miễn phí vận chuyển',
            'feature.shipping.desc': 'Freeship toàn quốc cho đơn hàng trên 500K',
            'feature.return': 'Đổi trả dễ dàng',
            'feature.return.desc': 'Đổi trả miễn phí trong vòng 30 ngày',
            'feature.support': 'Hỗ trợ 24/7',
            'feature.support.desc': 'Đội ngũ tư vấn luôn sẵn sàng phục vụ bạn',

            // Products Page
            'products.filter.title': 'Bộ lọc',
            'products.sort.title': 'Sắp xếp theo',
            'products.category.all': 'Tất cả sản phẩm',
            'products.add_to_cart': 'Thêm vào giỏ',
            'products.quick_view': 'Xem nhanh',
            'products.price': 'Giá',
            'products.status': 'Tình trạng',
            'products.instock': 'Còn hàng',
            'products.outofstock': 'Hết hàng',
            'products.sort.newest': 'Mới nhất',
            'products.sort.price_asc': 'Giá tăng dần',
            'products.sort.price_desc': 'Giá giảm dần',
            'products.sort.bestseller': 'Bán chạy nhất',
            'products.filter.price_range': 'Khoảng giá',
            'products.filter.brand': 'Thương hiệu',
            'products.filter.category': 'Danh mục',
            'products.filter.availability': 'Tình trạng hàng',
            'products.filter.apply': 'Áp dụng',
            'products.filter.reset': 'Đặt lại',

            // Product Categories
            'category.laptop.gaming': 'Laptop Gaming',
            'category.laptop.office': 'Laptop Văn phòng',
            'category.laptop.graphic': 'Laptop Đồ họa',
            'category.pc.gaming': 'PC Gaming',
            'category.pc.workstation': 'PC Workstation',
            'category.keyboard.mechanical': 'Bàn phím cơ',
            'category.mouse.gaming': 'Chuột Gaming',
            'category.headphone.gaming': 'Tai nghe Gaming',
            'category.monitor': 'Màn hình',
            'category.chair.gaming': 'Ghế Gaming',

            // Product Details
            'product.details.description': 'Mô tả sản phẩm',
            'product.details.specifications': 'Thông số kỹ thuật',
            'product.details.reviews': 'Đánh giá',
            'product.details.shipping': 'Thông tin vận chuyển',
            'product.details.warranty': 'Bảo hành',
            'product.details.quantity': 'Số lượng',
            'product.details.availability': 'Tình trạng',
            'product.details.sku': 'Mã sản phẩm',
            'product.details.category': 'Danh mục',
            'product.details.brand': 'Thương hiệu',
            'product.details.related': 'Sản phẩm liên quan',
            'product.details.addToCart': 'Thêm vào giỏ hàng',
            'product.details.buyNow': 'Mua ngay',
            'product.details.soldOut': 'Hết hàng',
            'product.details.inStock': 'Còn hàng',
            'product.details.lowStock': 'Sắp hết hàng',
            'products.sort.newest': 'Mới nhất',
            'products.sort.price_asc': 'Giá tăng dần',
            'products.sort.price_desc': 'Giá giảm dần',
            'products.sort.bestseller': 'Bán chạy nhất',
            'products.filter.price_range': 'Khoảng giá',
            'products.filter.brand': 'Thương hiệu',
            'products.filter.category': 'Danh mục',
            'products.filter.availability': 'Tình trạng hàng',
            'products.filter.apply': 'Áp dụng',
            'products.filter.reset': 'Đặt lại',
            
            // Product Categories
            'category.laptop.gaming': 'Laptop Gaming',
            'category.laptop.office': 'Laptop Văn phòng',
            'category.laptop.graphic': 'Laptop Đồ họa',
            'category.pc.gaming': 'PC Gaming',
            'category.pc.workstation': 'PC Workstation',
            'category.keyboard.mechanical': 'Bàn phím cơ',
            'category.mouse.gaming': 'Chuột Gaming',
            'category.headphone.gaming': 'Tai nghe Gaming',
            'category.monitor': 'Màn hình',
            'category.chair.gaming': 'Ghế Gaming',
            
            // Product Details
            'product.details.description': 'Mô tả sản phẩm',
            'product.details.specifications': 'Thông số kỹ thuật',
            'product.details.reviews': 'Đánh giá',
            'product.details.shipping': 'Thông tin vận chuyển',
            'product.details.warranty': 'Bảo hành',
            'product.details.quantity': 'Số lượng',
            'product.details.availability': 'Tình trạng',
            'product.details.sku': 'Mã sản phẩm',
            'product.details.category': 'Danh mục',
            'product.details.brand': 'Thương hiệu',
            'product.details.related': 'Sản phẩm liên quan',
            'product.details.addToCart': 'Thêm vào giỏ hàng',
            'product.details.buyNow': 'Mua ngay',
            'product.details.soldOut': 'Hết hàng',
            'product.details.inStock': 'Còn hàng',
            'product.details.lowStock': 'Sắp hết hàng',

            // Services Page
            'services.title': 'Dịch vụ chuyên nghiệp',
            'services.subtitle': 'Đội ngũ kỹ thuật viên giàu kinh nghiệm - Cam kết chất lượng',
            'services.repair.title': 'Sửa chữa Laptop/PC',
            'services.repair.desc': 'Sửa chữa mọi hãng: Dell, HP, Asus, Lenovo, Macbook. Bảo hành 6 tháng.',
            'services.upgrade.title': 'Nâng cấp phần cứng',
            'services.upgrade.desc': 'Nâng cấp RAM, SSD, VGA. Tư vấn cấu hình phù hợp.',
            'services.maintenance.title': 'Vệ sinh & Bảo trì',
            'services.maintenance.desc': 'Vệ sinh tản nhiệt, thay keo tản nhiệt, làm sạch bàn phím.',
            'services.software.title': 'Cài đặt phần mềm',
            'services.software.desc': 'Cài Windows, Office, phần mềm chuyên dụng. Hỗ trợ kích hoạt bản quyền.',
            'services.business.title': 'Giải pháp doanh nghiệp',
            'services.business.desc': 'Tư vấn IT, setup văn phòng, quản lý hệ thống mạng.',
            'services.custom.title': 'PC Build Custom',
            'services.custom.desc': 'Thiết kế và lắp ráp PC theo yêu cầu. Tối ưu giá - hiệu năng.',
            'services.cta.book': 'Đặt lịch ngay',
            'services.cta.consult': 'Liên hệ tư vấn',
            'services.cta.free': 'Tư vấn miễn phí',

            // Solutions Page
            'solutions.title': 'Giải pháp',
            'solutions.business': 'Doanh nghiệp',
            'solutions.gaming': 'Gaming Setup',
            'solutions.creation': 'Content Creation',
            'solutions.office': 'Văn phòng',
            'solutions.custom': 'Tùy chỉnh',

            // Contact Page
            'contact.title': 'Liên hệ với chúng tôi',
            'contact.form.name': 'Họ và tên',
            'contact.form.email': 'Email',
            'contact.form.phone': 'Số điện thoại',
            'contact.form.subject': 'Tiêu đề',
            'contact.form.message': 'Nội dung',
            'contact.form.submit': 'Gửi tin nhắn',
            'contact.address': 'Địa chỉ',
            'contact.phone': 'Điện thoại',
            'contact.email': 'Email',
            'contact.hours': 'Giờ làm việc',

            // Footer
            'footer.products': 'Sản phẩm',
            'footer.services': 'Dịch vụ',
            'footer.support': 'Hỗ trợ',
            'footer.contact': 'Liên hệ',
            'footer.copyright': '© 2025 ByteNest. All rights reserved.',
            'footer.faq': 'Câu hỏi thường gặp',
            'footer.warranty': 'Chính sách bảo hành',
            'footer.return_policy': 'Chính sách đổi trả',
            'footer.payment': 'Hướng dẫn thanh toán',

            // Account/Auth
            'auth.login': 'Đăng nhập',
            'auth.register': 'Tạo tài khoản',
            'auth.forgot': 'Quên mật khẩu?',
            'auth.email': 'Email',
            'auth.password': 'Mật khẩu',
            'auth.username': 'Tên đăng nhập',
            'auth.confirm_password': 'Xác nhận mật khẩu',
            'auth.remember': 'Ghi nhớ đăng nhập',
            'auth.or': 'Hoặc',
            'auth.google': 'Đăng nhập với Google',
            'auth.facebook': 'Đăng nhập với Facebook',
            'auth.welcome': 'Chào mừng đến với ByteNest',
            'auth.tagline': 'Giải pháp công nghệ một cửa của bạn.',
            'auth.have_account': 'Đã có tài khoản?',
            'auth.submit.register': 'Đăng ký',

            // Cart and Checkout
            'cart.empty': 'Giỏ hàng trống',
            'cart.summary': 'Tổng quan đơn hàng',
            'cart.subtotal': 'Tạm tính',
            'cart.shipping': 'Phí vận chuyển',
            'cart.total': 'Tổng cộng',
            'cart.checkout': 'Thanh toán',
            'cart.continue': 'Tiếp tục mua sắm',
            'cart.remove': 'Xóa',
            'cart.update': 'Cập nhật giỏ hàng',
            'cart.apply_coupon': 'Áp dụng mã giảm giá',
            'cart.shipping_method': 'Phương thức vận chuyển',
            'cart.payment_method': 'Phương thức thanh toán',

            // Checkout Process
            'checkout.billing': 'Thông tin thanh toán',
            'checkout.shipping': 'Thông tin giao hàng',
            'checkout.payment': 'Chi tiết thanh toán',
            'checkout.review': 'Xem lại đơn hàng',
            'checkout.confirmation': 'Xác nhận đơn hàng',
            'checkout.same_as_billing': 'Giống địa chỉ thanh toán',
            'checkout.next': 'Bước tiếp theo',
            'checkout.previous': 'Quay lại',
            'checkout.place_order': 'Đặt hàng',
            
            // Form Fields
            'form.first_name': 'Tên',
            'form.last_name': 'Họ',
            'form.company': 'Tên công ty',
            'form.address': 'Địa chỉ',
            'form.address2': 'Căn hộ, phòng, v.v.',
            'form.city': 'Thành phố',
            'form.state': 'Tỉnh/Thành',
            'form.postal_code': 'Mã bưu chính',
            'form.country': 'Quốc gia',
            'form.phone': 'Số điện thoại',
            'form.email': 'Địa chỉ email',
            'form.notes': 'Ghi chú đơn hàng',
            
            // Notifications
            'notify.success': 'Thành công',
            'notify.error': 'Lỗi',
            'notify.warning': 'Cảnh báo',
            'notify.info': 'Thông tin',
            'notify.added': '✓ Đã thêm',
            'notify.added_to_cart': 'Đã thêm vào giỏ hàng',
            'notify.removed_from_cart': 'Đã xóa khỏi giỏ hàng',
            'notify.cart_updated': 'Đã cập nhật giỏ hàng',
            'notify.order_placed': 'Đặt hàng thành công',
            'notify.payment_error': 'Lỗi xử lý thanh toán',
            
            // Reviews and Ratings
            'review.write': 'Viết đánh giá',
            'review.rating': 'Đánh giá của bạn',
            'review.title': 'Tiêu đề đánh giá',
            'review.content': 'Nội dung đánh giá',
            'review.submit': 'Gửi đánh giá',
            'review.verified': 'Đã xác nhận mua hàng',
            'review.helpful': 'Đánh giá này có hữu ích?',
            'review.report': 'Báo cáo đánh giá',
            'review.by': 'bởi',
            'review.on': 'vào',
            
            // Support and Help
            'support.faq': 'Câu hỏi thường gặp',
            'support.contact': 'Liên hệ hỗ trợ',
            'support.live_chat': 'Chat trực tuyến',
            'support.ticket': 'Tạo ticket hỗ trợ',
            'support.knowledge_base': 'Cơ sở kiến thức',
            'support.community': 'Diễn đàn cộng đồng',
            'support.help_center': 'Trung tâm trợ giúp'
        },
        en: {
            // Stats Section
            'stats.customers': '15K+',
            'stats.customers.desc': 'Trusted Customers',
            'stats.products': '5000+',
            'stats.products.desc': 'Diverse Products',
            'stats.rating': '98%',
            'stats.rating.desc': '5-Star Reviews',
            'stats.support': '24/7',
            'stats.support.desc': 'Customer Support',

            // Category Grid
            'category.pc.title': 'PC',
            'category.pc.desc': 'Pre-built | Custom',
            'category.laptop.title': 'Laptop',
            'category.laptop.desc': 'Gaming | Office | Graphics',
            'category.keyboard.title': 'Mechanical Keyboards',
            'category.keyboard.desc': 'Mechanical | Custom',
            'category.mouse.title': 'Gaming Mouse',
            'category.mouse.desc': 'RGB | Wireless | Pro',
            'category.headphone.title': 'Headphones | TWS',
            'category.headphone.desc': 'Wired | Wireless',
            'category.components.pc.title': 'PC Components',
            'category.components.pc.desc': 'CPU | RAM | GPU | SSD',
            'category.components.laptop.title': 'Laptop Components',
            'category.components.laptop.desc': 'RAM | SSD | Battery',
            'category.accessories.title': 'Other Accessories',
            'category.accessories.desc': 'Webcam | Hub | Cables',
            'category.monitor.title': 'Monitors',
            'category.monitor.desc': 'IPS | 144Hz | Monitor Arms',

            // Testimonials Section
            'testimonials.title': 'What Our Customers Say',
            'testimonials.subtitle': 'Positive feedback from our trusted ByteNest customers',
            'testimonial.1.text': '"Bought a gaming laptop at ByteNest, better price than market, fast shipping and comprehensive warranty. Very satisfied with the service!"',
            'testimonial.1.name': 'Nguyen Van A',
            'testimonial.1.role': 'Streamer',
            'testimonial.2.text': '"The consulting team was very enthusiastic, found a PC build with great value and strong performance. Thank you ByteNest!"',
            'testimonial.2.name': 'Tran Thi B',
            'testimonial.2.role': 'Designer',
            'testimonial.3.text': '"Keychron Q1 purchased here, excellent quality! Just as advertised, typing feel is great."',
            'testimonial.3.name': 'Le Minh C',
            'testimonial.3.role': 'Developer',

            // Categories Page
            'categories.title': 'Product Categories',
            'categories.subtitle': 'Wide range of authentic & imported tech products',

            // Navigation & Common
            'nav.products': 'Products',
            'nav.services': 'Services',
            'nav.solutions': 'Solutions',
            'nav.blog': 'ByteBlog',
            'nav.contact': 'Contact',
            'nav.home': 'Home',
            'nav.close': 'Close',
            'search.placeholder': 'Search products, services...',
            'lang.toggle_title': 'Language',
            'theme.toggle_title': 'Dark Mode',
            'cart.title': 'Cart',
            'account.title': 'Account',

            // Hero Section
            'hero.badge': '✨ New Collection 2025',
            'hero.title': '<span class="gradient-text">One-Stop</span><br>Tech Solution',
            'hero.subtitle': 'Comprehensive tech solutions — from products to services',
            'cta.explore': 'Explore Products',
            'cta.book': 'Book Service',

            // Banner Slides
            'banner.products.badge': '🔥 Hot Deals',
            'banner.products.title': 'Products',
            'banner.products.subtitle': 'Latest 2025',
            'banner.products.desc': 'Discover our premium tech product collection now',
            'banner.products.cta': 'View Now',
            'banner.services.badge': '⚡ Fast Service',
            'banner.services.title': 'Services',
            'banner.services.subtitle': 'Professional',
            'banner.services.desc': 'Repair and maintenance for your tech devices',
            'banner.services.cta': 'Book Now',

            // Homepage Sections
            'section.featured.title': 'Featured Products',
            'section.featured.subtitle': 'Discover our hottest tech products',
            'section.categories.title': 'Product Categories',
            'section.categories.subtitle': 'Wide range of authentic & imported tech products',
            'section.testimonials.title': 'What Our Customers Say',
            'section.testimonials.subtitle': 'Positive feedback from our trusted customers',

            // Featured Products
            'featured.badge.new': 'NEW',
            'featured.badge.hot': 'HOT',
            'featured.badge.sale': 'SALE',
            'featured.badge.best': 'BEST',
            'featured.category.laptop': 'LAPTOP',
            'featured.category.keyboard': 'KEYBOARD',
            'featured.category.mouse': 'MOUSE',
            'featured.category.cpu': 'CPU',
            'featured.product1.title': 'ASUS ROG Strix G15 Laptop (2025)',
            'featured.product2.title': 'Monsgeek M1 V5 Keyboard',
            'featured.product3.title': 'Logitech G Pro X Superlight 2 Mouse',
            'featured.product4.title': 'AMD Ryzen 7 7800X3D',
            'featured.addtocart': 'Add to Cart',
            'featured.quickview': 'Quick View',

            // Features
            'feature.genuine': '100% Authentic',
            'feature.genuine.desc': 'Guaranteed authentic products with comprehensive warranty',
            'feature.shipping': 'Free Shipping',
            'feature.shipping.desc': 'Free nationwide shipping for orders over 500K',
            'feature.return': 'Easy Returns',
            'feature.return.desc': 'Free returns within 30 days',
            'feature.support': '24/7 Support',
            'feature.support.desc': 'Our support team is always ready to help',

            // Products Page
            'products.filter.title': 'Filters',
            'products.sort.title': 'Sort by',
            'products.category.all': 'All Products',
            'products.add_to_cart': 'Add to Cart',
            'products.quick_view': 'Quick View',
            'products.price': 'Price',
            'products.status': 'Status',
            'products.instock': 'In Stock',
            'products.outofstock': 'Out of Stock',
            'products.sort.newest': 'Newest',
            'products.sort.price_asc': 'Price: Low to High',
            'products.sort.price_desc': 'Price: High to Low',
            'products.sort.bestseller': 'Best Sellers',
            'products.filter.price_range': 'Price Range',
            'products.filter.brand': 'Brand',
            'products.filter.category': 'Category',
            'products.filter.availability': 'Availability',
            'products.filter.apply': 'Apply',
            'products.filter.reset': 'Reset',

            // Product Categories
            'category.laptop.gaming': 'Gaming Laptop',
            'category.laptop.office': 'Office Laptop',
            'category.laptop.graphic': 'Graphics Laptop',
            'category.pc.gaming': 'Gaming PC',
            'category.pc.workstation': 'PC Workstation',
            'category.keyboard.mechanical': 'Mechanical Keyboard',
            'category.mouse.gaming': 'Gaming Mouse',
            'category.headphone.gaming': 'Gaming Headset',
            'category.monitor': 'Monitor',
            'category.chair.gaming': 'Gaming Chair',

            // Product Details
            'product.details.description': 'Product Description',
            'product.details.specifications': 'Specifications',
            'product.details.reviews': 'Reviews',
            'product.details.shipping': 'Shipping Information',
            'product.details.warranty': 'Warranty',
            'product.details.quantity': 'Quantity',
            'product.details.availability': 'Availability',
            'product.details.sku': 'SKU',
            'product.details.category': 'Category',
            'product.details.brand': 'Brand',
            'product.details.related': 'Related Products',
            'product.details.addToCart': 'Add to Cart',
            'product.details.buyNow': 'Buy Now',
            'product.details.soldOut': 'Sold Out',
            'product.details.inStock': 'In Stock',
            'product.details.lowStock': 'Low Stock',

            // Services Page
            'services.title': 'Professional Services',
            'services.subtitle': 'Experienced technical team - Quality commitment',
            'services.repair.title': 'Laptop/PC Repair',
            'services.repair.desc': 'Repair all brands: Dell, HP, Asus, Lenovo, Macbook. 6-month warranty.',
            'services.upgrade.title': 'Hardware Upgrades',
            'services.upgrade.desc': 'Upgrade RAM, SSD, GPU. Suitable configuration consulting.',
            'services.maintenance.title': 'Cleaning & Maintenance',
            'services.maintenance.desc': 'Heatsink cleaning, thermal paste replacement, keyboard cleaning.',
            'services.software.title': 'Software Installation',
            'services.software.desc': 'Install Windows, Office, specialized software. License activation support.',
            'services.business.title': 'Business Solutions',
            'services.business.desc': 'IT consulting, office setup, network system management.',
            'services.custom.title': 'Custom PC Build',
            'services.custom.desc': 'Design and assemble PC on demand. Price-performance optimization.',
            'services.cta.book': 'Book Now',
            'services.cta.consult': 'Contact for Consultation',
            'services.cta.free': 'Free Consultation',

            // Solutions Page
            'solutions.title': 'Solutions',
            'solutions.business': 'Business',
            'solutions.gaming': 'Gaming Setup',
            'solutions.creation': 'Content Creation',
            'solutions.office': 'Office',
            'solutions.custom': 'Custom',

            // Contact Page
            'contact.title': 'Contact Us',
            'contact.form.name': 'Full Name',
            'contact.form.email': 'Email',
            'contact.form.phone': 'Phone Number',
            'contact.form.subject': 'Subject',
            'contact.form.message': 'Message',
            'contact.form.submit': 'Send Message',
            'contact.address': 'Address',
            'contact.phone': 'Phone',
            'contact.email': 'Email',
            'contact.hours': 'Business Hours',

            // Footer
            'footer.products': 'Products',
            'footer.services': 'Services',
            'footer.support': 'Support',
            'footer.contact': 'Contact',
            'footer.copyright': '© 2025 ByteNest. All rights reserved.',
            'footer.faq': 'FAQ',
            'footer.warranty': 'Warranty Policy',
            'footer.return_policy': 'Return Policy',
            'footer.payment': 'Payment Guide',

            // Account/Auth
            'auth.login': 'Login',
            'auth.register': 'Create Account',
            'auth.forgot': 'Forgot Password?',
            'auth.email': 'Email',
            'auth.password': 'Password',
            'auth.username': 'Username',
            'auth.confirm_password': 'Confirm Password',
            'auth.remember': 'Remember me',
            'auth.or': 'Or',
            'auth.google': 'Sign in with Google',
            'auth.facebook': 'Sign in with Facebook',
            'auth.welcome': 'Welcome to ByteNest',
            'auth.tagline': 'Your one-stop tech solution.',
            'auth.have_account': 'Already have an account?',
            'auth.submit.register': 'Sign Up',

            // Cart and Checkout
            'cart.empty': 'Cart is empty',
            'cart.summary': 'Order Summary',
            'cart.subtotal': 'Subtotal',
            'cart.shipping': 'Shipping',
            'cart.total': 'Total',
            'cart.checkout': 'Checkout',
            'cart.continue': 'Continue Shopping',
            'cart.remove': 'Remove',
            'cart.update': 'Update Cart',
            'cart.apply_coupon': 'Apply Coupon',
            'cart.shipping_method': 'Shipping Method',
            'cart.payment_method': 'Payment Method',

            // Checkout Process
            'checkout.billing': 'Billing Information',
            'checkout.shipping': 'Shipping Information',
            'checkout.payment': 'Payment Details',
            'checkout.review': 'Order Review',
            'checkout.confirmation': 'Order Confirmation',
            'checkout.same_as_billing': 'Same as billing address',
            'checkout.next': 'Next Step',
            'checkout.previous': 'Previous Step',
            'checkout.place_order': 'Place Order',
            
            // Form Fields
            'form.first_name': 'First Name',
            'form.last_name': 'Last Name',
            'form.company': 'Company Name',
            'form.address': 'Address',
            'form.address2': 'Apartment, suite, etc.',
            'form.city': 'City',
            'form.state': 'State/Province',
            'form.postal_code': 'Postal Code',
            'form.country': 'Country',
            'form.phone': 'Phone Number',
            'form.email': 'Email Address',
            'form.notes': 'Order Notes',
            
            // Notifications
            'notify.success': 'Success',
            'notify.error': 'Error',
            'notify.warning': 'Warning',
            'notify.info': 'Information',
            'notify.added': '✓ Added',
            'notify.added_to_cart': 'Product added to cart',
            'notify.removed_from_cart': 'Product removed from cart',
            'notify.cart_updated': 'Cart updated',
            'notify.order_placed': 'Order placed successfully',
            'notify.payment_error': 'Payment processing error',
            
            // Reviews and Ratings
            'review.write': 'Write a Review',
            'review.rating': 'Your Rating',
            'review.title': 'Review Title',
            'review.content': 'Your Review',
            'review.submit': 'Submit Review',
            'review.verified': 'Verified Purchase',
            'review.helpful': 'Was this review helpful?',
            'review.report': 'Report Review',
            'review.by': 'by',
            'review.on': 'on',
            
            // Support and Help
            'support.faq': 'Frequently Asked Questions',
            'support.contact': 'Contact Support',
            'support.live_chat': 'Live Chat',
            'support.ticket': 'Create Support Ticket',
            'support.knowledge_base': 'Knowledge Base',
            'support.community': 'Community Forum',
            'support.help_center': 'Help Center'
        }
    }
};


function applyTranslations(lang) {
    const dict = I18N.dict[lang] || I18N.dict[I18N.defaultLang];

    // Add fade-out animation class
    document.body.classList.add('lang-transitioning');

    // Replace element content for data-i18n with animation
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (!key) return;
        const value = dict[key];
        if (value !== undefined) {
            // Skip animation for buttons themselves, only animate their text
            const isButtonText = el.tagName === 'SPAN' && el.closest('button');
            
            // Add fade effect
            el.style.opacity = '0';
            el.style.transform = isButtonText ? 'translateX(-3px)' : 'translateY(-5px)';
            
            setTimeout(() => {
                // allow HTML in translations for complex elements
                el.innerHTML = value;
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, 150);
        }
    });

    // Replace attributes for any data-i18n-XXX
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        const value = dict[key];
        if (value !== undefined) el.setAttribute('placeholder', value);
    });

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        const value = dict[key];
        if (value !== undefined) {
            el.setAttribute('title', value);
            // for accessibility also set aria-label when appropriate
            if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', value);
        }
    });

    // Update any language indicator (if present)
    const langBtn = document.getElementById('langToggleBtn');
    if (langBtn) {
        langBtn.setAttribute('aria-label', lang === 'en' ? 'Switch language to Vietnamese' : 'Chuyển sang tiếng Anh');
    }

    // Remove transition class after animation completes
    setTimeout(() => {
        document.body.classList.remove('lang-transitioning');
    }, 300);
}

function setLanguage(lang) {
    if (!I18N.supported.includes(lang)) lang = I18N.defaultLang;
    localStorage.setItem('site_lang', lang);
    applyTranslations(lang);
}

function toggleLanguage() {
    const current = localStorage.getItem('site_lang') || I18N.defaultLang;
    const next = current === 'vi' ? 'en' : 'vi';
    
    // Add rotation animation
    const btn = document.getElementById('langToggleBtn');
    if (btn) {
        btn.classList.add('rotate');
        // Remove class after animation completes to allow future animations
        setTimeout(() => {
            btn.classList.remove('rotate');
        }, 500); // Match the animation duration (500ms)
        btn.setAttribute('data-lang', next);
        
        // Update button text to show current language
        const langText = btn.querySelector('.lang-text');
        if (langText) {
            langText.textContent = next.toUpperCase(); // 'VI' or 'EN'
        }
    }
    
    setLanguage(next);
}

// Initialize language on DOMContentLoaded if not already set
document.addEventListener('DOMContentLoaded', () => {
    const saved = localStorage.getItem('site_lang') || I18N.defaultLang;
    setLanguage(saved);
    
    // Update language button text on page load
    const btn = document.getElementById('langToggleBtn');
    if (btn) {
        const langText = btn.querySelector('.lang-text');
        if (langText) {
            langText.textContent = saved.toUpperCase(); // 'VI' or 'EN'
        }
    }
});

/* ======================= END I18N ======================= */


// ======================= CART MANAGEMENT =======================
let cart = [];
let cartCount = 0;

function addToCart(event, productName, price) {
    cart.push({ name: productName, price: price });
    cartCount++;
    document.getElementById('cartCount').textContent = cartCount;

    // Animation feedback
    const btn = event.target.closest('button'); // Lấy button chứa span
    const btnText = btn.querySelector('span[data-i18n]'); // Lấy span chứa text
    
    if (btnText) {
        const originalText = btnText.textContent;
        const currentLang = I18N.currentLang || localStorage.getItem('lang') || 'vi';
        
        // Lấy text "✓ Đã thêm" hoặc "✓ Added" từ i18n
        btnText.textContent = I18N.dict[currentLang]['notify.added'];
        btn.style.background = '#28a745';

        setTimeout(() => {
            btnText.textContent = originalText;
            btn.style.background = '';
        }, 1500);
    }
}

function openCart() {
    if (cartCount === 0) {
        alert('Giỏ hàng của bạn đang trống');
        return;
    }

    let cartContent = 'Giỏ hàng của bạn:\n\n';
    let total = 0;

    cart.forEach((item, i) => {
        cartContent += `${i + 1}. ${item.name}: ${item.price.toLocaleString()}₫\n`;
        total += item.price;
    });

    cartContent += `\nTổng: ${total.toLocaleString()}₫`;
    alert(cartContent);
}

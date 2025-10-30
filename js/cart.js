// ======================= CART MANAGEMENT =======================
let cart = [];
let cartCount = 0;

function addToCart(event, productName, price) {
    cart.push({ name: productName, price: price });
    cartCount++;
    document.getElementById('cartCount').textContent = cartCount;

    // Animation feedback
    const btn = event.target;
    const originalText = btn.textContent;
    btn.textContent = '✓ Đã thêm';
    btn.style.background = '#28a745';

    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
    }, 1500);
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

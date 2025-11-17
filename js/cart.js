// ======================= CART MANAGEMENT =======================
let cart = [];
let cartCount = 0;
let cartToastTimeout = null;

function addToCart(eventOrName, maybeName, maybePrice) {
    // Hỗ trợ cả cách gọi cũ: addToCart('Tên', price) và mới: addToCart(event, 'Tên', price)
    let event = null;
    let productName;
    let price;

    if (typeof eventOrName === 'string') {
        productName = eventOrName;
        price = maybeName;
    } else {
        event = eventOrName;
        productName = maybeName;
        price = maybePrice;
    }

    cart.push({ name: productName, price: price });
    cartCount++;

    const cartCountEl = document.getElementById('cartCount');
    if (cartCountEl) cartCountEl.textContent = cartCount;

    // Hiệu ứng trên nút nếu có event
    if (event) {
        const btn = event.target.closest('button');
        if (btn) {
            btn.classList.add('btn-added');
            setTimeout(() => btn.classList.remove('btn-added'), 500);
        }
    }

    // Hiển thị toast hiện đại
    showCartToast(productName, price);
}

function showCartToast(productName, price) {
    const toast = document.getElementById('cartToast');
    const textEl = document.getElementById('cartToastText');
    if (!toast || !textEl) return;

    const formattedPrice = typeof price === 'number' ? price.toLocaleString('vi-VN') + '₫' : '';
    textEl.textContent = formattedPrice
        ? `${productName} • ${formattedPrice}`
        : productName;

    toast.classList.add('show');

    if (cartToastTimeout) clearTimeout(cartToastTimeout);
    cartToastTimeout = setTimeout(() => {
        toast.classList.remove('show');
    }, 2600);

    const closeBtn = toast.querySelector('.cart-toast__close');
    if (closeBtn && !closeBtn._bound) {
        closeBtn.addEventListener('click', () => {
            toast.classList.remove('show');
        });
        closeBtn._bound = true;
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

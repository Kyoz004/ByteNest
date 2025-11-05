// Product Detail Page Script
(function() {
  function qs(sel){ return document.querySelector(sel); }
  function getParam(name){ return new URLSearchParams(window.location.search).get(name); }
  function fmtPrice(p){
    if (p == null) return '';
    const n = typeof p === 'number' ? p : parseFloat(String(p).replace(/[^\d.]/g, ''));
    if (isNaN(n)) return '';
    return n.toLocaleString('vi-VN') + '₫';
  }

  document.addEventListener('DOMContentLoaded', () => {
    const title = getParam('title') || 'Sản phẩm';
    const price = getParam('price');
    const oldPrice = getParam('old');
    const image = getParam('image');
    const category = getParam('category') || '';
    const badge = getParam('badge') || '';
    const rating = getParam('rating') || '';

    // Populate UI
    qs('#productTitle').textContent = title;
    qs('#crumbProduct').textContent = title;
    if (category) qs('#productCategory').textContent = category;
    if (rating) qs('#productRating').textContent = rating;

    if (price) qs('#productPrice').textContent = fmtPrice(price);
    if (oldPrice) {
      const el = qs('#productOldPrice');
      el.style.display = 'inline-block';
      el.textContent = fmtPrice(oldPrice);
    }

    if (badge) {
      const b = qs('#productBadge');
      b.style.display = 'inline-flex';
      b.textContent = badge;
    }

    const img = qs('#mainImage');
    if (image) img.src = image;
    else img.src = 'assets/products_img/placeholder.jpg';

    // Generate simple thumbs (duplicate main image if no extra provided)
    const thumbs = qs('#thumbs');
    const thumbList = [image, image, image].filter(Boolean);
    thumbList.forEach(src => {
      const t = new Image();
      t.src = src;
      t.alt = 'Thumb';
      t.addEventListener('click', () => img.src = src);
      thumbs.appendChild(t);
    });

    // Options interaction
    document.querySelectorAll('.pill').forEach(p => {
      p.addEventListener('click', () => {
        document.querySelectorAll('.pill').forEach(x => x.setAttribute('aria-pressed','false'));
        p.setAttribute('aria-pressed','true');
      });
    });
    document.querySelectorAll('.swatch').forEach(s => {
      s.addEventListener('click', () => {
        document.querySelectorAll('.swatch').forEach(x => x.setAttribute('aria-pressed','false'));
        s.setAttribute('aria-pressed','true');
      });
    });

    // Qty controls
    const qtyInput = qs('#qtyInput');
    qs('#qtyMinus').addEventListener('click', () => {
      qtyInput.value = Math.max(1, parseInt(qtyInput.value || '1', 10) - 1);
    });
    qs('#qtyPlus').addEventListener('click', () => {
      qtyInput.value = Math.max(1, parseInt(qtyInput.value || '1', 10) + 1);
    });

    // Tabs
    document.querySelectorAll('.tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
        document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        qs(`#tab-${tab.dataset.tab}`).classList.add('active');
      });
    });

    // Add to cart + Buy Now
    const priceNumber = price ? parseFloat(String(price).replace(/[^\d.]/g, '')) : 0;
    qs('#btnAddToCart').addEventListener('click', (e) => {
      if (typeof addToCart === 'function') {
        addToCart(e, title, priceNumber);
      }
    });
    qs('#btnBuyNow').addEventListener('click', (e) => {
      if (typeof addToCart === 'function') addToCart(e, title, priceNumber);
      window.location.href = 'cart.html';
    });
  });
})();

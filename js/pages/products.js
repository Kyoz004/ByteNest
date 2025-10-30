// ======================= PRODUCT FILTER =======================
function filterProducts(event, category) {
    const products = document.querySelectorAll('.product-card');
    const filterBtns = document.querySelectorAll('.filter-btn');

    // Update active button
    filterBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    products.forEach(product => {
        const categories = product.dataset.category;

        if (category === 'all' || categories.includes(category)) {
            product.style.display = 'block';
            setTimeout(() => (product.style.opacity = '1'), 10);
        } else {
            product.style.opacity = '0';
            setTimeout(() => (product.style.display = 'none'), 300);
        }
    });
}

// ======================= ADVANCED FILTER SYSTEM =======================
let activeFilters = {
    quick: 'all',
    categories: [],
    brands: [],
    price: null,
    sort: 'popular',
    search: ''
};

// Apply all filters and show matching products
function applyAllFilters() {
    const products = document.querySelectorAll('.product-card');
    let visibleCount = 0;

    products.forEach((product, index) => {
        const categories = product.dataset.category?.toLowerCase() || '';
        const title = product.querySelector('.product-title')?.textContent.toLowerCase() || '';
        const category = product.querySelector('.product-category')?.textContent.toLowerCase() || '';
        const priceText = product.querySelector('.price-current')?.textContent || '';
        const price = parseFloat(priceText.replace(/[^\d]/g, '')) / 1000; // Convert to millions

        let shouldShow = true;

        // Quick filter
        if (activeFilters.quick !== 'all' && !categories.includes(activeFilters.quick)) {
            shouldShow = false;
        }

        // Category filter
        if (activeFilters.categories.length > 0) {
            const hasCategory = activeFilters.categories.some(cat => categories.includes(cat));
            if (!hasCategory) shouldShow = false;
        }

        // Brand filter (check in title and category)
        if (activeFilters.brands.length > 0) {
            const hasBrand = activeFilters.brands.some(brand => 
                title.includes(brand) || category.includes(brand)
            );
            if (!hasBrand) shouldShow = false;
        }

        // Price filter
        if (activeFilters.price) {
            const range = activeFilters.price;
            if (range === '0-5' && price >= 5) shouldShow = false;
            else if (range === '5-10' && (price < 5 || price >= 10)) shouldShow = false;
            else if (range === '10-20' && (price < 10 || price >= 20)) shouldShow = false;
            else if (range === '20-30' && (price < 20 || price >= 30)) shouldShow = false;
            else if (range === '30-50' && (price < 30 || price >= 50)) shouldShow = false;
            else if (range === '50+' && price < 50) shouldShow = false;
        }

        // Search filter
        if (activeFilters.search && !title.includes(activeFilters.search) && !category.includes(activeFilters.search)) {
            shouldShow = false;
        }

        // Show/hide product with animation
        if (shouldShow) {
            visibleCount++;
            setTimeout(() => {
                product.style.display = 'block';
                requestAnimationFrame(() => {
                    product.style.opacity = '1';
                    product.style.transform = 'translateY(0)';
                });
            }, index * 20);
        } else {
            product.style.opacity = '0';
            product.style.transform = 'translateY(20px)';
            setTimeout(() => (product.style.display = 'none'), 220);
        }
    });

    // Update results count
    updateResultsCount(visibleCount);
    updateActiveFilterTags();
}

// Update results count display
function updateResultsCount(count) {
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        resultsCount.textContent = `Hiển thị ${count} sản phẩm`;
    }
}

// Update active filter tags
function updateActiveFilterTags() {
    const activeFiltersDiv = document.getElementById('activeFilters');
    const tagsContainer = document.getElementById('activeFilterTags');
    
    if (!activeFiltersDiv || !tagsContainer) return;

    tagsContainer.innerHTML = '';
    let hasActiveFilters = false;

    // Add category tags
    activeFilters.categories.forEach(cat => {
        hasActiveFilters = true;
        const tag = createFilterTag(cat, () => {
            activeFilters.categories = activeFilters.categories.filter(c => c !== cat);
            document.querySelector(`[data-category="${cat}"]`)?.classList.remove('active');
            applyAllFilters();
        });
        tagsContainer.appendChild(tag);
    });

    // Add brand tags
    activeFilters.brands.forEach(brand => {
        hasActiveFilters = true;
        const tag = createFilterTag(brand, () => {
            activeFilters.brands = activeFilters.brands.filter(b => b !== brand);
            document.querySelector(`[data-brand="${brand}"]`)?.classList.remove('active');
            applyAllFilters();
        });
        tagsContainer.appendChild(tag);
    });

    // Add price tag
    if (activeFilters.price) {
        hasActiveFilters = true;
        const priceLabels = {
            '0-5': 'Dưới 5 triệu',
            '5-10': '5-10 triệu',
            '10-20': '10-20 triệu',
            '20-30': '20-30 triệu',
            '30-50': '30-50 triệu',
            '50+': 'Trên 50 triệu'
        };
        const tag = createFilterTag(priceLabels[activeFilters.price], () => {
            activeFilters.price = null;
            document.querySelector(`[data-price="${activeFilters.price}"]`)?.classList.remove('active');
            applyAllFilters();
        });
        tagsContainer.appendChild(tag);
    }

    // Show/hide active filters section
    activeFiltersDiv.style.display = hasActiveFilters ? 'flex' : 'none';
}

// Create filter tag element
function createFilterTag(label, onRemove) {
    const tag = document.createElement('div');
    tag.className = 'active-filter-tag';
    tag.innerHTML = `
        ${label}
        <i class="bi bi-x"></i>
    `;
    tag.querySelector('.bi-x').addEventListener('click', onRemove);
    return tag;
}

// Backward compatibility
function applyFilter(category) {
    activeFilters.quick = category;
    applyAllFilters();
}

function filterProducts(category) {
    applyFilter(category);
}

// ======================= DOM READY =======================
document.addEventListener('DOMContentLoaded', () => {
    const productCards = document.querySelectorAll('.product-card');
    
    // Add initial animation state
    productCards.forEach(card => {
        card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    productCards.forEach(card => observer.observe(card));

    // ======================= SEARCH BAR =======================
    const searchInput = document.getElementById('searchInput');
    const clearSearch = document.getElementById('clearSearch');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            activeFilters.search = e.target.value.toLowerCase().trim();
            clearSearch.style.display = activeFilters.search ? 'block' : 'none';
            applyAllFilters();
        });
    }

    if (clearSearch) {
        clearSearch.addEventListener('click', () => {
            searchInput.value = '';
            activeFilters.search = '';
            clearSearch.style.display = 'none';
            applyAllFilters();
        });
    }

    // ======================= QUICK FILTERS =======================
    const quickFilters = document.querySelectorAll('.quick-filter-btn');
    quickFilters.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            quickFilters.forEach(b => {
                b.classList.toggle('is-active', b === btn);
                b.setAttribute('aria-pressed', b === btn ? 'true' : 'false');
            });
            activeFilters.quick = filter;
            applyAllFilters();
        });
    });

    // ======================= FILTER TOGGLE =======================
    const filterToggle = document.getElementById('filterToggle');
    const filterPanel = document.getElementById('filterPanel');

    if (filterToggle && filterPanel) {
        filterToggle.addEventListener('click', () => {
            filterPanel.classList.toggle('show');
            filterToggle.classList.toggle('active');
        });
    }

    // ======================= CATEGORY FILTERS =======================
    const categoryFilters = document.querySelectorAll('[data-category]');
    categoryFilters.forEach(btn => {
        btn.addEventListener('click', () => {
            const category = btn.dataset.category;
            btn.classList.toggle('active');
            
            if (btn.classList.contains('active')) {
                if (!activeFilters.categories.includes(category)) {
                    activeFilters.categories.push(category);
                }
            } else {
                activeFilters.categories = activeFilters.categories.filter(c => c !== category);
            }
            
            applyAllFilters();
        });
    });

    // ======================= BRAND FILTERS =======================
    const brandFilters = document.querySelectorAll('[data-brand]');
    brandFilters.forEach(btn => {
        btn.addEventListener('click', () => {
            const brand = btn.dataset.brand;
            btn.classList.toggle('active');
            
            if (btn.classList.contains('active')) {
                if (!activeFilters.brands.includes(brand)) {
                    activeFilters.brands.push(brand);
                }
            } else {
                activeFilters.brands = activeFilters.brands.filter(b => b !== brand);
            }
            
            applyAllFilters();
        });
    });

    // ======================= PRICE FILTERS =======================
    const priceFilters = document.querySelectorAll('[data-price]');
    priceFilters.forEach(btn => {
        btn.addEventListener('click', () => {
            priceFilters.forEach(b => b.classList.remove('active'));
            
            if (activeFilters.price === btn.dataset.price) {
                activeFilters.price = null;
            } else {
                btn.classList.add('active');
                activeFilters.price = btn.dataset.price;
            }
            
            applyAllFilters();
        });
    });

    // ======================= SORT FILTERS =======================
    const sortFilters = document.querySelectorAll('[data-sort]');
    sortFilters.forEach(btn => {
        btn.addEventListener('click', () => {
            sortFilters.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilters.sort = btn.dataset.sort;
            sortProducts(activeFilters.sort);
        });
    });

    // ======================= FILTER ACTIONS =======================
    const resetFilters = document.getElementById('resetFilters');
    if (resetFilters) {
        resetFilters.addEventListener('click', () => {
            // Reset all filters
            activeFilters = {
                quick: 'all',
                categories: [],
                brands: [],
                price: null,
                sort: 'popular',
                search: ''
            };
            
            // Reset UI
            document.querySelectorAll('.filter-option').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.quick-filter-btn').forEach(btn => {
                btn.classList.toggle('is-active', btn.dataset.filter === 'all');
                btn.setAttribute('aria-pressed', btn.dataset.filter === 'all' ? 'true' : 'false');
            });
            
            if (searchInput) {
                searchInput.value = '';
                clearSearch.style.display = 'none';
            }
            
            applyAllFilters();
        });
    }

    const applyFiltersBtn = document.getElementById('applyFilters');
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', () => {
            applyAllFilters();
            if (filterPanel) {
                filterPanel.classList.remove('show');
                filterToggle?.classList.remove('active');
            }
        });
    }

    const clearAllFilters = document.getElementById('clearAllFilters');
    if (clearAllFilters) {
        clearAllFilters.addEventListener('click', () => {
            resetFilters?.click();
        });
    }

    // ======================= ADD TO CART =======================
    const addToCartButtons = document.querySelectorAll('.btn-add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            const rect = this.getBoundingClientRect();
            ripple.style.left = e.clientX - rect.left + 'px';
            ripple.style.top = e.clientY - rect.top + 'px';
            this.appendChild(ripple);

            const originalHTML = this.innerHTML;
            this.innerHTML = '<i class="bi bi-check2-circle"></i><span>Đã thêm!</span>';
            this.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';

            setTimeout(() => {
                this.innerHTML = originalHTML;
                this.style.background = '';
                ripple.remove();
            }, 1500);
        });
    });
});

// ======================= SORT PRODUCTS =======================
function sortProducts(sortType) {
    const grid = document.getElementById('productGrid');
    const products = Array.from(document.querySelectorAll('.product-card'));

    products.sort((a, b) => {
        switch(sortType) {
            case 'price-low':
                const priceA = parseFloat(a.querySelector('.price-current').textContent.replace(/[^\d]/g, ''));
                const priceB = parseFloat(b.querySelector('.price-current').textContent.replace(/[^\d]/g, ''));
                return priceA - priceB;
            
            case 'price-high':
                const priceA2 = parseFloat(a.querySelector('.price-current').textContent.replace(/[^\d]/g, ''));
                const priceB2 = parseFloat(b.querySelector('.price-current').textContent.replace(/[^\d]/g, ''));
                return priceB2 - priceA2;
            
            case 'newest':
                return b.dataset.category?.includes('new') ? 1 : -1;
            
            case 'discount':
                const hasDiscountA = a.querySelector('.product-badge') ? 1 : 0;
                const hasDiscountB = b.querySelector('.product-badge') ? 1 : 0;
                return hasDiscountB - hasDiscountA;
            
            default: // popular
                return b.dataset.category?.includes('bestseller') ? 1 : -1;
        }
    });

    products.forEach(product => grid.appendChild(product));
    applyAllFilters(); // Reapply animations
}

// =========================================================
// SCRIPT UTAMA (js/main.js) - FINAL CRISPY MOCHIZZA
// =========================================================

// --- 1. SLIDER BACKGROUND HERO (Khusus Halaman Home) ---
const heroSection = document.getElementById('hero-section');
if (heroSection) {
    const heroImages = [
        './images/Original Mochi.jpeg',
        './images/Choco Mochi.jpeg',
        './images/Matcha Mochi.jpeg',
        './images/Strawberry Mochi.jpeg'
    ];
    let currentImageIndex = 0;
    function changeHeroBackground() {
        currentImageIndex = (currentImageIndex + 1) % heroImages.length;
        heroSection.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${heroImages[currentImageIndex]}')`;
    }
    setInterval(changeHeroBackground, 2500);
}

// --- 2. LOGIKA DATA ULASAN & RATING ---
const defaultReviews = [
    { id: 1, productId: 1, name: "Amanda Sari", rating: 5, text: "Konsepnya unik banget! Baru pertama kali makan mochi digoreng, dan mozzarella-nya beneran lumer parah.", date: "10/06/2026" },
    { id: 2, productId: 3, name: "Budi Santoso", rating: 4, text: "Matcha-nya kerasa premium, ukurannya juga lumayan bikin kenyang. Recommended!", date: "11/06/2026" }
];

let reviews = JSON.parse(localStorage.getItem('mochiReviewsV3')) || defaultReviews;

function renderReviews() {
    const container = document.getElementById('reviews-container');
    if (!container) return; 

    container.innerHTML = '';
    if (reviews.length === 0) {
        container.innerHTML = '<p style="text-align:center; width:100%;">Belum ada ulasan. Jadilah yang pertama!</p>';
        return;
    }

    [...reviews].reverse().forEach(rev => {
        let stars = '⭐'.repeat(rev.rating); 
        container.innerHTML += `
            <div class="review-card">
                <div class="review-header" style="align-items: flex-start;">
                    <div>
                        <span class="review-name">${rev.name}</span>
                        <div class="review-stars">${stars}</div>
                    </div>
                    <button onclick="deleteReview(${rev.id})" class="btn-delete-review" title="Hapus Ulasan">🗑️</button>
                </div>
                <p class="review-text">"${rev.text}"</p>
                <span class="review-date">${rev.date}</span>
            </div>
        `;
    });
}

function deleteReview(id) {
    if(confirm("Yakin ingin menghapus ulasan ini?")) {
        reviews = reviews.filter(rev => rev.id !== id);
        localStorage.setItem('mochiReviewsV3', JSON.stringify(reviews));
        renderReviews();
        if (typeof renderProducts === "function") renderProducts(); // Update bintang
    }
}

function submitReview(event) {
    event.preventDefault(); 
    const name = document.getElementById('reviewer-name').value;
    const productId = parseInt(document.getElementById('reviewer-product').value);
    const rating = parseInt(document.getElementById('reviewer-rating').value);
    const text = document.getElementById('reviewer-text').value;
    
    if (!productId || isNaN(productId)) {
        alert("Silakan pilih produk yang ingin diulas terlebih dahulu!");
        return;
    }

    const date = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
    const newReview = { id: Date.now(), productId, name, rating, text, date };
    
    reviews.push(newReview);
    localStorage.setItem('mochiReviewsV3', JSON.stringify(reviews));
    
    renderReviews();
    if (typeof renderProducts === "function") renderProducts(); // Update bintang
    document.getElementById('review-form').reset();
    alert('Terima kasih! Ulasan Anda berhasil ditambahkan. ⭐');
}

// --- 3. RENDER KATALOG PRODUK DENGAN BINTANG DINAMIS ---
function renderProducts() {
    const productContainer = document.getElementById('product-list');
    if (!productContainer) return; 

    productContainer.innerHTML = '';
    products.forEach(product => {
        // Hitung bintang otomatis dari ulasan
        const productReviews = reviews.filter(r => r.productId === product.id);
        let avgRating = 0;
        
        if (productReviews.length > 0) {
            const totalStars = productReviews.reduce((sum, rev) => sum + rev.rating, 0);
            avgRating = (totalStars / productReviews.length).toFixed(1);
        } else {
            avgRating = product.rating.toFixed(1); 
        }

        let originalPriceHtml = '';
        if (product.originalPrice) {
            originalPriceHtml = `<span class="price-original">Rp ${product.originalPrice.toLocaleString('id-ID')}</span>`;
        }

        productContainer.innerHTML += `
            <div class="card-shop">
                <div class="card-img-wrapper">
                    <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x300?text=Gambar+Kosong'">
                </div>
                <div class="card-body">
                    <h3>${product.name}</h3>
                    <div class="price-container">
                        <span class="price-current">Rp ${product.price.toLocaleString('id-ID')}</span>
                        ${originalPriceHtml}
                    </div>
                    <div class="card-meta">
                        <span class="rating">⭐ ${avgRating}</span>
                        <span class="divider">|</span>
                        <span class="sold">${product.sold} Terjual</span>
                    </div>
                    <button onclick="openProductModal(${product.id})" class="btn-shop">Pilih Pesanan</button>
                </div>
            </div>
        `;
    });
}

// --- 4. LOGIKA JENDELA (MODAL) PRODUK & DISKON ---
let currentModalProduct = null; 

function openProductModal(id) {
    currentModalProduct = products.find(p => p.id === id);
    
    document.getElementById('modal-img').src = currentModalProduct.image;
    document.getElementById('modal-title').innerText = currentModalProduct.name;
    document.getElementById('modal-desc').innerText = currentModalProduct.desc;
    document.getElementById('modal-qty').value = 1;
    
    updateModalPriceAndDiscount();
    
    const modalReviewsContainer = document.getElementById('modal-reviews-list');
    if (modalReviewsContainer) {
        const productReviews = reviews.filter(r => r.productId === id);
        if (productReviews.length === 0) {
            modalReviewsContainer.innerHTML = '<p style="text-align:center; color:#999; font-size:0.85rem; margin-top:10px;">Belum ada ulasan untuk varian ini.</p>';
        } else {
            modalReviewsContainer.innerHTML = '<h4 style="font-size:0.95rem; margin-bottom:10px; color:var(--primary-color);">Ulasan Varian Ini:</h4>';
            productReviews.reverse().forEach(rev => {
                let stars = '⭐'.repeat(rev.rating);
                modalReviewsContainer.innerHTML += `
                    <div class="mini-review">
                        <div class="mini-review-head">
                            <span class="mini-review-name">${rev.name}</span>
                            <span class="mini-review-stars">${stars}</span>
                        </div>
                        <p class="mini-review-text">"${rev.text}"</p>
                    </div>
                `;
            });
        }
    }
    document.getElementById('product-modal').style.display = 'block';
}

function closeProductModal() {
    const modal = document.getElementById('product-modal');
    if (modal) modal.style.display = 'none';
}

function changeQty(change) {
    const qtyInput = document.getElementById('modal-qty');
    let newQty = parseInt(qtyInput.value) + change;
    if (newQty < 1) newQty = 1; 
    qtyInput.value = newQty;
    updateModalPriceAndDiscount();
}

function updateModalPriceAndDiscount() {
    if (!currentModalProduct) return;
    
    const qty = parseInt(document.getElementById('modal-qty').value);
    const basePrice = currentModalProduct.price;
    let discountPercent = 0;

    if (qty >= 4) discountPercent = 20;
    else if (qty >= 2) discountPercent = 10;

    const subtotal = basePrice * qty;
    const discountAmount = subtotal * (discountPercent / 100);
    const finalPrice = subtotal - discountAmount;

    const priceOriginalEl = document.getElementById('modal-price-original');
    const priceFinalEl = document.getElementById('modal-price');
    const promoBadgeEl = document.getElementById('modal-promo-badge');

    if(priceFinalEl) priceFinalEl.innerText = `Rp ${finalPrice.toLocaleString('id-ID')}`;

    if (discountPercent > 0) {
        if(promoBadgeEl) {
            promoBadgeEl.innerHTML = `🎉 HORE! Kamu dapat Diskon ${discountPercent}%!`;
            promoBadgeEl.style.backgroundColor = "#e8f5e9";
            promoBadgeEl.style.color = "#27ae60"; 
        }
        if(priceOriginalEl) {
            priceOriginalEl.innerText = `Rp ${subtotal.toLocaleString('id-ID')}`;
            priceOriginalEl.style.display = "inline-block"; 
        }
    } else {
        if(promoBadgeEl) {
            promoBadgeEl.innerHTML = `✨ Promo: Beli 2 Diskon 10%, Beli 4 Diskon 20%! ✨`;
            promoBadgeEl.style.backgroundColor = "#fdf0ed";
            promoBadgeEl.style.color = "#e74c3c"; 
        }
        if(priceOriginalEl) priceOriginalEl.style.display = "none"; 
    }
}

// Menutup modal dengan klik area luar
window.addEventListener('click', function(event) {
    const modal = document.getElementById('product-modal');
    if (event.target === modal) modal.style.display = 'none';
});

// Mengeksekusi tombol "Masukkan Keranjang" di dalam modal
const modalAddBtn = document.getElementById('modal-add-btn');
if (modalAddBtn) {
    modalAddBtn.addEventListener('click', () => {
        const qty = parseInt(document.getElementById('modal-qty').value);
        if (currentModalProduct && typeof addToCart === 'function') {
            addToCart(currentModalProduct.id, qty);
            closeProductModal();
        }
    });
}

// --- 5. PEMICU AWAL SAAT WEB DIBUKA (JANGAN DIHAPUS) ---
document.addEventListener("DOMContentLoaded", () => {
    try {
        if (typeof products !== "undefined") renderProducts();
        renderReviews();
    } catch (error) {
        console.error("Ada kesalahan saat memuat tampilan:", error);
    }
});

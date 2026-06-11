// js/main.js

// --- 1. SLIDER BACKGROUND (Hanya jalan di halaman Home) ---
const heroSection = document.getElementById('hero-section');
if (heroSection) {
    // Menggunakan gambar produk mochi asli
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
    // Ganti gambar setiap 2.5 detik (2500 milidetik)
    setInterval(changeHeroBackground, 2500);
}

// --- 2. RENDER PRODUK (Hanya jalan di halaman Products) ---
function renderProducts() {
    const productContainer = document.getElementById('product-list');
    if (!productContainer) return; 

    productContainer.innerHTML = '';
    products.forEach(product => {
        
        // Logika untuk menampilkan harga coret jika ada diskon
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
                        <span class="rating">⭐ ${product.rating.toFixed(1)}</span>
                        <span class="divider">|</span>
                        <span class="sold">${product.sold} Terjual</span>
                    </div>
                    <button onclick="openProductModal(${product.id})" class="btn-shop">Pilih Pesanan</button>
                </div>
            </div>
        `;
    });
}

// --- 3. MODAL PRODUK ---
let selectedProductId = null;
const productModal = document.getElementById('product-modal');

function openProductModal(id) {
    const product = products.find(p => p.id === id);
    selectedProductId = id;
    
    document.getElementById('modal-img').src = product.image;
    document.getElementById('modal-title').innerText = product.name;
    document.getElementById('modal-desc').innerText = product.desc;
    document.getElementById('modal-price').innerText = `Rp ${product.price.toLocaleString('id-ID')}`;
    document.getElementById('modal-qty').value = 1;
    
    productModal.style.display = 'block';
}

function closeProductModal() {
    if(productModal) productModal.style.display = 'none';
}

function changeQty(amount) {
    const qtyInput = document.getElementById('modal-qty');
    if(!qtyInput) return;
    let currentQty = parseInt(qtyInput.value) + amount;
    if (currentQty < 1) currentQty = 1; 
    qtyInput.value = currentQty;
}

const modalAddBtn = document.getElementById('modal-add-btn');
if(modalAddBtn) {
    modalAddBtn.onclick = function() {
        const qty = parseInt(document.getElementById('modal-qty').value);
        addToCart(selectedProductId, qty);
        closeProductModal();
    }
}

// --- 4. MODAL KERANJANG ---
const cartModal = document.getElementById('cart-modal');
const cartBtn = document.getElementById('cart-btn');

if(cartBtn) {
    cartBtn.onclick = function() { cartModal.style.display = "block"; }
}

function closeModal() {
    if(cartModal) cartModal.style.display = "none";
    if (typeof showCartView === "function") showCartView();
}

window.onclick = function(event) {
    if (event.target === cartModal) closeModal();
    if (event.target === productModal) closeProductModal();
}

document.addEventListener("DOMContentLoaded", renderProducts);

// --- 5. LOGIKA RATING & ULASAN (Menggunakan LocalStorage) ---

// Berikan 2 ulasan awal (dummy) agar website tidak kosong melompong saat pertama dibuka
const defaultReviews = [
    { id: 1, name: "Amanda Sari", rating: 5, text: "Konsepnya unik banget! Baru pertama kali makan mochi digoreng, dan mozzarella-nya beneran lumer parah. Suka banget!", date: "10/06/2026" },
    { id: 2, name: "Budi Santoso", rating: 4, text: "Matcha-nya kerasa premium, ukurannya juga lumayan bikin kenyang. Recommended buat temen ngopi.", date: "11/06/2026" }
];

// Ambil data dari memori browser, kalau kosong pakai defaultReviews
let reviews = JSON.parse(localStorage.getItem('mochiReviews')) || defaultReviews;

// Fungsi menampilkan ulasan ke layar
function renderReviews() {
    const container = document.getElementById('reviews-container');
    if (!container) return; // Mencegah error jika bukan di halaman index.html

    container.innerHTML = '';
    // Tampilkan ulasan dari yang terbaru (reverse)
    [...reviews].reverse().forEach(rev => {
        let stars = '⭐'.repeat(rev.rating); // Mengubah angka 5 menjadi ⭐⭐⭐⭐⭐
        container.innerHTML += `
            <div class="review-card">
                <div class="review-header">
                    <span class="review-name">${rev.name}</span>
                    <span class="review-stars">${stars}</span>
                </div>
                <p class="review-text">"${rev.text}"</p>
                <span class="review-date">${rev.date}</span>
            </div>
        `;
    });
}

// Fungsi menyimpan ulasan saat tombol diklik
function submitReview(event) {
    event.preventDefault(); // Mencegah halaman ke-refresh

    const name = document.getElementById('reviewer-name').value;
    const rating = parseInt(document.getElementById('reviewer-rating').value);
    const text = document.getElementById('reviewer-text').value;
    
    // Ambil tanggal hari ini (Format Indonesia)
    const date = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });

    const newReview = { id: Date.now(), name, rating, text, date };
    
    // Masukkan ke daftar dan simpan ke memori browser
    reviews.push(newReview);
    localStorage.setItem('mochiReviews', JSON.stringify(reviews));
    
    // Perbarui tampilan web & bersihkan form
    renderReviews();
    document.getElementById('review-form').reset();
    
    // Notifikasi berhasil
    alert('Terima kasih! Ulasan Anda berhasil ditambahkan. ⭐');
}

// Render ulasan otomatis saat halaman selesai dimuat
document.addEventListener("DOMContentLoaded", () => {
    // Memastikan renderProducts jalan jika ada (dari kode sebelumnya)
    if (typeof renderProducts === "function") renderProducts();
    // Jalankan render ulasan
    renderReviews();
});

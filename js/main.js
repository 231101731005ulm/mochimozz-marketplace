// js/main.js

// 1. Logika Slideshow Background Hero
const heroSection = document.getElementById('hero-section');
const heroImages = [
    'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1920&q=80', // Gambar 1
    'https://images.unsplash.com/photo-1563805042-7684c8a9e9cb?auto=format&fit=crop&w=1920&q=80', // Gambar 2
    'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?auto=format&fit=crop&w=1920&q=80'  // Gambar 3
];
let currentImageIndex = 0;

function changeHeroBackground() {
    currentImageIndex = (currentImageIndex + 1) % heroImages.length;
    heroSection.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${heroImages[currentImageIndex]}')`;
}
// Ganti gambar setiap 4 detik (4000 ms) agar tidak terlalu cepat
setInterval(changeHeroBackground, 4000); 

// 2. Render Produk (Ubah tombol menjadi buka modal)
function renderProducts() {
    const productContainer = document.getElementById('product-list');
    productContainer.innerHTML = '';

    products.forEach(product => {
        productContainer.innerHTML += `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x200?text=Image+Not+Found'">
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="desc">${product.desc}</p>
                    <p class="price">Rp ${product.price.toLocaleString('id-ID')}</p>
                    <button onclick="openProductModal(${product.id})" class="btn-primary">Pilih Pesanan</button>
                </div>
            </div>
        `;
    });
}

// 3. Logika Modal Produk
let selectedProductId = null;
const productModal = document.getElementById('product-modal');

function openProductModal(id) {
    const product = products.find(p => p.id === id);
    selectedProductId = id;
    
    // Isi data modal dengan data produk
    document.getElementById('modal-img').src = product.image;
    document.getElementById('modal-title').innerText = product.name;
    document.getElementById('modal-desc').innerText = product.desc;
    document.getElementById('modal-price').innerText = `Rp ${product.price.toLocaleString('id-ID')}`;
    document.getElementById('modal-qty').value = 1; // Reset jumlah selalu ke 1
    
    productModal.style.display = 'block';
}

function closeProductModal() {
    productModal.style.display = 'none';
}

// Fungsi tambah/kurang jumlah di modal
function changeQty(amount) {
    const qtyInput = document.getElementById('modal-qty');
    let currentQty = parseInt(qtyInput.value);
    currentQty += amount;
    
    // Cegah jumlah kurang dari 1
    if (currentQty < 1) currentQty = 1; 
    qtyInput.value = currentQty;
}

// Tombol eksekusi masuk ke keranjang dari modal
document.getElementById('modal-add-btn').onclick = function() {
    const qty = parseInt(document.getElementById('modal-qty').value);
    addToCart(selectedProductId, qty); // Panggil fungsi di cart.js
    closeProductModal();
}

// 4. Logika Modal Keranjang
const cartModal = document.getElementById('cart-modal');
const cartBtn = document.getElementById('cart-btn');

cartBtn.onclick = function() { cartModal.style.display = "block"; }

function closeModal() {
    cartModal.style.display = "none";
    if (typeof showCartView === "function") { showCartView(); }
}

// Klik di luar area pop-up untuk menutup
window.onclick = function(event) {
    if (event.target === cartModal) closeModal();
    if (event.target === productModal) closeProductModal();
}

// Inisialisasi awal
document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
});

// js/main.js

// --- 1. SLIDER BACKGROUND (Hanya jalan di halaman Home) ---
const heroSection = document.getElementById('hero-section');
if (heroSection) {
    const heroImages = [
        'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1563805042-7684c8a9e9cb?auto=format&fit=crop&w=1920&q=80',
        'https://images.unsplash.com/photo-1603569283847-aa295f0d016a?auto=format&fit=crop&w=1920&q=80'
    ];
    let currentImageIndex = 0;

    function changeHeroBackground() {
        currentImageIndex = (currentImageIndex + 1) % heroImages.length;
        heroSection.style.backgroundImage = `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url('${heroImages[currentImageIndex]}')`;
    }
    setInterval(changeHeroBackground, 4000);
}

// --- 2. RENDER PRODUK (Hanya jalan di halaman Products) ---
function renderProducts() {
    const productContainer = document.getElementById('product-list');
    if (!productContainer) return; // Cegah error di halaman lain

    productContainer.innerHTML = '';
    products.forEach(product => {
        productContainer.innerHTML += `
            <div class="card">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x200?text=Gambar+Kosong'">
                <div style="padding: 20px;">
                    <h3 style="margin-bottom: 10px; color: var(--primary-color);">${product.name}</h3>
                    <p style="color: #666; font-size: 0.9rem; margin-bottom: 15px;">${product.desc}</p>
                    <p style="font-weight: bold; font-size: 1.2rem; margin-bottom: 15px;">Rp ${product.price.toLocaleString('id-ID')}</p>
                    <button onclick="openProductModal(${product.id})" class="btn-primary" style="width: 100%;">Pilih Pesanan</button>
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

// Background Slider
const heroSection = document.getElementById('hero-section');
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

// Render Produk ke Web
function renderProducts() {
    const productContainer = document.getElementById('product-list');
    productContainer.innerHTML = '';

    products.forEach(product => {
        productContainer.innerHTML += `
            <div class="product-card">
                <img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/300x200?text=Gambar+Kosong'">
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

// Logika Modal Produk (Pop-up Detail)
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
    productModal.style.display = 'none';
}

function changeQty(amount) {
    const qtyInput = document.getElementById('modal-qty');
    let currentQty = parseInt(qtyInput.value) + amount;
    if (currentQty < 1) currentQty = 1; 
    qtyInput.value = currentQty;
}

document.getElementById('modal-add-btn').onclick = function() {
    const qty = parseInt(document.getElementById('modal-qty').value);
    addToCart(selectedProductId, qty);
    closeProductModal();
}

// Logika Modal Keranjang
const cartModal = document.getElementById('cart-modal');
document.getElementById('cart-btn').onclick = function() { cartModal.style.display = "block"; }

function closeModal() {
    cartModal.style.display = "none";
    if (typeof showCartView === "function") showCartView();
}

// Klik area luar modal untuk menutup
window.onclick = function(event) {
    if (event.target === cartModal) closeModal();
    if (event.target === productModal) closeProductModal();
}

document.addEventListener("DOMContentLoaded", renderProducts);

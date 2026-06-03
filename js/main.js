// Render produk secara dinamis ke halaman HTML
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
                    <button onclick="addToCart(${product.id})" class="btn-primary">Tambah ke Keranjang</button>
                </div>
            </div>
        `;
    });
}

// Logika Modal (Pop-up Keranjang)
const cartModal = document.getElementById('cart-modal');
const cartBtn = document.getElementById('cart-btn');
const closeBtn = document.querySelector('.close-btn');

cartBtn.onclick = function() {
    cartModal.style.display = "block";
}

// Fungsi menutup modal dan mengembalikan view ke keranjang
function closeModal() {
    cartModal.style.display = "none";
    if (typeof showCartView === "function") { 
        showCartView(); 
    }
}

closeBtn.onclick = closeModal;

window.onclick = function(event) {
    if (event.target === cartModal) {
        closeModal();
    }
}

// Eksekusi saat halaman pertama kali dimuat
document.addEventListener("DOMContentLoaded", () => {
    renderProducts();
});

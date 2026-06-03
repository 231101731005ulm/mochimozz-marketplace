// js/cart.js

// Ambil data dari LocalStorage jika ada, jika kosong gunakan array []
let cart = JSON.parse(localStorage.getItem('mochiCart')) || [];

// Panggil update UI saat halaman pertama dimuat agar angka keranjang muncul
document.addEventListener("DOMContentLoaded", updateCartUI);

function showToast(message) {
    const toast = document.getElementById('toast');
    if(!toast) return;
    toast.innerText = message;
    toast.className = "toast show";
    setTimeout(function() { 
        toast.className = toast.className.replace("show", ""); 
    }, 3000);
}

function saveCart() {
    // Simpan keranjang ke memori browser
    localStorage.setItem('mochiCart', JSON.stringify(cart));
}

function addToCart(productId, qtyToAdd = 1) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.qty += qtyToAdd;
    } else {
        cart.push({ ...product, qty: qtyToAdd });
    }
    
    saveCart(); // Simpan perubahan
    updateCartUI();
    showToast(`${qtyToAdd}x ${product.name} masuk keranjang! 🛒`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart(); // Simpan perubahan
    updateCartUI();
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const btnProceed = document.getElementById('btn-proceed');
    
    let total = 0;
    let count = 0;

    // Hitung total dulu untuk angka di tombol keranjang navbar
    cart.forEach(item => {
        total += item.price * item.qty;
        count += item.qty;
    });

    if(cartCount) cartCount.innerText = count;

    // Jika elemen UI keranjang (di dalam modal) ada, perbarui juga
    if(cartItemsContainer && cartTotal && btnProceed) {
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Keranjang masih kosong.</p>';
            btnProceed.style.display = 'none';
        } else {
            btnProceed.style.display = 'block';
            cart.forEach(item => {
                cartItemsContainer.innerHTML += `
                    <div class="cart-item">
                        <div>
                            <h4 style="margin-bottom:5px;">${item.name}</h4>
                            <p>Rp ${item.price.toLocaleString('id-ID')} x ${item.qty}</p>
                        </div>
                        <button type="button" class="btn-secondary" style="padding: 5px 10px;" onclick="removeFromCart(${item.id})">Hapus</button>
                    </div>
                `;
            });
        }
        cartTotal.innerText = `Rp ${total.toLocaleString('id-ID')}`;
    }
}

function showCheckoutView() {
    document.getElementById('cart-view').style.display = 'none';
    document.getElementById('checkout-view').style.display = 'block';
}

function showCartView() {
    document.getElementById('checkout-view').style.display = 'none';
    document.getElementById('cart-view').style.display = 'block';
}

function processPayment(event) {
    event.preventDefault();

    if (cart.length === 0) {
        showToast("Keranjang kosong!");
        return;
    }

    const name = document.getElementById('cust-name').value;
    const method = document.getElementById('payment-method').value;
    const receiptContainer = document.getElementById('print-receipt');
    const date = new Date().toLocaleString('id-ID');
    const orderId = 'INV-' + Math.floor(Math.random() * 1000000);
    
    let total = 0;
    let itemHtml = '';

    cart.forEach(item => {
        let subtotal = item.price * item.qty;
        total += subtotal;
        itemHtml += `
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>${item.name} (x${item.qty})</span>
                <span>Rp ${subtotal.toLocaleString('id-ID')}</span>
            </div>
        `;
    });

    receiptContainer.innerHTML = `
        <div style="text-align: center; border-bottom: 1px dashed black; padding-bottom: 10px; margin-bottom: 10px;">
            <h2 style="margin: 0; font-size: 18px;">CRISPY MOCHIZZA</h2>
            <p style="margin: 5px 0 0 0;">Banjarbaru, Kalimantan Selatan</p>
            <p style="margin: 0; font-size: 10px;">${date}</p>
        </div>
        <div style="margin-bottom: 15px; font-size: 12px;">
            <p style="margin: 2px 0;"><strong>No:</strong> ${orderId}</p>
            <p style="margin: 2px 0;"><strong>Nama:</strong> ${name}</p>
            <p style="margin: 2px 0;"><strong>Bayar:</strong> ${method}</p>
        </div>
        <div style="border-bottom: 1px dashed black; padding-bottom: 10px; margin-bottom: 10px; font-size: 12px;">
            ${itemHtml}
        </div>
        <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 14px;">
            <span>TOTAL:</span>
            <span>Rp ${total.toLocaleString('id-ID')}</span>
        </div>
        <div style="text-align: center; margin-top: 20px; font-size: 12px;">
            <h3 style="margin: 0;">-- LUNAS --</h3>
            <p style="margin: 5px 0 0 0;">Terima kasih atas pesanan Anda!</p>
        </div>
    `;

    window.print();

    // Reset keranjang dari UI dan Memori Browser setelah sukses cetak
    cart = [];
    saveCart();
    updateCartUI();
    document.getElementById('checkout-form').reset();
    document.getElementById('cart-modal').style.display = "none";
    showCartView();
}

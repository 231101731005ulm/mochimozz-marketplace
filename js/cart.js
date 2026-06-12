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
    
    saveCart(); 
    updateCartUI();
    showToast(`${qtyToAdd}x ${product.name} masuk keranjang! 🛒`);
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart(); 
    updateCartUI();
}

// --- SISTEM KERANJANG DENGAN DISKON ---
function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const btnProceed = document.getElementById('btn-proceed');
    
    let grandTotal = 0;
    let count = 0;

    cart.forEach(item => count += item.qty);
    if(cartCount) cartCount.innerText = count;

    if(cartItemsContainer && cartTotal && btnProceed) {
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>Keranjang masih kosong.</p>';
            btnProceed.style.display = 'none';
            cartTotal.innerText = `Rp 0`;
        } else {
            btnProceed.style.display = 'block';
            
            cart.forEach(item => {
                let discountPercent = 0;
                if (item.qty >= 4) discountPercent = 20;
                else if (item.qty >= 2) discountPercent = 10;

                const subtotal = item.price * item.qty;
                const discountAmount = subtotal * (discountPercent / 100);
                const finalPrice = subtotal - discountAmount;

                grandTotal += finalPrice;

                let promoBadge = '';
                let priceDisplay = `Rp ${item.price.toLocaleString('id-ID')} x ${item.qty}`;
                
                if (discountPercent > 0) {
                    promoBadge = `<span style="color: #27ae60; font-size: 0.75rem; background: #e8f5e9; padding: 2px 6px; border-radius: 4px; margin-left: 8px; font-weight: bold; vertical-align: middle;">Diskon ${discountPercent}%</span>`;
                    priceDisplay = `<span style="text-decoration: line-through; color: #999; margin-right: 5px;">Rp ${subtotal.toLocaleString('id-ID')}</span> <strong style="color: var(--primary-color); font-size: 0.95rem;">Rp ${finalPrice.toLocaleString('id-ID')}</strong>`;
                }

                cartItemsContainer.innerHTML += `
                    <div class="cart-item" style="border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 10px; align-items: center;">
                        <div style="flex-grow: 1;">
                            <h4 style="margin-bottom:5px;">${item.name} ${promoBadge}</h4>
                            <p style="margin: 0;">${priceDisplay}</p>
                        </div>
                        <button type="button" class="btn-secondary" style="padding: 5px 10px; margin-left: 10px;" onclick="removeFromCart(${item.id})">Hapus</button>
                    </div>
                `;
            });
            cartTotal.innerText = `Rp ${grandTotal.toLocaleString('id-ID')}`;
        }
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

// --- SISTEM PEMBAYARAN & STRUK DIGITAL ---
function processPayment(event) {
    event.preventDefault();

    if (cart.length === 0) {
        showToast("Keranjang kosong!");
        return;
    }

    const name = document.getElementById('cust-name').value;
    const method = document.getElementById('payment-method').value;
    const paperContainer = document.getElementById('thermal-paper-container'); 
    const date = new Date().toLocaleString('id-ID');
    const orderId = 'INV-' + Math.floor(Math.random() * 1000000);
    
    let grandTotal = 0;
    let itemHtml = '';

    cart.forEach(item => {
        let discountPercent = 0;
        if (item.qty >= 4) discountPercent = 20;
        else if (item.qty >= 2) discountPercent = 10;

        const subtotal = item.price * item.qty;
        const discountAmount = subtotal * (discountPercent / 100);
        const finalPrice = subtotal - discountAmount;

        grandTotal += finalPrice;

        let discountInfo = discountPercent > 0 ? `<br><small style="font-size: 11px; color: #e74c3c;">(Diskon ${discountPercent}%)</small>` : '';

        itemHtml += `
            <div class="thermal-item">
                <span style="flex: 1; padding-right: 10px;">${item.name} (x${item.qty}) ${discountInfo}</span>
                <span>Rp ${finalPrice.toLocaleString('id-ID')}</span>
            </div>
        `;
    });

    if (paperContainer) {
        paperContainer.innerHTML = `
            <div class="thermal-header">
                <h2>CRISPY MOCHIZZA</h2>
                <p>Banjarbaru, Kalimantan Selatan</p>
                <p>${date}</p>
            </div>
            <div class="thermal-info">
                <p><strong>No. Order :</strong> ${orderId}</p>
                <p><strong>Pelanggan :</strong> ${name}</p>
                <p><strong>Pembayaran:</strong> ${method}</p>
            </div>
            <div class="thermal-items">
                ${itemHtml}
            </div>
            <div class="thermal-total">
                <span>TOTAL</span>
                <span>Rp ${grandTotal.toLocaleString('id-ID')}</span>
            </div>
            <div class="thermal-footer">
                <h3>-- LUNAS --</h3>
                <p style="font-size: 0.85rem; margin-top: 5px;">Terima kasih telah berbelanja!</p>
                <p style="font-size: 0.7rem; color: #94a3b8; margin-top: 5px;">*Tunjukkan struk digital ini kepada kasir</p>
            </div>
        `;
    }

    cart = [];
    saveCart();
    updateCartUI();
    document.getElementById('checkout-form').reset();
    document.getElementById('payment-info-container').style.display = 'none'; 
    
    document.getElementById('cart-modal').style.display = "none";
    showCartView(); 

    const receiptModal = document.getElementById('digital-receipt-modal');
    if (receiptModal) receiptModal.style.display = 'block';
}

function closeReceiptModal() {
    const receiptModal = document.getElementById('digital-receipt-modal');
    if (receiptModal) receiptModal.style.display = 'none';
    showToast("Pesanan Selesai! 🎉");
}

// ==========================================
// FUNGSI BUKA & TUTUP JENDELA KERANJANG
// ==========================================

function openCartModal() {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.style.display = 'block';
        showCartView(); 
    } else {
        console.error("Modal keranjang tidak ditemukan di HTML.");
    }
}

function closeCartModal() {
    const cartModal = document.getElementById('cart-modal');
    if (cartModal) {
        cartModal.style.display = 'none';
    }
}

// ==========================================
// FUNGSI INFO PEMBAYARAN DINAMIS (QRIS / VA)
// ==========================================

function togglePaymentInfo() {
    const method = document.getElementById('payment-method').value;
    const infoContainer = document.getElementById('payment-info-container');
    
    if (!infoContainer) return;

    if (method === 'QRIS') {
        infoContainer.style.display = 'block';
        infoContainer.innerHTML = `
            <h4 style="margin-bottom: 10px; color: #333;">Scan QRIS</h4>
            <img src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" alt="QRIS Dummy" style="width: 150px; height: 150px; margin: 0 auto; display: block; border: 5px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.1); border-radius: 10px;">
            <p style="font-size: 0.85rem; color: #666; margin-top: 10px;">Atas Nama: <strong>Crispy Mochizza</strong><br>Silakan scan menggunakan GoPay, OVO, Dana, atau M-Banking Anda.</p>
        `;
    } else if (method === 'Transfer Bank') {
        infoContainer.style.display = 'block';
        infoContainer.innerHTML = `
            <h4 style="margin-bottom: 10px; color: #333;">Transfer Virtual Account</h4>
            <div style="background: var(--primary-color); color: white; padding: 10px; border-radius: 5px; font-size: 1.3rem; font-weight: bold; letter-spacing: 3px; width: fit-content; margin: 0 auto;">
                1234-5678-9012
            </div>
            <p style="font-size: 0.85rem; color: #666; margin-top: 10px;">Bank BCA a.n. <strong>Crispy Mochizza</strong><br>Pesanan akan otomatis diproses setelah transfer berhasil.</p>
        `;
    } else {
        infoContainer.style.display = 'none';
        infoContainer.innerHTML = '';
    }
}

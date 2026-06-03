```javascript
let cart = [];

function addToCart(productId) {

    const product = products.find(
        item => item.id === productId
    );

    if (!product) return;

    const existingItem = cart.find(
        item => item.id === productId
    );

    if (existingItem) {

        existingItem.qty++;

    } else {

        cart.push({
            ...product,
            qty: 1
        });

    }

    renderCart();
}

function removeFromCart(productId) {

    cart = cart.filter(
        item => item.id !== productId
    );

    renderCart();
}

function formatRupiah(number) {

    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            minimumFractionDigits: 0
        }
    ).format(number);

}

function renderCart() {

    const cartItems =
        document.getElementById("cart-items");

    const cartTotal =
        document.getElementById("cart-total");

    if (!cartItems || !cartTotal) return;

    if (cart.length === 0) {

        cartItems.innerHTML = `
            <p>Keranjang masih kosong 🛒</p>
        `;

        cartTotal.innerHTML =
            "Total: Rp0";

        return;
    }

    let html = "";

    let total = 0;

    cart.forEach(item => {

        const subtotal =
            item.price * item.qty;

        total += subtotal;

        html += `

        <div class="cart-item">

            <div>

                <h4>${item.name}</h4>

                <p>
                    Qty: ${item.qty}
                </p>

                <p>
                    ${formatRupiah(subtotal)}
                </p>

            </div>

            <button
                onclick="removeFromCart(${item.id})">

                Hapus

            </button>

        </div>

        `;
    });

    cartItems.innerHTML = html;

    cartTotal.innerHTML =
        `Total: ${formatRupiah(total)}`;
}
```


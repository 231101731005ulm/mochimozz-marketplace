```javascript
const productContainer = document.getElementById("product-container");

function formatRupiah(number) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
    }).format(number);
}

function renderProducts() {

    if (!productContainer) return;

    let html = "";

    products.forEach(product => {

        html += `

        <div class="product-card">

            <img src="${product.image}" alt="${product.name}">

            <div class="product-content">

                <span class="product-tag">
                    ${product.tag}
                </span>

                <h3>
                    ${product.name}
                </h3>

                <p>
                    ${product.description}
                </p>

                <div class="price">
                    ${formatRupiah(product.price)}
                </div>

                <button
                    class="buy-btn"
                    onclick="addToCart(${product.id})">

                    Tambah ke Keranjang

                </button>

            </div>

        </div>

        `;

    });

    productContainer.innerHTML = html;
}

function addToCart(productId) {

    const product = products.find(
        item => item.id === productId
    );

    if (!product) return;

    alert(
        `${product.name} berhasil ditambahkan ke keranjang 🛒`
    );
}

document.addEventListener("DOMContentLoaded", () => {

    renderProducts();

});
```

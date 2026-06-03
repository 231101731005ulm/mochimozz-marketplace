```javascript
const checkoutButton =
    document.getElementById("checkout-btn");

if (checkoutButton) {

    checkoutButton.addEventListener(
        "click",
        checkoutWhatsApp
    );

}

function checkoutWhatsApp() {

    if (cart.length === 0) {

        alert(
            "Keranjang masih kosong 🛒"
        );

        return;
    }

    let message =
`Halo Crispy Mochizza 🍡

Saya ingin memesan:

`;

    let total = 0;

    cart.forEach(item => {

        const subtotal =
            item.price * item.qty;

        total += subtotal;

        message +=
`• ${item.name}
  Qty : ${item.qty}
  Subtotal : ${formatRupiah(subtotal)}

`;

    });

    message +=
`Total Pesanan:
${formatRupiah(total)}

Terima kasih 🙏`;

    const whatsappNumber =
        "6281234567890";

    const whatsappURL =
        `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

    window.open(
        whatsappURL,
        "_blank"
    );
}
```


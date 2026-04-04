(() => {
    "use strict";

    const PRODUCTS = [
        {
            id: "classic-red-velvet",
            name: "Cake",
            price: 24.0,
            img: "cake.jpg",
            desc: "Red velvet cake with a smooth cream-cheese style frosting."
        },
        {
            id: "strawberry-silk",
            name: "Cupcake",
            price: 26.0,
            img: "cupcake.jpg",
            desc: "Red velvet cupcake with a light, silky frosting."
        },
        {
            id: "bundt-cake",
            name: "Bundt Cake",
            price: 30.0,
            img: "bundtcake.jpg",
            desc: "Red velvet bundt cake with a tender crumb and a silky glaze."
        },
        {
            id: "cake-slice",
            name: "Cake Slice",
            price: 14.0,
            img: "cakeslice.jpg",
            desc: "A red velvet cake slice, moist and frosted."
        },
        {
            id: "berry-parfait",
            name: "Parfait",
            price: 12.0,
            img: "parfait.jpg",
            desc: "Red velvet parfait layered with cream and a delicate crumble."
        },
        {
            id: "cake-balls",
            name: "Cake Balls",
            price: 9.0,
            img: "balls.jpg",
            desc: "Red velvet cake balls with a sweet coating and a soft center."
        },
        {
            id: "dark-chocolate-ganache",
            name: "Brownies",
            price: 28.0,
            img: "brownies.jpg",
            desc: "Red velvet brownies with a rich, fudgy bite."
        },
        {
            id: "vanilla-bean-cloud",
            name: "Cookies",
            price: 22.0,
            img: "cookies.jpg",
            desc: "Red velvet cookies with a soft center and a sweet finish."
        },
        {
            id: "caramel-hazelnut",
            name: "Cake Roll",
            price: 27.0,
            img: "cakeroll.jpg",
            desc: "Red velvet cake roll with a smooth cream filling."
        },
        {
            id: "lemon-raspberry",
            name: "Macarons",
            price: 25.0,
            img: "macarons.jpg",
            desc: "Red velvet macarons with a delicate, creamy center."
        },
        {
            id: "mini-cake",
            name: "Mini Cake",
            price: 10.0,
            img: "minicake.jpg",
            desc: "A petite red velvet mini cake, frosted and ready to share."
        },
        {
            id: "cinnamon-roll",
            name: "Cinnamon Roll",
            price: 8.0,
            img: "cinammonroll.jpg",
            desc: "Red velvet cinnamon roll with a sweet glaze and warm spice."
        }
    ];

    const CART_KEY = "velvet_crust_cart_v1";

    const $ = (id) => document.getElementById(id);
    const php = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" });
    const money = (n) => php.format(Number(n) || 0);

    function nowInManila() {
        return new Date().toLocaleString("en-PH", {
            timeZone: "Asia/Manila",
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        });
    }

    function randomOrderId() {
        // Simple human-friendly id for a demo site.
        const part = Math.random().toString(16).slice(2, 8).toUpperCase();
        return `VC-${part}`;
    }

    function loadCart() {
        try {
            const raw = localStorage.getItem(CART_KEY);
            if (!raw) return {};
            const cart = JSON.parse(raw);
            if (!cart || typeof cart !== "object") return {};
            return cart;
        } catch {
            return {};
        }
    }

    function saveCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
    }

    function clearCart() {
        localStorage.removeItem(CART_KEY);
        setCartCount();
    }

    function cartQtyTotal(cart) {
        return Object.values(cart).reduce((sum, qty) => sum + (Number(qty) || 0), 0);
    }

    function setCartCount() {
        const el = $("cart-count");
        if (!el) return;
        const cart = loadCart();
        el.textContent = String(cartQtyTotal(cart));
    }

    function getProduct(id) {
        return PRODUCTS.find((p) => p.id === id) || null;
    }

    function addToCart(productId, qty) {
        const cart = loadCart();
        const cur = Number(cart[productId] || 0);
        cart[productId] = cur + qty;
        saveCart(cart);
        setCartCount();
    }

    function removeFromCart(productId) {
        const cart = loadCart();
        delete cart[productId];
        saveCart(cart);
        setCartCount();
    }

    function updateCartQty(productId, qty) {
        const cart = loadCart();
        if (qty <= 0) {
            delete cart[productId];
        } else {
            cart[productId] = qty;
        }
        saveCart(cart);
        setCartCount();
    }

    function modalController() {
        const overlay = $("cart-modal");
        const titleEl = $("modal-title");
        const msgEl = $("modal-msg");
        const qtyBox = $("qty-box");
        const qtyInput = $("item-qty");
        const yesBtn = $("modal-yes");
        const noBtn = $("modal-no");

        if (!overlay || !titleEl || !msgEl || !qtyBox || !qtyInput || !yesBtn || !noBtn) {
            return null;
        }

        let onYes = null;
        let onNo = null;
        let allowOverlayClose = true;
        let allowEscClose = true;

        function close() {
            overlay.style.display = "none";
            onYes = null;
            onNo = null;
            allowOverlayClose = true;
            allowEscClose = true;
        }

        function open({
            title,
            message,
            messageHTML,
            withQty,
            qtyDefault,
            yesText,
            noText,
            closeOnOverlay = true,
            closeOnEsc = true,
            onConfirm,
            onCancel
        }) {
            titleEl.textContent = title || "Confirm";
            msgEl.textContent = "";
            msgEl.innerHTML = "";

            if (typeof message === "string") {
                msgEl.textContent = message;
            }

            if (typeof messageHTML === "string") {
                msgEl.innerHTML = messageHTML;
            }

            allowOverlayClose = closeOnOverlay !== false;
            allowEscClose = closeOnEsc !== false;

            if (withQty) {
                qtyBox.style.display = "";
                qtyInput.value = String(qtyDefault || 1);
                qtyInput.focus();
                qtyInput.select?.();
            } else {
                qtyBox.style.display = "none";
            }

            yesBtn.textContent = yesText || "Yes";
            noBtn.textContent = noText || "No";

            onYes = () => {
                const qty = Math.max(1, Number(qtyInput.value || 1));
                onConfirm?.(withQty ? qty : null);
                close();
            };
            onNo = () => {
                onCancel?.();
                close();
            };

            overlay.style.display = "flex";
        }

        yesBtn.addEventListener("click", (e) => {
            e.preventDefault();
            onYes?.();
        });
        noBtn.addEventListener("click", (e) => {
            e.preventDefault();
            onNo?.();
        });
        overlay.addEventListener("click", (e) => {
            if (e.target === overlay && allowOverlayClose) onNo?.();
        });
        document.addEventListener("keydown", (e) => {
            if (overlay.style.display !== "flex") return;
            if (e.key === "Escape" && allowEscClose) onNo?.();
            if (e.key === "Enter") onYes?.();
        });

        return { open, close };
    }

    function productCardHTML(p) {
        return `
            <article class="cake-card">
                <img class="cake-img" src="${p.img}" alt="${p.name}">
                <div class="cake-body">
                    <h3 class="cake-title">${p.name}</h3>
                    <p class="cake-desc">${p.desc}</p>
                    <div class="cake-row">
                        <div class="cake-price">${money(p.price)}</div>
                        <button class="btn cake-add" data-add="${p.id}" type="button">Add</button>
                    </div>
                </div>
            </article>
        `;
    }

    function renderGrid(gridEl, products) {
        gridEl.innerHTML = products.map(productCardHTML).join("");
    }

    function wireAddButtons(rootEl, modal) {
        rootEl.addEventListener("click", (e) => {
            const btn = e.target.closest?.("[data-add]");
            if (!btn) return;
            const productId = btn.getAttribute("data-add");
            const p = getProduct(productId);
            if (!p) return;

            modal.open({
                title: "Add to cart",
                message: `${p.name} (${money(p.price)})`,
                withQty: true,
                qtyDefault: 1,
                yesText: "Add",
                noText: "Cancel",
                onConfirm: (qty) => addToCart(productId, Number(qty) || 1)
            });
        });
    }

    function renderSummary() {
        const bodyEl = $("cart-items");
        const totalEl = $("total-price");
        if (!bodyEl || !totalEl) return;

        const cart = loadCart();
        const rows = [];
        let total = 0;

        for (const [productId, qtyRaw] of Object.entries(cart)) {
            const p = getProduct(productId);
            const qty = Math.max(1, Number(qtyRaw) || 1);
            if (!p) continue;
            const subtotal = p.price * qty;
            total += subtotal;

            rows.push(`
                <tr data-row="${productId}">
                    <td class="thumb-cell"><img class="thumb" src="${p.img}" alt="${p.name}"></td>
                    <td>${p.name}</td>
                    <td class="qty-cell">
                        <input class="qty-input" data-qty="${productId}" type="number" min="1" value="${qty}">
                    </td>
                    <td class="money">${money(subtotal)}</td>
                    <td class="action-cell">
                        <button class="btn btn-danger" data-remove="${productId}" type="button">Remove</button>
                    </td>
                </tr>
            `);
        }

        if (rows.length === 0) {
            bodyEl.innerHTML = `<tr><td colspan="5">Your cart is empty.</td></tr>`;
            totalEl.textContent = money(0);
            return;
        }

        bodyEl.innerHTML = rows.join("");
        totalEl.textContent = money(total);
    }

    function wireSummaryTable() {
        const tableBody = $("cart-items");
        if (!tableBody) return;

        tableBody.addEventListener("click", (e) => {
            const btn = e.target.closest?.("[data-remove]");
            if (!btn) return;
            const productId = btn.getAttribute("data-remove");
            removeFromCart(productId);
            renderSummary();
        });

        tableBody.addEventListener("change", (e) => {
            const input = e.target.closest?.("[data-qty]");
            if (!input) return;
            const productId = input.getAttribute("data-qty");
            const qty = Math.max(1, Number(input.value) || 1);
            updateCartQty(productId, qty);
            renderSummary();
        });
    }

    function wireCheckout(modal) {
        const btn = $("checkout-btn");
        if (!btn) return;
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            const cart = loadCart();
            const items = Object.entries(cart)
                .map(([productId, qtyRaw]) => {
                    const p = getProduct(productId);
                    if (!p) return null;
                    const qty = Math.max(1, Number(qtyRaw) || 1);
                    const lineTotal = qty * p.price;
                    return { p, qty, lineTotal };
                })
                .filter(Boolean);

            if (items.length === 0) {
                modal.open({
                    title: "Checkout",
                    message: "Your cart is empty.",
                    withQty: false,
                    yesText: "OK",
                    noText: "Close",
                    onConfirm: () => {},
                    onCancel: () => {}
                });
                return;
            }

            const orderId = randomOrderId();
            const when = nowInManila();
            const total = items.reduce((sum, it) => sum + it.lineTotal, 0);

            const linesHTML = items
                .map((it) => {
                    const unit = money(it.p.price);
                    const line = money(it.lineTotal);
                    return `<tr><td>${it.p.name}</td><td class="r">${it.qty}</td><td class="r">${unit}</td><td class="r">${line}</td></tr>`;
                })
                .join("");

            const receiptHTML = `
                <div class="receipt">
                    <div class="receipt-head">
                        <div class="receipt-title">Velvet Crust Cakes Receipt</div>
                        <div class="receipt-meta">${orderId} · ${when}</div>
                    </div>
                    <table class="receipt-lines" aria-label="Receipt items">
                        <thead>
                            <tr><th>Item</th><th class="r">Qty</th><th class="r">Unit</th><th class="r">Total</th></tr>
                        </thead>
                        <tbody>${linesHTML}</tbody>
                    </table>
                    <div class="receipt-total"><span>Grand total</span><strong>${money(total)}</strong></div>
                </div>
            `;

            function printReceipt() {
                const win = window.open("", "velvet_crust_receipt", "width=520,height=720");
                if (!win) return;
                const doc = win.document;
                doc.open();
                doc.write(`<!doctype html>
                    <html lang="en">
                    <head>
                        <meta charset="utf-8">
                        <title>Receipt ${orderId}</title>
                        <meta name="viewport" content="width=device-width, initial-scale=1">
                        <style>
                            body{font-family:Candara,Arial,sans-serif;margin:24px;background:#fff;color:#14080c;}
                            h1{font-family:Palatino,Georgia,serif;margin:0 0 6px;color:#79113a;}
                            .meta{color:#79113a;opacity:.8;margin:0 0 16px;}
                            table{width:100%;border-collapse:collapse;margin-top:12px;}
                            th,td{padding:10px 8px;border-bottom:1px solid rgba(121,17,58,.18);text-align:left;}
                            th{background:rgba(231,170,183,.18);color:#79113a;}
                            .r{text-align:right;}
                            .total{display:flex;justify-content:space-between;gap:10px;margin-top:14px;font-weight:800;color:#79113a;}
                        </style>
                    </head>
                    <body>
                        <h1>Velvet Crust Cakes</h1>
                        <p class="meta">${orderId} · ${when}</p>
                        <table>
                            <thead><tr><th>Item</th><th class="r">Qty</th><th class="r">Unit</th><th class="r">Total</th></tr></thead>
                            <tbody>${linesHTML}</tbody>
                        </table>
                        <div class="total"><span>Grand total</span><span>${money(total)}</span></div>
                        <script>window.onload=()=>{window.print();};<\/script>
                    </body>
                    </html>`);
                doc.close();
            }

            modal.open({
                title: "Receipt",
                messageHTML: receiptHTML,
                withQty: false,
                yesText: "Print receipt",
                noText: "New order",
                closeOnOverlay: false,
                closeOnEsc: false,
                onConfirm: () => printReceipt(),
                onCancel: () => {
                    clearCart();
                    renderSummary();
                }
            });
        });
    }

    function rotateHeroImage() {
        const img = $("carousel-img");
        if (!img) return;
        const images = [
            "cake.jpg",
            "parfait.jpg",
            "balls.jpg"
        ];
        let idx = 0;
        setInterval(() => {
            idx = (idx + 1) % images.length;
            img.style.opacity = "0.2";
            setTimeout(() => {
                img.src = images[idx];
                img.style.opacity = "1";
            }, 280);
        }, 6500);
    }

    document.addEventListener("DOMContentLoaded", () => {
        setCartCount();

        const modal = modalController();
        if (!modal) return;

        const trending = $("trending-grid");
        if (trending) {
            renderGrid(trending, [
                getProduct("classic-red-velvet"),
                getProduct("berry-parfait"),
                getProduct("cake-balls"),
                getProduct("dark-chocolate-ganache")
            ].filter(Boolean));
            wireAddButtons(trending, modal);
        }

        const full = $("full-grid");
        if (full) {
            renderGrid(full, PRODUCTS);
            wireAddButtons(full, modal);
        }

        if ($("cart-items")) {
            renderSummary();
            wireSummaryTable();
            wireCheckout(modal);
        }

        rotateHeroImage();
    });
})();

const cartItemsContainer = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");
const shippingForm = document.getElementById("shipping-form");
const trackingBadge = document.getElementById("tracking-badge");
const advanceTrackingButton = document.getElementById("advance-tracking");
const deliverySummary = document.getElementById("delivery-summary");
const deliveryName = document.getElementById("delivery-name");
const deliveryAddress = document.getElementById("delivery-address");
const receiptTotal = document.getElementById("receipt-total");
const searchInput = document.getElementById("search-input");
const searchEmpty = document.getElementById("search-empty");
const productCards = document.querySelectorAll(".product-card");
const menuChips = document.querySelectorAll(".menu-chip");
const checkoutTrigger = document.getElementById("checkout-trigger");
const checkoutModal = document.getElementById("checkout-modal");
const checkoutClose = document.getElementById("checkout-close");
const loginState = document.getElementById("login-state");
const checkoutNote = document.getElementById("checkout-note");
const userLoginForm = document.getElementById("user-login-form");
const adminLoginForm = document.getElementById("admin-login-form");
const adminItemCount = document.getElementById("admin-item-count");
const adminTotal = document.getElementById("admin-total");
const adminTrackingStatus = document.getElementById("admin-tracking-status");
const adminCustomerName = document.getElementById("admin-customer-name");
const adminCustomerAddress = document.getElementById("admin-customer-address");
const adminItemList = document.getElementById("admin-item-list");
const adminAccessState = document.getElementById("admin-access-state");

const CUSTOMER_STORAGE_KEY = "swiftcart_customer_logged_in";
const ADMIN_STORAGE_KEY = "swiftcart_admin_logged_in";
const ORDER_STORAGE_KEY = "swiftcart_latest_order";

const trackingSteps = [
  document.getElementById("shipping-step"),
  document.getElementById("route-step"),
  document.getElementById("delivery-step")
];

const cart = [];
let trackingIndex = 0;
let activeFilter = "trending";

function isCustomerLoggedIn() {
  return localStorage.getItem(CUSTOMER_STORAGE_KEY) === "true";
}

function isAdminLoggedIn() {
  return localStorage.getItem(ADMIN_STORAGE_KEY) === "true";
}

function saveOrderSnapshot(order) {
  localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(order));
}

function readOrderSnapshot() {
  const raw = localStorage.getItem(ORDER_STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

function updateLoginState() {
  if (loginState) {
    loginState.textContent = isCustomerLoggedIn() ? "Signed in as demo user" : "Login required for checkout";
  }

  if (checkoutNote) {
    checkoutNote.textContent = isCustomerLoggedIn()
      ? "You're signed in. You can proceed to checkout."
      : "Sign in with the demo shopper account before checking out.";
  }
}

function renderCart() {
  if (!cartItemsContainer || !cartCount || !cartTotal) {
    return;
  }

  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-state">Your cart is empty. Add something from the catalog.</p>';
    cartCount.textContent = "0";
    cartTotal.textContent = "$0";
    return;
  }

  let total = 0;

  cart.forEach((item) => {
    total += item.price;

    const itemRow = document.createElement("div");
    itemRow.className = "cart-item";
    itemRow.innerHTML = `
      <div>
        <strong>${item.name}</strong>
        <p class="empty-state">Ready for checkout</p>
      </div>
      <strong>$${item.price}</strong>
    `;
    cartItemsContainer.appendChild(itemRow);
  });

  cartCount.textContent = String(cart.length);
  cartTotal.textContent = `$${total}`;
}

function updateTracking() {
  if (!trackingBadge || !advanceTrackingButton) {
    return;
  }

  trackingSteps.forEach((step, index) => {
    if (step) {
      step.classList.toggle("active", index < trackingIndex);
    }
  });

  const labels = ["Waiting", "Shipping Set", "In Transit", "Out for Delivery"];
  trackingBadge.textContent = labels[trackingIndex];

  if (trackingIndex === trackingSteps.length) {
    advanceTrackingButton.disabled = true;
    advanceTrackingButton.textContent = "Route Complete";
  }

  const snapshot = readOrderSnapshot();
  if (snapshot) {
    snapshot.trackingIndex = trackingIndex;
    snapshot.trackingLabel = labels[trackingIndex];
    saveOrderSnapshot(snapshot);
  }
}

function filterProducts(query) {
  let visibleCount = 0;
  const normalizedQuery = query.trim().toLowerCase();

  productCards.forEach((card) => {
    const productName = (card.dataset.name || "").toLowerCase();
    const categories = (card.dataset.category || "").split(" ").filter(Boolean);
    const matchesFilter = activeFilter === "more" ? true : categories.includes(activeFilter);
    const matchesSearch = normalizedQuery === "" || productName.includes(normalizedQuery);
    const isVisible = matchesFilter && matchesSearch;
    card.style.display = isVisible ? "" : "none";

    if (isVisible) {
      visibleCount += 1;
    }
  });

  if (searchEmpty) {
    searchEmpty.hidden = visibleCount > 0;
  }
}

function openCheckoutModal() {
  if (!checkoutModal) {
    return;
  }

  checkoutModal.hidden = false;
}

function closeCheckoutModal() {
  if (!checkoutModal) {
    return;
  }

  checkoutModal.hidden = true;
}

document.querySelectorAll(".add-to-cart").forEach((button) => {
  button.addEventListener("click", () => {
    cart.push({
      name: button.dataset.name,
      price: Number(button.dataset.price)
    });
    renderCart();
  });
});

if (searchInput) {
  searchInput.addEventListener("input", (event) => {
    filterProducts(event.target.value);
  });
}

menuChips.forEach((chip) => {
  chip.addEventListener("click", () => {
    activeFilter = chip.dataset.filter || "more";

    menuChips.forEach((item) => {
      item.classList.toggle("active", item === chip);
    });

    filterProducts(searchInput ? searchInput.value : "");
  });
});

if (shippingForm) {
  shippingForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const address = document.getElementById("address").value.trim();
    const city = document.getElementById("city").value.trim();
    const postalCode = document.getElementById("postalCode").value.trim();
    const total = cart.reduce((sum, item) => sum + item.price, 0);

    trackingIndex = Math.max(trackingIndex, 1);
    updateTracking();

    if (deliverySummary && deliveryName && deliveryAddress) {
      deliverySummary.hidden = false;
      deliveryName.textContent = `${fullName} - Order confirmed`;
      deliveryAddress.textContent = `${address}, ${city}, ${postalCode}`;
      if (receiptTotal) {
        receiptTotal.textContent = `Receipt total: $${total}`;
      }
    }

    saveOrderSnapshot({
      customerName: fullName,
      address: `${address}, ${city}, ${postalCode}`,
      total,
      items: [...cart],
      trackingIndex,
      trackingLabel: "Shipping Set"
    });

    closeCheckoutModal();
  });
}

if (checkoutTrigger) {
  checkoutTrigger.addEventListener("click", () => {
    if (cart.length === 0) {
      return;
    }

    if (!isCustomerLoggedIn()) {
      if (checkoutNote) {
        checkoutNote.textContent = "Please log in first with user / 12345.";
      }
      window.location.href = "userlogin.html";
      return;
    }

    openCheckoutModal();
  });
}

if (checkoutClose) {
  checkoutClose.addEventListener("click", () => {
    closeCheckoutModal();
  });
}

if (checkoutModal) {
  checkoutModal.addEventListener("click", (event) => {
    if (event.target === checkoutModal) {
      closeCheckoutModal();
    }
  });
}

if (advanceTrackingButton) {
  advanceTrackingButton.addEventListener("click", () => {
    if (trackingIndex < trackingSteps.length) {
      trackingIndex += 1;
      updateTracking();
    }
  });
}

if (userLoginForm) {
  userLoginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = document.getElementById("user-username").value.trim();
    const password = document.getElementById("user-password").value.trim();
    const message = document.getElementById("user-login-message");

    if (username === "user" && password === "12345") {
      localStorage.setItem(CUSTOMER_STORAGE_KEY, "true");
      if (message) {
        message.textContent = "Login successful. Redirecting to the store.";
      }
      window.location.href = "index.html";
      return;
    }

    if (message) {
      message.textContent = "Incorrect demo credentials. Use user / 12345.";
    }
  });
}

if (adminLoginForm) {
  adminLoginForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = document.getElementById("admin-username").value.trim();
    const password = document.getElementById("admin-password").value.trim();
    const message = document.getElementById("admin-login-message");

    if (username === "dimapelis" && password === "12345") {
      localStorage.setItem(ADMIN_STORAGE_KEY, "true");
      if (message) {
        message.textContent = "Admin login successful. Redirecting to dashboard.";
      }
      window.location.href = "dashboard.html";
      return;
    }

    if (message) {
      message.textContent = "Incorrect demo credentials. Use dimapelis / 12345.";
    }
  });
}

if (cartItemsContainer) {
  renderCart();
  updateTracking();
  filterProducts("");
  updateLoginState();
}

if (adminAccessState) {
  adminAccessState.textContent = isAdminLoggedIn() ? "Admin session active" : "Demo admin not signed in";
}

if (adminItemCount && adminTotal && adminTrackingStatus) {
  const snapshot = readOrderSnapshot();
  const labels = ["Waiting", "Shipping Set", "In Transit", "Out for Delivery"];

  if (!snapshot) {
    adminItemCount.textContent = "0";
    adminTotal.textContent = "$0";
    adminTrackingStatus.textContent = "Waiting";
  } else {
    adminItemCount.textContent = String(snapshot.items?.length || 0);
    adminTotal.textContent = `$${snapshot.total || 0}`;
    adminTrackingStatus.textContent = snapshot.trackingLabel || labels[snapshot.trackingIndex || 0];

    if (adminCustomerName) {
      adminCustomerName.textContent = snapshot.customerName || "Unknown customer";
    }
    if (adminCustomerAddress) {
      adminCustomerAddress.textContent = snapshot.address || "No address submitted.";
    }
    if (adminItemList) {
      adminItemList.innerHTML = "";
      (snapshot.items || []).forEach((item) => {
        const row = document.createElement("div");
        row.className = "cart-item";
        row.innerHTML = `<strong>${item.name}</strong><strong>$${item.price}</strong>`;
        adminItemList.appendChild(row);
      });
    }

    const adminSteps = [
      document.getElementById("admin-shipping-step"),
      document.getElementById("admin-route-step"),
      document.getElementById("admin-delivery-step")
    ];
    adminSteps.forEach((step, index) => {
      if (step) {
        step.classList.toggle("active", index < (snapshot.trackingIndex || 0));
      }
    });
  }
}

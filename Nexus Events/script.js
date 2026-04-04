const eventCatalog = [
  {
    id: "soundclash",
    name: "Soundclash Friday",
    date: "April 18, 2026",
    venue: "Nexus Dome",
    blurb: "A loud opening-night mix of alt-pop, projection art, and midnight food drops.",
    tiers: [
      { id: "general", name: "General", price: "$39", perks: "Main floor access + welcome tote" },
      { id: "plus", name: "Plus", price: "$79", perks: "Fast lane entry + lounge seating" },
      { id: "vip", name: "VIP", price: "$129", perks: "Front pit + artist zine pack" }
    ]
  },
  {
    id: "pixelplay",
    name: "Pixel Playground",
    date: "April 19, 2026",
    venue: "Signal Hall",
    blurb: "Interactive installations, gaming pods, and creator talks with a daytime pulse.",
    tiers: [
      { id: "day", name: "Day Pass", price: "$25", perks: "All exhibits until 6PM" },
      { id: "creator", name: "Creator", price: "$58", perks: "Workshops + networking mix" },
      { id: "allin", name: "All In", price: "$92", perks: "Full-day access + merch bundle" }
    ]
  },
  {
    id: "citylights",
    name: "City Lights Sessions",
    date: "April 20, 2026",
    venue: "Roofline Yard",
    blurb: "Sunset sets, giant visuals, and a rooftop crowd built for golden-hour photos.",
    tiers: [
      { id: "rooftop", name: "Rooftop", price: "$45", perks: "Concert access + drink token" },
      { id: "premium", name: "Premium", price: "$88", perks: "Reserved deck rail section" },
      { id: "backstage", name: "Backstage", price: "$140", perks: "Soundcheck + photo wall pass" }
    ]
  }
];

const adminCredentials = {
  email: "dimapelis@gmail.com",
  password: "12345"
};

const adminSessionKey = "nexusAdminAuthenticated";

function getSitePrefix() {
  const pathname = window.location.pathname.replace(/\\/g, "/");
  return pathname.includes("/admin/") ? "../" : "";
}

function formatTierLabel(tier) {
  return `${tier.name} ${tier.price}`;
}

function buildQrUrl(payload) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=280x280&margin=12&data=${encodeURIComponent(payload)}`;
}

function initTicketBuilder() {
  const builder = document.querySelector("[data-ticket-builder]");
  if (!builder) {
    return;
  }

  const eventChoiceWrap = builder.querySelector("[data-event-choices]");
  const tierChoiceWrap = builder.querySelector("[data-tier-choices]");
  const form = builder.querySelector("[data-attendee-form]");
  const qrPanel = builder.querySelector("[data-qr-panel]");
  const progressPills = builder.querySelectorAll("[data-step]");
  const eventNameField = builder.querySelector("[data-summary-event]");
  const tierNameField = builder.querySelector("[data-summary-tier]");
  const attendeeNameField = builder.querySelector("[data-summary-name]");
  const qrImage = builder.querySelector("[data-qr-image]");
  const ticketCode = builder.querySelector("[data-ticket-code]");
  const eventInput = builder.querySelector("[name='event_id']");
  const tierInput = builder.querySelector("[name='tier_id']");
  const formNote = document.getElementById("ticket-form-note");

  const state = {
    event: eventCatalog[0],
    tier: eventCatalog[0].tiers[0]
  };

  function syncProgress(stepNumber) {
    progressPills.forEach((pill) => {
      const isCurrent = Number(pill.dataset.step) === stepNumber;
      pill.classList.toggle("is-current", isCurrent);
    });
  }

  function renderSelectedEvent() {
    const buttons = eventChoiceWrap.querySelectorAll(".choice-button");
    buttons.forEach((button) => {
      const isActive = button.dataset.eventId === state.event.id;
      button.classList.toggle("is-active", isActive);
    });
  }

  function renderEvents() {
    eventChoiceWrap.innerHTML = "";
    eventCatalog.forEach((event) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "choice-button";
      button.dataset.eventId = event.id;
      button.innerHTML = `<strong>${event.name}</strong><span>${event.date} / ${event.venue}</span><p>${event.blurb}</p>`;
      button.addEventListener("click", () => {
        state.event = event;
        state.tier = event.tiers[0];
        eventInput.value = event.id;
        renderTiers();
        renderSelectedEvent();
        syncProgress(2);
      });
      eventChoiceWrap.appendChild(button);
    });
    renderSelectedEvent();
  }

  function renderTiers() {
    tierChoiceWrap.innerHTML = "";
    tierChoiceWrap.classList.remove("hide");

    state.event.tiers.forEach((tier) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "tier-button";
      if (tier.id === state.tier.id) {
        button.classList.add("is-active");
      }
      button.innerHTML = `<strong>${formatTierLabel(tier)}</strong><span>${tier.perks}</span>`;
      button.addEventListener("click", () => {
        state.tier = tier;
        tierInput.value = tier.id;
        renderTiers();
        form.classList.remove("hide");
        if (formNote) {
          formNote.classList.add("hide");
        }
        syncProgress(3);
      });
      tierChoiceWrap.appendChild(button);
    });

    eventInput.value = state.event.id;
    tierInput.value = state.tier.id;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const attendeeName = String(formData.get("attendee_name") || "").trim();
    const attendeeEmail = String(formData.get("attendee_email") || "").trim();
    const attendeePhone = String(formData.get("attendee_phone") || "").trim();

    const code = `NX-${state.event.id.slice(0, 3).toUpperCase()}-${state.tier.id.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`;
    const qrPayload = [
      `Event: ${state.event.name}`,
      `Tier: ${state.tier.name}`,
      `Guest: ${attendeeName}`,
      `Email: ${attendeeEmail}`,
      `Phone: ${attendeePhone}`,
      `Code: ${code}`
    ].join(" | ");

    eventNameField.textContent = `${state.event.name} / ${state.event.date}`;
    tierNameField.textContent = `${state.tier.name} / ${state.tier.price}`;
    attendeeNameField.textContent = attendeeName || "Guest";
    ticketCode.textContent = code;
    qrImage.src = buildQrUrl(qrPayload);
    qrImage.alt = `QR code for ${attendeeName || "guest"} attending ${state.event.name}`;
    qrPanel.classList.remove("hide");
    syncProgress(4);
    qrPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  renderEvents();
  renderTiers();
  syncProgress(1);
}

function initAutoYear() {
  document.querySelectorAll("[data-year]").forEach((node) => {
    node.textContent = new Date().getFullYear();
  });
}

function initActiveNav() {
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-link, .admin-entry").forEach((link) => {
    const targetPath = link.getAttribute("href");
    const activeClass = link.classList.contains("admin-entry") ? "is-current" : "is-active";
    link.classList.toggle(activeClass, targetPath === currentPath);
  });
}

function isAdminAuthenticated() {
  return window.sessionStorage.getItem(adminSessionKey) === "true";
}

function initAdminProtection() {
  const protectedPage = document.body.dataset.adminProtected === "true";
  if (!protectedPage) {
    return;
  }

  if (!isAdminAuthenticated()) {
    window.location.href = `${getSitePrefix()}admin-login.html`;
  }
}

function initAdminLogin() {
  const form = document.querySelector("[data-admin-login-form]");
  if (!form) {
    return;
  }

  if (isAdminAuthenticated()) {
    window.location.href = "admin.html";
    return;
  }

  const status = document.querySelector("[data-admin-login-status]");

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const email = String(formData.get("admin_email") || "").trim();
    const password = String(formData.get("admin_password") || "");

    if (email === adminCredentials.email && password === adminCredentials.password) {
      window.sessionStorage.setItem(adminSessionKey, "true");
      if (status) {
        status.textContent = "Access granted. Redirecting to the admin dashboard...";
        status.classList.remove("is-error");
        status.classList.add("is-success");
      }
      window.setTimeout(() => {
        window.location.href = "admin.html";
      }, 500);
      return;
    }

    if (status) {
      status.textContent = "Incorrect email or password. Please try again.";
      status.classList.remove("is-success");
      status.classList.add("is-error");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initAdminProtection();
  initTicketBuilder();
  initAutoYear();
  initActiveNav();
  initAdminLogin();
});

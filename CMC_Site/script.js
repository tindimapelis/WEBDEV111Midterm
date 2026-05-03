const currentPage = document.documentElement.dataset.page;
const navLinks = document.querySelectorAll(".main-nav a");

for (const link of navLinks) {
  const href = link.getAttribute("href");

  if (href === currentPage) {
    link.classList.add("is-active");
    link.setAttribute("aria-current", "page");
  }
}

const footerMarkup = `
  <footer class="site-footer" aria-label="Site footer">
    <div class="footer-layout">
      <section class="footer-section" aria-label="Footer navigation">
        <nav class="footer-nav">
          <a href="index.html">Home</a>
          <a href="mini-games.html">Minigames</a>
          <a href="merch-store.html">Merch</a>
          <a href="archive.html">Events</a>
          <a href="about.html">About</a>
          <a href="contact.html">Contact Us</a>
        </nav>
        <p class="footer-copy">&copy; 2026, Creative Minds Consortium. All Rights Reserved.</p>
      </section>
      <section class="footer-section">
        <div class="footer-links" aria-label="Footer information links">
          <a class="footer-link-button" href="privacy.html">Privacy</a>
          <button class="footer-link-button" type="button" data-modal="newsletter">Newsletter</button>
          <a class="footer-link-button" href="terms.html">Terms &amp; Service</a>
        </div>
      </section>
      <section class="footer-section footer-social-shell">
        <p class="footer-social-label">Social Media</p>
        <div class="footer-social" aria-label="Social media links">
          <a
            class="social-icon-link"
            href="https://www.facebook.com/profile.php?id=61586734906378"
            target="_blank"
            rel="noreferrer"
            aria-label="Visit Creative Minds Consortium on Facebook"
          >
            <img src="FACEBOOK.png" alt="" aria-hidden="true" />
          </a>
          <button class="social-icon-button" type="button" data-modal="email" aria-label="Email Creative Minds Consortium">
            <img src="EMAIL.png" alt="" aria-hidden="true" />
          </button>
          <button class="social-icon-button" type="button" data-modal="unavailable" aria-label="TikTok unavailable notice">
            <img src="TIKTOK.png" alt="" aria-hidden="true" />
          </button>
          <button class="social-icon-button" type="button" data-modal="unavailable" aria-label="Instagram unavailable notice">
            <img src="INSTAGRAM.png" alt="" aria-hidden="true" />
          </button>
        </div>
      </section>
    </div>
  </footer>
  <div class="footer-modal" hidden>
    <div class="footer-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="footer-modal-title">
      <div class="footer-modal-header">
        <h2 class="footer-modal-title" id="footer-modal-title"></h2>
        <button class="modal-close" type="button" aria-label="Close popup">Close</button>
      </div>
      <div class="footer-modal-body"></div>
    </div>
  </div>
`;

const modalContent = {
  newsletter: {
    title: "Newsletter",
    body: `
      <p>Our newsletter area is being prepared.</p>
      <p>For now, you can stay updated by reaching out to <strong>cmc2024.official@gmail.com</strong> and asking to be included in future announcements.</p>
      <a class="modal-email-link" href="mailto:cmc2024.official@gmail.com?subject=Newsletter%20Updates">Email CMC</a>
    `,
  },
  email: {
    title: "Email Us",
    body: `
      <p>You can reach Creative Minds Consortium at:</p>
      <p><strong>cmc2024.official@gmail.com</strong></p>
      <a class="modal-email-link" href="mailto:cmc2024.official@gmail.com">Open Email App</a>
    `,
  },
  unavailable: {
    title: "Currently Unavailable",
    body: `
      <p>Sorry! Currently unavailable.</p>
      <p>Stay tuned for future announcement regarding this.</p>
    `,
  },
};

const pageShell = document.querySelector(".page-shell");

if (pageShell) {
  pageShell.insertAdjacentHTML("afterend", footerMarkup);

  const modal = document.querySelector(".footer-modal");
  const modalTitle = modal?.querySelector(".footer-modal-title");
  const modalBody = modal?.querySelector(".footer-modal-body");
  const closeButton = modal?.querySelector(".modal-close");
  let lastTrigger = null;

  const openModal = (key, trigger) => {
    const entry = modalContent[key];

    if (!modal || !modalTitle || !modalBody || !entry) {
      return;
    }

    modalTitle.textContent = entry.title;
    modalBody.innerHTML = entry.body;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    lastTrigger = trigger ?? null;
    closeButton?.focus();
  };

  const closeModal = () => {
    if (!modal) {
      return;
    }

    modal.hidden = true;
    document.body.style.overflow = "";
    lastTrigger?.focus();
  };

  document.querySelectorAll("[data-modal]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      openModal(trigger.getAttribute("data-modal"), trigger);
    });
  });

  closeButton?.addEventListener("click", closeModal);

  modal?.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && modal && !modal.hidden) {
      closeModal();
    }
  });
}

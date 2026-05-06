const currentPage = document.documentElement.dataset.page;
const navLinks = document.querySelectorAll(".main-nav a");
const homePages = new Set(["index.html", "sinag.html", "likha.html", "laraw.html", "himig.html"]);
const topShell = document.querySelector(".top-shell");
const mainNav = document.querySelector(".main-nav");
const brandBar = document.querySelector(".brand-bar");
const mobileNavQuery = window.matchMedia("(max-width: 760px)");
let navToggle = null;

const queueLoginTransition = (target, label) => {
  try {
    sessionStorage.setItem(
      "cmc-login-transition",
      JSON.stringify({
        target,
        label,
        at: Date.now(),
      })
    );
  } catch {}
};

const showQueuedLoginTransition = () => {
  let transitionData = null;

  try {
    transitionData = JSON.parse(sessionStorage.getItem("cmc-login-transition") || "null");
  } catch {
    transitionData = null;
  }

  if (!transitionData?.target || transitionData.target !== currentPage) {
    return;
  }

  try {
    sessionStorage.removeItem("cmc-login-transition");
  } catch {}

  const overlay = document.createElement("div");
  overlay.className = "login-transition-overlay";
  overlay.innerHTML = `
    <div class="login-transition-core">
      <div class="login-transition-sigil" aria-hidden="true"></div>
      <p class="login-transition-kicker">Crossing the threshold</p>
      <h2>${transitionData.label || "Entering CMC"}</h2>
      <p class="login-transition-copy">Gathering emberlight, mist, and memory before the next chamber opens.</p>
    </div>
  `;

  document.body.appendChild(overlay);
  document.body.classList.add("is-login-transitioning");

  window.setTimeout(() => {
    overlay.classList.add("is-leaving");
  }, 900);

  window.setTimeout(() => {
    overlay.remove();
    document.body.classList.remove("is-login-transitioning");
  }, 1450);
};

showQueuedLoginTransition();

const createMysticClickPlayer = () => {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;

  if (!AudioContextClass) {
    return () => {};
  }

  const audioContext = new AudioContextClass();
  const volume = 0.13;

  return () => {
    if (audioContext.state === "suspended") {
      audioContext.resume().catch(() => {});
    }

    const now = audioContext.currentTime;
    const gain = audioContext.createGain();
    const oscA = audioContext.createOscillator();
    const oscB = audioContext.createOscillator();
    const filter = audioContext.createBiquadFilter();

    oscA.type = "sine";
    oscA.frequency.setValueAtTime(540, now);
    oscA.frequency.exponentialRampToValueAtTime(420, now + 0.18);

    oscB.type = "triangle";
    oscB.frequency.setValueAtTime(810, now);
    oscB.frequency.exponentialRampToValueAtTime(620, now + 0.14);

    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1250, now);
    filter.Q.value = 0.7;

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.022);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.19);

    oscA.connect(filter);
    oscB.connect(filter);
    filter.connect(gain);
    gain.connect(audioContext.destination);

    oscA.start(now);
    oscB.start(now);
    oscA.stop(now + 0.21);
    oscB.stop(now + 0.18);
  };
};

const playMysticClick = createMysticClickPlayer();

document.addEventListener("click", (event) => {
  const interactiveTarget = event.target.closest(
    ".brand-mark, .signup-btn, .main-nav > a, .admin-sidebar-brand, .admin-sidebar-nav a, .admin-sidebar-meta a, .admin-toolbar-link"
  );

  if (!interactiveTarget) {
    return;
  }

  playMysticClick();
});

for (const link of navLinks) {
  const href = link.getAttribute("href");

  if (href === currentPage) {
    link.classList.add("is-active");
    link.setAttribute("aria-current", "page");
  }
}

const homeTrigger = document.querySelector('.nav-dropdown-trigger[href="index.html"]');
const eventsTrigger = document.querySelector('.nav-dropdown-trigger[href="ongoing-events.html"]');

if (homeTrigger && homePages.has(currentPage)) {
  homeTrigger.classList.add("is-active");
  homeTrigger.setAttribute("aria-current", "page");
}

if (eventsTrigger && (currentPage === "ongoing-events.html" || currentPage === "past-events.html")) {
  eventsTrigger.classList.add("is-active");
  eventsTrigger.setAttribute("aria-current", "page");
}

if (topShell && brandBar && mainNav) {
  const accountMenu = topShell.querySelector(".account-menu");
  const accountTrigger = accountMenu?.querySelector(".account-menu-trigger");

  const syncHeaderOffset = () => {
    document.documentElement.style.setProperty("--header-offset", `${topShell.offsetHeight}px`);
  };

  const sparkleField = document.createElement("div");
  sparkleField.className = "nav-particles";

  for (let index = 0; index < 18; index += 1) {
    const particle = document.createElement("span");
    particle.className = "nav-particle";
    particle.style.left = `${6 + Math.random() * 88}%`;
    particle.style.top = `${10 + Math.random() * 68}%`;
    particle.style.setProperty("--duration", `${7 + Math.random() * 8}s`);
    particle.style.setProperty("--delay", `${Math.random() * -8}s`);
    sparkleField.appendChild(particle);
  }

  topShell.appendChild(sparkleField);

  navToggle = document.createElement("button");
  navToggle.className = "nav-toggle";
  navToggle.type = "button";
  navToggle.setAttribute("aria-label", "Toggle navigation menu");
  navToggle.setAttribute("aria-controls", "primary-navigation");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.innerHTML = '<span class="nav-toggle-lines" aria-hidden="true"></span>';
  brandBar.insertBefore(navToggle, brandBar.querySelector(".signup-btn, .account-menu"));
  mainNav.id = "primary-navigation";

  const closeNav = () => {
    topShell.classList.remove("nav-open");
    navToggle?.setAttribute("aria-expanded", "false");
    document.querySelectorAll(".nav-dropdown.is-open").forEach((dropdown) => {
      dropdown.classList.remove("is-open");
    });
    accountMenu?.classList.remove("is-open");
  };

  const syncNavForViewport = () => {
    if (!mobileNavQuery.matches) {
      closeNav();
    }
  };

  navToggle.addEventListener("click", () => {
    const nextOpen = !topShell.classList.contains("nav-open");
    topShell.classList.toggle("nav-open", nextOpen);
    navToggle.setAttribute("aria-expanded", String(nextOpen));
  });

  document.querySelectorAll(".nav-dropdown").forEach((dropdown) => {
    const trigger = dropdown.querySelector(".nav-dropdown-trigger");

    trigger?.addEventListener("click", (event) => {
      if (!mobileNavQuery.matches) {
        return;
      }

      if (!dropdown.classList.contains("is-open")) {
        event.preventDefault();
        document.querySelectorAll(".nav-dropdown.is-open").forEach((openDropdown) => {
          if (openDropdown !== dropdown) {
            openDropdown.classList.remove("is-open");
          }
        });
        dropdown.classList.add("is-open");
        return;
      }

      dropdown.classList.remove("is-open");
    });
  });

  accountTrigger?.addEventListener("click", (event) => {
    event.preventDefault();
    const nextOpen = !accountMenu?.classList.contains("is-open");
    accountMenu?.classList.toggle("is-open", nextOpen);
  });

  document.addEventListener("click", (event) => {
    if (!topShell.contains(event.target)) {
      closeNav();
      return;
    }

    if (accountMenu && !accountMenu.contains(event.target)) {
      accountMenu.classList.remove("is-open");
    }
  });

  mobileNavQuery.addEventListener("change", syncNavForViewport);
  syncNavForViewport();
  syncHeaderOffset();
  window.addEventListener("resize", syncHeaderOffset);

  let trailTimer = null;

  topShell.addEventListener("mousemove", (event) => {
    const rect = topShell.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    topShell.style.setProperty("--trail-x", `${x}%`);
    topShell.style.setProperty("--trail-y", `${y}%`);
    topShell.classList.add("is-trail-active");

    window.clearTimeout(trailTimer);
    trailTimer = window.setTimeout(() => {
      topShell.classList.remove("is-trail-active");
    }, 180);
  });

  topShell.addEventListener("mouseleave", () => {
    topShell.classList.remove("is-trail-active");
  });
}

const guildSectionLinks = document.querySelectorAll("[data-guild-link]");
const guildSections = document.querySelectorAll("[data-guild-section]");
const adminSidebarLinks = document.querySelectorAll(".admin-sidebar-nav a");

if (adminSidebarLinks.length > 0 && currentPage) {
  const currentDirectory = currentPage.includes("/") ? currentPage.slice(0, currentPage.lastIndexOf("/") + 1) : "";

  adminSidebarLinks.forEach((link) => {
    const href = link.getAttribute("href");

    if (!href || href.startsWith("#") || href.startsWith("http")) {
      return;
    }

    const normalizedHref = href.includes("/") ? href : `${currentDirectory}${href}`;
    const isCurrent = normalizedHref === currentPage;
    link.classList.toggle("is-current", isCurrent);

    if (isCurrent) {
      link.setAttribute("aria-current", "page");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

if (guildSectionLinks.length > 0 && guildSections.length > 0) {
  const setCurrentGuildLink = (guild) => {
    guildSectionLinks.forEach((link) => {
      const isCurrent = link.getAttribute("data-guild-link") === guild;
      link.classList.toggle("is-current", isCurrent);
      if (isCurrent) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort((left, right) => right.intersectionRatio - left.intersectionRatio);

      if (visibleEntries.length > 0) {
        setCurrentGuildLink(visibleEntries[0].target.getAttribute("data-guild-section"));
      }
    },
    {
      rootMargin: "-25% 0px -45% 0px",
      threshold: [0.2, 0.35, 0.5],
    }
  );

  guildSections.forEach((section) => observer.observe(section));
  setCurrentGuildLink(guildSections[0].getAttribute("data-guild-section"));
}

const guildCategoryLinks = document.querySelectorAll('.guild-category-nav a[href^="#"]');

if (guildCategoryLinks.length > 0) {
  const linkedSections = Array.from(guildCategoryLinks)
    .map((link) => document.querySelector(link.getAttribute("href")))
    .filter(Boolean);

  const setCurrentCategoryLink = (id) => {
    guildCategoryLinks.forEach((link) => {
      const isCurrent = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("is-current", isCurrent);
      if (isCurrent) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const categoryObserver = new IntersectionObserver(
    (entries) => {
      const visibleEntries = entries
        .filter((entry) => entry.isIntersecting)
        .sort((left, right) => right.intersectionRatio - left.intersectionRatio);

      if (visibleEntries.length > 0) {
        setCurrentCategoryLink(visibleEntries[0].target.id);
      }
    },
    {
      rootMargin: "-20% 0px -55% 0px",
      threshold: [0.2, 0.4, 0.6],
    }
  );

  linkedSections.forEach((section) => categoryObserver.observe(section));
  if (linkedSections[0]?.id) {
    setCurrentCategoryLink(linkedSections[0].id);
  }
}

document.querySelectorAll(".guild-like-button").forEach((button) => {
  const icon = button.querySelector("i");
  const countLabel = button.querySelector("span");
  const initialCount = Number(button.getAttribute("data-like-count") || countLabel?.textContent || "0");
  let liked = false;
  let currentCount = initialCount;

  const renderLikeState = () => {
    button.classList.toggle("is-liked", liked);
    button.setAttribute("aria-pressed", String(liked));
    if (icon) {
      icon.classList.toggle("fa-regular", !liked);
      icon.classList.toggle("fa-solid", liked);
    }
    if (countLabel) {
      countLabel.textContent = String(currentCount);
    }
  };

  button.addEventListener("click", () => {
    liked = !liked;
    currentCount += liked ? 1 : -1;
    renderLikeState();
  });

  renderLikeState();
});

const userAccountForm = document.querySelector('[data-account-form="user"]');
const staffAccountForm = document.querySelector('[data-account-form="staff"]');
const portalAccountForm = document.querySelector('[data-account-form="portal"]');
const demoFillButtons = document.querySelectorAll("[data-demo-fill]");

document.querySelectorAll("[data-password-toggle]").forEach((button) => {
  button.textContent = "Show";
  button.setAttribute("aria-label", "Show password");

  button.addEventListener("click", () => {
    const field = button.closest(".login-password-field")?.querySelector("input");

    if (!field) {
      return;
    }

    const nextType = field.type === "password" ? "text" : "password";
    field.type = nextType;
    button.textContent = nextType === "password" ? "◌" : "◉";
    button.setAttribute("aria-label", nextType === "password" ? "Show password" : "Hide password");
  });
});

if (userAccountForm) {
  const message = document.querySelector('[data-auth-message="user"]');

  userAccountForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = userAccountForm.querySelector('input[name="user-login"]')?.value.trim();
    const password = userAccountForm.querySelector('input[name="user-password"]')?.value.trim();
    const isValid = username === "user" && password === "1234";

    if (message) {
      message.classList.remove("is-error", "is-success");
    }

    if (isValid) {
      if (message) {
        message.textContent = "Demo login accepted. Redirecting to the member view.";
        message.classList.add("is-success");
      }

      window.setTimeout(() => {
        queueLoginTransition("index.html", "Member Portal");
        window.location.href = "index.html";
      }, 650);
      return;
    }

    if (message) {
      message.textContent = "Use the User Demo credentials listed below to enter this demo flow.";
      message.classList.add("is-error");
    }
  });
}

if (staffAccountForm) {
  const message = document.querySelector('[data-auth-message="staff"]');
  const roleField = staffAccountForm.querySelector('select[name="staff-role"]');
  const submitButton = staffAccountForm.querySelector("[data-staff-submit]");

  const renderStaffRoleState = () => {
    if (!roleField || !submitButton) {
      return;
    }

    const isSuperAdmin = roleField.value === "Super Admin";
    submitButton.classList.toggle("is-superadmin", isSuperAdmin);
  };

  if (currentPage === "staff-login.html" && roleField) {
    if (window.location.hash === "#super-admin") {
      roleField.value = "Super Admin";
    } else if (window.location.hash === "#admin") {
      roleField.value = "Admin";
    }
  }

  roleField?.addEventListener("change", renderStaffRoleState);
  renderStaffRoleState();

  staffAccountForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = staffAccountForm.querySelector('input[name="staff-login"]')?.value.trim();
    const password = staffAccountForm.querySelector('input[name="staff-password"]')?.value.trim();
    const role = staffAccountForm.querySelector('select[name="staff-role"]')?.value;
    const isAdmin = role === "Admin" && username === "admin" && password === "1234";
    const isSuperAdmin =
      role === "Super Admin" &&
      username === "superadmin" &&
      password === "1234";

    if (message) {
      message.classList.remove("is-error", "is-success");
    }

    if (isAdmin || isSuperAdmin) {
      if (message) {
        message.textContent = `Demo ${role} login accepted. Redirecting now.`;
        message.classList.add("is-success");
      }

      window.setTimeout(() => {
        queueLoginTransition(
          isSuperAdmin ? "superadmin/index.html" : "admin/index.html",
          isSuperAdmin ? "Super Admin Command Panel" : "Admin Dashboard"
        );
        window.location.href = isSuperAdmin ? "superadmin/index.html" : "admin/index.html";
      }, 650);
      return;
    }

    if (message) {
      message.textContent = "Match the selected role with the correct demo username and password below.";
      message.classList.add("is-error");
    }
  });
}

if (portalAccountForm) {
  const message = document.querySelector('[data-auth-message="portal"]');
  const submitButton = portalAccountForm.querySelector("[data-portal-submit]");

  portalAccountForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const username = portalAccountForm.querySelector('input[name="portal-login"]')?.value.trim();
    const password = portalAccountForm.querySelector('input[name="portal-password"]')?.value.trim();
    const isMember = username === "user" && password === "1234";
    const isAdmin = username === "admin" && password === "1234";
    const isSuperAdmin = username === "superadmin" && password === "1234";

    if (message) {
      message.classList.remove("is-error", "is-success");
    }

    submitButton?.classList.toggle("is-superadmin", isSuperAdmin);

    if (isMember || isAdmin || isSuperAdmin) {
      const roleLabel = isSuperAdmin ? "Super Admin" : isAdmin ? "Admin" : "Member";

      if (message) {
        message.textContent = `Demo ${roleLabel} login accepted. Redirecting now.`;
        message.classList.add("is-success");
      }

      window.setTimeout(() => {
        if (isSuperAdmin) {
          queueLoginTransition("superadmin/index.html", "Super Admin Command Panel");
          window.location.href = "superadmin/index.html";
        } else if (isAdmin) {
          queueLoginTransition("admin/index.html", "Admin Dashboard");
          window.location.href = "admin/index.html";
        } else {
          queueLoginTransition("index.html", "Member Portal");
          window.location.href = "index.html";
        }
      }, 650);
      return;
    }

    if (message) {
      message.textContent = "Use one of the demo usernames and the matching password listed below.";
      message.classList.add("is-error");
    }
  });
}

if (demoFillButtons.length > 0) {
  demoFillButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const type = button.getAttribute("data-demo-fill");

      if (type === "user" && userAccountForm) {
        const usernameField = userAccountForm.querySelector('input[name="user-login"]');
        const passwordField = userAccountForm.querySelector('input[name="user-password"]');
        const message = document.querySelector('[data-auth-message="user"]');

        if (usernameField) {
          usernameField.value = "user";
        }

        if (passwordField) {
          passwordField.value = "1234";
          passwordField.type = "password";
        }

        userAccountForm.querySelector("[data-password-toggle]")?.replaceChildren(document.createTextNode("Show"));

        if (message) {
          message.textContent = "Demo member credentials loaded.";
          message.classList.remove("is-error");
          message.classList.add("is-success");
        }

        usernameField?.focus();
      }

      if ((type === "admin" || type === "superadmin") && staffAccountForm) {
        const usernameField = staffAccountForm.querySelector('input[name="staff-login"]');
        const passwordField = staffAccountForm.querySelector('input[name="staff-password"]');
        const roleField = staffAccountForm.querySelector('select[name="staff-role"]');
        const message = document.querySelector('[data-auth-message="staff"]');
        const isSuperAdmin = type === "superadmin";

        if (usernameField) {
          usernameField.value = isSuperAdmin ? "superadmin" : "admin";
        }

        if (passwordField) {
          passwordField.value = "1234";
          passwordField.type = "password";
        }

        if (roleField) {
          roleField.value = isSuperAdmin ? "Super Admin" : "Admin";
          roleField.dispatchEvent(new Event("change"));
        }

        staffAccountForm.querySelector("[data-password-toggle]")?.replaceChildren(document.createTextNode("Show"));

        if (message) {
          message.textContent = `Demo ${isSuperAdmin ? "Super Admin" : "Admin"} credentials loaded.`;
          message.classList.remove("is-error");
          message.classList.add("is-success");
        }

        usernameField?.focus();
      }

      if (portalAccountForm) {
        const usernameField = portalAccountForm.querySelector('input[name="portal-login"]');
        const passwordField = portalAccountForm.querySelector('input[name="portal-password"]');
        const message = document.querySelector('[data-auth-message="portal"]');
        const portalSubmitButton = portalAccountForm.querySelector("[data-portal-submit]");
        const roleValue = type === "superadmin" ? "Super Admin" : type === "admin" ? "Admin" : "Member";
        const usernameValue = type === "superadmin" ? "superadmin" : type === "admin" ? "admin" : "user";

        if (usernameField) {
          usernameField.value = usernameValue;
        }

        if (passwordField) {
          passwordField.value = "1234";
          passwordField.type = "password";
        }

        portalAccountForm.querySelector("[data-password-toggle]")?.replaceChildren(document.createTextNode("Show"));
        portalSubmitButton?.classList.toggle("is-superadmin", type === "superadmin");

        if (message) {
          message.textContent = `Demo ${roleValue} credentials loaded.`;
          message.classList.remove("is-error");
          message.classList.add("is-success");
        }

        usernameField?.focus();
      }
    });
  });
}

const initFanCarousel = ({ root, cardSelector, prevSelector, nextSelector, triggerSelector, triggerAttribute }) => {
  if (!root) {
    return;
  }

  const cards = Array.from(root.querySelectorAll(cardSelector));
  const prev = root.querySelector(prevSelector);
  const next = root.querySelector(nextSelector);
  const triggers = triggerSelector ? Array.from(document.querySelectorAll(triggerSelector)) : [];
  let activeIndex = 0;

  const render = () => {
    cards.forEach((card, index) => {
      card.classList.remove("is-left-2", "is-left-1", "is-active", "is-right-1", "is-right-2");
      const delta = (index - activeIndex + cards.length) % cards.length;

      if (delta === 0) {
        card.classList.add("is-active");
      } else if (delta === 1) {
        card.classList.add("is-right-1");
      } else if (delta === 2) {
        card.classList.add("is-right-2");
      } else if (delta === cards.length - 1) {
        card.classList.add("is-left-1");
      } else {
        card.classList.add("is-left-2");
      }
    });

    triggers.forEach((trigger, index) => {
      const isActive = index === activeIndex;
      trigger.classList.toggle("is-active", isActive);
      trigger.setAttribute("aria-pressed", String(isActive));
    });
  };

  prev?.addEventListener("click", () => {
    activeIndex = (activeIndex - 1 + cards.length) % cards.length;
    render();
  });

  next?.addEventListener("click", () => {
    activeIndex = (activeIndex + 1) % cards.length;
    render();
  });

  triggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const nextIndex = Number(trigger.getAttribute(triggerAttribute));

      if (Number.isFinite(nextIndex)) {
        activeIndex = nextIndex;
        render();
      }
    });
  });

  render();
};

initFanCarousel({
  root: document.querySelector("[data-about-carousel]"),
  cardSelector: "[data-about-card]",
  prevSelector: "[data-about-prev]",
  nextSelector: "[data-about-next]",
  triggerSelector: "[data-value-trigger]",
  triggerAttribute: "data-value-trigger",
});

initFanCarousel({
  root: document.querySelector("[data-officer-carousel]"),
  cardSelector: "[data-officer-card]",
  prevSelector: "[data-officer-prev]",
  nextSelector: "[data-officer-next]",
});

const artCarousel = document.querySelector("[data-art-carousel]");

if (artCarousel) {
  const artImage = artCarousel.querySelector("[data-art-carousel-image]");
  const prevButton = artCarousel.querySelector(".carousel-arrow-left");
  const nextButton = artCarousel.querySelector(".carousel-arrow-right");
  const artSlides = ["monthlyart_1.jpg", "monthlyart_2.jpg", "monthlyart_3.jpg"];
  let activeArtIndex = 0;

  const renderArtSlide = () => {
    if (!artImage) {
      return;
    }

    artImage.src = artSlides[activeArtIndex];
    artImage.alt = `Monthly art feature ${activeArtIndex + 1}`;
  };

  prevButton?.addEventListener("click", () => {
    activeArtIndex = (activeArtIndex - 1 + artSlides.length) % artSlides.length;
    renderArtSlide();
  });

  nextButton?.addEventListener("click", () => {
    activeArtIndex = (activeArtIndex + 1) % artSlides.length;
    renderArtSlide();
  });

  renderArtSlide();
}

const guildMatchRoot = document.querySelector("[data-guild-match]");

if (guildMatchRoot) {
  const matchCards = Array.from(guildMatchRoot.querySelectorAll("[data-match-group]"));
  const matchStatus = document.querySelector("[data-guild-match-status]");
  let flippedCards = [];
  let matchedPairs = 0;
  let lockBoard = false;

  const renderMatchStatus = (message) => {
    if (matchStatus) {
      matchStatus.textContent = message;
    }
  };

  const resetFlippedCards = () => {
    flippedCards.forEach((card) => card.classList.remove("is-flipped"));
    flippedCards = [];
  };

  matchCards.forEach((card) => {
    card.addEventListener("click", () => {
      if (lockBoard || card.classList.contains("is-flipped") || card.classList.contains("is-matched")) {
        return;
      }

      card.classList.add("is-flipped");
      flippedCards.push(card);

      if (flippedCards.length < 2) {
        return;
      }

      const [firstCard, secondCard] = flippedCards;
      const isMatch = firstCard.getAttribute("data-match-group") === secondCard.getAttribute("data-match-group");

      if (isMatch) {
        firstCard.classList.add("is-matched");
        secondCard.classList.add("is-matched");
        flippedCards = [];
        matchedPairs += 1;

        if (matchedPairs === 4) {
          renderMatchStatus("All four pairs matched. Well done!");
        } else {
          renderMatchStatus(`Great match. ${4 - matchedPairs} pair(s) left.`);
        }
        return;
      }

      lockBoard = true;
      renderMatchStatus("Not a match. Try again.");
      window.setTimeout(() => {
        resetFlippedCards();
        lockBoard = false;
      }, 850);
    });
  });
}

const eventsFilter = document.querySelector("[data-events-filter]");

if (eventsFilter) {
  const eventViews = Array.from(document.querySelectorAll("[data-events-view]"));
  const eventsModal = document.querySelector("[data-events-modal]");
  const eventCards = Array.from(document.querySelectorAll("[data-event-card]"));
  const modalTitle = eventsModal?.querySelector("[data-events-modal-title]");
  const modalStatus = eventsModal?.querySelector("[data-events-modal-status]");
  const modalImage = eventsModal?.querySelector("[data-events-modal-image]");
  const modalDescription = eventsModal?.querySelector("[data-events-modal-description]");
  const modalMeta = eventsModal?.querySelector("[data-events-modal-meta]");
  const modalPrev = eventsModal?.querySelector("[data-events-modal-prev]");
  const modalNext = eventsModal?.querySelector("[data-events-modal-next]");
  const modalClose = eventsModal?.querySelector("[data-events-modal-close]");
  let activeEventImages = [];
  let activeEventIndex = 0;
  let lastEventTrigger = null;

  const getEventsViewFromHash = () => (window.location.hash === "#past" ? "past" : "ongoing");

  const renderEventsView = (view) => {
    eventViews.forEach((section) => {
      section.hidden = section.getAttribute("data-events-view") !== view;
    });

    eventsFilter.value = view;
  };

  const syncEventsHash = (view) => {
    const nextHash = view === "past" ? "#past" : "#ongoing";

    if (window.location.hash !== nextHash) {
      history.replaceState(null, "", `${window.location.pathname}${nextHash}`);
    }
  };

  const renderEventModalImage = () => {
    if (!modalImage || activeEventImages.length === 0) {
      return;
    }

    modalImage.src = activeEventImages[activeEventIndex];
    modalImage.alt = `${modalTitle?.textContent || "Event"} photo ${activeEventIndex + 1}`;
  };

  const closeEventsModal = () => {
    if (!eventsModal) {
      return;
    }

    eventsModal.hidden = true;
    document.body.style.overflow = "";
    lastEventTrigger?.focus();
  };

  const openEventsModal = (card, trigger) => {
    if (!eventsModal || !modalTitle || !modalStatus || !modalImage || !modalDescription || !modalMeta) {
      return;
    }

    activeEventImages = (card.getAttribute("data-event-images") || "").split("|").filter(Boolean);
    activeEventIndex = 0;
    lastEventTrigger = trigger;
    modalTitle.textContent = card.getAttribute("data-event-title") || "CMC Event";
    modalStatus.textContent = card.getAttribute("data-event-status") || "Event";
    modalDescription.textContent = card.getAttribute("data-event-description") || "";
    modalMeta.textContent = card.getAttribute("data-event-meta") || "";
    renderEventModalImage();
    eventsModal.hidden = false;
    document.body.style.overflow = "hidden";
  };

  eventsFilter.addEventListener("change", () => {
    const nextView = eventsFilter.value === "past" ? "past" : "ongoing";
    renderEventsView(nextView);
    syncEventsHash(nextView);
  });

  window.addEventListener("hashchange", () => {
    renderEventsView(getEventsViewFromHash());
  });

  eventCards.forEach((card) => {
    const trigger = card.querySelector(".events-entry-media");

    trigger?.addEventListener("click", () => {
      openEventsModal(card, trigger);
    });
  });

  modalPrev?.addEventListener("click", () => {
    if (activeEventImages.length === 0) {
      return;
    }

    activeEventIndex = (activeEventIndex - 1 + activeEventImages.length) % activeEventImages.length;
    renderEventModalImage();
  });

  modalNext?.addEventListener("click", () => {
    if (activeEventImages.length === 0) {
      return;
    }

    activeEventIndex = (activeEventIndex + 1) % activeEventImages.length;
    renderEventModalImage();
  });

  modalClose?.addEventListener("click", closeEventsModal);

  eventsModal?.addEventListener("click", (event) => {
    if (event.target === eventsModal) {
      closeEventsModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && eventsModal && !eventsModal.hidden) {
      closeEventsModal();
    }
  });

  const initialView = getEventsViewFromHash();
  renderEventsView(initialView);
  syncEventsHash(initialView);
}

const merchCartModal = document.querySelector(".merch-cart-modal");
const merchProductModal = document.querySelector(".merch-product-modal");

if (merchProductModal) {
  const productCards = document.querySelectorAll(".merch-catalog-card");
  const productImage = merchProductModal.querySelector("[data-product-modal-image]");
  const productTitle = merchProductModal.querySelector("[data-product-modal-title]");
  const productDescription = merchProductModal.querySelector("[data-product-modal-description]");
  const productPrice = merchProductModal.querySelector("[data-product-modal-price]");
  const productColor = merchProductModal.querySelector("[data-product-modal-color]");
  const productColorGroup = productColor?.closest(".merch-product-option-group");
  const productColors = merchProductModal.querySelector("[data-product-modal-colors]");
  const productOptionLabel = merchProductModal.querySelector("[data-product-modal-option-label]");
  const productSizes = merchProductModal.querySelector("[data-product-modal-sizes]");
  const productQty = merchProductModal.querySelector("[data-product-modal-qty]");
  const productAdd = merchProductModal.querySelector("[data-product-modal-add]");
  const productBuy = merchProductModal.querySelector(".merch-detail-shop-button");
  const productClose = merchProductModal.querySelector(".merch-product-close");
  let currentProduct = null;
  let currentQty = 1;
  let lastProductTrigger = null;
  let selectedOption = "";
  let selectedColor = "";

  const swatchClassMap = {
    Black: "merch-swatch-black",
    Cream: "merch-swatch-cream",
    Grey: "merch-swatch-grey",
    Blue: "merch-swatch-blue",
    Pink: "merch-swatch-pink",
    Brown: "merch-swatch-brown",
    Red: "merch-swatch-red",
    Dust: "merch-swatch-cream",
  };

  const openProduct = (card) => {
    const variationImages = Object.fromEntries(
      (card.getAttribute("data-product-variation-images") || "")
        .split("|")
        .filter(Boolean)
        .map((entry) => {
          const [label, image] = entry.split(":");
          return [label?.trim(), image?.trim()];
        })
        .filter(([label, image]) => label && image)
    );
    const colorImages = Object.fromEntries(
      (card.getAttribute("data-product-color-images") || "")
        .split("|")
        .filter(Boolean)
        .map((entry) => {
          const [label, image] = entry.split(":");
          return [label?.trim(), image?.trim()];
        })
        .filter(([label, image]) => label && image)
    );

    currentProduct = {
      name: card.getAttribute("data-product-name") || "CMC Item",
      price: Number(card.getAttribute("data-product-price") || "0"),
      image: card.getAttribute("data-product-image") || "logo.jpg",
      description: card.getAttribute("data-product-description") || "Items will be shipped within 4-5 weeks.",
      displayPrice: card.getAttribute("data-product-display-price") || "P0",
      color: card.getAttribute("data-product-color") || "Black",
      colors: (card.getAttribute("data-product-colors") || "").split(",").filter(Boolean),
      optionLabel: card.getAttribute("data-product-option-label") || "Size",
      sizes: (card.getAttribute("data-product-sizes") || "Small,Medium,Large").split(","),
      status: card.getAttribute("data-product-status") || "",
      variationImages,
      colorImages,
    };

    currentQty = 1;
    selectedOption = currentProduct.sizes[0]?.trim() || "";
    selectedColor = currentProduct.color;
    lastProductTrigger = card;

    if (productImage) {
      productImage.src = currentProduct.image;
      productImage.alt = `${currentProduct.name} preview`;
    }

    if (productTitle) {
      productTitle.textContent = currentProduct.name;
    }

    if (productDescription) {
      productDescription.textContent = currentProduct.description;
    }

    if (productPrice) {
      productPrice.textContent = currentProduct.displayPrice;
    }

    if (productColor) {
      productColor.textContent = currentProduct.color;
    }

    if (productColorGroup) {
      productColorGroup.hidden = currentProduct.colors.length === 0;
    }

    if (productOptionLabel) {
      productOptionLabel.textContent = currentProduct.optionLabel;
    }

    if (productColors) {
      productColors.innerHTML = currentProduct.colors
        .map((colorName, index) => {
          const trimmed = colorName.trim();
          const cssClass = swatchClassMap[trimmed] || "merch-swatch-cream";
          return `<button class="merch-swatch ${cssClass}${index === 0 ? " is-selected" : ""}" type="button" data-color-value="${trimmed}" title="${trimmed}" aria-label="${trimmed}"></button>`;
        })
        .join("");

      productColors.querySelectorAll(".merch-swatch").forEach((swatch) => {
        swatch.addEventListener("click", () => {
          selectedColor = swatch.getAttribute("data-color-value") || currentProduct?.color || "";
          productColor && (productColor.textContent = selectedColor);
          productColors.querySelectorAll(".merch-swatch").forEach((otherSwatch) => {
            otherSwatch.classList.toggle("is-selected", otherSwatch === swatch);
          });

          if (currentProduct?.colorImages?.[selectedColor] && productImage) {
            productImage.src = currentProduct.colorImages[selectedColor];
            productImage.alt = `${currentProduct.name} ${selectedColor} preview`;
          }
        });
      });
    }

    if (productSizes) {
      productSizes.innerHTML = currentProduct.sizes
        .map((size, index) => `<button class="merch-size-chip${index === 0 ? " is-selected" : ""}" type="button" data-option-value="${size.trim()}">${size.trim()}</button>`)
        .join("");

      productSizes.querySelectorAll(".merch-size-chip").forEach((chip) => {
        chip.addEventListener("click", () => {
          selectedOption = chip.getAttribute("data-option-value") || "";
          productSizes.querySelectorAll(".merch-size-chip").forEach((otherChip) => {
            otherChip.classList.toggle("is-selected", otherChip === chip);
          });

          if (currentProduct?.variationImages?.[selectedOption] && productImage) {
            productImage.src = currentProduct.variationImages[selectedOption];
            productImage.alt = `${currentProduct.name} ${selectedOption} preview`;
          }
        });
      });
    }

    if (productQty) {
      productQty.textContent = String(currentQty);
    }

    const isUnavailable = currentProduct.status === "Work in Progress";
    if (productAdd) {
      productAdd.disabled = isUnavailable;
      productAdd.textContent = isUnavailable ? "Unavailable" : "Add to cart";
    }
    if (productBuy) {
      productBuy.disabled = isUnavailable;
      productBuy.textContent = isUnavailable ? "Coming Soon" : "Buy with cart";
    }

    merchProductModal.hidden = false;
    document.body.style.overflow = "hidden";
    productClose?.focus();
  };

  const closeProduct = () => {
    merchProductModal.hidden = true;
    if (!document.querySelector(".merch-cart-modal:not([hidden])")) {
      document.body.style.overflow = "";
    }
    lastProductTrigger?.focus();
  };

  productCards.forEach((card) => {
    card.addEventListener("click", () => openProduct(card));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openProduct(card);
      }
    });
  });

  merchProductModal.querySelectorAll("[data-qty-change]").forEach((button) => {
    button.addEventListener("click", () => {
      currentQty = Math.max(1, currentQty + Number(button.getAttribute("data-qty-change") || "0"));
      if (productQty) {
        productQty.textContent = String(currentQty);
      }
    });
  });

  productAdd?.addEventListener("click", () => {
    if (!currentProduct || currentProduct.status === "Work in Progress") {
      return;
    }

    for (let count = 0; count < currentQty; count += 1) {
      document.querySelector(".merch-cart-modal");
      const addEvent = new CustomEvent("merch:add-to-cart", { detail: currentProduct });
      document.dispatchEvent(addEvent);
    }

    closeProduct();
  });

  productBuy?.addEventListener("click", () => {
    if (!currentProduct || currentProduct.status === "Work in Progress") {
      return;
    }

    for (let count = 0; count < currentQty; count += 1) {
      const addEvent = new CustomEvent("merch:add-to-cart", { detail: currentProduct });
      document.dispatchEvent(addEvent);
    }

    closeProduct();
  });

  productClose?.addEventListener("click", closeProduct);

  merchProductModal.addEventListener("click", (event) => {
    if (event.target === merchProductModal) {
      closeProduct();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !merchProductModal.hidden) {
      closeProduct();
    }
  });
}

if (merchCartModal) {
  const cartCountLabel = document.querySelector("[data-cart-count]");
  const cartList = merchCartModal.querySelector("[data-cart-list]");
  const cartTotal = merchCartModal.querySelector("[data-cart-total]");
  const cartClose = merchCartModal.querySelector(".merch-cart-close");
  const cartTriggers = document.querySelectorAll(".merch-cart-trigger, [data-open-cart]");
  const merchButtons = document.querySelectorAll("[data-cart-item]");
  const cartItems = [];
  let lastCartTrigger = null;

  const peso = new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: "PHP",
    maximumFractionDigits: 0,
  });

  const renderCart = () => {
    const count = cartItems.length;
    const total = cartItems.reduce((sum, item) => sum + item.price, 0);

    if (cartCountLabel) {
      cartCountLabel.textContent = String(count);
    }

    if (cartTotal) {
      cartTotal.textContent = peso.format(total);
    }

    if (!cartList) {
      return;
    }

    if (count === 0) {
      cartList.innerHTML = '<li class="merch-cart-empty">No items yet. Try a Quick Add.</li>';
      return;
    }

    cartList.innerHTML = cartItems
      .map(
        (item) => `
          <li>
            <span>${item.name}</span>
            <strong>${peso.format(item.price)}</strong>
          </li>
        `
      )
      .join("");
  };

  const openCart = (trigger) => {
    merchCartModal.hidden = false;
    document.body.style.overflow = "hidden";
    lastCartTrigger = trigger ?? null;
    cartClose?.focus();
  };

  const closeCart = () => {
    merchCartModal.hidden = true;
    document.body.style.overflow = "";
    lastCartTrigger?.focus();
  };

  merchButtons.forEach((button) => {
    button.addEventListener("click", () => {
      cartItems.push({
        name: button.getAttribute("data-cart-item") || "CMC Item",
        price: Number(button.getAttribute("data-cart-price") || "0"),
      });
      renderCart();
      openCart(button);
    });
  });

  document.addEventListener("merch:add-to-cart", (event) => {
    const item = event.detail;

    if (!item) {
      return;
    }

    cartItems.push({
      name: item.name || "CMC Item",
      price: Number(item.price || 0),
    });
    renderCart();
    openCart(document.querySelector("[data-product-modal-add]"));
  });

  cartTriggers.forEach((trigger) => {
    trigger.addEventListener("click", () => {
      renderCart();
      openCart(trigger);
    });
  });

  cartClose?.addEventListener("click", closeCart);

  merchCartModal.addEventListener("click", (event) => {
    if (event.target === merchCartModal) {
      closeCart();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !merchCartModal.hidden) {
      closeCart();
    }
  });

  renderCart();
}

const footerMarkup = `
  <footer class="site-footer" aria-label="Site footer">
    <div class="footer-layout">
      <section class="footer-section" aria-label="Footer navigation">
        <nav class="footer-nav">
          <a href="index.html">Home</a>
          <a href="about.html">About</a>
          <a href="mini-games.html">Mini Games</a>
          <a href="merch-store.html">Merch</a>
          <a href="ongoing-events.html">Events</a>
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
const suppressFooterPages = new Set(["account.html", "user-login.html", "staff-login.html", "registration.html"]);
const suppressFooter =
  suppressFooterPages.has(currentPage) ||
  currentPage?.startsWith("admin/") ||
  currentPage?.startsWith("superadmin/");

if (pageShell && !suppressFooter) {
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

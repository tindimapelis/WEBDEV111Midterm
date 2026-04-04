(function () {
  const SESSION_KEY = "healthsync-portal-session";
  const LATEST_BOOKING_KEY = "healthsync-latest-booking";

  const accounts = [
    {
      role: "admin",
      label: "Admin",
      username: "dimapelis@gmail.com",
      password: "admin123",
      name: "Clinic Administrator",
      dashboard: "admin-dashboard.html",
      description: "Primary admin access for schedules, approvals, staffing, and branch-level oversight."
    },
    {
      role: "user",
      label: "User",
      username: "user",
      password: "user123",
      name: "Patient Account",
      dashboard: "user-dashboard.html",
      description: "Patient access for profile, bookings, and reminders."
    }
  ];

  function getSession() {
    try {
      const stored = window.localStorage.getItem(SESSION_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      return null;
    }
  }

  function saveSession(account) {
    const session = {
      role: account.role,
      label: account.label,
      username: account.username,
      name: account.name,
      dashboard: account.dashboard
    };

    window.localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return session;
  }

  function clearSession() {
    window.localStorage.removeItem(SESSION_KEY);
  }

  function getAccount(username, password) {
    const normalizedUsername = username.trim().toLowerCase();
    return accounts.find((account) => {
      return account.username === normalizedUsername && account.password === password;
    }) || null;
  }

  function goToDashboard(role) {
    const account = accounts.find((entry) => entry.role === role);
    window.location.href = account ? account.dashboard : "login.html";
  }

  function setupLogoutButtons() {
    document.querySelectorAll("[data-logout]").forEach((button) => {
      button.addEventListener("click", () => {
        clearSession();
        window.location.href = "login.html";
      });
    });
  }

  function populateSession(session) {
    document.querySelectorAll("[data-auth-name]").forEach((node) => {
      node.textContent = session.name;
    });

    document.querySelectorAll("[data-auth-role]").forEach((node) => {
      node.textContent = session.label;
    });

    document.querySelectorAll("[data-auth-username]").forEach((node) => {
      node.textContent = session.username;
    });
  }

  function readLatestBooking() {
    try {
      const stored = window.localStorage.getItem(LATEST_BOOKING_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      return null;
    }
  }

  function renderLatestBooking() {
    const booking = readLatestBooking();

    document.querySelectorAll("[data-latest-booking]").forEach((node) => {
      if (!booking) {
        node.innerHTML = `
          <div class="empty-box">
            No new booking has been submitted from the public wizard yet.
          </div>
        `;
        return;
      }

      node.innerHTML = `
        <div class="booking-summary">
          <strong>${booking.specialty}</strong>
          <small>${booking.doctor}</small>
          <p>${booking.date} at ${booking.time}</p>
          <span class="status-pill status-pending">${booking.status}</span>
        </div>
      `;
    });
  }

  function protectPage(expectedRole) {
    const session = getSession();

    if (!session) {
      window.location.href = "login.html";
      return;
    }

    if (session.role !== expectedRole) {
      goToDashboard(session.role);
      return;
    }

    populateSession(session);
    renderLatestBooking();
    setupLogoutButtons();
  }

  function renderAccountCards(accountList = accounts) {
    const grid = document.getElementById("accountGrid");
    if (!grid) {
      return;
    }

    grid.innerHTML = accountList.map((account) => {
      return `
        <article class="account-card">
          <div class="card-head">
            <span class="role-chip">${account.label}</span>
            <button type="button" class="fill-button" data-fill="${account.role}">Use</button>
          </div>
          <h3>${account.name}</h3>
          <p>${account.description}</p>
          <div class="credential-line"><span>${account.role === "admin" ? "Email" : "Username"}</span><strong>${account.username}</strong></div>
          <div class="credential-line"><span>Password</span><strong>${account.password}</strong></div>
        </article>
      `;
    }).join("");

    grid.querySelectorAll("[data-fill]").forEach((button) => {
      button.addEventListener("click", () => {
        const account = accountList.find((entry) => entry.role === button.dataset.fill);
        const usernameInput = document.getElementById("username");
        const passwordInput = document.getElementById("password");

        if (!account || !usernameInput || !passwordInput) {
          return;
        }

        usernameInput.value = account.username;
        passwordInput.value = account.password;
      });
    });
  }

  function initRoleLoginPage(expectedRole) {
    const session = getSession();
    const currentSession = document.getElementById("currentSession");
    const continueSession = document.getElementById("continueSession");
    const form = document.getElementById("loginForm");

    if (session && currentSession && continueSession && session.role === expectedRole) {
      currentSession.hidden = false;
      continueSession.hidden = false;
      currentSession.textContent = `Current session: ${session.name} (${session.label})`;
      continueSession.addEventListener("click", () => {
        goToDashboard(session.role);
      });
    }

    setupLogoutButtons();

    if (!form) {
      return;
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      const account = getAccount(username, password);

      if (!account || account.role !== expectedRole) {
        setLoginStatus("Use the patient account shown below to open the user portal.", "error");
        return;
      }

      saveSession(account);
      setLoginStatus(`Login successful. Opening the ${account.label} dashboard...`, "success");
      goToDashboard(account.role);
    });
  }

  function setLoginStatus(message, state) {
    const node = document.getElementById("loginStatus");
    if (!node) {
      return;
    }

    node.textContent = message;
    node.dataset.state = state;
  }

  function initLoginPage() {
    renderAccountCards(accounts.filter((account) => account.role === "admin"));

    const session = getSession();
    const currentSession = document.getElementById("currentSession");
    const continueSession = document.getElementById("continueSession");

    if (session && currentSession && continueSession) {
      currentSession.hidden = false;
      continueSession.hidden = false;
      currentSession.textContent = `Current session: ${session.name} (${session.label})`;
      continueSession.addEventListener("click", () => {
        goToDashboard(session.role);
      });
    }

    setupLogoutButtons();

    const form = document.getElementById("loginForm");
    if (!form) {
      return;
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      const account = getAccount(username, password);

      if (!account || account.role !== "admin") {
        setLoginStatus("Use the admin account shown below to open the admin portal.", "error");
        return;
      }

      saveSession(account);
      setLoginStatus(`Login successful. Opening the ${account.label} dashboard...`, "success");
      goToDashboard(account.role);
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const page = document.body.dataset.page;
    const protectedRole = document.body.dataset.protectedRole;

    if (page === "login") {
      initLoginPage();
      return;
    }

    if (page === "user-login") {
      initRoleLoginPage("user");
      return;
    }

    if (protectedRole) {
      protectPage(protectedRole);
    }
  });
})();

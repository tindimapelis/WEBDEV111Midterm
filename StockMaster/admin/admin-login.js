const adminLoginForm = document.getElementById("adminLoginForm");
const adminLoginStatus = document.getElementById("adminLoginStatus");
const validAdminEmail = "dimapelis@gmail.com";
const validAdminPassword = "12345";

adminLoginForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const adminId = document.getElementById("adminId").value.trim();
  const password = document.getElementById("adminPassword").value.trim();

  if (!adminId || !password) {
    adminLoginStatus.textContent = "Please enter both admin email and password.";
    return;
  }

  if (adminId !== validAdminEmail || password !== validAdminPassword) {
    adminLoginStatus.textContent = "Invalid admin credentials. Please try again.";
    return;
  }

  localStorage.setItem("stockmaster-admin-session", JSON.stringify({
    role: "admin",
    adminId,
    loggedInAt: Date.now(),
  }));

  adminLoginStatus.textContent = "Admin verified. Opening dashboard...";
  window.location.href = "dashboard.html";
});

const userLoginForm = document.getElementById("userLoginForm");
const userLoginStatus = document.getElementById("userLoginStatus");
const validUsername = "user";
const validUserPassword = "12345";

userLoginForm?.addEventListener("submit", (event) => {
  event.preventDefault();

  const username = document.getElementById("userEmail").value.trim();
  const password = document.getElementById("userPassword").value.trim();

  if (!username || !password) {
    userLoginStatus.textContent = "Please enter both username and password.";
    return;
  }

  if (username !== validUsername || password !== validUserPassword) {
    userLoginStatus.textContent = "Invalid user credentials. Please try again.";
    return;
  }

  localStorage.setItem("stockmaster-user-session", JSON.stringify({
    role: "user",
    username,
    loggedInAt: Date.now(),
  }));

  userLoginStatus.textContent = "Login successful. Opening invoice tracker...";
  window.location.href = "invoice-tracker.html";
});

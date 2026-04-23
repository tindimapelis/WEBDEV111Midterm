const currentPage = document.documentElement.dataset.page;
const navLinks = document.querySelectorAll(".main-nav a");

for (const link of navLinks) {
  const href = link.getAttribute("href");

  if (href === currentPage) {
    link.classList.add("is-active");
    link.setAttribute("aria-current", "page");
  }
}

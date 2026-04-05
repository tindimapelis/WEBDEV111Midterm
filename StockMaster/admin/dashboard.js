const storedInvoices = loadInvoices();

const adminDescription = document.getElementById("adminDescription");
const adminTotalInvoices = document.getElementById("adminTotalInvoices");
const adminTotalCompanies = document.getElementById("adminTotalCompanies");
const adminOpenInvoices = document.getElementById("adminOpenInvoices");
const adminDueSoon = document.getElementById("adminDueSoon");
const adminCompanySummary = document.getElementById("adminCompanySummary");
const adminRecentInvoices = document.getElementById("adminRecentInvoices");
const adminInvoiceRows = document.getElementById("adminInvoiceRows");

renderAdminDashboard();

function renderAdminDashboard() {
  const companies = [...new Set(storedInvoices.map((invoice) => invoice.company))];
  const dueSoonCount = storedInvoices.filter((invoice) => getDaysLeft(invoice.dueDate) <= 7).length;

  adminTotalInvoices.textContent = String(storedInvoices.length);
  adminTotalCompanies.textContent = String(companies.length);
  adminOpenInvoices.textContent = String(storedInvoices.length);
  adminDueSoon.textContent = String(dueSoonCount);

  if (storedInvoices.length === 0) {
    adminDescription.textContent = "Invoice and company statistics will appear here after users begin adding records.";
    adminCompanySummary.innerHTML = '<p class="summary-note">No company activity yet.</p>';
    adminRecentInvoices.innerHTML = '<p class="summary-note">No invoice activity yet.</p>';
    adminInvoiceRows.innerHTML = '<tr><td colspan="6" class="empty-state-cell">No invoice records available.</td></tr>';
    return;
  }

  const busiestCompany = companies
    .map((company) => ({
      company,
      count: storedInvoices.filter((invoice) => invoice.company === company).length,
    }))
    .sort((a, b) => b.count - a.count)[0];

  adminDescription.textContent = `${busiestCompany.company} currently leads with ${busiestCompany.count} invoice${busiestCompany.count === 1 ? "" : "s"}. ${dueSoonCount} invoice${dueSoonCount === 1 ? "" : "s"} need attention within 7 days.`;

  adminCompanySummary.innerHTML = companies
    .map((company) => ({
      company,
      count: storedInvoices.filter((invoice) => invoice.company === company).length,
    }))
    .sort((a, b) => b.count - a.count)
    .map(({ company, count }) => `
      <div class="company-row">
        <span>${company}</span>
        <strong>${count} invoice${count === 1 ? "" : "s"}</strong>
      </div>
    `)
    .join("");

  adminRecentInvoices.innerHTML = storedInvoices
    .slice(0, 4)
    .map((invoice) => `
      <div class="company-row">
        <span>${invoice.client} / ${invoice.company}</span>
        <strong>${formatDate(invoice.dueDate)}</strong>
      </div>
    `)
    .join("");

  adminInvoiceRows.innerHTML = storedInvoices
    .map((invoice) => {
      const daysLeft = getDaysLeft(invoice.dueDate);
      const statusClass = daysLeft <= 3 ? "alert" : daysLeft <= 7 ? "warning" : "";
      const statusLabel = daysLeft < 0 ? "Overdue" : daysLeft <= 7 ? "Due Soon" : "Open";

      return `
        <tr>
          <td>${invoice.id}</td>
          <td>${invoice.company}</td>
          <td>${invoice.client}</td>
          <td>${formatDate(invoice.dueDate)}</td>
          <td>${daysLeft < 0 ? `${Math.abs(daysLeft)} days overdue` : `${daysLeft} days left`}</td>
          <td><span class="status-tag ${statusClass}">${statusLabel}</span></td>
        </tr>
      `;
    })
    .join("");
}

function loadInvoices() {
  const saved = localStorage.getItem("stockmaster-invoices");

  if (!saved) {
    return [];
  }

  try {
    return JSON.parse(saved);
  } catch (error) {
    return [];
  }
}

function formatDate(value) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getDaysLeft(value) {
  const today = new Date();
  const dueDate = new Date(`${value}T00:00:00`);
  today.setHours(0, 0, 0, 0);
  return Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
}

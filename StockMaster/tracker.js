const trackerForm = document.getElementById("trackerForm");
const companyNameInput = document.getElementById("companyName");
const trackerClientNameInput = document.getElementById("trackerClientName");
const trackerDueDateInput = document.getElementById("trackerDueDate");
const trackerNoteInput = document.getElementById("trackerNote");
const clearInvoicesButton = document.getElementById("clearInvoices");

const totalInvoices = document.getElementById("totalInvoices");
const totalCompanies = document.getElementById("totalCompanies");
const latestCompany = document.getElementById("latestCompany");
const invoiceDescription = document.getElementById("invoiceDescription");
const companySummary = document.getElementById("companySummary");
const invoiceRows = document.getElementById("invoiceRows");

const storageKey = "stockmaster-invoices";
const defaultDueDate = new Date();
defaultDueDate.setDate(defaultDueDate.getDate() + 14);
trackerDueDateInput.value = defaultDueDate.toISOString().split("T")[0];

let invoices = loadInvoices();
renderInvoices();

trackerForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const invoice = {
    id: createInvoiceId(),
    company: companyNameInput.value.trim(),
    client: trackerClientNameInput.value.trim(),
    dueDate: trackerDueDateInput.value,
    note: trackerNoteInput.value.trim() || "No extra description",
    status: "Open",
    createdAt: Date.now(),
  };

  invoices.unshift(invoice);
  saveInvoices();
  renderInvoices();

  trackerForm.reset();
  trackerDueDateInput.value = defaultDueDate.toISOString().split("T")[0];
  companyNameInput.focus();
});

clearInvoicesButton.addEventListener("click", () => {
  invoices = [];
  saveInvoices();
  renderInvoices();
  trackerForm.reset();
  trackerDueDateInput.value = defaultDueDate.toISOString().split("T")[0];
});

function renderInvoices() {
  renderSummaryCards();
  renderCompanySummary();
  renderInvoiceTable();
}

function renderSummaryCards() {
  const companies = [...new Set(invoices.map((invoice) => invoice.company))];
  const latestInvoice = invoices[0];

  totalInvoices.textContent = String(invoices.length);
  totalCompanies.textContent = String(companies.length);
  latestCompany.textContent = latestInvoice ? latestInvoice.company : "Waiting";

  if (!latestInvoice) {
    invoiceDescription.textContent = "No invoices added yet. Start by entering a company and client to build your invoice history.";
    return;
  }

  const companyInvoiceCount = invoices.filter((invoice) => invoice.company === latestInvoice.company).length;
  invoiceDescription.textContent = `${latestInvoice.company} has taken ${companyInvoiceCount} invoice${companyInvoiceCount === 1 ? "" : "s"} so far. Latest client: ${latestInvoice.client}, due ${formatDate(latestInvoice.dueDate)}.`;
}

function renderCompanySummary() {
  if (invoices.length === 0) {
    companySummary.innerHTML = '<p class="summary-note">No company records yet.</p>';
    return;
  }

  const counts = invoices.reduce((accumulator, invoice) => {
    accumulator[invoice.company] = (accumulator[invoice.company] || 0) + 1;
    return accumulator;
  }, {});

  companySummary.innerHTML = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .map(([company, count]) => `
      <div class="company-row">
        <span>${company}</span>
        <strong>${count} invoice${count === 1 ? "" : "s"}</strong>
      </div>
    `)
    .join("");
}

function renderInvoiceTable() {
  if (invoices.length === 0) {
    invoiceRows.innerHTML = `
      <tr>
        <td colspan="6" class="empty-state-cell">No invoices tracked yet.</td>
      </tr>
    `;
    return;
  }

  invoiceRows.innerHTML = invoices
    .map((invoice) => `
      <tr>
        <td>${invoice.id}</td>
        <td>${invoice.company}</td>
        <td>${invoice.client}</td>
        <td>${formatDate(invoice.dueDate)}</td>
        <td>${invoice.output ? `${invoice.note} / ${invoice.output}` : invoice.note}</td>
        <td><span class="status-tag">${invoice.status}</span></td>
      </tr>
    `)
    .join("");
}

function loadInvoices() {
  const storedInvoices = localStorage.getItem(storageKey);

  if (!storedInvoices) {
    return [];
  }

  try {
    return JSON.parse(storedInvoices);
  } catch (error) {
    return [];
  }
}

function saveInvoices() {
  localStorage.setItem(storageKey, JSON.stringify(invoices));
}

function createInvoiceId() {
  return `INV-${Math.floor(1000 + Math.random() * 9000)}`;
}

function formatDate(value) {
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

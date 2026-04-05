const invoiceForm = document.getElementById("invoiceForm");
const companyNameInput = document.getElementById("companyName");
const clientNameInput = document.getElementById("clientName");
const dueDateInput = document.getElementById("dueDate");
const orderNoteInput = document.getElementById("orderNote");
const generateOutputButton = document.getElementById("generateOutput");
const startInvoiceButton = document.getElementById("startInvoice");

const summaryCompany = document.getElementById("summaryCompany");
const summaryClient = document.getElementById("summaryClient");
const summaryDue = document.getElementById("summaryDue");
const summaryOutput = document.getElementById("summaryOutput");
const statusMessage = document.getElementById("statusMessage");

const storageKey = "stockmaster-invoices";
const defaultDueDate = new Date();
defaultDueDate.setDate(defaultDueDate.getDate() + 14);
dueDateInput.value = defaultDueDate.toISOString().split("T")[0];
summaryDue.textContent = formatDate(dueDateInput.value);

let currentInvoiceId = null;

startInvoiceButton.addEventListener("click", () => {
  invoiceForm.reset();
  dueDateInput.value = defaultDueDate.toISOString().split("T")[0];
  summaryCompany.textContent = "Waiting for input";
  summaryClient.textContent = "Waiting for input";
  summaryDue.textContent = formatDate(dueDateInput.value);
  summaryOutput.textContent = "Link not generated";
  statusMessage.textContent = "Fresh invoice draft created. Add a client to continue.";
  currentInvoiceId = null;
  companyNameInput.focus();
});

invoiceForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const company = companyNameInput.value.trim();
  const client = clientNameInput.value.trim();
  const dueDate = dueDateInput.value;
  const note = orderNoteInput.value.trim();
  const invoices = loadInvoices();

  const invoice = {
    id: currentInvoiceId || createInvoiceId(),
    company,
    client,
    dueDate,
    note: note || "No extra description",
    status: "Open",
    output: summaryOutput.textContent === "Link not generated" ? "Draft ready" : summaryOutput.textContent,
    createdAt: Date.now(),
  };

  currentInvoiceId = invoice.id;
  upsertInvoice(invoices, invoice);
  saveInvoices(invoices);

  summaryCompany.textContent = company || "Waiting for input";
  summaryClient.textContent = client || "Waiting for input";
  summaryDue.textContent = dueDate ? formatDate(dueDate) : "Not set";
  summaryOutput.textContent = invoice.output;
  statusMessage.textContent = note
    ? `Invoice saved to tracker for ${company}. Due ${formatDate(dueDate)}. Note saved for fulfillment.`
    : `Invoice saved to tracker for ${company}. Due ${formatDate(dueDate)}. Ready for link or PDF generation.`;
});

generateOutputButton.addEventListener("click", () => {
  const company = companyNameInput.value.trim();
  const client = clientNameInput.value.trim();

  if (!company || !client) {
    statusMessage.textContent = "Add both company and client before generating a shareable invoice link or PDF.";
    if (!company) {
      companyNameInput.focus();
      return;
    }

    clientNameInput.focus();
    return;
  }

  const cleanClient = client.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const cleanCompany = company.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const invoiceCode = currentInvoiceId || createInvoiceId();
  const outputValue = `${invoiceCode} / ${cleanCompany || "company"}-${cleanClient || "client"}-pdf`;

  currentInvoiceId = invoiceCode;
  summaryCompany.textContent = company;
  summaryClient.textContent = client;
  summaryDue.textContent = formatDate(dueDateInput.value);
  summaryOutput.textContent = outputValue;
  persistCurrentInvoice(outputValue);
  statusMessage.textContent = "Invoice assets generated and synced to the tracker. Share the link with the buyer or export the PDF for records.";
});

document.querySelectorAll(".table-action").forEach((button) => {
  button.addEventListener("click", () => {
    statusMessage.textContent = `${button.textContent} action queued from the operations board.`;
  });
});

function formatDate(value) {
  if (!value) {
    return "Not set";
  }

  return new Date(`${value}T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
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

function saveInvoices(invoices) {
  localStorage.setItem(storageKey, JSON.stringify(invoices));
}

function createInvoiceId() {
  return `INV-${Math.floor(1000 + Math.random() * 9000)}`;
}

function upsertInvoice(invoices, invoice) {
  const invoiceIndex = invoices.findIndex((entry) => entry.id === invoice.id);

  if (invoiceIndex >= 0) {
    invoices[invoiceIndex] = { ...invoices[invoiceIndex], ...invoice };
    return;
  }

  invoices.unshift(invoice);
}

function persistCurrentInvoice(outputValue) {
  const invoices = loadInvoices();
  const invoice = {
    id: currentInvoiceId || createInvoiceId(),
    company: companyNameInput.value.trim(),
    client: clientNameInput.value.trim(),
    dueDate: dueDateInput.value,
    note: orderNoteInput.value.trim() || "No extra description",
    status: "Open",
    output: outputValue,
    createdAt: Date.now(),
  };

  currentInvoiceId = invoice.id;
  upsertInvoice(invoices, invoice);
  saveInvoices(invoices);
}

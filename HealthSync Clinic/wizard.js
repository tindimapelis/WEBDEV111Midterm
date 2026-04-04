const WIZARD_STORAGE_KEY = "healthsync-wizard-state";
const APPOINTMENTS_STORAGE_KEY = "healthsync-demo-appointments";
const LATEST_BOOKING_KEY = "healthsync-latest-booking";

const specialties = [
  {
    id: "cardiology",
    label: "Cardiology",
    badge: "CRT",
    description: "Heart rhythm screening, preventive checkups, and circulation-focused consultations."
  },
  {
    id: "dermatology",
    label: "Dermatology",
    badge: "DER",
    description: "Skin, hair, and wellness care with visual assessments and guided treatment planning."
  },
  {
    id: "pediatrics",
    label: "Pediatrics",
    badge: "PDS",
    description: "Child wellness, follow-up visits, developmental support, and family-friendly care."
  },
  {
    id: "orthopedics",
    label: "Orthopedics",
    badge: "ORT",
    description: "Mobility, pain recovery, posture support, and musculoskeletal treatment planning."
  }
];

const doctors = [
  {
    id: "d1",
    name: "Dr. Castorice",
    specialtyIds: ["cardiology", "dermatology"],
    title: "Cardiology and Dermatology Consultant",
    image: "doctor.jpg",
    accent: "violet",
    experience: 12,
    branch: "Okhema Annex, Amphoreus Wing",
    bio: "Inspired by Castorice's solemn Amphoreus lore, this profile emphasizes quiet precision, composed observation, and carefully measured long-view care.",
    availability: {
      0: ["09:00 AM", "10:30 AM", "02:00 PM"],
      1: ["11:00 AM", "01:30 PM", "03:30 PM"],
      2: ["09:30 AM", "12:30 PM", "04:00 PM"]
    }
  },
  {
    id: "d2",
    name: "Dr. Bailu",
    specialtyIds: ["pediatrics", "cardiology"],
    title: "Pediatrics and Wellness Specialist",
    image: "doctor1.jpg",
    accent: "mint",
    experience: 9,
    branch: "Alchemy Commission, Xianzhou Luofu Wing",
    bio: "Inspired by Bailu's healing role on the Luofu, this profile centers on lively bedside warmth, restorative care, and reassuring family follow-ups.",
    availability: {
      0: ["08:30 AM", "01:00 PM", "03:00 PM"],
      3: ["09:30 AM", "11:30 AM", "02:30 PM"],
      4: ["10:00 AM", "01:30 PM", "04:30 PM"]
    }
  },
  {
    id: "d3",
    name: "Dr. Hyacine",
    specialtyIds: ["dermatology", "orthopedics"],
    title: "Dermatology and Recovery Specialist",
    image: "doctor2.jpg",
    accent: "sky",
    experience: 11,
    branch: "Dreammaster Pavilion, Penacony Wing",
    bio: "Styled with a graceful Penacony sensibility, Hyacine's profile leans into refined recovery planning, visual care guidance, and polished patient support.",
    availability: {
      0: ["09:00 AM", "11:00 AM", "03:30 PM"],
      1: ["10:00 AM", "01:00 PM", "04:00 PM"],
      5: ["09:30 AM", "12:00 PM", "02:30 PM"]
    }
  },
  {
    id: "d4",
    name: "Dr. Gallagher",
    specialtyIds: ["orthopedics", "pediatrics"],
    title: "Orthopedics and Family Care Specialist",
    image: "doctor3.jpg",
    accent: "rose",
    experience: 14,
    branch: "The Reverie, Penacony Service Wing",
    bio: "Grounded in Gallagher's rough-edged Penacony presence, this profile brings practical recovery support, dependable triage instincts, and no-nonsense guidance.",
    availability: {
      1: ["08:30 AM", "10:30 AM", "01:30 PM"],
      2: ["09:00 AM", "11:30 AM", "03:30 PM"],
      4: ["08:00 AM", "12:00 PM", "04:00 PM"]
    }
  }
];

const seedAppointments = [
  {
    id: "a1",
    specialtyId: "dermatology",
    doctorId: "d3",
    date: "2026-03-24",
    time: "11:00 AM",
    status: "Confirmed"
  },
  {
    id: "a2",
    specialtyId: "pediatrics",
    doctorId: "d2",
    date: "2026-03-28",
    time: "01:30 PM",
    status: "Pending"
  },
  {
    id: "a3",
    specialtyId: "cardiology",
    doctorId: "d1",
    date: "2026-03-22",
    time: "09:00 AM",
    status: "Confirmed"
  },
  {
    id: "a4",
    specialtyId: "orthopedics",
    doctorId: "d4",
    date: "2026-03-22",
    time: "03:00 PM",
    status: "Pending"
  },
];

const stepMeta = [
  {
    title: "Step 1 of 4",
    subtitle: "Start by choosing the kind of care you need.",
    question: "Which specialty feels right for your visit?"
  },
  {
    title: "Step 2 of 4",
    subtitle: "Pick the doctor whose profile fits your preferences.",
    question: "Which doctor would you like to book with?"
  },
  {
    title: "Step 3 of 4",
    subtitle: "Choose from the currently open dates and times.",
    question: "When would you like to come in?"
  },
  {
    title: "Step 4 of 4",
    subtitle: "Review the details before sending your request.",
    question: "Does everything look right before we confirm?"
  }
];

const defaultWizardState = {
  step: 0,
  specialtyId: "",
  doctorId: "",
  date: "",
  time: "",
  confirmed: false
};

let appointments = loadAppointments();
let wizardState = loadWizardState();

const wizardScreen = document.getElementById("wizardScreen");
const wizardQuestion = document.getElementById("wizardQuestion");
const stepLabel = document.getElementById("stepLabel");
const stepSubtitle = document.getElementById("stepSubtitle");
const progressFill = document.getElementById("progressFill");
const backButton = document.getElementById("backButton");
const nextButton = document.getElementById("nextButton");
const resetWizardButton = document.getElementById("resetWizard");
const resumeNotice = document.getElementById("resumeNotice");
const heroDoctorCount = document.getElementById("heroDoctorCount");
const heroPendingCount = document.getElementById("heroPendingCount");

const summarySpecialty = document.getElementById("summarySpecialty");
const summaryDoctor = document.getElementById("summaryDoctor");
const summaryDate = document.getElementById("summaryDate");
const summaryTime = document.getElementById("summaryTime");
const carouselElement = document.getElementById("careCarousel");
const carouselCaption = document.getElementById("carouselCaption");
const carouselDotsContainer = document.getElementById("carouselDots");
const carouselPrevButton = document.getElementById("carouselPrev");
const carouselNextButton = document.getElementById("carouselNext");
const doctorShowcaseGrid = document.getElementById("doctorShowcaseGrid");

function loadAppointments() {
  try {
    const stored = window.localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
    if (!stored) {
      window.localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(seedAppointments));
      return [...seedAppointments];
    }

    return JSON.parse(stored);
  } catch (error) {
    return [...seedAppointments];
  }
}

function saveAppointments() {
  window.localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(appointments));
}

function loadWizardState() {
  try {
    const stored = window.localStorage.getItem(WIZARD_STORAGE_KEY);
    if (!stored) {
      return { ...defaultWizardState };
    }

    return { ...defaultWizardState, ...JSON.parse(stored) };
  } catch (error) {
    return { ...defaultWizardState };
  }
}

function saveWizardState() {
  window.localStorage.setItem(WIZARD_STORAGE_KEY, JSON.stringify(wizardState));
}

function resetWizard() {
  wizardState = { ...defaultWizardState };
  saveWizardState();
  renderWizard();
}

function updateWizardState(patch) {
  wizardState = { ...wizardState, ...patch };
  saveWizardState();
  renderWizard();
}

function getSpecialtyById(id) {
  return specialties.find((specialty) => specialty.id === id);
}

function getDoctorById(id) {
  return doctors.find((doctor) => doctor.id === id);
}

function getDoctorSpecialties(doctor) {
  if (!doctor) {
    return [];
  }

  return specialties.filter((specialty) => doctor.specialtyIds.includes(specialty.id));
}

function getDoctorSpecialtiesLabel(doctor) {
  const labels = getDoctorSpecialties(doctor).map((specialty) => specialty.label);
  return labels.join(" / ");
}

function formatDate(dateString) {
  if (!dateString) {
    return "Not selected";
  }

  const date = new Date(`${dateString}T12:00:00`);
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(date);
}

function getDateChoices() {
  return Array.from({ length: 7 }, (_, offset) => {
    const date = new Date();
    date.setHours(12, 0, 0, 0);
    date.setDate(date.getDate() + offset);
    return {
      offset,
      iso: date.toISOString().split("T")[0],
      day: new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(date),
      label: new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(date)
    };
  });
}

function getAvailableTimes(doctor) {
  if (!doctor) {
    return [];
  }

  const match = getDateChoices().find((item) => item.iso === wizardState.date);
  if (!match) {
    return [];
  }

  return doctor.availability[match.offset] || [];
}

function updateHeroStats() {
  if (heroDoctorCount) {
    heroDoctorCount.textContent = String(doctors.length);
  }

  if (heroPendingCount) {
    const pendingCount = appointments.filter((appointment) => appointment.status === "Pending").length;
    heroPendingCount.textContent = String(pendingCount);
  }
}

function updateSummary() {
  const specialty = getSpecialtyById(wizardState.specialtyId);
  const doctor = getDoctorById(wizardState.doctorId);

  summarySpecialty.textContent = specialty ? specialty.label : "Not selected";
  summaryDoctor.textContent = doctor ? doctor.name : "Not selected";
  summaryDate.textContent = wizardState.date ? formatDate(wizardState.date) : "Not selected";
  summaryTime.textContent = wizardState.time || "Not selected";

  const hasPartialState = Boolean(
    wizardState.specialtyId || wizardState.doctorId || wizardState.date || wizardState.time
  );
  resumeNotice.textContent = hasPartialState
    ? "Your booking progress is saved here, so you can leave and come back without losing your selections."
    : "Your progress is stored locally in this browser so you can safely resume later.";
}

function renderDoctorShowcase() {
  if (!doctorShowcaseGrid) {
    return;
  }

  doctorShowcaseGrid.innerHTML = doctors
    .map((doctor) => {
      return `
        <article class="doctor-showcase-card accent-${doctor.accent}">
          <div class="doctor-showcase-media">
            <img src="${doctor.image}" alt="${doctor.name}">
          </div>
          <div class="doctor-showcase-body">
            <p class="doctor-showcase-specialty">${getDoctorSpecialtiesLabel(doctor)}</p>
            <h3>${doctor.name}</h3>
            <p class="doctor-showcase-title">${doctor.title}</p>
            <p class="doctor-showcase-bio">${doctor.bio}</p>
            <div class="doctor-showcase-divider"></div>
            <div class="doctor-meta">
              <span class="meta-pill">${doctor.experience} yrs exp</span>
              <span class="meta-pill">${doctor.branch}</span>
            </div>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderSpecialtyStep() {
  wizardScreen.innerHTML = `
    <div class="choice-grid">
      ${specialties
        .map((specialty) => {
          const active = wizardState.specialtyId === specialty.id ? "active" : "";
          return `
            <button type="button" class="choice-card ${active}" data-specialty-id="${specialty.id}">
              <span class="choice-badge">${specialty.badge}</span>
              <h3>${specialty.label}</h3>
              <p>${specialty.description}</p>
            </button>
          `;
        })
        .join("")}
    </div>
  `;

  wizardScreen.querySelectorAll("[data-specialty-id]").forEach((button) => {
    button.addEventListener("click", () => {
      updateWizardState({
        specialtyId: button.dataset.specialtyId,
        doctorId: "",
        date: "",
        time: "",
        confirmed: false
      });
    });
  });
}

function renderDoctorStep() {
  const filteredDoctors = doctors.filter((doctor) => doctor.specialtyIds.includes(wizardState.specialtyId));

  if (!filteredDoctors.length) {
    wizardScreen.innerHTML = `<div class="empty-state">Choose a specialty first, and we will reveal the matching doctors for that visit.</div>`;
    return;
  }

  wizardScreen.innerHTML = `
    <div class="doctor-step-intro">
      <p class="doctor-step-label">Character-inspired doctor profiles</p>
      <p class="doctor-step-copy">Compare the visual cards, care focus, and branch details below before choosing who you want to book.</p>
    </div>
    <div class="doctor-grid">
      ${filteredDoctors
        .map((doctor) => {
          const active = wizardState.doctorId === doctor.id ? "active" : "";
          return `
            <button type="button" class="doctor-card ${active}" data-doctor-id="${doctor.id}">
              <div class="doctor-card-media accent-${doctor.accent}">
                <img src="${doctor.image}" alt="${doctor.name}">
              </div>
              <div class="doctor-card-copy">
                <p class="doctor-card-specialty">${getDoctorSpecialtiesLabel(doctor)}</p>
                <h3>${doctor.name}</h3>
                <p>${doctor.title}</p>
                <p class="doctor-card-bio">${doctor.bio}</p>
              </div>
              <div class="doctor-meta">
                <span class="meta-pill">${doctor.experience} yrs exp</span>
                <span class="meta-pill">${doctor.branch}</span>
              </div>
            </button>
          `;
        })
        .join("")}
    </div>
  `;

  wizardScreen.querySelectorAll("[data-doctor-id]").forEach((button) => {
    button.addEventListener("click", () => {
      updateWizardState({
        doctorId: button.dataset.doctorId,
        date: "",
        time: "",
        confirmed: false
      });
    });
  });
}

function renderTimeStep() {
  const doctor = getDoctorById(wizardState.doctorId);
  const dateChoices = getDateChoices();
  const availableTimes = getAvailableTimes(doctor);

  wizardScreen.innerHTML = `
    <div>
      <p class="slot-heading">Choose a day</p>
      <div class="date-grid">
        ${dateChoices
          .map((dateChoice) => {
            const active = wizardState.date === dateChoice.iso ? "active" : "";
            const availableCount = ((doctor && doctor.availability[dateChoice.offset]) || []).length;
            return `
              <button type="button" class="date-card ${active}" data-date="${dateChoice.iso}">
                <h3>${dateChoice.day}</h3>
                <p>${dateChoice.label}</p>
                <p>${availableCount} slots</p>
              </button>
            `;
          })
          .join("")}
      </div>
    </div>
    <div>
      <p class="slot-heading">Choose a time</p>
      ${
        wizardState.date
          ? availableTimes.length
            ? `
              <div class="time-grid">
                ${availableTimes
                  .map((time) => {
                    const active = wizardState.time === time ? "active" : "";
                    return `
              <button type="button" class="time-card ${active}" data-time="${time}">
                        <h3>${time}</h3>
                        <p>${doctor.name} is available at this time.</p>
                      </button>
                    `;
                  })
                  .join("")}
              </div>
            `
            : `<div class="empty-state">This doctor has no open slots on that day yet. Try another date.</div>`
          : `<div class="empty-state">Select a date first to reveal the available time slots.</div>`
      }
    </div>
  `;

  wizardScreen.querySelectorAll("[data-date]").forEach((button) => {
    button.addEventListener("click", () => {
      updateWizardState({
        date: button.dataset.date,
        time: "",
        confirmed: false
      });
    });
  });

  wizardScreen.querySelectorAll("[data-time]").forEach((button) => {
    button.addEventListener("click", () => {
      updateWizardState({
        time: button.dataset.time,
        confirmed: false
      });
    });
  });
}

function renderConfirmStep() {
  const specialty = getSpecialtyById(wizardState.specialtyId);
  const doctor = getDoctorById(wizardState.doctorId);

  wizardScreen.innerHTML = `
    ${
      wizardState.confirmed
        ? `<div class="confirmation-banner">Appointment request submitted. You can now open the matching dashboard to review the latest booking.</div>`
        : ""
    }
    <div class="summary-card">
      <h3>Appointment Summary</h3>
      <p><strong>Specialty:</strong> ${specialty ? specialty.label : "Not selected"}</p>
      <p><strong>Doctor:</strong> ${doctor ? doctor.name : "Not selected"}</p>
      <p><strong>Date:</strong> ${wizardState.date ? formatDate(wizardState.date) : "Not selected"}</p>
      <p><strong>Time:</strong> ${wizardState.time || "Not selected"}</p>
    </div>
    <div class="helper-copy">
      Selecting Book Now saves this as a pending appointment request and keeps the latest booking ready for the role-based dashboards.
    </div>
  `;
}

function renderWizard() {
  const meta = stepMeta[wizardState.step];
  const progress = ((wizardState.step + 1) / stepMeta.length) * 100;

  stepLabel.textContent = meta.title;
  stepSubtitle.textContent = meta.subtitle;
  wizardQuestion.textContent = meta.question;
  progressFill.style.width = `${progress}%`;

  backButton.disabled = wizardState.step === 0;
  nextButton.textContent = wizardState.step === 3
    ? (wizardState.confirmed ? "Booked" : "Book Now")
    : "Continue";
  nextButton.disabled = !canContinue() || (wizardState.step === 3 && wizardState.confirmed);

  if (wizardState.step === 0) {
    renderSpecialtyStep();
  } else if (wizardState.step === 1) {
    renderDoctorStep();
  } else if (wizardState.step === 2) {
    renderTimeStep();
  } else {
    renderConfirmStep();
  }

  updateSummary();
  updateHeroStats();
}

function canContinue() {
  if (wizardState.step === 0) {
    return Boolean(wizardState.specialtyId);
  }

  if (wizardState.step === 1) {
    return Boolean(wizardState.doctorId);
  }

  if (wizardState.step === 2) {
    return Boolean(wizardState.date && wizardState.time);
  }

  return Boolean(
    wizardState.specialtyId && wizardState.doctorId && wizardState.date && wizardState.time
  );
}

function saveLatestBooking() {
  const specialty = getSpecialtyById(wizardState.specialtyId);
  const doctor = getDoctorById(wizardState.doctorId);

  const latestBooking = {
    specialty: specialty ? specialty.label : "Not selected",
    doctor: doctor ? doctor.name : "Not selected",
    date: formatDate(wizardState.date),
    time: wizardState.time || "Not selected",
    status: "Pending"
  };

  window.localStorage.setItem(LATEST_BOOKING_KEY, JSON.stringify(latestBooking));
}

function goToNextStep() {
  if (!canContinue()) {
    return;
  }

  if (wizardState.step < 3) {
    updateWizardState({ step: wizardState.step + 1 });
    return;
  }

  if (!wizardState.confirmed) {
    appointments = [
      {
        id: `a${appointments.length + 1}`,
        specialtyId: wizardState.specialtyId,
        doctorId: wizardState.doctorId,
        date: wizardState.date,
        time: wizardState.time,
        status: "Pending"
      },
      ...appointments
    ];
    saveAppointments();
    saveLatestBooking();
  }

  wizardState = { ...wizardState, confirmed: true };
  saveWizardState();
  renderWizard();
}

function goToPreviousStep() {
  if (wizardState.step === 0) {
    return;
  }

  updateWizardState({
    step: wizardState.step - 1,
    confirmed: false
  });
}

function initCarousel() {
  if (!carouselElement || !carouselCaption || !carouselDotsContainer) {
    return;
  }

  const slides = Array.from(carouselElement.querySelectorAll(".carousel-slide"));
  const dots = Array.from(carouselDotsContainer.querySelectorAll(".carousel-dot"));

  if (!slides.length || slides.length !== dots.length) {
    return;
  }

  let activeIndex = slides.findIndex((slide) => slide.classList.contains("active"));
  activeIndex = activeIndex >= 0 ? activeIndex : 0;
  let intervalId = null;

  function renderCarousel(index) {
    activeIndex = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("active", slideIndex === activeIndex);
    });

    dots.forEach((dot, dotIndex) => {
      dot.classList.toggle("active", dotIndex === activeIndex);
    });

    carouselCaption.textContent = slides[activeIndex].dataset.slideCaption || "";
  }

  function startAutoPlay() {
    stopAutoPlay();
    intervalId = window.setInterval(() => {
      renderCarousel(activeIndex + 1);
    }, 4800);
  }

  function stopAutoPlay() {
    if (intervalId) {
      window.clearInterval(intervalId);
      intervalId = null;
    }
  }

  dots.forEach((dot, dotIndex) => {
    dot.addEventListener("click", () => {
      renderCarousel(dotIndex);
      startAutoPlay();
    });
  });

  if (carouselPrevButton) {
    carouselPrevButton.addEventListener("click", () => {
      renderCarousel(activeIndex - 1);
      startAutoPlay();
    });
  }

  if (carouselNextButton) {
    carouselNextButton.addEventListener("click", () => {
      renderCarousel(activeIndex + 1);
      startAutoPlay();
    });
  }

  carouselElement.addEventListener("mouseenter", stopAutoPlay);
  carouselElement.addEventListener("mouseleave", startAutoPlay);

  renderCarousel(activeIndex);
  startAutoPlay();
}

backButton.addEventListener("click", goToPreviousStep);
nextButton.addEventListener("click", goToNextStep);
resetWizardButton.addEventListener("click", resetWizard);

renderWizard();
renderDoctorShowcase();
initCarousel();

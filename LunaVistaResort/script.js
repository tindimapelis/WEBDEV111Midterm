function scrollToSection(id) {
  const section = document.getElementById(id);
  if (section) {
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}

function goToPage(path, hash = "") {
  window.location.href = `${path}${hash}`;
}

function showRoom(name, type, bio, amenities, img) {
  const roomDetails = document.getElementById("roomDetails");
  if (!roomDetails) return;

  roomDetails.style.display = "block";
  document.getElementById("detailName").innerText = name;
  document.getElementById("detailType").innerText = type;
  document.getElementById("detailBio").innerText = bio;

  const detailImg = document.getElementById("detailImg");
  detailImg.src = img;
  detailImg.alt = name;

  const list = document.getElementById("detailAmenities");
  list.innerHTML = "";

  amenities.forEach((amenity) => {
    const li = document.createElement("li");
    li.textContent = amenity;
    list.appendChild(li);
  });

  roomDetails.scrollIntoView({ behavior: "smooth", block: "start" });
}

function hideRoomDetails() {
  const roomDetails = document.getElementById("roomDetails");
  if (roomDetails) {
    roomDetails.style.display = "none";
  }
}

function loginUser() {
  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");

  if (!emailInput || !passwordInput) return false;

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  if (email.includes("@") && password !== "") {
    window.location.href = "index.html";
  } else {
    alert("Please enter a valid email and password.");
  }

  return false;
}

document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");
  let current = 0;

  if (slides.length && dots.length && prevBtn && nextBtn) {
    const showSlide = (index) => {
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle("active", slideIndex === index);
      });

      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle("active", dotIndex === index);
      });

      current = index;
    };

    nextBtn.addEventListener("click", () => {
      showSlide((current + 1) % slides.length);
    });

    prevBtn.addEventListener("click", () => {
      showSlide((current - 1 + slides.length) % slides.length);
    });

    dots.forEach((dot, index) => {
      dot.addEventListener("click", () => showSlide(index));
    });

  }

  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      setTimeout(() => {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 150);
    }
  }

  document.querySelectorAll('.room[role="button"]').forEach((card) => {
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        card.click();
      }
    });
  });

  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (event) => {
      event.preventDefault();
      loginUser();
    });
  }

  const checkInInput = document.getElementById("checkInDate");
  const checkOutInput = document.getElementById("checkOutDate");
  const dateSummary = document.getElementById("dateSummary");

  if (checkInInput && checkOutInput) {
    const today = new Date();
    const todayValue = today.toISOString().split("T")[0];
    checkInInput.min = todayValue;
    checkOutInput.min = todayValue;

    const formatDate = (value) => {
      const date = new Date(`${value}T00:00:00`);
      return date.toLocaleDateString(undefined, {
        month: "long",
        day: "numeric",
        year: "numeric",
      });
    };

    const updateDateSummary = () => {
      if (checkInInput.value) {
        checkOutInput.min = checkInInput.value;
      }

      if (checkInInput.value && checkOutInput.value) {
        const start = new Date(`${checkInInput.value}T00:00:00`);
        const end = new Date(`${checkOutInput.value}T00:00:00`);
        const nights = Math.round((end - start) / 86400000);

        if (nights > 0) {
          dateSummary.textContent = `Requested stay: ${formatDate(checkInInput.value)} to ${formatDate(checkOutInput.value)} for ${nights} night${nights > 1 ? "s" : ""}. We will confirm if the entire resort is available for this private booking window.`;
        } else {
          dateSummary.textContent = "Check-out must be after check-in for overnight stays. For same-day events, choose the event rental option and include your timing in special requests.";
        }
      } else {
        dateSummary.textContent = "Select your dates to check the stay window. Our team will confirm whether the entire place is open for your requested schedule.";
      }
    };

    checkInInput.addEventListener("change", updateDateSummary);
    checkOutInput.addEventListener("change", updateDateSummary);
    updateDateSummary();
  }
});

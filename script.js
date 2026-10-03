/* =====================================================
   MUHAMMAD & ASEEL — WEDDING INVITATION
   script.js
===================================================== */

// ── CENTRAL DATA OBJECT ──────────────────────────────
const weddingData = {
  groomArabic:  "محمد",
  brideArabic:  "أسيل",
  groomEnglish: "Muhammad",
  brideEnglish: "Aseel",
  initials:     "M & A",

  henna: {
    date:     "01/10/2026",
    day:      "الخميس",
    time:     "بعد صلاة العصر مباشرة",
    venue:    "صالة الماسة الكبرى",
    location: "خربثا بني حارث",
    mapsUrl:  "https://maps.app.goo.gl/7N4gaw1M77QCRgbs7"
  },

  wedding: {
    date:        "03/10/2026",
    day:         "السبت",
    time:        "الساعة السادسة مساءً",
    venue:       "صالة المجلس القروي",
    location:    "دير قديس",
    mapsUrl:     "https://maps.app.goo.gl/V9S8pJ8Rbqjo8RP68",
    countdownTarget: new Date("2026-10-03T18:00:00+03:00")
  }
};

// ── INVITATION OPENING ───────────────────────────────
function openInvitation() {
  const cover = document.getElementById("invitation-cover");
  const card  = document.getElementById("cover-card");
  const main  = document.getElementById("main-content");

  // Card fades/scales away
  card.classList.add("opening");

  // After brief pause, overlay fades
  setTimeout(() => {
    cover.classList.add("closing");
    main.classList.add("revealed");

    // Scroll body
    document.body.style.overflow = "auto";

    // Trigger initial visible reveals
    setTimeout(checkReveal, 150);

    // Remove cover from DOM after transition
    setTimeout(() => {
      cover.remove();
    }, 1600);
  }, 450);
}

// Keyboard support for seal button
document.addEventListener("DOMContentLoaded", () => {
  document.body.style.overflow = "hidden";

  const btn = document.getElementById("open-btn");
  if (btn) {
    btn.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openInvitation();
      }
    });
  }

  // Build calendar
  buildCalendar();

  // Start countdown
  updateCountdown();
  setInterval(updateCountdown, 1000);

  // Initial scroll check (sections already in view on desktop)
  setTimeout(checkReveal, 200);
});

// ── SCROLL REVEAL ────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
    }
  });
}, {
  threshold: 0.1,
  rootMargin: "0px 0px -40px 0px"
});

function checkReveal() {
  document.querySelectorAll(".reveal-up").forEach(el => {
    revealObserver.observe(el);
  });
}

// ── CALENDAR BUILD ───────────────────────────────────
function buildCalendar() {
  const grid = document.getElementById("calendar-grid");
  if (!grid) return;

  // October 2026: starts on Thursday (day index 4 in Sun=0 system)
  // In RTL grid (Sun=col1, Sat=col7), Thursday = index 4 from left = column 5
  // Oct 1 2026 is a Thursday. Sunday=0, Mon=1, Tue=2, Wed=3, Thu=4, Fri=5, Sat=6
  const firstDayOfWeek = new Date(2026, 9, 1).getDay(); // 4 = Thursday
  const daysInMonth = 31;

  // Arabic numerals map
  const toArabicNum = (n) => {
    return n.toString().replace(/\d/g, d => "٠١٢٣٤٥٦٧٨٩"[d]);
  };

  // Empty cells before first day (RTL: Sunday is first column)
  for (let i = 0; i < firstDayOfWeek; i++) {
    const empty = document.createElement("div");
    empty.className = "cal-day empty";
    grid.appendChild(empty);
  }

  // Day cells
  for (let d = 1; d <= daysInMonth; d++) {
    const cell = document.createElement("div");
    cell.className = "cal-day";

    if (d === 3) {
      cell.classList.add("wedding-day");
      cell.setAttribute("aria-label", "يوم الزفاف - ٣ أكتوبر");
    }

    cell.textContent = toArabicNum(d);
    grid.appendChild(cell);
  }
}

// ── COUNTDOWN ────────────────────────────────────────
function updateCountdown() {
  const target = weddingData.wedding.countdownTarget;
  const now    = new Date();
  const diff   = target - now;

  const display  = document.getElementById("countdown-display");
  const finished = document.getElementById("countdown-finished");

  if (diff <= 0) {
    // Show finished message
    if (display)  display.style.display = "none";
    if (finished) finished.style.display = "block";
    return;
  }

  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  const pad = (n) => String(n).padStart(2, "0");

  const elDays    = document.getElementById("cd-days");
  const elHours   = document.getElementById("cd-hours");
  const elMinutes = document.getElementById("cd-minutes");
  const elSeconds = document.getElementById("cd-seconds");

  if (elDays)    setCountdownValue(elDays,    pad(days));
  if (elHours)   setCountdownValue(elHours,   pad(hours));
  if (elMinutes) setCountdownValue(elMinutes, pad(minutes));
  if (elSeconds) setCountdownValue(elSeconds, pad(seconds));
}

function setCountdownValue(el, val) {
  if (el.textContent !== val) {
    el.style.opacity = "0.5";
    el.style.transform = "translateY(-4px)";
    setTimeout(() => {
      el.textContent = val;
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, 100);
  }
}

// Smooth countdown transitions
document.querySelectorAll(".countdown-number").forEach(el => {
  el.style.transition = "opacity 0.15s ease, transform 0.15s ease";
});
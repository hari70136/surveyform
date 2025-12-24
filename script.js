/* ===================== SURVEY LOGIC ===================== */

const surveyForm = document.getElementById("surveyForm");

if (surveyForm) {
  surveyForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const surveyData = {
      name: document.getElementById("name")?.value || "",
      emoji: document.querySelector('input[name="emoji"]:checked')?.value || "",
      rating: document.getElementById("rating")?.value || "",
      feedback: document.getElementById("feedback")?.value || "",
      time: new Date().toLocaleString()
    };

    const data = JSON.parse(localStorage.getItem("surveyResponses")) || [];
    data.push(surveyData);
    localStorage.setItem("surveyResponses", JSON.stringify(data));

    this.classList.add("hidden");
    document.getElementById("thankYouScreen")?.classList.remove("hidden");

    if (typeof launchConfetti === "function") {
      launchConfetti();
    }
  });
}

function backToSurvey() {
  document.getElementById("thankYouScreen")?.classList.add("hidden");
  surveyForm?.classList.remove("hidden");
  surveyForm?.reset();
}

/* ===================== CONFETTI ===================== */

function launchConfetti() {
  const container = document.getElementById("confetti-container");
  if (!container) return;

  const colors = ["#ff0", "#0ff", "#f0f", "#0f0", "#00f", "#f00"];

  for (let i = 0; i < 80; i++) {
    const confetti = document.createElement("div");
    confetti.className = "confetti";
    confetti.style.left = Math.random() * 100 + "vw";
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.animationDuration = Math.random() * 2 + 2 + "s";
    container.appendChild(confetti);
    setTimeout(() => confetti.remove(), 3000);
  }
}

/* ===================== ADMIN AUTH ===================== */

const ADMIN_PASSWORD = "admin123";

document.addEventListener("DOMContentLoaded", () => {
  if (sessionStorage.getItem("adminLoggedIn") === "true") {
    showDashboard();
  }
});

function loginAdmin() {
  const input = document.getElementById("adminPassword");
  const error = document.getElementById("loginError");

  if (!input) return;

  if (input.value === ADMIN_PASSWORD) {
    sessionStorage.setItem("adminLoggedIn", "true");
    showDashboard();
  } else {
    error.innerText = "❌ Incorrect password";
  }
}

function showDashboard() {
  document.getElementById("loginBox")?.classList.add("hidden");
  document.getElementById("adminDashboard")?.classList.remove("hidden");
}

function logoutAdmin() {
  sessionStorage.removeItem("adminLoggedIn");
  location.reload();
}

/* ===================== ADMIN TABLE + ANALYTICS ===================== */

function renderTable() {
  const data = JSON.parse(localStorage.getItem("surveyResponses")) || [];
  const tbody = document.querySelector("#responseTable tbody");
  if (!tbody) return;

  tbody.innerHTML = "";

  if (!data.length) {
    tbody.innerHTML = "<tr><td colspan='6'>No responses available</td></tr>";
    return;
  }

  data.forEach((item, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${item.name || "-"}</td>
      <td>${item.emoji || "-"}</td>
      <td>${item.rating || "-"}</td>
      <td>${item.feedback || "-"}</td>
      <td>${item.time}</td>
    `;
    tbody.appendChild(row);
  });

  calculateEmojiStats(data);
}

function calculateEmojiStats(data) {
  const stats = {};
  data.forEach(item => {
    if (item.emoji) stats[item.emoji] = (stats[item.emoji] || 0) + 1;
  });

  const statsDiv = document.getElementById("emojiStats");
  if (!statsDiv) return;

  statsDiv.innerHTML = Object.entries(stats)
    .map(([emoji, count]) => `<p>${emoji} ${count}</p>`)
    .join("");
}

/* ===================== DOWNLOAD JSON ===================== */

function downloadJSON() {
  const data = JSON.parse(localStorage.getItem("surveyResponses")) || [];
  if (!data.length) {
    alert("No data to download");
    return;
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json"
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "survey-responses.json";
  a.click();
  URL.revokeObjectURL(url);
}

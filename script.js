let selectedRatio = "16:9";

function selectRatio(ratio) {
  selectedRatio = ratio;
  document.querySelectorAll('.aspect-toggle button').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.trim() === ratio);
  });
}

function tryLogin() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  if (username && password) {
    document.getElementById("loginOverlay").style.display = "none";
    document.getElementById("mainApp").classList.remove("hidden");
    loadHistory();
    addBotMessage("Welcome! Our custom AI is ready — describe your thumbnail idea!");
  } else {
    alert("Enter username and password");
  }
}

async function generateThumbnail() {
  const prompt = document.getElementById("promptInput").value.trim();
  if (!prompt) return alert("Enter a description first!");

  const btn = document.getElementById("generateBtn");
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
  btn.disabled = true;

  document.getElementById("imageResult").classList.remove("hidden");
  document.getElementById("imageContainer").innerHTML = '<div class="placeholder-loading">Our AI is generating... <i class="fa-solid fa-spinner fa-spin"></i></div>';

  // Simulate your own AI (replace this block later with real fetch to your server)
  setTimeout(() => {
    // Fake image URLs for dummy mode (replace with your server endpoint later)
    const fakeImages = [
      "https://picsum.photos/800/450?random=1",  // 16:9 style
      "https://picsum.photos/512/512?random=2",  // 1:1 style
      "https://picsum.photos/800/450?random=3"
    ];

    const randomImage = fakeImages[Math.floor(Math.random() * fakeImages.length)];

    const img = document.createElement("img");
    img.src = randomImage;
    img.alt = "Generated Roblox Thumbnail";

    const container = document.getElementById("imageContainer");
    container.innerHTML = '';
    container.appendChild(img);

    // Download link
    const downloadLink = document.getElementById("downloadLink");
    downloadLink.href = randomImage;
    downloadLink.download = "rblxthumb-dummy.png";
    downloadLink.style.display = "inline-block";

    savePrompt(prompt, selectedRatio);
    addBotMessage(`Generated: "${prompt}" — check it out!`);

    btn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    btn.disabled = false;
  }, 2500);  // 2.5 second fake delay (real AI might take 5-30s)
}

function savePrompt(prompt, ratio) {
  let history = JSON.parse(localStorage.getItem("rblxthumbs_history") || "[]");
  history.unshift({ prompt, ratio, time: new Date().toLocaleString() });
  if (history.length > 12) history.pop();
  localStorage.setItem("rblxthumbs_history", JSON.stringify(history));
  loadHistory();
}

function loadHistory() {
  const container = document.getElementById("historyList");
  const history = JSON.parse(localStorage.getItem("rblxthumbs_history") || "[]");
  container.innerHTML = "";
  history.forEach(item => {
    const div = document.createElement("div");
    div.innerHTML = `<small>${item.time} • ${item.ratio}</small><div>${item.prompt}</div>`;
    container.appendChild(div);
  });
}

function clearHistory() {
  if (confirm("Clear all?")) {
    localStorage.removeItem("rblxthumbs_history");
    loadHistory();
  }
}

// Chat helper (dummy)
function addBotMessage(text) {
  const msg = document.createElement("div");
  msg.className = "message bot";
  msg.innerHTML = text;
  document.getElementById("chatMessages").appendChild(msg);
  document.getElementById("chatMessages").scrollTop = document.getElementById("chatMessages").scrollHeight;
}

function sendChatMessage() {
  const input = document.getElementById("chatInput");
  const text = input.value.trim();
  if (!text) return;

  const userMsg = document.createElement("div");
  userMsg.className = "message user";
  userMsg.textContent = text;
  document.getElementById("chatMessages").appendChild(userMsg);

  input.value = "";

  setTimeout(() => {
    addBotMessage("Good idea! Try adding: 'vibrant Roblox style, blocky characters, epic lighting'");
  }, 800);
}

document.getElementById("chatInput")?.addEventListener("keypress", e => {
  if (e.key === "Enter") sendChatMessage();
});

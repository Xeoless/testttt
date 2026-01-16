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
    addBotMessage("Hey Kevin! Describe your Roblox thumbnail idea — I'll generate it with AI! ✨");
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

  const fullPrompt = `${prompt}, Roblox game thumbnail, vibrant colors, blocky avatars, exciting action, high detail, ${selectedRatio === '16:9' ? 'widescreen landscape' : 'square format'}`;

  try {
    // Use Puter.js free txt2img (Flux or similar under the hood)
    const imageElement = await puter.ai.txt2img(fullPrompt);

    const container = document.getElementById("imageContainer");
    container.innerHTML = '';
    container.appendChild(imageElement);

    // Make downloadable
    const url = imageElement.src;
    const downloadLink = document.getElementById("downloadLink");
    downloadLink.href = url;
    downloadLink.download = "rblxthumbs-generated.png";
    downloadLink.style.display = "inline-block";

    document.getElementById("imageResult").classList.remove("hidden");

    // Save to history
    savePrompt(prompt, selectedRatio);
  } catch (err) {
    alert("Generation failed: " + (err.message || "Try again later"));
    console.error(err);
  } finally {
    btn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    btn.disabled = false;
  }
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

// Chat helper (same as before)
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
    let reply = "Got it! Try generating with: " + text;
    if (text.toLowerCase().includes("idea")) {
      reply += "<br>Quick suggestion: Add 'neon glow, dramatic lighting, Roblox avatars'";
    }
    addBotMessage(reply);
  }, 800);
}

document.getElementById("chatInput")?.addEventListener("keypress", e => {
  if (e.key === "Enter") sendChatMessage();
});

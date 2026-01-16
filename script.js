let selectedRatio = "16:9";

function selectRatio(ratio) {
  selectedRatio = ratio;
  document.getElementById("btn169").classList.toggle("active", ratio === "16:9");
  document.getElementById("btn11").classList.toggle("active", ratio === "1:1");
}

function tryLogin() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  if (username && password) {
    document.getElementById("loginOverlay").style.display = "none";
    document.getElementById("mainApp").classList.remove("hidden");
    loadHistory();
    addBotMessage("Hey! Ask me for thumbnail ideas, e.g. 'ideas for obby game' or 'make it scary'");
  } else {
    alert("Enter username and password");
  }
}

function fakeGenerate() {
  const prompt = document.getElementById("promptInput").value.trim();
  if (!prompt) return alert("Write something first!");

  alert(`[FAKE] Generating ${selectedRatio} thumbnail:\n${prompt}`);

  savePrompt(prompt, selectedRatio);
  document.getElementById("promptInput").value = "";
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
    div.className = "item";
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

// ────────────────────────────────────────────────
// Chat system
// ────────────────────────────────────────────────

function addUserMessage(text) {
  const msg = document.createElement("div");
  msg.className = "message user";
  msg.textContent = text;
  document.getElementById("chatMessages").appendChild(msg);
  scrollChatToBottom();
}

function addBotMessage(text) {
  const msg = document.createElement("div");
  msg.className = "message bot";
  msg.innerHTML = text; // allow <strong> etc if you want
  document.getElementById("chatMessages").appendChild(msg);
  scrollChatToBottom();
}

function scrollChatToBottom() {
  const chat = document.getElementById("chatMessages");
  chat.scrollTop = chat.scrollHeight;
}

function sendChatMessage() {
  const input = document.getElementById("chatInput");
  const text = input.value.trim();
  if (!text) return;

  addUserMessage(text);
  input.value = "";

  // Simple dummy responses
  setTimeout(() => {
    let reply = "Hmm... let me think...";

    if (text.toLowerCase().includes("obby") || text.toLowerCase().includes("parkour")) {
      reply = "For an obby try: <strong>excited noob jumping over lava traps, dramatic angle, big glowing text 'WORLD'S HARDEST OBBY!'</strong> — add some particles and speed lines!";
    } else if (text.toLowerCase().includes("horror") || text.toLowerCase().includes("scary")) {
      reply = "Horror vibe? Dark foggy background, creepy red eyes glowing, blood splatter, text like 'DON'T LOOK BEHIND YOU' in dripping font.";
    } else if (text.toLowerCase().includes("simulator") || text.toLowerCase().includes("pet")) {
      reply = "Pet sim idea: Giant rainbow pet next to tiny player, explosion of coins/gems, bold text '<strong>NEW HUGE UPDATE!</strong>' with sparkles everywhere.";
    } else if (text.toLowerCase().includes("idea") || text.toLowerCase().includes("ideas")) {
      reply = "Quick ideas:<br>1. Tycoon with golden towers<br>2. Simulator with massive pets<br>3. Battle royale with explosions<br>What style do you like?";
    } else {
      reply = "Cool! Try something like: <strong>epic action pose, vibrant colors, bold game title, Roblox avatars everywhere</strong>. Want me to make it more specific?";
    }

    addBotMessage(reply);
  }, 800);
}

// Enter key to send chat
document.getElementById("chatInput")?.addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    sendChatMessage();
  }
});

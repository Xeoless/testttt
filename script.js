let selectedRatio = "16:9";

function selectRatio(ratio) {
  selectedRatio = ratio;
  document.querySelectorAll('.aspect-toggle button').forEach(btn => {
    btn.classList.toggle('active', btn.textContent.includes(ratio));
  });
}

function tryLogin() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  if (username && password) {
    document.getElementById("loginOverlay").style.display = "none";
    document.getElementById("mainApp").classList.remove("hidden");
    loadHistory();
  } else {
    alert("Enter username and password bro");
  }
}

async function generateThumbnail() {
  let prompt = document.getElementById("promptInput").value.trim();
  if (!prompt) return alert("Describe your Roblox thumbnail bro!");

  // Auto-boost for Roblox style (makes it feel like "our own AI")
  prompt = prompt + ", Roblox game thumbnail, blocky avatars, vibrant colors, exciting action, bold text overlay, high detail, cartoon style, game icon aesthetic";

  const btn = document.getElementById("generateBtn");
  btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i>';
  btn.disabled = true;

  document.getElementById("imageResult").classList.remove("hidden");
  document.getElementById("imageContainer").innerHTML = '<div class="placeholder-loading">Our Roblox AI cooking... <i class="fa-solid fa-spinner fa-spin"></i></div>';

  // Simulate generation (fake delay + Roblox-looking placeholders)
  setTimeout(() => {
    // Fake Roblox-style images (replace with your real server later)
    const robloxFakes = [
      "https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=800&q=80&txt=Roblox+obby+lava",  // obby example
      "https://images.unsplash.com/photo-1557683316-973673baf926?w=512&q=80&txt=Roblox+tycoon",     // tycoon
      "https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?w=800&q=80&txt=Roblox+horror",     // horror
      "https://picsum.photos/800/450?random=50&grayscale&blur=1"  // random placeholder
    ];

    const randomImage = robloxFakes[Math.floor(Math.random() * robloxFakes.length)];

    const img = document.createElement("img");
    img.src = randomImage;
    img.alt = "Generated Roblox Thumbnail";

    const container = document.getElementById("imageContainer");
    container.innerHTML = '';
    container.appendChild(img);

    // Download
    const downloadLink = document.getElementById("downloadLink");
    downloadLink.href = randomImage;
    downloadLink.download = "roblox-thumbnail-bro.png";
    downloadLink.style.display = "inline-block";

    savePrompt(prompt, selectedRatio);
    btn.innerHTML = '<i class="fa-solid fa-arrow-up"></i>';
    btn.disabled = false;
  }, 2800);  // fake delay to feel like AI
}

// Image upload + preview + remove
document.getElementById("imageUpload").addEventListener("change", function(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(event) {
    const preview = document.getElementById("uploadPreview");
    const img = document.getElementById("previewImg");
    img.src = event.target.result;
    preview.classList.remove("hidden");
  };
  reader.readAsDataURL(file);
});

document.getElementById("removeImage").addEventListener("click", function() {
  document.getElementById("imageUpload").value = "";
  document.getElementById("uploadPreview").classList.add("hidden");
  document.getElementById("previewImg").src = "";
});

// ... keep your savePrompt, loadHistory, clearHistory functions from before ...

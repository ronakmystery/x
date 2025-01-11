document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.local.get("gptResult", (data) => {
      const responseDiv = document.getElementById("response");
      responseDiv.textContent = data.gptResult || "No response yet!";
  });
});


function applyTheme() {
  chrome.storage.sync.get(['theme'], (items) => {
    const theme = items.theme || 'light'; // Default to 'light' if no theme is set
    document.body.style.backgroundColor = theme === 'dark' ? '#333' : '#fff';
    document.body.style.color = theme === 'dark' ? '#fff' : '#000';
  });
}

// Apply the theme when the popup is loaded
document.addEventListener('DOMContentLoaded', applyTheme);
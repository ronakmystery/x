// Saves options to chrome.storage
function saveOptions() {
    const theme = document.getElementById('theme').value;
    const enableFeature = document.getElementById('enable-feature').checked;
  
    chrome.storage.sync.set({ theme, enableFeature }, () => {
      const status = document.getElementById('status');
      status.textContent = 'Options saved.';
      setTimeout(() => {
        status.textContent = '';
      }, 1500);
    });
  }
  
  // Restores options from chrome.storage
  function restoreOptions() {
    chrome.storage.sync.get(['theme', 'enableFeature'], (items) => {
      if (items.theme) {
        document.getElementById('theme').value = items.theme;
      }
      document.getElementById('enable-feature').checked = items.enableFeature || false;
    });
  }
  
  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.getElementById('save-button').addEventListener('click', saveOptions);
  
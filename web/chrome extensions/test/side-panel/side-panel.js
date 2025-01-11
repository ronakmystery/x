import { Notes } from "./notes.js";




console.log("syncing")
// Listen for changes to storage and re-render
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local" && changes.notes) {
      Notes();
    }
  });

  Notes()

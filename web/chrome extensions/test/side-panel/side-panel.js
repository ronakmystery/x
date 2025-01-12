import { GPT,GPT_IMG } from "./functions/gpt.js";

const notesList = document.getElementById("notes");

const noteInput = document.getElementById("note-input");
const addNoteBtn = document.getElementById("add-note-btn");
const instruction = document.getElementById("instruction");



export const Notes = () => {
  chrome.storage.local.get({ notes: [] }, (data) => {
    notesList.innerHTML = ""; // Clear existing notes

    data.notes.forEach((note, index) => {
      const li = document.createElement("li");
      li.className = "note"; // Add base class for styling

      // Display note text
      const noteText = document.createElement("div");
      noteText.textContent = note.text;
      li.appendChild(noteText);


       // Delete Button
       const deleteBtn = document.createElement("button");
       deleteBtn.textContent = "Delete";
       deleteBtn.style.marginLeft = "10px";
       deleteBtn.addEventListener("click", () => {
         // Remove the note from storage
         chrome.storage.local.get({ notes: [] }, (data) => {
           const updatedNotes = data.notes.filter((_, i) => i !== index);
           chrome.storage.local.set({ notes: updatedNotes }, Notes); // Re-render the notes
         });
       });
       li.appendChild(deleteBtn);

      // Append the note to the list
      notesList.appendChild(li);
    });
  });
};

// GPT Button Click Event
let askGPT=async ()=>{
    try {

        const noteText = noteInput.value.trim();
      
        if (!noteText) {
          alert("bruv u need to write a note!");
          return;
        }


        addNoteBtn.textContent = "Loading..."; // Update button text
        addNoteBtn.disabled = true; // Disable button during API call

        const gptResponse = await GPT(instruction.value, noteText);

        addNoteBtn.textContent = "Add Note"; // Update button text
        addNoteBtn.disabled = false; // Disable button during API call

        chrome.storage.local.get({ notes: [] }, (data) => {
          const updatedNotes = [{ text: gptResponse },...data.notes];
      
          chrome.storage.local.set({ notes: updatedNotes }, () => {
            noteInput.value = ""; // Clear the input field
            Notes(); // Re-render the notes
          });
        });

    
      } catch (error) {
        console.error("Error calling GPT:", error);
      }
}

// Initial rendering of notes
Notes();


// Add Note Button Click Event
addNoteBtn.addEventListener("click", () => {
  askGPT()
  });

  
  
  const log = (data) => {
    chrome.runtime.sendMessage({ action: "logToOriginalWindow", data });
  }



  
console.log("syncing")
// Listen for changes to storage and re-render
  chrome.storage.onChanged.addListener((changes, areaName) => {
    if (areaName === "local" && changes.notes) {
      Notes();
    }
  });

  Notes()




let lookGPT=async(url)=>{
  const gptResponse = await GPT_IMG(url);

  chrome.storage.local.get({ notes: [] }, (data) => {
    const updatedNotes = [{ text: gptResponse },...data.notes];

    chrome.storage.local.set({ notes: updatedNotes }, () => {
      Notes(); // Re-render the notes
    });
  });

}

document.getElementById("take-screenshot").addEventListener("click", async () => {
  try {
    // Query the active tab
    const tabs = await chrome.tabs.query({ active: true, currentWindow: true });
    const activeTab = tabs[0];

    // Inject selection overlay into the webpage
    const results = await chrome.scripting.executeScript({
      target: { tabId: activeTab.id },
      func: selectAreaForScreenshot,
    });

    if (results && results[0] && results[0].result) {

      // Capture the visible tab
      const dataUrl = await captureVisibleTab();

 

      // Display the cropped screenshot in the side panel
      const preview = document.getElementById("screenshot-preview");
      preview.src = dataUrl;

      await chrome.scripting.executeScript({
        target: { tabId: activeTab.id },
        func: () => {
          const element = document.getElementById("screenshot");
          if (element) {
            element.remove();
            console.log("Screenshot element removed from tab.");
          } else {
            console.log("No screenshot element found in the tab.");
          }
        },
      });

      lookGPT(dataUrl)
    
    } else {
      console.error("Failed to capture or crop the area.");
    }
  } catch (error) {
    console.error("Error during screenshot process:", error);
  }
});




// Function to capture the visible tab
function captureVisibleTab() {
  return new Promise((resolve, reject) => {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, (dataUrl) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(dataUrl);
      }
    });
  });
}




// Function to select an area and return its coordinates
function selectAreaForScreenshot() {
  return new Promise((resolve) => {
    const overlay = document.createElement("div");
    overlay.id="screenshot";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100vw";
    overlay.style.height = "100vh";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.2)";
    overlay.style.cursor = "crosshair";
    overlay.style.zIndex = "9999";
    document.body.appendChild(overlay);

    let startX, startY, endX, endY;
    const selectionBox = document.createElement("div");
    selectionBox.style.position = "absolute";
    selectionBox.style.border = "2px dashed red";
    selectionBox.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
    overlay.appendChild(selectionBox);

    overlay.addEventListener("mousedown", (e) => {
      startX = e.clientX;
      startY = e.clientY;
      selectionBox.style.left = `${startX}px`;
      selectionBox.style.top = `${startY}px`;
      selectionBox.style.width = "0px";
      selectionBox.style.height = "0px";
    });

    overlay.addEventListener("mousemove", (e) => {
      if (startX !== undefined && startY !== undefined) {
        endX = e.clientX;
        endY = e.clientY;
        const width = Math.abs(endX - startX);
        const height = Math.abs(endY - startY);
        selectionBox.style.left = `${Math.min(startX, endX)}px`;
        selectionBox.style.top = `${Math.min(startY, endY)}px`;
        selectionBox.style.width = `${width}px`;
        selectionBox.style.height = `${height}px`;
      }
    });

    overlay.addEventListener("mouseup", () => {
      const rect = selectionBox.getBoundingClientRect();
      resolve({ x: rect.left, y: rect.top, width: rect.width, height: rect.height });
    });
  });
}


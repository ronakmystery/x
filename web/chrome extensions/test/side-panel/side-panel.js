import "./functions/screenshot.js"
import { GPT,GPT_IMAGINE } from "./functions/gpt.js";

const notesList = document.getElementById("notes");

// const noteInput = document.getElementById("note-input");
// const addNoteBtn = document.getElementById("add-note-btn");
// const instruction = document.getElementById("instruction");



export const Notes = () => {
  chrome.storage.local.get({ notes: [] }, (data) => {
    notesList.innerHTML = ""; // Clear existing notes

    data.notes.forEach((note, index) => {
      const li = document.createElement("li");
      li.className = "note"; // Add base class for styling

      console.log(note)


      // Display note image (if exists)
      if (note.image) {
        let noteImageContainer=document.createElement("div")
        noteImageContainer.className="img-container"
        const noteImage = document.createElement("img");
        noteImage.src =note.image;
        noteImage.alt = "Generated Image";
        noteImageContainer.appendChild(noteImage);
        li.appendChild(noteImageContainer)
      }


      // //note text
      
      li.appendChild(Object.assign(document.createElement("div"), { 
        className: "note-prompt", textContent: note.prompt_request || "?" 
      }));

      li.appendChild(Object.assign(document.createElement("div"), { 
        className: "note-text", textContent: note.text || "?" 
      }));
 
      

      // Delete Button
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "delete";
      deleteBtn.className="delete-note"
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
// let askGPT = async () => {
//   try {
//     const noteText = noteInput.value.trim();

//     if (!noteText) {
//       alert("bruv u need to write a note!");
//       return;
//     }

//     addNoteBtn.textContent = "Loading..."; // Update button text
//     addNoteBtn.disabled = true; // Disable button during API call

//     // Call GPT for text response
//     const gptResponse = await GPT(instruction.value, noteText);

//     // Call GPT_IMAGINE for image generation
//     const img = await GPT_IMAGINE(noteText);

//     addNoteBtn.textContent = "Add Note"; // Reset button text
//     addNoteBtn.disabled = false; // Re-enable button

//     // Retrieve and update Chrome storage
//     chrome.storage.local.get({ notes: [] }, (data) => {
//       const updatedNotes = [
//         { text: gptResponse, image: img }, // Add both text and image
//         ...data.notes,
//       ];

//       chrome.storage.local.set({ notes: updatedNotes }, () => {
//         noteInput.value = ""; // Clear the input field
//       });
//     });
//   } catch (error) {
//     console.error("Error calling GPT:", error);

//     // Reset button state on error
//     addNoteBtn.textContent = "Add Note";
//     addNoteBtn.disabled = false;
//   }
// };



// Add Note Button Click Event
// addNoteBtn.addEventListener("click", () => {
//   askGPT()
//   });

  
  
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




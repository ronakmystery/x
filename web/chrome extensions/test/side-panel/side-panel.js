import "./functions/screenshot.js"
import { GPT } from "./functions/gpt.js";

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





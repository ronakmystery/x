import { GPT } from "./functions/gpt.js";

const notesList = document.getElementById("notes");
const instruction = document.getElementById("instruction");
const gptBtn = document.getElementById("ask-gpt"); // Single GPT button
let selectedNoteIndex = null; // To track the selected note

export const Notes = () => {
  console.log("Rendering notes...");
  chrome.storage.local.get({ notes: [] }, (data) => {
    notesList.innerHTML = ""; // Clear existing notes

    data.notes.forEach((note, index) => {
      const li = document.createElement("li");
      li.className = "note"; // Add base class for styling

      // Display note text
      const noteText = document.createElement("div");
      noteText.textContent = note.text;
      li.appendChild(noteText);

      // Handle note selection
      li.addEventListener("click", () => {
        // Remove 'selected' class from all notes
        document.querySelectorAll(".note").forEach((el) => el.classList.remove("selected-note"));

        // Add 'selected' class to the clicked note
        li.classList.add("selected-note");
        selectedNoteIndex = index; // Update the selected note index
        console.log(`Selected note index: ${index}`);
      });

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
gptBtn.addEventListener("click", async () => {
  if (selectedNoteIndex === null) {
    alert("Please select a note first!");
    return;
  }

  gptBtn.textContent = "Loading..."; // Update button text
  gptBtn.disabled = true; // Disable button during API call

  try {
    // Get the selected note's text
    chrome.storage.local.get({ notes: [] }, async (data) => {
      const selectedNote = data.notes[selectedNoteIndex];
      if (!selectedNote) {
        alert("Selected note not found!");
        gptBtn.textContent = "Ask GPT";
        gptBtn.disabled = false;
        return;
      }

      // Call GPT with the instruction and selected note text
      const gptResponse = await GPT(instruction.value, selectedNote.text);

      // Overwrite the note with the GPT response
      const updatedNotes = data.notes.map((n, i) =>
        i === selectedNoteIndex ? { text: gptResponse } : n
      );

      // Save the updated notes back to storage
      chrome.storage.local.set({ notes: updatedNotes }, Notes);

      // Reset button state
      gptBtn.textContent = "Ask GPT";
      gptBtn.disabled = false;
    });
  } catch (error) {
    console.error("Error calling GPT:", error);
    gptBtn.textContent = "Ask GPT"; // Reset button text
    gptBtn.disabled = false; // Re-enable button
  }
});

// Initial rendering of notes
Notes();



  
  const logToOriginalWindow = (data) => {
    chrome.runtime.sendMessage({ action: "logToOriginalWindow", data });
  }

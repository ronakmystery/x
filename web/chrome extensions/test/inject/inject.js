// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//   if (message.action === "logData") {
//     console.log("Data received from side panel:", message.data);
//   }
// });


// document.addEventListener("mouseup", () => {
//   const selectedText = window.getSelection().toString().trim();

//   if (selectedText) {
//     // Save the selected text to Chrome's storage
//     chrome.storage.local.get({ notes: [] }, (data) => {
//       const notes = data.notes || [];

//       // Avoid duplicate entries
//       if (!notes.some((note) => note.text === selectedText)) {
//         const updatedNotes = [...notes, { text: selectedText, response: null }];
//         chrome.storage.local.set({ notes: updatedNotes }, () => {
//           // console.log("Note saved:", selectedText);
//         });
//       } else {
//         console.log("Duplicate note not saved:", selectedText);
//       }
//     });
//   }
// });


console.log("inject")



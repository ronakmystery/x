
import {addNoteToFirestore,fetchNotes,uploadImage,deleteNote} from "./firebase.js"


let course="formal languages"


document.getElementById("noteForm").addEventListener("submit", async (event) => {
  event.preventDefault();


  const frontImage = document.getElementById("frontImage").files[0];
  const backImage = document.getElementById("backImage").files[0];
  const message= document.getElementById("message")


  if (!frontImage || !backImage) {
    alert("Please fill out all fields and upload both images.");
    return;
  }

  try {
    document.getElementById("message").innerText = "Uploading images...";

    const front = await uploadImage(frontImage,course);
    const back = await uploadImage(backImage,course);


    message.innerText = "Saving note...";
    const noteId = await addNoteToFirestore(front, back, course);

    message.innerText = `Note added successfully with ID: ${noteId}`;
    fetchNotes(course).then(data=>{
      renderNotes(data)
    })
  } catch (error) {
    document.getElementById("message").innerText = "Error adding note. Please try again.";
  }
});




function showImagePreview(fileInput, previewElementId) {
  const file = fileInput.files[0];
  const previewElement = document.getElementById(previewElementId);

  if (file) {
    const reader = new FileReader();

    // Set the image source once the file is read
    reader.onload = function (event) {
      previewElement.src = event.target.result;
      previewElement.style.display = "block"; // Make the preview visible
    };

    reader.readAsDataURL(file); // Read the file as a data URL
  } else {
    previewElement.style.display = "none"; // Hide the preview if no file is selected
  }
}


document.getElementById("frontImage").addEventListener("change", (event) => {
  showImagePreview(event.target, "frontPreview");
});

document.getElementById("backImage").addEventListener("change", (event) => {
  showImagePreview(event.target, "backPreview");
});




function renderNotes(notes) {
  const container = document.getElementById("notes");
  container.innerHTML = ""; // Clear existing notes

  if (notes.length === 0) {
    container.innerHTML = "<p>No notes found!</p>";
    return;
  }

  notes.forEach((note) => {
    const noteDiv = document.createElement("div");
    noteDiv.id=note.id;
    noteDiv.style.border = "1px solid #ccc";
    noteDiv.style.margin = "10px";
    noteDiv.style.padding = "10px";
    noteDiv.style.borderRadius = "5px";

    noteDiv.innerHTML = `
    Front
      <img src="${note.frontUrl}" alt="Front Image" style="width:100%; margin-top:10px;" />
     Back 
      <img src="${note.backUrl}" alt="Back Image" style="width:100%; margin-top:10px;" />
          <button class="delete-btn" data-id="${note.id}" style="margin-top:10px; background-color: red; color: white; padding: 5px 10px; border: none; border-radius: 5px;">Delete Note</button>

      `;

    container.appendChild(noteDiv);
  });

  attachDeleteHandlers()

}


fetchNotes(course).then(data=>{
  renderNotes(data)
})


function attachDeleteHandlers() {
  const deleteButtons = document.querySelectorAll(".delete-btn");

  deleteButtons.forEach((button) => {
    button.addEventListener("click", (event) => {
      const id = event.target.getAttribute("data-id");
      if (confirm("Are you sure you want to delete this note?")) {
        deleteNote(course,id).then(()=>{
          fetchNotes(course).then(data=>{
            renderNotes(data)
          })
        });
      }
    });
  });

  
}

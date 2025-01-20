import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getFirestore,collection,getDocs,doc,getDoc,addDoc,deleteDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getStorage, ref, uploadBytes, getDownloadURL,deleteObject } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";

import {firebaseConfig} from "./api.js"
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage();


export async function fetchNotes(course) {
    const notesCollection = collection(db, `courses/${course}/notes`);
  
    try {
      const querySnapshot = await getDocs(notesCollection);
  
      if (querySnapshot.empty) {
        console.log("No notes found!");
        return [];
      }
  
      const notes = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
  
      console.log(notes)
      return notes;
    } catch (error) {
      console.error("Error fetching notes:", error);
      return [];
    }
  }



export async function addNoteToFirestore(front, back, course) {


  const notesCollection = collection(db, `courses/${course}/notes`);

  try {
    const docRef = await addDoc(notesCollection, {
      frontUrl: front.downloadURL,
      backUrl: back.downloadURL,
      frontName:front.fileName,
      backName:back.fileName,
      created_at: new Date(),
    });

    console.log(`Document added with ID: ${docRef.id}`);
    return docRef.id
  } catch (error) {
    console.error("Error adding document:", error);
    throw error;
  }
}


export async function deleteNote(course,id) {
    try {
        const docRef = doc(db, `courses/${course}/notes/${id}`);
        const docSnap = await getDoc(docRef);

        await deleteDoc(docRef);


          const { frontName, backName } = docSnap.data();

 // Delete the front image
 const frontImageRef = ref(storage, frontName);
 await deleteObject(frontImageRef);
 console.log("Front image deleted successfully:", frontName);

 // Delete the back image
 const backImageRef = ref(storage, backName);
 await deleteObject(backImageRef);
 console.log("Back image deleted successfully:", backName);


              return true
    } catch (error) {
        console.log(error)
    }
  }


  export async function uploadImage(file, course) {
    const fileName = `courses/${course}/${file.name}`;

    try {
      // Create a reference to the storage location
      const storageRef = ref(storage, fileName);
  
      // Upload the file
      const snapshot = await uploadBytes(storageRef, file);
      console.log("Uploaded image:", snapshot);
  
      // Get the download URL
      const downloadURL = await getDownloadURL(snapshot.ref);
  
      return {fileName,downloadURL}; 
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  }
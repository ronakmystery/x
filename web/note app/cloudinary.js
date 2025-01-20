import { API } from './api.js';


const cloudName = "ronakmystery"; // Replace with your Cloudinary cloud name

export async function upload(file) {

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "notes app");


 
  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to upload image: ${response.statusText}`);
    }

    const data = await response.json(); // Parse JSON response
    console.log("Cloudinary Response:", data);

    return data.secure_url; // Return the secure URL of the uploaded image
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error; // Rethrow the error for the calling function to handle
  }

}



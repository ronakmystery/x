
let screenshotButton= document.getElementById("take-screenshot");
const preview = document.getElementById("screenshot-preview");

import { GPT_IMG } from "./gpt.js";

let lookGPT = async (url) => {
  try {
    // Call GPT_IMG to get the image (Base64 or URL)
    const gptResponse = await GPT_IMG(url);

    // Reset UI states
    preview.src = "";
    screenshotButton.textContent = "Capture"; // Reset button text
    screenshotButton.disabled = false; // Enable button

    // Save to Chrome Storage
    chrome.storage.local.get({ notes: [] }, (data) => {
      // Assume `gptResponse` contains both `text` and `image` (adjust if different)
      const updatedNotes = [
        { text: gptResponse, image: url }, // Add both text and image
        ...data.notes,
      ];

      chrome.storage.local.set({ notes: updatedNotes }, () => {
        console.log("Note with image saved successfully!");
      });
    });
  } catch (error) {
    console.error("Error saving image with note:", error.message);
    screenshotButton.textContent = "Capture"; // Reset UI on error
    screenshotButton.disabled = false;
  }
};


document.getElementById("take-screenshot").addEventListener("click", async () => {
    screenshotButton.textContent = "loading..."; // Update button text
   screenshotButton.disabled = true; // Disable button during API call
 
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
       let dataUrl = await captureVisibleTab();
 
       //crop
       dataUrl=await crop(dataUrl,results[0].result)
 
 
       // Display the cropped screenshot in the side panel
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
export function captureVisibleTab() {
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
export function selectAreaForScreenshot() {
   return new Promise((resolve) => {
     // Create overlay for area selection
     const overlay = document.createElement("div");
     overlay.id = "screenshot";
     overlay.style.position = "fixed";
     overlay.style.top = "0";
     overlay.style.left = "0";
     overlay.style.width = "100vw";
     overlay.style.height = "100vh";
     overlay.style.cursor = "crosshair";
     overlay.style.zIndex = "9999";
     document.body.appendChild(overlay);
 
     let startX, startY, endX, endY;
 
     // Create selection box
     const selectionBox = document.createElement("div");
     selectionBox.style.position = "absolute";
     selectionBox.style.border = "2px dashed red";
     overlay.appendChild(selectionBox);
 
     // Handle mousedown event
     overlay.addEventListener("mousedown", (e) => {
       startX = e.pageX;
       startY = e.pageY;
 
       selectionBox.style.left = `${startX - window.scrollX}px`; // Adjust for scroll
       selectionBox.style.top = `${startY - window.scrollY}px`; // Adjust for scroll
       selectionBox.style.width = "0px";
       selectionBox.style.height = "0px";
     });
 
     // Handle mousemove event
     overlay.addEventListener("mousemove", (e) => {
       if (startX !== undefined && startY !== undefined) {
         endX = e.pageX;
         endY = e.pageY;
 
         const width = Math.abs(endX - startX);
         const height = Math.abs(endY - startY);
 
         selectionBox.style.left = `${Math.min(startX, endX) - window.scrollX}px`; // Adjust for scroll
         selectionBox.style.top = `${Math.min(startY, endY) - window.scrollY}px`; // Adjust for scroll
         selectionBox.style.width = `${width}px`;
         selectionBox.style.height = `${height}px`;
       }
     });
 
     // Handle mouseup event
     overlay.addEventListener("mouseup", () => {
       const rect = selectionBox.getBoundingClientRect();
 
       // Include the device pixel ratio for accurate cropping
       const scale = window.devicePixelRatio;
 
       // Resolve the crop area including adjustments for scroll and scaling
       resolve({
         x: rect.left * scale,
         y: rect.top * scale,
         width: rect.width * scale,
         height: rect.height * scale,
       });
 
       // Clean up the overlay
       document.body.removeChild(overlay);
     });
   });
 }
 
 
 
 export function crop(dataUri, cropArea) {
   return new Promise((resolve, reject) => {
     const img = new Image();
     img.onload = () => {
     
       const canvas = document.createElement("canvas");
       canvas.width = cropArea.width;
       canvas.height = cropArea.height;
 
       const ctx = canvas.getContext("2d");
       ctx.drawImage(
         img,
         cropArea.x+5, // Source x
         cropArea.y+5, // Source y
         cropArea.width-10, // Source width
         cropArea.height-10, // Source height
         0, // Destination x
         0, // Destination y
         cropArea.width, // Destination width
         cropArea.height // Destination height
       );
 
       const croppedDataUri = canvas.toDataURL("image/png");
       resolve(croppedDataUri);
     };
 
     img.src = dataUri; // Load the image
 })
 }
 
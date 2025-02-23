
let screenshotButton = document.getElementById("take-screenshot");
const preview = document.getElementById("screenshot-preview");

import { GPT_IMG } from "./gpt.js";

let lookGPT = async (url,prompt_request) => {
  try {


    chrome.runtime.sendMessage({ action: "gpt" });
    screenshotButton.textContent = "analyzing..."

    // Call GPT_IMG to get the image (Base64 or URL)
    const gptResponse = await GPT_IMG(url,prompt_request);
    console.log(gptResponse)
    // await new Promise((resolve) => setTimeout(resolve, 1000));

    chrome.runtime.sendMessage({ action: "end" });


    // Reset UI states
    preview.src = "";
    screenshotButton.textContent = "analyze"; // Reset button text
    screenshotButton.disabled = false; // Enable button
    preview.classList.remove("show-preview")
    screenshotButton.classList.remove("capture")

    // Save to Chrome Storage
    chrome.storage.local.get({ notes: [] }, (data) => {
      // Assume `gptResponse` contains both `text` and `image` (adjust if different)
      const updatedNotes = [
        { text: gptResponse,prompt_request, image: url }, // Add both text and image
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
  screenshotButton.textContent = "select area (esc to cancel)"; // Update button text
  screenshotButton.disabled = true; // Disable button during API call
  screenshotButton.classList.add("capture")

      // Escape key event to cancel selection
      const cancelSelection = (event) => {
        if (event.key === "Escape") {
                  // Reset UI states
    preview.src = "";
    screenshotButton.textContent = "analyze"; // Reset button text
    screenshotButton.disabled = false; // Enable button
    preview.classList.remove("show-preview")
    screenshotButton.classList.remove("capture")
          return
        }
      };
      document.addEventListener("keydown", cancelSelection);
      

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
      dataUrl = await crop(dataUrl, results[0].result)


      // // Display the cropped screenshot in the side panel
      // preview.classList.add("show-preview")
      // preview.src = dataUrl;

      // await chrome.scripting.executeScript({
      //   target: { tabId: activeTab.id },
      //   func: () => {
      //     const element = document.getElementById("screenshot");
      //     if (element) {
      //       element.remove();
      //       console.log("Screenshot element removed from tab.");
      //     } else {
      //       console.log("No screenshot element found in the tab.");
      //     }
      //   },
      // });

      // preview.style = "display:block"

      let prompt_request=prompt("prompt: ")
      console.log(prompt)
      if(prompt_request==null){
        
        // Reset UI states
    preview.src = "";
    screenshotButton.textContent = "analyze"; // Reset button text
    screenshotButton.disabled = false; // Enable button
    preview.classList.remove("show-preview")
    screenshotButton.classList.remove("capture")
        return
      }

      lookGPT(dataUrl,prompt_request)


    }else{
              // Reset UI states
    preview.src = "";
    screenshotButton.textContent = "analyze"; // Reset button text
    screenshotButton.disabled = false; // Enable button
    preview.classList.remove("show-preview")
    screenshotButton.classList.remove("capture")
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
    let selectionBox = document.createElement("div");
    selectionBox.style.position = "absolute";
    selectionBox.style.border = "2px dashed red";
    overlay.appendChild(selectionBox);

    const removeOverlay = () => {
      if (document.body.contains(overlay)) {
        document.body.removeChild(overlay);
      }
      document.removeEventListener("keydown", cancelSelection); // Remove key listener
    };

    // Escape key event to cancel selection
    const cancelSelection = (event) => {
      if (event.key === "Escape") {
        removeOverlay();
        resolve(null); // Return null to indicate cancellation
      }
    };

    document.addEventListener("keydown", cancelSelection);

    overlay.addEventListener("mousedown", (e) => {
      startX = e.pageX;
      startY = e.pageY;
      selectionBox.style.left = `${startX - window.scrollX}px`;
      selectionBox.style.top = `${startY - window.scrollY}px`;
      selectionBox.style.width = "0px";
      selectionBox.style.height = "0px";
    });

    overlay.addEventListener("mousemove", (e) => {
      if (startX !== undefined && startY !== undefined) {
        endX = e.pageX;
        endY = e.pageY;
        const width = Math.abs(endX - startX);
        const height = Math.abs(endY - startY);
        selectionBox.style.left = `${Math.min(startX, endX) - window.scrollX}px`;
        selectionBox.style.top = `${Math.min(startY, endY) - window.scrollY}px`;
        selectionBox.style.width = `${width}px`;
        selectionBox.style.height = `${height}px`;
      }
    });

    overlay.addEventListener("mouseup", () => {
      const rect = selectionBox.getBoundingClientRect();
      const scale = window.devicePixelRatio;
      resolve({
        x: rect.left * scale,
        y: rect.top * scale,
        width: rect.width * scale,
        height: rect.height * scale,
      });
      removeOverlay();
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
        cropArea.x + 5, // Source x
        cropArea.y + 5, // Source y
        cropArea.width - 10, // Source width
        cropArea.height - 10, // Source height
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

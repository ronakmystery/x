chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "logToOriginalWindow") {
      // Get the active tab
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        if (activeTab) {
          // Forward the message to the active tab
          chrome.tabs.sendMessage(activeTab.id, { action: "logData", data: message.data });
        }
      });
  
      sendResponse({ status: "Message forwarded to active tab" });
    }
  });
  


  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    chrome.action.setBadgeBackgroundColor({ color: "white" }); // Orange color for waiting

    if (message.action === "gpt") {
      // Show badge text and change background color
      chrome.action.setBadgeText({ text: "🔍" }); 
    }else if(message.action==="end"){
      chrome.action.setBadgeText({ text: "" }); 
    }

    return true; // Indicate asynchronous response
  });
  
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
  
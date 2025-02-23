console.log("Background script loaded!");
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Received message:", message.message);
  message_parameter = message.message;
  if (message_parameter.action === "open_tab") {
    chrome.tabs.create({ url: message_parameter.url }, (tab) => {
      console.log(message_parameter.url);
      console.log("New tab created:", tab);
      sendResponse({ success: true });
    });
    return true; // Keeps the message channel open for async response
  }
});

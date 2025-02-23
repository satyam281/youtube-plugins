console.log("Background script loaded!");
chrome.runtime.onConnect.addListener((port) => {
  console.log("connected to port ", port);
  //   console.log("Received message:", message.message);
  port.onMessage.addListener((message) => {
    console.log("message contents: ",message)
    if (message.action === "open_tab") {
      chrome.tabs.create({ url: message.url }, (tab) => {
        console.log(message.url);
        console.log("New tab created:", tab);
        sendResponse({ success: true });
      });
      return true; // Keeps the message channel open for async response
    }
  });
});

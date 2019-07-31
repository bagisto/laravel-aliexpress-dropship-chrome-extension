//listen for new tab to be activated
chrome.tabs.onActivated.addListener(function(info) {
  chrome.tabs.query({ currentWindow: true, active: true }, function(tabs) {
    if (tabs[0].url.search("aliexpress.com") != -1) {
      path = "resources/images/icon-enabled.png";
      var a = chrome.runtime.getURL(path);
      chrome.browserAction.setIcon({ path: a });
      chrome.browserAction.setPopup({ popup: "resources/html/popupEi.html" });
    } else {
      path = "resources/images/icon-disabled.png";
      var a = chrome.runtime.getURL(path);
      chrome.browserAction.setIcon({ path: a });
      chrome.browserAction.setPopup({ popup: "resources/html/popupDi.html" });
    }
  });
});

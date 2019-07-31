var importIcon = chrome.runtime.getURL("resources/images/Import-Icon.png");

var jquery =
  '<script src="' +
  chrome.extension.getURL("resources/js/jquery.min.js") +
  '" ></script>';
$("head").append(jquery);
var wk_inserted =
  '<script src="' +
  chrome.extension.getURL("resources/js/wk_inserted.js") +
  '" ></script>';
$("head").append(wk_inserted);

$("#list-items li div.pic")
  .css({ border: "1px solid green" })
  .prepend('<div class="wk_epacket_grid">ePacket<span></span></div>')
  .before(
    '<div class="wk_dropshipper" ><img src="' +
      importIcon +
      '" class="import-icon" title="Click Here To Import" id="addToStoreButton" /></div>'
  )
  .append(
    '<div class="wk-processing-time-grid"><div class="wk-indicator">Processing Time</div><div class="wk-day"></div></div>'
  )
  .parent()
  .css("margin-bottom", "40px");

$("#hs-list-items li div.pic")
  .css({ border: "1px solid #0031F0" })
  .prepend('<div class="wk_epacket_grid">ePacket<span></span></div>')
  .before(
    '<div class="wk_dropshipper" ><img src="' +
      importIcon +
      '" class="import-icon" title="Click Here To Import" id="addToStoreButton" /></div>'
  )
  .append(
    '<div class="wk-processing-time-grid"><div class="wk-indicator">Processing Time</div><div class="wk-day"></div></div>'
  )
  .parent()
  .css("margin-bottom", "40px");

$("#list-items li div.img-container")
  .css({ border: "1px solid #0031F0" })
  .before('<div class="wk_epacket_list">ePacket<span></span></div>')
  .before(
    '<div class="wk_dropshipper" ><img src="' +
      importIcon +
      '" class="import-icon" title="Click Here To Import" id="addToStoreButtonList" /></div>'
  )
  .after(
    '<div class="wk-processing-time-list"><div class="wk-indicator">Processing Time</div><div class="wk-day"></div></div>'
  )
  .find(".has-sku-image > a")
  .css("margin-top", "22px");

$("#hs-list-items li div.img-container")
  .css({ border: "1px solid #0031F0" })
  .before('<div class="wk_epacket_list">ePacket<span></span></div>')
  .before(
    '<div class="wk_dropshipper" ><img src="' +
      importIcon +
      '" class="import-icon" title="Click Here To Import" id="addToStoreButtonList" /></div>'
  )
  .after(
    '<div class="wk-processing-time-list"><div class="wk-indicator">Processing Time</div><div class="wk-day"></div></div>'
  )
  .find(".has-sku-image > a")
  .css("margin-top", "22px");

$("#hs-below-list-items li div.img-container")
  .css({ border: "1px solid #0031F0" })
  .before('<div class="wk_epacket_list">ePacket<span></span></div>')
  .before(
    '<div class="wk_dropshipper" ><img src="' +
      importIcon +
      '" class="import-icon" title="Click Here To Import" id="addToStoreButtonList" /></div>'
  )
  .after(
    '<div class="wk-processing-time-list"><div class="wk-indicator">Processing Time</div><div class="wk-day"></div></div>'
  )
  .find(".has-sku-image > a")
  .css("margin-top", "22px");

$(".detail-wrap")
  .css({ border: "1px solid #0031F0", position: "relative" })
  .prepend(
    '<div class="wk_dropshipper" ><img src="' +
      importIcon +
      '" class="import-icon" title="Click Here To Import" id="addToStoreButtonProduct" /></div>'
  );

$(".product-main-wrap > .product-info")
  .css({
    border: "1px solid blue",
    position: "relative"
  })
  .prepend(
    '<div class="wk_dropshipper"><img src="' +
      importIcon +
      '" class="import-icon" title="Click Here To Import" id="addToStoreButtonProduct" /></div>'
  );

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  switch (request.type) {
    case "clearLocalStorage":
      window.postMessage({ type: "clearLocalStorage" }, "*");
      sendResponse({ success: true });
      break;

    case "orderPlace":
      window.postMessage(request, "*");
      break;

    case "functionCheckbox":
      window.postMessage(request, "*");
      break;

    case "refreshPopup":
      if ($(".list-item").length > 0) {
        var allow_filter = true;
      }

      sendResponse({
        allow_filter: allow_filter,
        epacket: localStorage.epacket,
        hide_product_noepacket: localStorage.hide_product_noepacket,
        orders: localStorage.aliexpress_order_list
      });
      break;

    default:
  }
});

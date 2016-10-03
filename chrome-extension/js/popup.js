var $resultSpan = $("#resultMsg");

$("#syncBtn").click(function () {
    chrome.runtime.sendMessage('op_sync', function(response){
        $resultSpan.text(response);
    });
});

$("#downloadBtn").click(function () {
    chrome.runtime.sendMessage('op_get', function(response){
        $resultSpan.text(response);
    });
});

$("#uploadBtn").click(function () {
    chrome.runtime.sendMessage('op_put', function(response){
        $resultSpan.text(response);
    });
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    if(message.indexOf('rs') == 0){
        $resultSpan.text(message.substring(3));
    }
});
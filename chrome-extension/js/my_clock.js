function my_clock(el) {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = m >= 10 ? m : ('0' + m);
    s = s >= 10 ? s : ('0' + s);
    el.innerHTML = h + ":" + m + ":" + s;
    setTimeout(function () {
        my_clock(el)
    }, 1000);
}

var clock_div = document.getElementById('clock_div');
my_clock(clock_div);


function getAll() {
    $.post("http://localhost/api/getAll", {},
        function (data) {
            console.log("Data Loaded: " + data);

        }, "json");
}
function putAll() {
    chrome.bookmarks.getTree(function (bookmarkArray) {
        var str = JSON.stringify(bookmarkArray);
        $.post("http://localhost/api/putAll", {json: str},
            function (data) {
                console.log("Data Loaded: " + data);
            });
    });
}
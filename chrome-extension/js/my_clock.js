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


function putAll() {
    chrome.bookmarks.getTree(function (bookmarkArray) {
        var str = JSON.stringify(bookmarkArray);
        $.post("http://localhost/api/putAll", {json: str},
            function (data) {
                console.log("Data Loaded: " + data);
            });
    });
}


function getAll() {
    $.post("http://localhost/api/getAll", {},
        function (data) {
            console.log("Data Loaded: " + data);
            createBookRecur(data, '1');
        }, "json");
}
function createBookRecur(root, parentId) {
    if (!root.parentId || root.parentId == '0') {
        var index;
        for (index in root.children) {
            createBookRecur(root.children[index], parentId);
        }
    } else {
        chrome.bookmarks.create({
            parentId: parentId,
            index: root.index,
            title: root.title,
            url: root.url
        }, function(bookmark){
            var index;
            if (root.children) {
                for (index in root.children) {
                    createBookRecur(root.children[index], bookmark.id);
                }
            }
        });
    }
}
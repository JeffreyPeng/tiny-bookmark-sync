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

function syncAll() {
    $.post("http://localhost/api/getAll", {},
        function (data) {
            console.log("Data Loaded: " + data);
            chrome.bookmarks.getTree(function (bookmarkArray) {
                union(bookmarkArray[0].children[0], data.children[0]);
            });
        }, "json");
}
function union(root1, root2) {
    var map = new Array();
    var index;
    for (index in root2.children) {
        var child = root2.children[index];
        map[child.title + child.url] = child;
    }
    var index2;
    for (index2 in root1.children) {
        var child = root1.children[index2];
        var child2 = map[child.title + child.url];
        if (child2) {
            if (child2.children) {
                union(child, child2);
            }
        }
        delete map[child.title + child.url];
    }
    var childAddIndex;
    for (childAddIndex in map) {
        createBookMark(map[childAddIndex], root1.id);
    }
}
function createBookMark(child, parentId) {
    chrome.bookmarks.create({
        parentId: parentId,
        index: child.index,
        title: child.title,
        url: child.url
    }, function(bookmark){
        child.id = bookmark.id
        if (child.children) {
            var index;
            for (index in child.children) {
                createBookMark(child.children[index], child.id);
            }
        }
    });
}
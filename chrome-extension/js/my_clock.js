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
        var str = JSON.stringify(bookmarkArray[0]);
        $.post("http://localhost/api/putAll", {json: str},
            function (data) {
                //console.log("putAll Data Loaded: " + data);
            });
    });
}


function getAll() {
    $.post("http://localhost/api/getAll", {},
        function (data) {
            console.log("getAll Data Loaded: " + data);
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
            //console.log("getAll Data Loaded: " + data);
            if (data && data.children[0]) {
                chrome.bookmarks.getTree(function (bookmarkArray) {
                    // 当前仅同步书签栏
                    unionRecur(bookmarkArray[0].children[0], data.children[0]);
                });
            }
            //setTimeout(putAll, 5000);
        }, "json");
}
function unionRecur(root1, root2) {
    var map = new Array();
    for (var index in root2.children) {
        var child = root2.children[index];
        map[child.title + child.url] = child;
    }
    for (var index in root1.children) {
        var child = root1.children[index];
        var child2 = map[child.title + child.url];
        if (child2) {
            if (child2.children) {
                unionRecur(child, child2);
            }
        }
        delete map[child.title + child.url];
    }
    for (var index in map) {
        createRecur(map[index], root1.id);
    }
}
function createRecur(child, parentId) {
    chrome.bookmarks.create({
        parentId: parentId,
        index: child.index,
        title: child.title,
        url: child.url
    }, function(bookmark){
        child.id = bookmark.id
        if (child.children) {
            for (var index in child.children) {
                createRecur(child.children[index], child.id);
            }
        }
    });
}
chrome.bookmarks.onCreated.addListener(function(bookmark){
    // TODO
    console.log(bookmark);
});
chrome.bookmarks.onRemoved.addListener(function(id, removeInfo){
    console.log('Bookmark '+id+' has been removed:');
    console.log(removeInfo);
    chrome.bookmarks.get([removeInfo.parentId], function(bookmarkArray){
        deleteRecur(bookmarkArray[0].parentId, bookmarkArray[0], removeInfo.index);
    });
});
chrome.bookmarks.onChanged.addListener(function(id, changeInfo){
    // TODO
    console.log('Bookmark '+id+' has been changed:');
    console.log(changeInfo);
});
chrome.bookmarks.onMoved.addListener(function(id, moveInfo){
    // TODO
    console.log('Bookmark '+id+' has been moved:');
    console.log(moveInfo);
});
chrome.bookmarks.onChildrenReordered.addListener(function(id, reorderInfo){
    // TODO
    console.log('Bookmark '+id+' has a new children order:');
    console.log(reorderInfo);
});
chrome.bookmarks.onImportEnded.addListener(function(){
    // TODO
    console.log('Bookmark import ended.');
});

function deleteRecur(parentId, child, removeIndex) {
    chrome.bookmarks.get([parentId], function(bookmarkArray){
        var parent = bookmarkArray[0];
        parent.children = new Array();
        parent.children.push(child);
        if (parent.parentId) {
            deleteRecur(parent.parentId, parent, removeIndex);
        } else {
            var str = JSON.stringify(parent);
            //console.log(parent);
            //console.log(removeIndex);
            $.post("http://localhost/api/delete", {json: str},
                function (data) {
                    //console.log("putAll Data Loaded: " + data);
                });
        }
    });
}
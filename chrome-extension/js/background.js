
var sync = false;

var syncTaskId = setInterval(syncAll, 5000);

var putTaskId;
function putTask() {
    if (putTaskId) {
        clearTimeout(putTaskId);
    }
    putTaskId = setTimeout(putTaskCore, 5000);
}
function putTaskCore() {
    if (sync) {
        putAll();
    }
}

function putAll() {
    chrome.bookmarks.getTree(function (bookmarkArray) {
        var str = JSON.stringify(bookmarkArray[0]);
        $.post("http://localhost/api/putAll", {json: str},
            function (data) {
                sync = true;
                //console.log("putAll Data Loaded: " + data);
            });
    });
}

function syncAll() {
    $.post("http://localhost/api/getAll", {},
        function (data) {
            //console.log("getAll Data Loaded: " + data);
            if (data && data.children[0]) {
                chrome.bookmarks.getTree(function (bookmarkArray) {
                    // 当前仅同步书签栏
                    unionRecur(bookmarkArray[0].children[0], data.children[0]);
                    sync = true;
                    putTask();
                    clearInterval(syncTaskId);
                });
            } else {
                putAll();
            }
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
    putTask();
});
chrome.bookmarks.onRemoved.addListener(function(id, removeInfo){
    putTask();
});
chrome.bookmarks.onChanged.addListener(function(id, changeInfo){
    putTask();
});
chrome.bookmarks.onMoved.addListener(function(id, moveInfo){
    putTask();
});
chrome.bookmarks.onChildrenReordered.addListener(function(id, reorderInfo){
    putTask();
});
chrome.bookmarks.onImportEnded.addListener(function(){
    putTask();
});

/*
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

chrome.bookmarks.onRemoved.addListener(function(id, removeInfo){
    console.log('Bookmark '+id+' has been removed:');
    console.log(removeInfo);
    //chrome.bookmarks.get([removeInfo.parentId], function(bookmarkArray){
        //deleteRecur(bookmarkArray[0].parentId, bookmarkArray[0], removeInfo.index);
    //});
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
*/
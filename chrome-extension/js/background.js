var serviceHost = "http://localhost";

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse){
    if(message.indexOf('op') == 0){
        if (message == 'op_sync') {
            syncAll();
            sendResponse('同步中...');
        }
        if (message == 'op_get') {
            getAll();
            sendResponse('下载中...');
        }
        if (message == 'op_put') {
            putAll();
            sendResponse('上传中...');
        }
    }
});

//---------------------------------------------------------------

function putAll() {
    chrome.bookmarks.getTree(function (bookmarkArray) {
        var str = JSON.stringify(bookmarkArray[0]);
        $.post(serviceHost + "/api/putAll", {json: str},
            function (data) {
                //console.log("putAll Data Loaded: " + data);
                chrome.runtime.sendMessage('rs_上传成功！', function(response){});
            });
    });
}

//---------------------------------------------------------------

function syncAll() {
    $.post(serviceHost + "/api/getAll", {},
        function (data) {
            //console.log("getAll Data Loaded: " + data);
            if (data && data.children && data.children[0]) {
                chrome.bookmarks.getTree(function (bookmarkArray) {
                    // 当前仅同步书签栏
                    unionRecur(bookmarkArray[0].children[0], data.children[0]);
                    chrome.runtime.sendMessage('rs_同步成功！', function(response){});
                });
            } else {
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

//---------------------------------------------------------------

function getAll() {
    chrome.bookmarks.getChildren('1', function(bookmarkArray){
        if(bookmarkArray.length > 0) {
            for(var index in bookmarkArray) {
                if (bookmarkArray[index].url) {
                    chrome.bookmarks.remove(bookmarkArray[index].id, function(){
                        //console.log('Bookmark 16 has been removed.');
                    });
                } else {
                    chrome.bookmarks.removeTree(bookmarkArray[index].id, function(){
                        //console.log('Bookmark group 6 has been removed.');
                    });
                }
            }
        }
    });
    $.post(serviceHost + "/api/getAll", {},
        function (data) {
            //console.log("getAll Data Loaded: " + data);
            if (data && data.children && data.children[0]) {
                createBookRecur(data, '1');
                chrome.runtime.sendMessage('rs_下载成功！', function(response){});
            } else {

            }
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

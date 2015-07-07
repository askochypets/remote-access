var xhr,
fn = {
    focus: function (elem) {
        var sel = $("#fileList").get(0);

        if (elem.id !== sel.listSelectedItem) {
            if (sel.listSelectedItem) {
                document.getElementById(sel.listSelectedItem).style.backgroundColor = "#414141";
                document.getElementById(sel.listSelectedItem).removeAttribute('id');
            }
            elem.style.backgroundColor = "#696969";
            sel.listSelectedItem = fn.idGen(elem);                    
            elem.focus();
        }
    },
    idGen: function () {
        var i = 0, d = "list" + (new Date() * 1).toString(16);
        return function (obj) {
            if (obj.id) return obj.id;
            if (i == 9999999) {
                d = "list" + (new Date() * 1).toString(16);
                i = 0;
            }
            return (obj.id = d + (i++).toString(16));
        }               
    }(),
    getFileList: function(dirPath) {
        if (xhr) xhr.abort();
        xhr = $.ajax({
            url: '/filelist',
            type: "POST",
            data: {dirPath: dirPath},
        })
        .done(function(res) {
            if (res != "error") {
                var files = JSON.parse(res).files,
                    root = JSON.parse(res).root,
                    arr = [];
                    path = $("#path");

                $.each(files, function (key, value) {
                    if (value.dir === "drive") {
                        arr.push('<li tabindex="0" class="drive">' + value.name + '</li>');
                    } else if (value.dir === true) {
                        arr.push('<li tabindex="0">' + value.name + '</li>');
                    } else {
                        arr.push('<li tabindex="0" class="file">' + value.name + '</li>');
                    }
                    
                });
                $("#fileList").html(arr.join(""));

                if (path.html() == "") {
                    path.html(root);
                }
                delete $("#fileList").get(0).listSelectedItem;
            } else {
                fn.removePath();
                console.log("forbidden!");
            }
        })
        .fail(function() {
            console.log("ajax send fail");
        });
    },
    keydown: function (e, elem) {
        var key = e.keyCode,
            elem = e.target,
            listItem = $("#fileList").get(0);

        if (key == 38 || key == 39) {
            elem.previousElementSibling ? 
                this.focus(elem.previousElementSibling) : 
                this.focus(listItem.lastElementChild);
        } else if (key == 37 || key == 40) {
            elem.nextElementSibling ? 
                this.focus(elem.nextElementSibling) : 
                this.focus(listItem.firstElementChild);
        } else if (key == 13) {
            fn.sendRequest(elem);
        }                      
    },
    setEvent: function () {
        $("#fileList").on("focus", "li", function () {
            fn.focus(this);
        })
        .on("keydown", function () {
            fn.keydown(event, this);
        })
        .on("dblclick", "li", function () {
            fn.sendRequest(event.target);
        });
        $("#stepBack").on("click", function () {
            if (fn.removePath() === "") {
                fn.getFileList();
            } else {
                //step back
                fn.getFileList($("#path").html());
            }            
        });
    },
    setPath: function (text) {
        if (!$(event.target).hasClass("file")) {
            $("#path").html($("#path").html() + text + "\\");
        }
        return $("#path").html();
    },
    removePath: function () {
        var arr = $("#path").html().split("\\");
        arr.splice(-2);
        if (arr.length > 0) {
            $("#path").html(arr.join("\\") + "\\");    
        } else {
            $("#path").html("");
        }        
        return $("#path").html();
    },
    sendRequest: function (element) {
        var isFile = $(element).hasClass("file");
        if (!isFile) {
            fn.getFileList(fn.setPath($(element).html()));    
        }
    }

};
$(document).ready(function () {    
    fn.setEvent();
});

fn.getFileList();
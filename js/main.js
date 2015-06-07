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
        $.ajax({
            url: '/filelist',
            type: "POST",
            data: {dirPath: dirPath},
        })
        .done(function(res) {
            var files = JSON.parse(res).files,
                arr = [];

            $.each(files, function (index, element) {
                arr.push('<li tabindex="0">' + element + '</li>');
            });
            
            $("#fileList").html(arr.join(""));

            fn.isFile($("li"));
            fn.setEvent();
        })
        .fail(function() {
            console.log("error");
        });
    },
    keydown: function (e, elem) {
        var key = e.keyCode,
            elem = e.target,
            listItem = $("#fileList").get(0);

        if (key == 38) {
            elem.previousElementSibling ? 
                this.focus(elem.previousElementSibling) : 
                this.focus(listItem.lastElementChild);
        } else if (key == 40) {
            elem.nextElementSibling ? 
                this.focus(elem.nextElementSibling) : 
                this.focus(listItem.firstElementChild);
        } else if (key == 13) {
            this.getFileList();
            delete listItem.listSelectedItem;
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
            fn.getFileList("C:\\Windows");
            delete this.listSelectedItem;
        });
    },
    isFile: function (arrOfElem) {
        var ext;
        $.each(arrOfElem, function (index, element) {
            ext = $(element).html().split(".");
            if (ext[1] !== undefined) {
                $(element).addClass("file");
            }
        });
    }

};

fn.getFileList();
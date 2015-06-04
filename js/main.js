fn = {
    focus: function (elem) {
        var sel = $("#fileList").get(0);

        if (sel.listSelectedIted) {
            document.getElementById(sel.listSelectedIted).style.backgroundColor = "#414141";
            document.getElementById(sel.listSelectedIted).removeAttribute('id');
        }
        elem.style.backgroundColor = "#696969";
        sel.listSelectedIted = fn.idGen(elem);                    
        elem.focus();
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
    getFileList: function(dirName) {
        $.ajax({
            url: '/filelist',
            type: "POST",
            data: {dirName: dirName},
        })
        .done(function(res) {
            var files = JSON.parse(res).files,
                arr = [];

            $.each(files, function (index, element) {
                arr.push('<li tabindex="0">' + element + '</li>');
            });
            
            $("#fileList").html(arr.join(""));

            fn.setEvent();
        })
        .fail(function() {
            console.log("error");
        });
    },
    keydown: function (e, elem) {
        var key = e.keyCode,
            elem = e.target,
            listItem = $("#fileList");

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

        }                      
    },
    setEvent: function () {
        $("#fileList").on("focus", "li", function () {
            fn.focus(this);
        })
        .on("keydown", function () {
            fn.keydown(event, this);
        })
        .on("dblclick", function () {
            fn.getFileList();
        });
    }

};

fn.getFileList("C:\\");
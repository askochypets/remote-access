var http = require("http"),
    fs = require("fs"),
    express = require("express"),
    app = express(),
    bodyParser = require("body-parser");
    
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

app.use(express.static(__dirname));

app.post('/filelist', function (req, res) {
    var data = fn.createJson(req.body.dirPath);
    
    if (data != undefined) {
      res.send(data);
    } else {
      res.send("error");
    }    
});

var fn = {
  createJson: function (path) {
    var json = {};

    try {      
      //receive a specified path or path to root directory
      if (path !== undefined && path !== "") {
        json.files = fn.getNewList(fs.readdirSync(path), path);
        json.root = path;
      } else {
        json.files = fn.existingDrives();
        json.root = "";
      }

      //convert to json format
      return JSON.stringify(json);     
    } catch (err) {     
      fn.hint();
    }
  },
  hint: function () {
    console.log("\r\n\n\t\t\tERROR! Please try again.");
  },
  getNewList: function (fileList, path) {
    var newFileList = {};

    for (index in fileList) {
      try {
        newFileList[index] = {
          name: fileList[index],
          dir: fs.statSync(path + fileList[index]).isDirectory() ? "" : "file"
        }          
      } catch (err) {
        //...
      }
      
    }
    return newFileList;
  },
  //check that drive is exist
  //return array of existing drives
  existingDrives: function () {
      var possibleDrives = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"],
          existDrives = {};

      for (index in possibleDrives) {
        try {
          if (fs.statSync(possibleDrives[index] + ":\\")) {
            existDrives[index] = {
              name: possibleDrives[index].toUpperCase() + ":",
              dir: "drive"
            }
          }  
        } catch (err) {
          //...
        }
        
      }
      return existDrives;
  }
};

app.listen(3000);

console.log("listening on 3000");
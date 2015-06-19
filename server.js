var http = require("http"),
    fs = require("fs"),
    express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static(__dirname));

app.post('/filelist', urlencodedParser, function (req, res) {
    var data = fn.createJson(req.body.dirPath);
    
    if (data != undefined) {
      res.send(data);
    } else {
      res.send("error");
    }    
});

var fn = {
  getSystemDir: function (path) {
    var arr = path.split("\\");     
    return arr[0] + "\\";
  },
  createJson: function (path) {
    var rootPath,
        fileList,
        json = {};
    try {
      //receive a specified path or path to root directory
      rootPath = path || fn.getSystemDir(process.env.SystemDrive);
      fileList = fs.readdirSync(rootPath);
      json.files = fn.getNewList(fileList, rootPath);
      json.root = rootPath;

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
          dir: fs.statSync(path + fileList[index]).isDirectory()
        }          
      } catch (err) {
        fn.hint();
      }
      
    }
    return newFileList;
  }
};

app.listen(3000);

console.log("listening on 3000");
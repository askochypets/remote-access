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
        json = {};
    try {
      //receive a specified path or path to root directory
      rootPath = path || fn.getSystemDir(process.env.SystemDrive);
      json.files = fs.readdirSync(rootPath);
      json.root = rootPath;
      fn.isFile(rootPath);

      
      //convert to json format
      return JSON.stringify(json);     
    } catch (err) {     
      fn.hint();
    }
  },
  hint: function () {
    console.log("\r\n\n\t\t\tERROR! Please try again.");
  },
  isFile: function (rootPath) {
    var path,
        fileList = fs.readdirSync(rootPath);

    for (var index in fileList) {
        try {
          path = rootPath + fileList[index];
          console.log(fs.lstatSync(path).isFile());  
        } catch (err) {
          console.log("err");
        }
        
    };
    
    
  }
};

app.listen(3000);

console.log("listening on 3000");
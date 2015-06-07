var http = require("http"),
    fs = require("fs"),
    express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(express.static(__dirname));

app.post('/filelist', urlencodedParser, function (req, res) {
  res.send(fn.createJson(req.body.dirPath));
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
      //convert to json format
      return JSON.stringify(json);     
    } catch (err) {     
      fn.hint();
    }
  },
  hint: function () {
    console.log("\r\n\n\t\t\tERROR! Please try again.");
  }
};

app.listen(3000);

console.log("listening on 3000");
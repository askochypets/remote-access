var http = require("http"),
    fs = require("fs"),
    express = require("express"),
    app = express();

app.use(express.static(__dirname));

app.post("/connect", function (req, res) {
  res.send(fn.createJson());  
});

app.post('/filelist', function (req, res) {
  res.send(fn.createJson("D:\\"));
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
      //get rootPath to directory
      rootPath = path || process.argv[2] || fn.getSystemDir(process.env.USERPROFILE);
      json.files = fs.readdirSync(rootPath);
      //convert to json format and write into file
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
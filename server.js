var net = require('net'),
    fs = require("fs");


net.createServer(function(sock) {
  console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
  // var data = fn.createJson("C:\\");
  // if (data != undefined) {
  //   socket.write(JSON.stringify(data));
  //   socket.pipe(socket);
  // } else {
  //   console.log("ERROR!!!")
  // }

  sock.on('data', function(data) {
    console.log('DATA ' + sock.remoteAddress + ': ' + data);

    sock.write('You said "' + data + '"');
  });

  sock.on('close', function(data) {
    console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
  });
}).listen(1337, '127.0.0.1');

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
      throw err;
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

console.log('Server listening on 127.0.0.1 1337');
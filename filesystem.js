var clients = [];

exports.connect = function (req, res) {
	clients.push(res);

	res.on("close", function () {
		clients.splice(clients.indexOf(res), 1);
	})
};

exports.getFileList = function (message) {
	clients.forEach(function (res){
		res.writeHead(200, {'Access-Control-Allow-Origin': '*'});
		res.end(message + new Date());
	});

	clients = [];
}
var	net = require('net'),
	client = new net.Socket();

var app = angular.module("fileExplorer", []);

app.controller("fileExplorerCtrl", function ($scope) {
	$scope.getConnect = function () {
		client.connect(1337, '127.0.0.1', function() {
		    console.log('CONNECTED TO: 127.0.0.1 1337');
		});

		client.on('data', function(response) {
			var data = JSON.parse(response),
				newData = JSON.parse(data);

		    $scope.dataObj = {
				files: newData.files,
				root: newData.root,
			}
		});

		client.on('close', function() {
		    console.log('Connection closed');
		});
	}
	$scope.getNewData = function (path) {
		client.write(path);
	}
	$scope.stepBack = function (postUrl) {
		if (postUrl !== "" && postUrl !== undefined) {
			var newUrl = postUrl.split("\\");
			
			newUrl.splice(-2, 1);
			//$scope.getFileList(newUrl.join("\\"));	
		}		
	}
	// List controll with keyboard
	$scope.keyControl = function (event, itemName) {
		var key = event.keyCode;

		if (key === 8) {
			event.preventDefault();
			$scope.stepBack($scope.dataObj.root);	
		} else if (key === 13) {
			event.preventDefault();
			//$scope.getFileList($scope.dataObj.root + itemName + '\\', event);
		} else if (key === 37) {
			event.preventDefault();
			$scope.focusElem(event, "prev");
		} else if (key === 38) {
			event.preventDefault();
			$scope.focusElem(event, "prev");
		} else if (key === 39) {
			event.preventDefault();
			$scope.focusElem(event, "next");
		} else if (key === 40) {
			event.preventDefault();
			$scope.focusElem(event, "next");
		}
	}
	// Focus element with keyboard
	$scope.focusElem = function (event, direction) {
		var elem = event.target;
		
		if (direction === "next") {
			if (elem.nextElementSibling) {
				elem.nextElementSibling.focus();
			} else {
				elem.parentElement.firstElementChild.focus();
			}
		} else if (direction === "prev") {
			if (elem.previousElementSibling) {
				elem.previousElementSibling.focus();
			} else {
				elem.parentElement.lastElementChild.focus();
			}
		}
	}
});
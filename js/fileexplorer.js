var app = angular.module("fileExplorer", []);

app.controller("fileExplorerCtrl", function ($scope, $http) {
	$scope.getFileList = function (dirPath) {
		$http.post("127.0.0.1/filelist", {dirPath: dirPath})
		.success(function (data) {
			$scope.dataObj = {
				files: data.files,
				root: data.root,
			}
		})
		.error(function () {
			console.log("Ajax sent fail!");
		});
	}
	$scope.stepBack = function (postUrl) {
		if (postUrl !== "" && postUrl !== undefined) {
			var newUrl = postUrl.split("\\");
			
			newUrl.splice(-2, 1);
			$scope.getFileList(newUrl.join("\\"));	
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
			$scope.getFileList($scope.dataObj.root + itemName + '\\', event);
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
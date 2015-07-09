var app = angular.module("fileExplorer", []);

app.controller("fileExplorerCtrl", function ($scope, $http) {
	$scope.getFileList = function (dirPath) {
		$http.post("/filelist", {dirPath: dirPath})
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
	$scope.getFileList();
});
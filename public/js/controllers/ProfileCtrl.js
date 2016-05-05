angular.module('thepark').controller('ProfileController', ['$scope', function($scope) {

	$scope.data = {
		"title": "Profile",
		"description": "This is the home page"
	};

	$scope.posts = [
		{
			"title": "Card with image",
			"description": "Medium",
		},
		{
			"title": "Card with image",
			"description": "Medium",
		},
		{
			"title": "Card with image",
			"description": "Medium",
		},
		{
			"title": "Card with image",
			"description": "Medium",
		},
		{
			"title": "Card with image",
			"description": "Medium",
		},
		{
			"title": "Card with image",
			"description": "Medium",
		}
	];

}]);
angular.module('thepark').controller('ClassroomsController', ['$scope', '$mdDialog', '$mdToast', function($scope, $mdDialog, $mdToast) {
	$scope.joinClass = function(ev) {
		var joinPrompt = $mdDialog.prompt()
			.title('Join Classroom')
			.textContent('Enter the class code provided by your teacher')
			.placeholder('Class code')
			.ariaLabel('Join classroom')
			.targetEvent(ev)
			.clickOutsideToClose(true)
			.openFrom('#button-joinClass')
			.closeTo('#button-joinClass')
			.ok('Join')
			.cancel('Cancel');
		$mdDialog.show(joinPrompt).then(function(code) {
			//Callback
			// alert("The code you wrote was: "+code);
			$mdToast.show(
				$mdToast.simple()
					.content('Joined class')
			);
		});
	}

	$scope.classes = [
		{
			"name": "Digital Art",
			"period": 1,
			"ab": "a",
			"teacher": {
				"name": {
					"first": "Allison",
					"last": "Blaylock"
				},
				"gender": "f",
				"photo": "https://i.imgur.com/XtGnc70.png"
			},
			"cover": "https://i.imgur.com/wUDfBEA.png"
		},
		{
			"name": "Multimedia and Webpage Design",
			"period": 1,
			"ab": "b",
			"teacher": {
				"name": {
					"first": "Lakeisha",
					"last": "Stewart"
				},
				"gender": "f",
				"photo": "https://i.imgur.com/XtGnc70.png"
			},
			"cover": "https://newevolutiondesigns.com/images/freebies/nature-hd-background-10.jpg"
		},
		{
			"name": "Honors Math III",
			"period": 2,
			"ab": null,
			"teacher": {
				"name": {
					"first": "Laura",
					"last": "Armstrong"
				},
				"gender": "f",
				"photo": "https://i.imgur.com/XtGnc70.png"
			},
			"cover": "https://i.imgur.com/wUDfBEA.png"
		},
		{
			"name": "Spanish II",
			"period": 3,
			"ab": null,
			"teacher": {
				"name": {
					"first": "Ariana",
					"last": "Perez"
				},
				"gender": "f",
				"photo": "https://i.imgur.com/XtGnc70.png"
			},
			"cover": "https://brianlauritzen.files.wordpress.com/2015/08/mountain-sunrise-background-wallpaper-1.jpg"
		},
		{
			"name": "Honors English II",
			"period": "4",
			"ab": null,
			"teacher": {
				"fname": "Mary",
				"lname": "LaRocca",
				"gender": "f",
				"photo": "https://i.imgur.com/XtGnc70.png"
			},
			"cover": "https://newevolutiondesigns.com/images/freebies/nature-hd-background-10.jpg"
		}
	]
}]);
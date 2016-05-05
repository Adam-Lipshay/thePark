angular.module('appRoutes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider
		.when('/', {
			templateUrl: 'views/home.ejs',
			controller: 'HomeController',
			css: 'css/views/home.css',
			restricted: false
		})
		
		.when('/profile', {
			templateUrl: 'views/profile.ejs',
			controller: 'ProfileController',
			css: 'css/views/profile.css',
			restricted: true
		})

		.when('/classroom', {
			templateUrl: 'views/profile.ejs',
			controller: 'ProfileController',
			css: 'css/views/profile.css',
			restricted: true
		})

		.when('/classrooms', {
			templateUrl: 'views/classrooms.ejs',
			controller: 'ClassroomsController',
			css: 'css/views/classrooms.css',
			restricted: true
		})
		
		.when('/chat', {
			templateUrl: 'views/chat.ejs',
			controller: 'ChatController',
			restricted: false
		})

		.when('/settings', {
			templateUrl: 'views/settings.ejs',
			controller: 'SettingsController',
			css: 'css/views/settings.css',
			restricted: true
		})

		.otherwise('/');

	$locationProvider.html5Mode(true);

}]);
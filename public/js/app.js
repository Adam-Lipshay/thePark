angular.module('thepark', [
		'ngMaterial', 'ngRoute', 'ngAnimate', 'appRoutes', 'btford.socket-io',//'alAngularHero',
		'angularCSS',
		'customFilters'
		// 'ProfileService'
	])
	.config(function($mdThemingProvider) {
		$mdThemingProvider
			.theme('default')
			.primaryPalette('green')
			.accentPalette('teal');
	})
	.run(function ($rootScope, $location, $route, AuthService, $mdToast) {
		$rootScope.$on('$routeChangeStart', function (event, next, current) {
			var isLoggedIn = AuthService.isLoggedIn()
			if (next.restricted && !isLoggedIn) {
				$mdToast.show($mdToast.simple().textContent("Sign in first"));
				$location.path('/');
				$route.reload();
			}
		});
	})
	
	.factory('Socket', ['socketFactory', function(socketFactory) {
		return socketFactory();
	}])

	//Main app controller
	.controller('AppCtrl', function($scope, $mdDialog, $mdToast, AuthService) {
		
		AuthService.getUser().then(function(user) {
			$scope.user = user;
		});
		
		$scope.init = function() {
			
			
			///// Shortcut keys /////
			// Toggle help "h"
			Mousetrap.bind('h', function() {
				$scope.openHelp();
			});
			// Konami code
			Mousetrap.bind('up up down down left right left right b a', function() {
				alert('KONAMI');
			});
			// Toggle nav "n"
			Mousetrap.bind('n', function() {
				$scope.toggleSideNav();
			});
		}
		
		// Open help dialog
		$scope.openHelp = function(ev) {
    		$mdDialog.show({
				templateUrl: 'templates/help.ejs',
				parent: angular.element(document.body),
				targetEvent: ev,
				clickOutsideToClose:true
		    });
		}
		// Close dialog
		$scope.closeDialog = function() {
			$mdDialog.hide();
		};
		// Help dialog key bindings list
		$scope.keyBindings = [
			{
				"name": "Open Help",
				"keys": ['h']
			},
			{
				"name": "Toggle Navigation",
				"keys": ['n']
			}
		];
	})

	// Navigation components
	.controller('NavCtrl', ['$scope', '$mdSidenav', '$location', 'AuthService', function($scope, $mdSidenav, $location, AuthService) {
		$scope.openSideNav = function () {
			$mdSidenav('left').open();
		};
		$scope.closeSideNav = function () {
			$mdSidenav('left').close();
		};
		$scope.toggleSideNav = function () {
			$mdSidenav('left').toggle();
		};
		var originatorEv;
		$scope.openMenu = function($mdOpenMenu, ev) {
			$mdOpenMenu(ev);
		};
		$scope.navigate = function(url) {
			if (url === '/logout') {
				AuthService.logout()
					.then(function() {
						$location.path('/');
					});
			} else {
				$location.path(url);
			}
		};
		$scope.navLinks = [
			{
				"name": "profile",
				"url": "/profile",
				"text": "Profile",
				"icon": "account_circle"
			},
			{
				"name": "classrooms",
				"url": "/classrooms",
				"text": "Classrooms",
				"icon": "class"
			},
			{
				"name": "chat",
				"url": "/chat",
				"text": "Chat",
				"icon": "chat"
			},
			{
				"name": "help-center",
				"url": "/help-center",
				"text": "Help Center",
				"icon": "help"
			},
			"divider",
			{
				"name": "settings",
				"url": "/settings",
				"text": "Settings",
				"icon": "settings"
			},
			{
				"name": "log-out",
				"url": "/logout",
				"text": "Log Out",
				"icon": "exit_to_app"
			}
		];
	}])
;

$('.onload-list-drop').each(function(i) {
	var t = $(this);
	setTimeout(function() {
		t.addClass('animation');
	}, i * 50);
});
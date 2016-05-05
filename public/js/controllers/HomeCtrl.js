angular.module('thepark')
    .controller('HomeController', ['$scope', '$mdDialog', function($scope, $mdDialog) {
        $scope.showLogin = function(ev, index) {
            $mdDialog.show({
                controller: 'SigninController',
                templateUrl: 'templates/signin.ejs',
                parent: angular.element(document.body),
                targetEvent: ev,
                clickOutsideToClose: true,
                locals: {
                    selectedIndex: index
                }
            });
        };
    }])
    
    .controller('SigninController', ['$scope', '$location', '$window', '$mdToast', '$mdDialog', 'AuthService', 'selectedIndex', function($scope, $location, $window, $mdToast, $mdDialog, AuthService, selectedIndex) {
        $scope.selectedIndex = selectedIndex;
        function toast(message) {
            var toast = $mdToast.simple()
                .textContent(message)
                .position('bottom right');
            
            $mdToast.show(toast);
        }
        
        $scope.login = function() {
            AuthService.login($scope.loginForm.username, $scope.loginForm.password)
                .then(function(user) {
                    $mdDialog.hide();
                    $scope.user = user;
                    $location.path('/profile');
                })
                .catch(function(data) {
                    $scope.loginForm.password = '';
                    toast(data.err.message);
                });
        };
        
        $scope.loginGoogle = function() {
            // Location service doesn't work because this route is not in appRoutes
            $window.location.href = '/auth/google';
        };
        
        $scope.register = function() {
            if (!$scope.registerForm.name.first || !$scope.registerForm.name.last || !$scope.registerForm.email) {
                toast("Please fill in all the fields");
                return false;
            }
            if ($scope.registerForm.password.original !== $scope.registerForm.password.confirm) {
                toast("Passwords do not match");
                $scope.registerForm.password.original = '';
                $scope.registerForm.password.confirm = '';
                return false;
            }
            AuthService.register(
                    $scope.registerForm.name,
                    $scope.registerForm.email,
                    $scope.registerForm.username, 
                    $scope.registerForm.gender,
                    $scope.registerForm.password.original
                )
                .then(function() {
                    $mdDialog.hide();
                    $location.path('/profile');
                })
                .catch(function(data) {
                    toast(data.err.message);
                });
        };
    }])
;
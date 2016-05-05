// http://mherman.org/blog/2015/07/02/handling-user-authentication-with-the-mean-stack

angular.module('thepark').factory('AuthService', ['$q', '$timeout', '$http', function($q, $timeout, $http) {
    // create user variable
    var service = {};
    service.user = null;
    
    service.isLoggedIn = function() {
        if (service.status) {
            return true;
        } else {
            service.getUser().then(function(user) {
                if (user) {
                    return true;
                } else {
                    return false;
                }
            });
        }
    };
    
    service.getUser = function() {
        var deferred = $q.defer();
        
        $http.get('/auth/local/status')
            .success(function(data) {
                service.user = data.user;
                service.status = data.status;
                deferred.resolve(data.user);
            }, function(data, status) {
                service.user = false;
                deferred.reject(status);
            });
        
        return deferred.promise;
    };
    
    service.login = function(username, password) {
        // create a new instance of deferred
        var deferred = $q.defer();
        
        // send a post request to the server
        $http.post('/auth/local/signin', {username: username, password: password})
            .success(function(data, status) {
                if (status === 200 && data.status) {
                    service.getUser().then(function(user) {
                        deferred.resolve(user);
                    });
                } else {
                    service.user = false;
                    deferred.reject(data);
                }
            })
            .error(function(data) {
                service.user = false;
                deferred.reject(data);
            });
            
        // return promise object
        return deferred.promise;
    };
    
    service.logout = function() {
        // create a new instance of deferred
        var deferred = $q.defer();
        
        // send a get request to the server
        $http.get('/auth/local/signout')
            .success(function() {
                service.user = false;
                deferred.resolve();
            })
            .error(function(data) {
                service.user = false;
                deferred.reject();
            });
            
        // return promise object
        return deferred.promise;
    };
    
    service.register = function(name, email, username, gender, password) {
        // create a new instance of deferred
        var deferred = $q.defer();
        
        // send a post request to the server
        $http.post('/auth/local/register', {
                name: name,
                email: email,
                username: username,
                gender,
                password: password
            })
            .success(function(data, status) {
                if (data.status) {
                    service.getUser();
                    deferred.resolve();
                } else {
                    deferred.reject(data);
                }
            })
            .error(function(data) {
                deferred.reject(data);
            });
            
        // return promise object
        return deferred.promise;
    };
    
    return service;
}]);
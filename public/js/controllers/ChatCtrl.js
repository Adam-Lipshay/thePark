angular.module('thepark').controller('ChatController', ['$scope', 'Socket', function($scope, Socket) {
    Socket.connect();
    
    $scope.messages = [];
    var isTyping = false;
    
    $scope.sendMessage = function(message) {
        if (message != null && message.trim() != '') {
            Socket.emit('sendMessage', {message: message});
            Socket.emit('stopTyping');
            typingTimer = null;
        }
        $scope.messageForm.message = '';    
    }
    
    var typingTimer = null;
    $scope.isTyping = function() {
        if (typingTimer === null) {
            Socket.emit('startTyping');
        }
        clearTimeout(typingTimer); 
        typingTimer = setTimeout(function() {
            Socket.emit('stopTyping');
            typingTimer = null;
        }, 1000)
    }
    
    Socket.on('newMessage', function(data) {
        $scope.messages.push(data);
    });
    
    Socket.on('startTyping', function() {
        $scope.typing = true;
    });
    Socket.on('stopTyping', function() {
        $scope.typing = false;
    })
    
    $scope.$on('locationChangeStart', function(e) {
        Socket.disconnect(true);
    })
}]);
var socketio = require('socket.io');

module.exports = function(io){
    io.on('connection', function(socket) {
        console.log("A user has connected");
        
        socket.on('sendMessage', function(data) {
            io.emit('newMessage', {message: data.message})
        });
        
        socket.on('disconnect', function(data) {
            console.log("A user has disconnected");
        });
        
        socket.on('startTyping', function() {
            io.emit('startTyping');
        });
        
        socket.on('stopTyping', function() {
            io.emit('stopTyping');
        });
        
    });
}
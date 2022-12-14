var socket = new WebSocket('ws://' + window.location.host + '/users/');

console.log("file js imported")

socket.onopen = function open() {
    console.log('WebSockets connection created.');
};

if (socket.readyState == WebSocket.OPEN) {
    socket.onopen();
}
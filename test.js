
'use strict';

var WebSocket = require('ws');
var ABClient = require('./libs.js').ABClient;
var ABServer = require('./libs.js').ABServer;

/* ABServer */
var s = new ABServer.Class(8081);

s.setOnConnectedListener(function(ab_client) {
    console.log('Connected: ' + ab_client.id);
});

s.setOnDataReceivedListener(function(ab_client, message) {
    console.log('Messsage from client `' + ab_client.id + '`: ' + message);
    ab_client.send('Echo: ' + message);
});

s.setOnDisconnectedListener(function(ab_client) {
    console.log('Disconnected: ' + ab_client.id);
});

s.listen();

/* ABClient */
var clients = [
    new ABClient.Class('localhost', 8081),
    new ABClient.Class('localhost', 8081),
    new ABClient.Class('localhost', 8081)
];

for (var i = 0; i < clients.length; i++) {
    var c = clients[i];

    var index = function(j){return j}(i);

    c.setOnConnectedListener(function() {
        console.log('Client + %d: connected to server.', index);
    });

    c.setOnDataReceivedListener(function(message) {
        console.log('Client %d: message from server: %s.', index, message);
    });

    c.setOnDisconnectedListener(function() {
        console.log('Client %d: disconnected from server.', index);
    });
}

var test = function(n) {
    var n = typeof n === 'undefined' ? 0 : n;

    if (n >= 5)
        return;

    for (var i = 0; i < clients.length; i++)
        clients[i].send('My test message + ' + i + '.');
    setTimeout(function() { test(n + 1); }, 5000);
};
test();

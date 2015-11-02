
'use strict';


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
var c = new ABClient.Class('localhost', 8081);

c.setOnConnectedListener(function() {
    console.log('Connected to server.');
});

c.setOnDataReceivedListener(function(message) {
    console.log('Message from server: ' + message);
});

c.setOnDisconnectedListener(function() {
    console.log('Disconnected from server.');
});

var test = function(n) {
    var n = typeof n === 'undefined' ? 0 : n;

    if (n >= 5)
        return;

    c.send('My test message + ' + n + '.');
    setTimeout(function() { test(n + 1); }, 5000);
};
test();

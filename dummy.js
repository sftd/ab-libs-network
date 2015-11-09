
var WebSocket = require('ws');


/* Server */
var wss = new WebSocket.Server({port: 8080});
var client_i = 0;

wss.on('connection', function connection(ws) {
    var i = function(j) {return j}(client_i);
    console.log('client %d connected', i);
    ws.on('message', function incoming(message) {
        console.log('client %d: %s', i, message);
    });
    client_i++;
});

/* Clients */
var t1 = new WebSocket('ws://localhost:8080');
var t2 = new WebSocket('ws://localhost:8080');
var t3 = new WebSocket('ws://localhost:8080');

t1.on('open', function open() {
    t1.send('socket 1');
    t1.send('socket 1');
});


t2.on('open', function open() {
    t2.send('socket 2');
    t2.send('socket 2');
});

t3.on('open', function open() {
    t3.send('socket 3');
    t3.send('socket 3');
});

// var ts = [
//     new WebSocket('ws://localhost:8080'),
//     new WebSocket('ws://localhost:8080'),
//     new WebSocket('ws://localhost:8080')
// ]
//
// for (var i = 0; i < ts.length; i++) {
//     var t_i = function(j) {
//         return j;
//     }(i);
//
//     ts[i].on('open', function open() {
//         ts[t_i].send('socket + ' + i);
//     });
//
//     ts[i].on('message', function(data, flags) {
//       console.log('socket ' + i + ': ' + data);
//     });
// }

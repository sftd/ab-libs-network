
'use strict';

var WebSocket = require('ws');

var ABClient = {
    self: null,

    STATE_CONNECTED:        0,
    STATE_CONNECTING:       1,
    STATE_DICONNECTED:      2,
    STATE_DISCONNECTING:    3,

    host: '',
    port: 8080,

    socket: null,

    state: -1,
    datas: null,

    listeners_OnConnected: null,
    listeners_OnDisconnected: null,
    listeners_OnMesssageReceived: null,

    Class: function(host, port)
    {
        this.self = this;
        var self = this.self;

        self.host = host;
        self.port = port;

        self.datas = [];

        self.state = ABClient.STATE_DICONNECTED;
    },

    connect: function()
    {
        var self = this.self;

        if (self.state === ABClient.STATE_CONNECTED ||
            self.state === ABClient.STATE_CONNECTING)
            return;

        self.state === ABClient.STATE_CONNECTING;

        self.socket = new WebSocket('ws://' + self.host + ':' + self.port);

        self.socket.addEventListener('close', function() {
            var t_state = self.state;
            self.state = ABClient.STATE_DICONNECTED;

            if (self.listeners_OnDisconnected !== null)
                self.listeners_OnDisconnected();

            if (t_state !== ABClient.STATE_DISCONNECTING)
                self.connect();
        });

        self.socket.addEventListener('error', function(e) {
            console.log('Socket error: ', e);
        });

        self.socket.addEventListener('message', function(e) {
            if (self.listeners_OnMesssageReceived !== null)
                self.listeners_OnMesssageReceived(e.data);
        });

        self.socket.addEventListener('open', function() {
            self.state = ABClient.STATE_CONNECTED;
            if (self.listeners_OnConnectedListener !== null)
                self.listeners_OnConnectedListener();
            while (self.datas.length > 0) {
                if (self.state !== ABClient.STATE_CONNECTED)
                    break;
                var data = self.datas.pop(0);
                self.socket.send(data);
             }
        });
    },

    disconnect: function()
    {
        var self = this.self;

        self.state = ABClient.STATE_DISCONNECTING;
        self.socket.close();
    },

    send: function(message)
    {
        var self = this.self;

        self.datas.push(message);

        while (self.datas.length > 0) {
            if (self.state !== ABClient.STATE_CONNECTED) {
                self.connect();
                break;
            }
            self.socket.send(self.datas.pop(0));
        }
    },

    setOnConnectedListener: function(listener)
    {
        var self = this.self;

        self.listeners_OnConnectedListener = listener;
    },

    setOnDisconnectedListener: function(listener)
    {
        var self = this.self;

        self.listeners_OnDisconnected = listener;
    },

    setOnDataReceivedListener: function(listener)
    {
        var self = this.self;

        self.listeners_OnMesssageReceived = listener;
    }

};
ABClient.Class.prototype = ABClient;
exports.ABClient = ABClient;

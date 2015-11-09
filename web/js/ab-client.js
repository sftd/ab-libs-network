
'use strict';


var ABClient = {
    self: null,

    host: '',
    port: 8080,

    socket: null,

    connected: false,
    messages: [],

    listeners_OnConnected: null,
    listeners_OnMesssageReceived: null,

    Class: function(host, port)
    {
        this.self = this;
        var self = this.self;

        self.host = host;
        self.port = port;
    },

    connect: function()
    {
        var self = this.self;

        if (self.connected)
            return;

        self.socket = new WebSocket('ws://' + self.host + ':' + self.port);

        self.socket.addEventListener('message', function(e) {
            if (self.listeners_OnMesssageReceived !== null)
                self.listeners_OnMesssageReceived(e.data);
        });

        self.socket.addEventListener('close', function() {
            self.connected = false;
        });

        self.socket.addEventListener('open', function() {
            self.connected = true;
            if (self.listeners_OnConnected !== null)
                self.listeners_OnConnected();
            while (self.messages.length > 0) {
                if (!self.connected)
                    break;
                var message = self.messages.pop(0);
                self.socket.send(message);
             }
        });
    },

    send: function(message)
    {
        var self = this.self;

        self.messages.push(message);

        while (self.messages.length > 0) {
            if (!self.connected) {
                self.connect();
                break;
            }
            self.socket.send(self.messages.pop(0));
        }
    },

    setOnConnectedListener: function(listener)
    {
        var self = this.self;

        self.listeners_OnConnectedListener = listener;
    },

    setOnDataReceivedListener: function(listener)
    {
        var self = this.self;

        self.listeners_OnMesssageReceived = listener;
    }

};
ABClient.Class.prototype = ABClient;

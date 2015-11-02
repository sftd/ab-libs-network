
'use strict';

/* External */
var ws = require('ws');
/* Internal */
var ABServer_Client = require('./../libs.js').ABServer_Client;

/* Class */
var ABServer = {
    self: null,

    port: 80,
    wsServer: null,

    clients: null,

    listeners_OnConnected: null,
    listeners_OnConnecting: null,
    listeners_OnDisconnected: null,
    listeners_OnDataReceived: null,

    Class: function(port)
    {
        this.self = this;
        var self = this.self;

        self.port = port;
        self.clients = [];
    },

    listen: function()
    {
        var self = this.self;

        self.wsServer = new ws.Server({port: self.port});

        self.wsServer.on('connection', function(ws_socket) {
            self.onConnected(ws_socket);
        });

        console.log('Listening...');
    },

    onConnected: function(ws_socket) {
        var self = this.self;

        var client_id = -1;
        for (var i = 0; i < self.clients.length; i++)
            if (self.clients[i] === null)
                client_id = i;

        if (client_id === -1) {
            self.clients.push(null);
            client_id = self.clients.length - 1;
        }

        var client = new ABServer_Client.Class(client_id, ws_socket);
        self.clients[client_id] = client;


        if (self.listeners_OnConnected !== null)
            self.listeners_OnConnected(client);

        ws_socket.on('close', function() {
            if (!self.listeners_OnDisconnected !== null)
                self.listeners_OnDisconnected(client);
        });

        ws_socket.on('message', function(message) {
            if (!self.listeners_OnDataReceived !== null)
                self.listeners_OnDataReceived(client, message);
        });
    },

    setOnConnectedListener: function(listener) {
        var self = this.self;

        self.listeners_OnConnected = listener;
    },

    setOnDisconnectedListener: function(listener) {
        var self = this.self;

        self.listeners_OnDisconnected = listener;
    },

    setOnDataReceivedListener: function(listener) {
        var self = this.self;

        self.listeners_OnDataReceived = listener;
    }

};
ABServer.Class.prototype = ABServer;
exports.ABServer = ABServer;

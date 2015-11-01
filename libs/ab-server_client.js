
'use strict';


var ABServer_Client = {
    self: null,

    id: -1,
    socket: null,

    Class: function(id, socket)
    {
        this.self = this;
        var self = this.self;

        self.id = id;
        self.socket = socket;
    },

    send: function(message)
    {
        var self = this.self;

        self.socket.send(message);
    }

};
ABServer_Client.Class.prototype = ABServer_Client;
exports.ABServer_Client = ABServer_Client;

/**
 * Created by hzyangyusen on 2016/12/27.
 */
var server = require('websocket').server;
var http = require('http');

var socket = new server({
    httpServer: http.createServer().listen(1337)
});

var connectionMap = {};

socket.on('request', function (req) {
    console.log(req.key);
    if (!connectionMap[req.key]) {
        connectionMap[req.key] = req.accept(null, req.origin);
        if (Object.keys(connectionMap).length > 1) {
            for (var i in connectionMap) {
                if (connectionMap[i] != connectionMap[req.key]) {
                    connectionMap[i].sendUTF('someone joined ...')
                }
            }
        }
        connectionMap[req.key].on('message', function (message) {
            if (Object.keys(connectionMap).length > 1) {
                for (var i in connectionMap) {
                    if (connectionMap[i] != connectionMap[req.key]) {
                        connectionMap[i].sendUTF('others : ' + message.utf8Data)
                    }
                }
            } else {
                connectionMap[req.key].sendUTF('there is no man here ...')
            }
        });
        connectionMap[req.key].on('close', function () {
            delete connectionMap[req.key];
            for (var i in connectionMap) {
                if (connectionMap[i] != connectionMap[req.key]) {
                    connectionMap[i].sendUTF('someone leaved ...')
                }
            }
        });
    }
})
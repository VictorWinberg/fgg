var express = require('express');

var app = express();
app.use('/fgg', express.static(__dirname + '/')); // set the static files location /public/img will be /img for users

var server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1'

app.listen(server_port, server_ip_address, function () {
  console.log("Listening on " + server_ip_address + ", server_port " + server_port)
});
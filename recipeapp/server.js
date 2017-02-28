var express = require("express");
var app     = express.createServer();
var path    = require("path");
app.use(express.static('public'));



app.listen(8080);
console.log(process.env.IP);

console.log("Running at Port 8080");
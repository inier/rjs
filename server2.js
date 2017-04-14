
var path=require('path');

var HOST = "http://localhost";
var PORT = 3000;
var DOMAIN = `${HOST}:${PORT}/`;

// 使用express框架
var express = require('express');
//初始化一个web服务
var app = express();

app.use("/", express.static(__dirname + "/r*"));

app.listen(PORT, function (err) {
    if (err) {
        console.log(err);
        return;
    }

    console.log('Listening at '+ DOMAIN);
});

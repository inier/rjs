var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');

var HOST = "http://localhost";
var PORT = 3000;
var DOMAIN = `${HOST}:${PORT}/`;

//nodeJS版 添加MIME类型
var MIME_TYPE = {
    "css": "text/css",
    "gif": "image/gif",
    "html": "text/html",
    "ico": "image/x-icon",
    "jpeg": "image/jpeg",
    "jpg": "image/jpeg",
    "js": "text/javascript",
    "json": "application/json",
    "pdf": "application/pdf",
    "png": "image/png",
    "svg": "image/svg+xml",
    "swf": "application/x-shockwave-flash",
    "tiff": "image/tiff",
    "txt": "text/plain",
    "wav": "audio/x-wav",
    "wma": "audio/x-ms-wma",
    "wmv": "video/x-ms-wmv",
    "xml": "text/xml"
};

var server = http.createServer(serverStatic);
function serverStatic(req, res) {
    var filePath;
    if (req.url === "/") {
        filePath = "index.html";
    } else {
        filePath = "./" + url
            .parse(req.url)
            .pathname;
    }

  /*  var params = url.parse(req.url, true);

    var IMGS = new imageServer(http, url);

    IMGS.http(params.query.url, function(data) {
        res.writeHead(200, {"Content-Type": data.type});
        res.write(data.body, "binary");
        res.end();
    });*/

    fs.exists(filePath, function (err) {
        if (!err) {
            send404(res);
        } else {
            var ext = path.extname(filePath);
            ext = ext
                ? ext.slice(1)
                : 'unknown';
            var contentType = MIME_TYPE[ext] || "text/plain";
            fs.readFile(filePath, function (err, data) {
                if (err) {
                    res.end("<h1>500</h1>服务器内部错误！");
                } else {
                    res.writeHead(200, {'content-type': contentType});
                    res.end(data.toString());
                }
            }); //fs.readfile
        }
    }) //path.exists

}

server.listen(PORT);
console.log("Server runing at port: " + PORT + ".");

function send404(res) {
    res.end("<h1>404</h1><p>file not found</p>")
}

function imageServer(http, url) {
    var _url = url;
    var _http = http;

    this.http = function(url, callback, method) {
        method = method || 'GET';
        callback = callback ||
        function() {};
        var urlData = _url.parse(url);
        var request = _http.createClient(80, urlData.host).
        request(method, urlData.pathname, {
            "host": urlData.host
        });

        request.end();

        request.on('response', function(response) {
            var type = response.headers["content-type"],
                body = "";
            response.setEncoding('binary');
            response.on('end', function() {
                var data = {
                    type: type,
                    body: body
                };
                callback(data);

            });
            response.on('data', function(chunk) {
                if (response.statusCode == 200) body += chunk;
            });
        });

    };
}

// // 使用express框架 var express = require('express'); //初始化一个web服务 var app =
// express(); app.use("/",express.static(__dirname + "/r*")); app.listen(PORT,
// function (err) {     if (err) {         console.log(err);         return; }
//   console.log('Listening at '+ DOMAIN); });
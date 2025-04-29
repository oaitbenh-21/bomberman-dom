var http = require('http');
var fs = require('fs');

http.createServer(function (req, res) {
    console.log("." + req.url)
    fs.readFile("." + req.url, function (err, data) {
        if (err) console.log(err)
        res.end(data)
    });
}).listen(8080, '0.0.0.0');

console.log(`🚀 Server running at http://localhost:8080`);


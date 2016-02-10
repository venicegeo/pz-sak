var express = require("express"),
    request = require("request"),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    port = process.env.PORT || 8080;

//request.debug = true;
var app = express();
var logger = require('morgan');
app.use(logger('combined'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

//app.use(express.urlencoded());
app.set("view options", {
    layout: false
});
app.use(express.static(__dirname + '/public'));

app.get('/proxy', function (req, res) {
    var url = "http://" + req.query.url;
    console.log("\nURL from index.js = " + url + "\n");
    req.pipe(request(url)).pipe(res);
});

app.get('/proxy/*', function (req, res) {
    var url = "http://" + req.url.substring(7);
    req.pipe(request(url).pipe(res));
});

app.post('/proxy', function (req, res) {
    var url = "http://" + req.query.url;
    console.log("\nURL from index.js = " + url + "\n");
    req.pipe(request({
        uri: url,
        method: req.method,
        headers: req.headers,
        json: true,
        body: req.body
    }, function(error, response, body) {
        console.log(error);
    })).pipe(res);
});

app.listen(port);
console.log('Express server running at http://localhost:' + port);
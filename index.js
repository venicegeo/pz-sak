var express = require("express"),
    request = require("request"),
    fs = require('fs'),
    bodyParser = require('body-parser'),
    port = process.env.PORT || 8080;

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
    var url = req.query.url;
    req.pipe(request(url)).pipe(res);
});

app.listen(port);
console.log('Express server running at http://localhost:' + port);
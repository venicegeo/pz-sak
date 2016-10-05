/**
 Copyright 2016, RadiantBlue Technologies, Inc.

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */

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
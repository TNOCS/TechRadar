var express = require('express');
var path = require('path');
var app = express();
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));
var port = 3333;
var server = app.listen(port, function () {
    console.log('Example app listening at http://localhost:%s', port);
});

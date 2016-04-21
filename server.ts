import express = require('express');
import path    = require('path');

var app = express();

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'dist')));

// app.get('/', function (req, res) {
//   res.send('Hello World!');
// });
 
var port = 3333;
var server = app.listen(port, function () {
  console.log('Example app listening at http://localhost:%s', port);
});

var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.redirect('/index.html');
});

app.get('/_ah/health', function(req, res) {
  res.status(200).send('ok');
});
app.use(function(err, req, res, next) {
  /* jshint unused:false */
  res.status(500).send('Something broke!');
});
app.use(express.static('app'));
var server = app.listen(8080, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
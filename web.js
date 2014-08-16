var express = require('express');
var bodyParser = require('body-parser');
var logfmt = require('logfmt');

var app = express();
var unscrambler = require('./unscrambler');

app.use(logfmt.requestLogger());
app.use(bodyParser.urlencoded({extended: false}));

app.get('/browser.js', function(req, res) {
	res.sendFile(__dirname + '/browser.js');
});

app.post('/unscramble', function(req, res) {
	unscrambler.unscramble(req.body.text, req.body.extra, function(text) {
		res.set({
			'Access-Control-Allow-Origin': '*'
		});
		res.send(text);
	});
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
	console.log('Listening on ' + port);
});


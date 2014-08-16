var express = require('express');
var bodyParser = require('body-parser');
var logfmt = require('logfmt');
var ua = require('universal-analytics');

var app = express();
var unscrambler = require('./unscrambler');

app.use(logfmt.requestLogger());
app.use(bodyParser.urlencoded({extended: false}));
app.use(ua.middleware('UA-53893556-1', {cookieName: '_ga'}));

app.get('/', function(req, res) {
	req.visitor.pageview('/').send();

	res.redirect('https://github.com/sim642/epl-unscramble');
});

app.get('/browser.js', function(req, res) {
	req.visitor.pageview('/browser.js').send();

	res.sendFile(__dirname + '/browser.js');
});

app.post('/unscramble', function(req, res) {
	req.visitor.pageview('/unscramble').event('Processing', 'unscramble', req.body.url).send();
	var time = process.hrtime();

	unscrambler.unscramble(req.body.text, req.body.extra, function(text) {
		var diff = process.hrtime(time);
		var ms = Math.round(diff[0] * 1e3 + diff[1] / 1e6);
		req.visitor.timing('Processing', 'unscramble', ms, req.body.url).send();

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


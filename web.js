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
	console.log(req.ip, req.headers['user-agent']);
	req.visitor.pageview({dp: '/', uip: req.ip, ua: req.headers['user-agent']}).send();

	res.redirect('https://github.com/sim642/epl-unscramble');
});

app.get('/browser.js', function(req, res) {
	req.visitor.pageview({dp: '/browser.js', uip: req.ip, ua: req.headers['user-agent']}).send();

	res.sendFile(__dirname + '/browser.js');
});

app.post('/unscramble', function(req, res) {
	req.visitor.pageview({dp: '/unscramble', uip: req.ip, ua: req.headers['user-agent']}).event({ec: 'Processing', ea: 'unscramble', el: req.body.url, uip: req.ip, ua: req.headers['user-agent']}).send();
	var time = process.hrtime();

	unscrambler.unscramble(req.body.text, req.body.extra, function(text) {
		var diff = process.hrtime(time);
		var ms = Math.round(diff[0] * 1e3 + diff[1] / 1e6);
		req.visitor.timing({utc: 'Processing', etv: 'unscramble', ett: ms, utl: req.body.url, uip: req.ip, ua: req.headers['user-agent']}).send();

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


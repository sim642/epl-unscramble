var express = require('express');
var bodyParser = require('body-parser');
var logfmt = require('logfmt');
var ua = require('universal-analytics');

var app = express();
var unscrambler = require('./unscrambler');

app.use(logfmt.requestLogger());
app.use(bodyParser.urlencoded({extended: false})); // POST body parser
app.use(ua.middleware('UA-53893556-1', {cookieName: '_ga'})); // Google Analytics

// https://stackoverflow.com/questions/14382725/how-to-get-the-correct-ip-address-of-a-client-into-a-node-socket-io-app-hosted-o
function getClientIp(req) {
	var ipAddress;
	// Amazon EC2 / Heroku workaround to get real client IP
	var forwardedIpsStr = req.header('x-forwarded-for'); 
	if (forwardedIpsStr) {
		// 'x-forwarded-for' header may return multiple IP addresses in
		// the format: "client IP, proxy 1 IP, proxy 2 IP" so take the
		// the first one
		var forwardedIps = forwardedIpsStr.split(',');
		ipAddress = forwardedIps[0];
	}
	if (!ipAddress) {
		// Ensure getting client IP address still works in
		// development environment
		ipAddress = req.connection.remoteAddress;
	}
	return ipAddress;
};

app.get('/', function(req, res) {
	req.visitor.pageview({dp: '/', uip: getClientIp(req), ua: req.headers['user-agent']}).send();

	res.sendFile(__dirname + '/index.html');
});

app.get('/browser.js', function(req, res) {
	req.visitor.pageview({dp: '/browser.js', uip: getClientIp(req), ua: req.headers['user-agent']}).send();

	res.sendFile(__dirname + '/browser.js');
});

app.post('/unscramble', function(req, res) {
	req.visitor.pageview({dp: '/unscramble', uip: getClientIp(req), ua: req.headers['user-agent']}).event({ec: 'Processing', ea: 'unscramble', el: req.body.url, uip: getClientIp(req), ua: req.headers['user-agent']}).send();
	var time = process.hrtime();

	unscrambler.unscramble(req.body.text, req.body.extra, function(text) {
		var diff = process.hrtime(time);
		var ms = Math.round(diff[0] * 1e3 + diff[1] / 1e6);
		req.visitor.timing({utc: 'Processing', etv: 'unscramble', ett: ms, utl: req.body.url, uip: getClientIp(req), ua: req.headers['user-agent']}).send();

		res.set({
			'Access-Control-Allow-Origin': '*'
		}); // stop browsers from freaking out
		res.send(text);
	});
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
	console.log('Listening on ' + port);
});


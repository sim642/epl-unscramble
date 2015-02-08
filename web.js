var express = require('express');
var logfmt = require('logfmt');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var ua = require('universal-analytics');
var merge = require('merge');
var url = require('url');

var app = express();
var unscrambler = require('./unscrambler');

app.enable('trust proxy');

app.use(logfmt.requestLogger());
app.use(bodyParser.urlencoded({extended: false})); // POST body parser
app.use(cookieParser()); // parse cookies to be used with GA
app.use(session({secret: '7f52d94ac59a47c352ffaab4e6515730240546c2'})); // allow setting cookies
app.use(ua.middleware('UA-53893556-1', {cookieName: '_ga'})); // Google Analytics

app.use(function(req, res, next) { // req fixer
	req.originalUrl = req.originalUrl.replace(/&?_=\d*/, '');
	next();
});

app.use(function(req, res, next) { // GA pageview
	req.visitor.defaults = { // default parameters used which should be used for all GA responses
		dp: req.originalUrl,
		dt: req.path,
		uip: req.ip,
		ua: req.headers['user-agent'],
		dr: req.headers['referer'] || ''
	};

	req.visitor.pageview(req.visitor.defaults).send(); // automatically count pageview
	next();
});

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.get('/browser.js', function(req, res) {
	res.sendFile(__dirname + '/browser.js');
});

app.get('/epl-unscramble.user.js', function(req, res) {
	res.sendFile(__dirname + '/epl-unscramble.user.js');
});

app.post('/unscramble', function(req, res) {
	req.visitor.event(merge(req.visitor.defaults, {ec: 'Processing', ea: 'unscramble', el: req.body.url})).send();

	unscrambler.unscramble(req.body.text, req.body.extra, req.body.mode, function(text) {
		res.set({'Access-Control-Allow-Origin': '*'}); // stop browsers from freaking out about cross domain AJAX
		res.send(text);
	});
});

var port = Number(process.env.PORT || 5000);
app.listen(port, function() {
	console.log('Listening on ' + port);
});


var jsdom = require('jsdom');
var fs = require('fs');

String.prototype.sort = function() {
	return this.split('').sort().join('');
}

String.prototype.replaceAt = function(index, character) {
    return this.substr(0, index) + character + this.substr(index+character.length);
}

var wordLines = fs.readFileSync('et.txt').toString().split(/\r?\n/);

var words = {};
for (var i = 0; i < wordLines.length; i++) {
	var s = wordLines[i].split(' ');
	var sorted = s[0].sort();
	
	if (!(sorted in words))
		words[sorted] = [];
	
	words[sorted].push({word: s[0], count: parseInt(s[1])});
}

module.exports.unscramble = function(content, extra, callback) {
	var extras = {};
	extra.replace(/[A-ZÕÜÄÖa-zäöõü]+/g, function(match) {
		var sorted = match.toLowerCase().sort();

		if (!(sorted in extras))
			extras[sorted] = [];

		var i;
		for (i = 0; i < extras[sorted].length; i++) {
			if (extras[sorted][i].word == match.toLowerCase()) {
				extras[sorted][i].count++;
				break;
			}
		}

		if (i == extras[sorted].length) {
			extras[sorted].push({word: match.toLowerCase(), count: 1});
		}
	});

	for (var sorted in extras) {
		extras[sorted].sort(function(lhs, rhs) {
			rhs.count - lhs.count;
		});
	}

	jsdom.env(content, ['http://code.jquery.com/jquery-1.11.0.min.js'], function(err, window) {
		var $ = window.jQuery;

		$('p, h3, h4').text(function(i, text) {
			//return text.replace(/\b[^\s.,-]+\b/g, function(match) {
			return text.replace(/[A-ZÕÜÄÖa-zäöõü]+/g, function(match) {
				var sorted = match.toLowerCase().sort();
				if (sorted in extras) {
					var word = extras[sorted][0].word;
					for (var i = 0; i < match.length; i++) {
						if (match[i].match(/[A-ZÕÜÄÖ]/)) {
							word = word.replaceAt(i, word[0].toUpperCase());
						}
					}
					//return "<" + word + ">";
					return word;
				}
				else if (sorted in words) {
					var word = words[sorted][0].word;
					for (var i = 0; i < match.length; i++) {
						if (match[i].match(/[A-ZÕÜÄÖ]/)) {
							word = word.replaceAt(i, word[0].toUpperCase());
						}
					}
					//return "<" + word + ">";
					return word;
				}
				else
					return "[" + match + "]";
					//return match;
			});
		});

		/*$('p, h3, h4').text(function (i, text) {
			console.log(i, text);
		});*/

		(callback || function(){})($('body').html());
	});
}

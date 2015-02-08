var jsdom = require('jsdom');
var fs = require('fs');
var jquery = fs.readFileSync('./jquery-1.11.1.min.js', 'utf-8').toString();

String.prototype.sort = function() {
	return this.split('').sort().join('');
}

String.prototype.replaceAt = function(index, character) {
    return this.substr(0, index) + character + this.substr(index + character.length);
}

var wordset = {epl: {}, pm: {}};
var wordSum = 0;

function loadWordFile(filename, swap) {
	console.log('Loading wordfile', filename);
	var wordLines = fs.readFileSync(filename).toString().split(/\r?\n/);
	for (var i = 0; i < wordLines.length; i++) {
		var s = wordLines[i].split(/\s/);
		if (s.length < 2)
			continue;

		if (swap)
			s = [s[1], s[0]];

		for (var mode in wordset) {
			var words = wordset[mode];
			var sorted;

			switch (mode) {
			case 'epl':
				sorted = s[1].sort();
				break;

			case 'pm':
				sorted = s[1].replace(/[õüäö]/gi, '').sort();
				break;
			}

			if (!(sorted in words))
				words[sorted] = [];

			var j;
			for (j = 0; j < words[sorted].length; j++) {
				if (words[sorted][j].word == s[1]) {
					words[sorted][j].count += parseInt(s[0]);
					break;
				}
			}

			if (j == words[sorted].length)
				words[sorted].push({word: s[1], count: parseInt(s[0])});
		}

		wordSum += parseInt(s[0]);
	}
}

loadWordFile('sonavorm_kahanevas.txt', false);
loadWordFile('et.txt', true);

for (var mode in wordset) {
	var words = wordset[mode];
	for (var sorted in words) {
		words[sorted].sort(function(lhs, rhs) {
			rhs.count - lhs.count;
		});
	}
}

console.log('Loading bigramfile');
var bigramLines = fs.readFileSync('2_gramm_koond_sonavorm_sort_x_va10').toString().split(/\r?\n/);
var bigrams = {};
var bigramSum = 0;
for (var i = 0; i < bigramLines.length; i++) {
	var s = bigramLines[i].trim().replace(/#z#/g, '').split(/\s/);
	if (s.length < 3)
		continue;
	
	bigrams[[s[1], s[2]]] = parseInt(s[0]);
	bigramSum += parseInt(s[0]);
}
bigramLines = null;

function mimicCapital(word, mask, mode) {
	switch (mode) {
	case 'epl':
		for (var i = 0; i < mask.length; i++) {
			if (mask[i].match(/[A-ZÕÜÄÖ]/)) {
				word = word.replaceAt(i, word[i].toUpperCase());
			}
		}
		break;

	case 'pm':
		for (var i = 0; i < mask.length; i++) {
			if (mask[i].match(/[A-ZÕÜÄÖ]/)) {
				word = word.replace(mask[i].toLowerCase(), mask[i]);
			}
		}
		break;
	}
	return word;
}

module.exports.unscramble = function(content, extra, mode, callback) {
	if (!(mode in wordset)) { // invalid mode
		(callback || function(){})('');
		return;
	}

	var extras = {}; // known words from article intro
	extra.replace(/[A-ZÕÜÄÖa-zäöõü]+/g, function(match) {
		var sorted = match.toLowerCase().sort();
		if (mode == 'pm')
			sorted = sorted.replace(/[õüäö]/gi, '');

		if (!(sorted in extras))
			extras[sorted] = [];

		var i;
		for (i = 0; i < extras[sorted].length; i++) { // find word in extras[sorted]
			if (extras[sorted][i].word == match.toLowerCase()) {
				extras[sorted][i].count++;
				break;
			}
		}

		if (i == extras[sorted].length) { // word was not found in extras[sorted], add it
			extras[sorted].push({word: match.toLowerCase(), count: 1});
		}
	});

	for (var sorted in extras) { // sort descendingly to get most probable matches first
		extras[sorted].sort(function(lhs, rhs) {
			rhs.count - lhs.count;
		});
	}

	var words = wordset[mode];

	jsdom.env({html: content, src: [jquery], done: function(err, window) {
		var $ = window.jQuery;

		var nodes = $('*:not(script)').contents().filter(function() {
			return this.nodeType == 3;
		}); // select all DOM nodes of text type

		var prev = ''; // previous word, TODO: might be broken due to nodes selector
		for (var i = 0; i < nodes.length; i++) {
			var re;
			switch (mode) {
			case 'epl':
				re = /[A-ZÕÜÄÖa-zäöõü]+|[.,](?=\s)/g;
				break;
			case 'pm':
				re = /[A-ZÕÜÄÖa-zäöõü.,]+/g;
				break;
			}

			nodes[i].nodeValue = nodes[i].nodeValue.replace(re, function(match) {
				var suffix = '';

				var punctPos = match.search(/[.,]/);
				if (punctPos != -1) { // remember punctuation as previous
					switch (mode) {
					case 'epl':
						prev = match;
						return match;
					case 'pm':
						suffix = match[punctPos];
						match = match.slice(0, punctPos) + match.slice(punctPos + 1);
						break;
					}
				}

				var sorted = match.toLowerCase().sort();

				if (sorted in extras) { // known word from article intro
					var word = mimicCapital(extras[sorted][0].word, match, mode);
					prev = suffix == '' ? word : suffix;
					return word + suffix;
				}
				if (sorted in words) { // known word from wordlist
					var cands = words[sorted]; // word candidates
					// naive bayesian classifier
					for (var i = 0; i < cands.length; i++) {
						cands[i].prob = (cands[i].count / wordSum) * ((bigrams[[prev, cands[i].word]] || 1) / bigramSum);
					}
					cands.sort(function(lhs, rhs) {
						return rhs.prob - lhs.prob;
					});

					var word = mimicCapital(cands[0].word, match, mode);
					prev = suffix == '' ? word : suffix;
					return word + suffix;
				}
				else { // unknown word
					prev = match;
					return "[" + match + suffix + "]";
				}
			});
		}

		(callback || function(){})($('body').html());
	}});
}

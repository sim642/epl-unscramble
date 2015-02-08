if ($('div.obfuscated_body').length > 0) { // EPL, delfi
	$.post('http://localhost:5000/unscramble?auto=' + (window.EPLauto ? 1 : 0), {
		text: $('div.obfuscated_body').html(),
		extra: $('font.articleBody[itemprop="description"]').text() +
			' ' + $('font.articleBody[itemprop="articleBody"] > p').text().trim() +
			' ' + $('font.articleBody[itemprop="articleBody"]').clone().children().remove().end().text().trim() +
			' ' + $('font.imgCapS').text() +
			' ' + $('a', '.obfuscated_body').clone().text(function(i, text) { return text + " "; }).text(),
		url: document.URL,
		mode: 'epl'
		// does not send cross-domain cookies
	}, function(data) {
		$('div.obfuscated_body').html(data).removeClass('obfuscated_body');
		$('.sso-art-wrapper, .bottom-sso-wrapper, .pcc-recommended-content').hide();
	}).fail(function(jqXHR, text, err) {
		alert(text + '\n\n' + JSON.stringify(err));
	});
}
else if ($('div.shadowText').length > 0) { // postimees
	$.post('http://localhost:5000/unscramble?auto=' + (window.EPLauto ? 1 : 0), {
		text: $('div.shadowText').html(),
		extra: $('section.articleLead[itemprop="description"]').text() +
			' ' + $('h1.articleHeading').text() +
			' ' + $('section.articleTeaser').text() +
			' ' + $('section.articlePhotoes div.photoDescription').text(),
		url: document.URL,
		mode: 'pm'
		// does not send cross-domain cookies
	}, function(data) {
		$('div.shadowText').html(data).removeClass('shadowText');
		$('.payMethodContainer').hide();
	}).fail(function(jqXHR, text, err) {
		alert(text + '\n\n' + JSON.stringify(err));
	});
}

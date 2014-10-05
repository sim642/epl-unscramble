if ($('div.obfuscated_body').length > 0) {
	$.post('http://epl-unscramble.herokuapp.com/unscramble?auto=' + (window.EPLauto ? 1 : 0), {
		text: $('div.obfuscated_body').html(),
		extra: $('font.articleBody[itemprop="description"]').text() +
			' ' + $('font.articleBody[itemprop="articleBody"] > p').text().trim() +
			' ' + $('font.articleBody[itemprop="articleBody"]').clone().children().remove().end().text().trim() +
			' ' + $('font.imgCapS').text() +
			' ' + $('a', '.obfuscated_body').clone().text(function(i, text) { return text + " "; }).text(),
		url: document.URL
		// does not send cross-domain cookies
	}, function(data) {
		$('div.obfuscated_body').html(data).removeClass('obfuscated_body');
		$('.sso-art-wrapper, .bottom-sso-wrapper, .pcc-recommended-content').hide();
	}).fail(function(jqXHR, text, err) {
		alert(text + '\n\n' + JSON.stringify(err));
	});
}

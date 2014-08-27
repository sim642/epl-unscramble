if ($('div.obfuscated_body').length > 0) {
	$.post('http://epl-unscramble.herokuapp.com/unscramble', {
		text: $('div.obfuscated_body').html(),
		extra: $('font.articleBody[itemprop="description"]').text() +
			' ' + $('font.articleBody[itemprop="articleBody"] > p').text().trim() +
			' ' + $('font.articleBody[itemprop="articleBody"]').clone().children().remove().end().text().trim() +
			' ' + $('font.imgCapS').text(),
		url: document.URL
	}, function(data) {
		$('div.obfuscated_body').html(data).removeClass('obfuscated_body');
		$('.sso-art-wrapper').hide();
	}).fail(function(jqXHR, text, err) {
		alert(text + '\n\n' + JSON.stringify(err));
	});
}

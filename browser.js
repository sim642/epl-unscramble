$.post("http://localhost:5000/unscramble", {
	text: $('div.obfuscated_body').html(),
	extra: $('font.articleBody').clone().children().remove().end().text().trim() +
		" " + $('font.imgCapS').text()
}, function(data) {
	$('div.obfuscated_body').html(data).removeClass('obfuscated_body');
	$('.sso-art-wrapper').hide();
});

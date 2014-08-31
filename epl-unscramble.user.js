// ==UserScript==
// @name        epl-unscramble
// @namespace   https://github.com/sim642/epl-unscramble
// @description EPL tasuliste artiklite tõenäosuslik dešifreerija
// @include     http://epl.delfi.ee/news/*
// @include     http://ekspress.delfi.ee/news/*
// @include     http://maaleht.delfi.ee/news/*
// @include     http://arileht.delfi.ee/news/*
// @include     http://kasulik.delfi.ee/news/*
// @include     http://maakodu.delfi.ee/news/*
// @version     3
// @grant       none
// ==/UserScript==

if ($('div.obfuscated_body').length > 0) {
	window.EPLauto = true;
	$.ajaxSetup({cache: false});
	$.getScript('http://epl-unscramble.herokuapp.com/browser.js?auto=1');
	$.ajaxSetup({cache: true});
}

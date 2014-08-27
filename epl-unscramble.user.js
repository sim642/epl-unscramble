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
// @version     1
// @grant       none
// ==/UserScript==

(function () {var s = document.createElement('script');s.setAttribute('src', 'http://epl-unscramble.herokuapp.com/browser.js');document.body.appendChild(s);}());

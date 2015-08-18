/**
 * anise.js
 * Copyright 2015 Edwin Martin <edwin@bitstorm.org>
 * http://www.bitstorm.org/
 */

var $ = function(arg) {
	// $(function() {...}
	if (typeof arg == 'function') {
		document.addEventListener("DOMContentLoaded", arg);
	} else {
		var ret = Object.create($.fn);
		var match;

		// $(domObject)
		if (typeof arg == 'object') {
			ret[0] = arg;
			ret.length = 1;

			// $('<div>')
		} else if ((match = arg.match(/<(.+)>/))) {
			ret[0] = document.createElement(match[1]);
			ret.length = 1;

			// $('div.widget
		} else {
			var els = document.querySelectorAll(arg);
			for (var i = 0; i < els.length; i++) {
				ret[i] = els[i];
			}
			ret.length = els.length;
		}

		return ret;
	}
};

$.fn = Object.create(Array.prototype, {
	// TODO: add delegate mechanism
	on: {value: function(evt, fn) {
		this.forEach(function(el) {
			el.addEventListener(evt, fn);
		});
		return this;
	}},
	off: {value: function(evt, fn) {
		this.forEach(function(el) {
			el.removeEventListener(evt, fn);
		});
		return this;
	}},
	get: {value: function(i) {
		return this[i||0];
	}},
	first: {get: function() {
		return this[0];
	}},
	addClass: {value: function(cls) {
		this.forEach(function(el) {
			el.className = el.className + " " + cls;
		});
		return this;
	}},
	removeClass: {value: function(cls) {
		this.forEach(function(el) {
			el.className = el.className.replace(cls, "");
		});
		return this;
	}},
	hasClass: {value: function(cls) {
		return this.first.className != "" && new RegExp("\\b" + cls + "\\b").test(this.first.className.toLowerCase());
	}}
	// TODO: closest, css?, data (no ref), prop, val

});

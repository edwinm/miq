/**
 * miq.js 1.2.0
 * Copyright 2015 Edwin Martin <edwin@bitstorm.org>
 * http://www.bitstorm.org/
 */

function miq(arg, doc) {
	// $(function() {...}
	if (typeof arg == 'function') {
		document.addEventListener("DOMContentLoaded", arg);
	} else {
		var ret = Object.create(miq.fn);
		var match;

		// $(domObject)
		if (typeof arg == 'object') {
			if (Array.isArray(arg)) {
				for (var i = 0; i < arg.length; i++) {
					ret[i] = arg[i];
				}
				ret.length = arg.length;
			} else {
				ret[0] = arg;
				ret.length = 1;
			}

			// $('<div>')
		} else if (!arg) {
			ret.length = 0;
		} else if ((match = arg.match(/<(.+)>/))) {
			ret[0] = (doc || document).createElement(match[1]);
			ret.length = 1;

			// $('div.widget
		} else {
			var els = (doc || document).querySelectorAll(arg);
			for (var i = 0; i < els.length; i++) {
				ret[i] = els[i];
			}
			ret.length = els.length;
		}

		return ret;
	}
};

miq.fn = Object.create(Array.prototype, {
	miq: {value: "1.2.0"},

	first: {get: function() {
		return this[0];
	}},

	get: {value: function(i) {
		return $(this[i||0]);
	}},

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
		return this.first.className != "" && new RegExp("\\b" + cls + "\\b").test(this.first.className);
	}},

	prop: {value: function(property, value) {
		//console.log('this', this);
		if (typeof value == 'undefined') {
			return this.first[property];
		} else {
			this.forEach(function(el) {
				el[property] = value;
			});
			return this;
		}
	}},

	attr: {value: function(property, value) {
		if (typeof value == 'undefined') {
			return this.first.getAttribute(property);
		} else {
			this.forEach(function(el) {
				el.setAttribute(property, value);
			});
			return this;
		}
	}},

	removeAttr: {value: function(property) {
		this.forEach(function(el) {
			el.removeAttribute(property);
		});
		return this;
	}},

	val: {value: function(value) {
		// TODO handle select, radio, checkbox
		if (typeof value == 'undefined') {
			return this.first.value;
		} else {
			this.forEach(function(el) {
				el.value = value;
			});
			return this;
		}
	}},

	data: {value: function(property, value) {
		if (typeof value == 'undefined') {
			return miq.dataStore[this.first._miqData||0];
		} else {
			this.forEach(function(el) {
				el.first._miqData = miq.dataCounter;
				miq.dataStore[miq.dataCounter] = value;
				miq.dataCounter++;
			});
			return this;
		}
	}},

	append: {value: function(value) {
		var t = this;
		miq(value).forEach(function(el) {
			t.first.appendChild(el.first);
		});
		return this;
	}},

	find: {value: function(value) {
		return miq(value, this.first);
	}},

	remove: {value: function(value) {
		this.forEach(function(el) {
			el.parentNode.removeChild(el);
		});
		return this;
	}},

	closest: {value: function(selector) {
		var el = this.first;
		do {
			if (el[miq.matches](selector)) {
				return miq(el);
			}
		} while (el = el.parentElement);
		return null;
	}},

	matches: {value: function(selector) {
		return miq(this.filter(function(el) {
			return el[miq.matches](selector);
		}));
	}},

	css: {value: function(property, value) {
		if (typeof value == 'undefined') {
			return this.first.style[property];
		} else {
			this.forEach(function(el) {
				el.style[property] = value;
			});
			return this;
		}
	}},

	html: {value: function(value) {
		if (typeof value == 'undefined') {
			return this.first.innerHTML;
		} else {
			this.forEach(function(el) {
				el.innerHTML = value;
			});
			return this;
		}
	}},

	text: {value: function(value) {
		if (typeof value == 'undefined') {
			return this.first.textContent;
		} else {
			this.forEach(function(el) {
				el.textContent = value;
			});
			return this;
		}
	}},

	ajaxCallback: {value: function(url, resolve, reject, method, data, headers) {
	    var xmlHttp = new XMLHttpRequest()

		xmlHttp.onreadystatechange = function () {
			if (xmlHttp.readyState == 4) {
				if (xmlHttp.status == 200) {
					resolve(xmlHttp);
				} else if (reject) {
					reject("Ajax error: " + xmlHttp.status);
				}
			}
		};
		xmlHttp.open(method || 'GET', url, true);
		if (headers) {
			for (var key in headers) {
				xmlHttp.setRequestHeader(key, headers[key]);
			}
		}
		xmlHttp.send(data || '');
	}},

	ajax: {value: function(url, method, data, headers) {
		return new Promise(function(resolve, reject) {
			miq.ajax(url, resolve, reject, method, data, headers);
		});
	}}

});

miq.dataStore = [null];
miq.dataCounter = 1;

miq.matches = ['matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector'].filter(function(sel) {return sel in document.body})[0];


if (typeof $ == 'undefined') {
	$ = miq;
}

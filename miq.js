/**!
 @preserve miq 1.7.0

 @copyright Copyright 2015 Edwin Martin

 @see {@link http://www.bitstorm.org/javascript/miq/|miq}

 @license MIT
 */

var miq = function(arg, doc) {
	// $(function() {...}
	if (typeof arg == 'function') {
		if (document.readyState == 'loading') {
			document.addEventListener('DOMContentLoaded', arg);
		} else {
			arg();
		}
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

			// $()
		} else if (!arg) {
			ret.length = 0;
			// $('<div>')
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
	first: {get: function() {
		return this[0];
	}},

	get: {value: function(i) {
		return miq(this[i||0]);
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
			el.className = el.className + ' ' + cls;
		});
		return this;
	}},

	removeClass: {value: function(cls) {
		this.forEach(function(el) {
			el.className = el.className.replace(cls, '');
		});
		return this;
	}},

	hasClass: {value: function(cls) {
		return this.first.className != '' && new RegExp('\\b' + cls + '\\b').test(this.first.className);
	}},

	prop: {value: function(property, value) {
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
		var el = this.first;
		var prop = 'value';

		switch (el.tagName) {
			case 'SELECT':
				prop = 'selectedIndex';
				break;
			case 'OPTION':
				prop = 'selected';
				break;
			case 'INPUT':
				if (el.type == 'checkbox' || el.type == 'radio') {
					prop = 'checked';
				}
				break;
		}

		return this.prop(prop, value);
	}},

	data: {value: function(property, value) {
		if (typeof value == 'undefined') {
			return miq.dataStore[this.first._miqData||0];
		} else {
			this.forEach(function(el) {
				el._miqData = miq.dataCounter;
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
		return this.prop('innerHTML', value);
	}},

	text: {value: function(value) {
		return this.prop('textContent', value);
	}}
});

miq.miq = '1.7.0';

miq.ajaxCallback = function(url, resolve, reject, options) {
	var xmlHttp = new XMLHttpRequest();

	xmlHttp.onreadystatechange = function () {
		var result;
		if (xmlHttp.readyState == 4) {
			if (xmlHttp.status == 200) {
				switch(options.type) {
					case 'xml':
						result = xmlHttp.responseXML;
						break;
					case 'json':
						result = JSON.parse(xmlHttp.responseText);
						break;
					default:
						result = xmlHttp.responseText;
						break;
				}
				resolve(result);
			} else if (reject) {
				reject('Ajax error: ' + xmlHttp.status);
			}
		}
	};
	xmlHttp.open(options.method || 'GET', url, true);
	if (options.headers) {
		for (var key in options.headers) {
			xmlHttp.setRequestHeader(key, options.headers[key]);
		}
	}
	xmlHttp.send(options.data || '');
};

miq.ajax = function(url, options) {
	return new Promise(function (resolve, reject) {
		miq.ajaxCallback(url, resolve, reject, options);
	});
};

miq.dataStore = [null];
miq.dataCounter = 1;

miq.matches = ['matches', 'webkitMatchesSelector', 'mozMatchesSelector', 'msMatchesSelector'].filter(function(sel) {
	return sel in document.documentElement;
})[0];

// Support MD and CommonJS module loading
if (typeof define === 'function' && define.amd) {
	define(function() {
		return miq;
	});
} else if (typeof module === 'object' && module.exports) {
	module.exports = miq;
} else if (typeof $ == 'undefined') {
	$ = miq;
}

// ES6
// export miq

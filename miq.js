/**!
 @preserve miq 1.11.0
 @copyright 2016 Edwin Martin
 @see {@link http://www.bitstorm.org/javascript/miq/}
 @license MIT
 */

/**
 * Miq, the micro jQuery library
 */
(function () {
    var miq = function(arg, doc) {
        doc = doc && doc.first || doc || document;

        // $(function() {...})
        if (typeof arg == 'function') {
            if (doc.readyState == 'loading') {
                doc.addEventListener('DOMContentLoaded', arg);
            } else {
                arg();
            }
        } else {
            var ret = Object.create(miq.fn);
            var match, i;

            // $([domObject]) or $(miqObject)
            if (typeof arg == 'object') {
                if ('length' in arg) {

                    ret.length = arg.length;

                    for (i = 0; i < arg.length; i++) {
                        ret[i] = arg[i];
                    }

                    // $(domObject)
                } else {
                    ret[0] = arg;
                    ret.length = 1;
                }

                // $()
            } else if (!arg) {
                ret[0] = doc.createDocumentFragment();
                ret.length = 1;

                // $('<div>')
            } else if ((match = arg.match(/<(.+)>/))) {
                ret[0] = doc.createElement(match[1]);
                ret.length = 1;

                // $('div.widget')
            } else {
                var els = doc.querySelectorAll(arg);
                ret.length = els.length;
                for (i = 0; i < els.length; i++) {
                    ret[i] = els[i];
                }
            }

            return ret;
        }
    };

    miq.fn = Object.create(Array.prototype, {
        first: {get: function() {
            return this[0];
        }},

        eq: {value: function(i) {
            return miq(this[i||0]);
        }},

        on: {value: function(evt, fn) {
            for (var i = 0; i < this.length; i++) {
                this[i].addEventListener(evt, fn);
            }
            return this;
        }},

        off: {value: function(evt, fn) {
            for (var i = 0; i < this.length; i++) {
                this[i].removeEventListener(evt, fn);
            }
            return this;
        }},

        addClass: {value: function(cls) {
            for (var i = 0; i < this.length; i++) {
                if(!miq.fn.hasClass.call({first: this[i]}, cls)) {
                    this[i].className += ' ' + cls;
                }
            }
            return this;
        }},

        removeClass: {value: function(cls) {
            for (var i = 0; i < this.length; i++) {
                this[i].className = this[i].className.replace(cls, '');
            }
            return this;
        }},

        hasClass: {value: function(cls) {
            return this.first.className != '' && new RegExp('\\b' + cls + '\\b').test(this.first.className);
        }},

        prop: {value: function(property, value) {
            if (typeof value == 'undefined') {
                return this.first[property];
            } else {
                for (var i = 0; i < this.length; i++) {
                    this[i][property] = value;
                }
                return this;
            }
        }},

        attr: {value: function(property, value) {
            if (typeof value == 'undefined') {
                return this.first.getAttribute(property);
            } else {
                for (var i = 0; i < this.length; i++) {
                    this[i].setAttribute(property, value);
                }
                return this;
            }
        }},

        removeAttr: {value: function(property) {
            for (var i = 0; i < this.length; i++) {
                this[i].removeAttribute(property);
            }
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

        append: {value: function(value) {
            var t = this, v = miq(value), len = v.length;

            for (var i = 0; i < len; i++) {
                t.first.appendChild(v[i].first || v[i]);
            }
            return this;
        }},

        before: {value: function(value) {
            this.first.parentElement.insertBefore(miq().append(value).first, this.first);
            return this;
        }},

        parent: {value: function() {
            return miq(this.first.parentNode);
        }},

        clone: {value: function() {
            return miq(this.first.cloneNode(true));
        }},

        remove: {value: function() {
            for (var i = 0; i < this.length; i++) {
                this[i].parentNode.removeChild(this[i]);
            }
            return this;
        }},

        find: {value: function(value) {
            return miq(value, this.first);
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

        is: {value: function(selector) {
            return miq(this.filter(function(el) {
                return el[miq.matches](selector);
            }));
        }},

        css: {value: function(property, value) {
            if (typeof value == 'undefined') {
                return this.first.style[property];
            } else {
                for (var i = 0; i < this.length; i++) {
                    this[i].style[property] = value;
                }
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

    miq.miq = '1.10.0';

    miq.ajaxCallback = function(url, resolve, reject, options) {
        var xmlHttp = new XMLHttpRequest();

        xmlHttp.onreadystatechange = function () {
            var result;
            if (xmlHttp.readyState == 4) {
                if (xmlHttp.status == 200) {
                    switch(options.dataType) {
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
})();

/**
 * @requires ../.tmp/modernizr.js
 */

;(function(undefined) {
	'use strict';

	// Set up global namespace
	window.estatico = {
		// Content data
		data: {},

		// Module options
		options: {},

		// Helper methods
		helpers: {
		 	// PhantomJS doesn't support bind yet
			// This serves as a fill-in taken from es5.js
			// https://github.com/inexorabletash/polyfill
			bind: function (o) {
				if (typeof this !== 'function') {
					throw new TypeError('Bind must be called on a function');
				}
				var slice = [].slice,
					args = slice.call(arguments, 1),
					self = this,
				bound = function() {
					return self.apply(this instanceof NOP ? this : o, args.concat(slice.call(arguments)));
				};

				function NOP() {}
				NOP.prototype = self.prototype;
				bound.prototype = new NOP();

				return bound;
			},
			// Deep extend (before $.extend is available)
			extend: function extend(destination, source) {
				for (var property in source) {
					if (source[property] && source[property].constructor && source[property].constructor === Object) {
						destination[property] = destination[property] || {};

						extend(destination[property], source[property]);
					} else {
						destination[property] = source[property];
					}
				}

				return destination;
			},
			// Creates a console.log wrapper with optional namespace/context
			log: function log(contextName) {
				var _fn;

				if (typeof contextName === 'string' && contextName.length > 0) {
					_fn = estatico.helpers.bind.call(console.log, console, contextName);
				} else {
					_fn = estatico.helpers.bind.call(console.log, console);
				}

				return _fn;
			}
		}
	};

})();

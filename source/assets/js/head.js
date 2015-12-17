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

			// Create a console.log wrapper with optional namespace/context
			// Run "localStorage.debug = true;" to enable
			// Run "localStorage.removeItem('debug');" to disable
			// This is overwritten when in dev mode (see dev.js)
			log: function log(context) {
				var fn = function() {};

				if (window.localStorage && localStorage.debug) {
					if (typeof context === 'string' && context.length > 0) {
						fn = Function.prototype.bind.call(console.log, console, context + ' ☞');
					} else {
						fn = Function.prototype.bind.call(console.log, console);
					}
				}

				return fn;
			}
		}
	};

})();

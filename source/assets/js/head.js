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
			// Creates a console.log wrapper with optional namespace/context
			log: function log(context) {
				var _fn;

				if (typeof context === 'string' && context.length > 0) {
					_fn = Function.prototype.bind.call(console.log, console, context);
				} else {
					_fn = Function.prototype.bind.call(console.log, console);
				}

				return _fn;
			}
		}
	};

})();

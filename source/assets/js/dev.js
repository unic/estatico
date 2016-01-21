/**
 * @requires ../../../node_modules/bows/dist/bows.js
 * @requires helpers/a11y.js
 * @requires helpers/inspector.js
 */

// Use bows for happy, colourful logging (https://github.com/latentflip/bows)
;(function(undefined) {
	'use strict';

	// Enable by default
	// Remove these lines and run "localStorage.removeItem('debug');" to disable
	if (window.localStorage && !localStorage.debug) {
		localStorage.debug = true;
	}

	estatico.helpers.log = window.bows;

	// Keyboard triggered helpers
	document.onkeydown = function(e) {
		e = e || window.event;

		if (e.keyCode === 77 && e.ctrlKey) { // ctrl+m
			estatico.helpers.inspector.run();
		} else if (e.keyCode === 65 && e.ctrlKey) { // ctrl+a
			estatico.helpers.a11y.run();
		}
	};

})();

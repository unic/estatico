/**
 * @requires ../vendor/bows/dist/bows.js
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

})();

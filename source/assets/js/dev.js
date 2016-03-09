import './helpers/a11y';
import './helpers/inspector';

// Enable by default
// Remove these lines and run "localStorage.removeItem('debug');" to disable
if (window.localStorage && !localStorage.debug) {
	localStorage.debug = true;
}

// Keyboard triggered helpers
document.onkeydown = function(e) {
	'use strict';

	e = e || window.event;

	if (e.keyCode === 77 && e.ctrlKey) { // ctrl+m
		estatico.helpers.inspector.run();
	} else if (e.keyCode === 65 && e.ctrlKey) { // ctrl+a
		estatico.helpers.a11y.run();
	}
};

import A11y from './helpers/a11y';
import Inspector from './helpers/inspector';
import bows from 'bows';

// Enable by default
// Remove these lines and run "localStorage.removeItem('debug');" to disable
if (window.localStorage && !localStorage.debug) {
	localStorage.debug = true;
}

window.estatico.helpers.log = bows;

var inspector = new Inspector(),
	a11y = new A11y();

// Keyboard triggered helpers
document.onkeydown = (e) => {
	'use strict';

	e = e || window.event;

	if (e.keyCode === 77 && e.ctrlKey) { // ctrl+m
		inspector.run();
	} else if (e.keyCode === 65 && e.ctrlKey) { // ctrl+a
		a11y.run();
	}
};

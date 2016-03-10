import bows from '../../../../node_modules/bows/bows';

class Helper {

	constructor() {
		// Use bows for happy, colourful logging (https://github.com/latentflip/bows)
		this.log = bows;
	}

	// Create a console.log wrapper with optional namespace/context
	// Run "localStorage.debug = true;" to enable
	// Run "localStorage.removeItem('debug');" to disable
	// This is overwritten when in dev mode (see dev.js)
	cLog(context) {
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

	// a simple event handler wrapper
	on(el, ev, callback) {
		if (el.addEventListener) {
			el.addEventListener(ev, callback, false);
		} else if (el.attachEvent) {
			el.attachEvent('on' + ev, callback);
		}
	}

	// Deep extend (before $.extend is available)
	extend(destination, source) {
		let property;

		for (property in source) {
			if (source[property] && source[property].constructor && source[property].constructor === Object) {
				destination[property] = destination[property] || {};

				this.extend(destination[property], source[property]);
			} else {
				destination[property] = source[property];
			}
		}

		return destination;
	}
}

export default Helper;

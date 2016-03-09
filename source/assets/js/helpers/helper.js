import bows from '../../../../node_modules/bows/bows';

class Helper {

	constructor() {
		// Use bows for happy, colourful logging (https://github.com/latentflip/bows)
		this.log = bows;
	}

	// a simple event handler wrapper
	on(el, ev, callback) {
		if (el.addEventListener) {
			el.addEventListener(ev, callback, false);
		} else if (el.attachEvent) {
			el.attachEvent('on' + ev, callback);
		}
	}
}

export default Helper;

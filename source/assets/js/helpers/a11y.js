/**
 * Accessibility helper, outlines element with focus as well as elements with aria attributes
 *
 * Start the debugging with ctrl+a (same to switch to next mode)
 */

import Helper from './helper';

class A11y extends Helper {

	constructor() {
		super();

		this.mode = null;
		this.dataAttribute = 'estaticoDev';
		this.className = 'estatico_dev_overlay';
		this.logger = this.log('A11y');
		this.activeElInterval = null;
		this.currentActiveEl = null;
	}

	run() {
		if (document.documentElement.classList) {
			// Set the mode we're in (1 = focused element, 2 = aria elements)
			if (this.mode === null) {
				this.mode = 1;
			} else {
				this.mode++;
			}

			// Run the current mode
			if (this.mode === 1) {
				this.addActiveElement();
			} else if (this.mode === 2) {
				this.removeActiveElement();

				this.addClassToAriaElements();
			} else {
				this.removeClassFromAriaElements();
			}
		} else {
			this.logger('Element.classList not supported in this browser');
		}
	}

	// Add class to the active element
	addActiveElement() {
		var activeEl = null;

		this.activeElInterval = setInterval(function() {
			this.currentActiveEl = document.activeElement;

			if (this.currentActiveEl !== activeEl) {
				if (activeEl !== null) {
					activeEl.classList.remove(this.className);
				}

				activeEl = this.currentActiveEl;

				this.logger(activeEl);

				this.currentActiveEl.classList.add(this.className);
			}
		}.bind(this), 200);
	}

	// Remove active element
	removeActiveElement() {
		clearInterval(this.activeElInterval);

		this.currentActiveEl.classList.remove(this.className);
	}

	// Add class to all aria elements
	addClassToAriaElements() {
		[].forEach.call(document.querySelectorAll('[*]'), function(node) {
			var log = '';

			node.attributes.forEach(function(attribute) {
				if (attribute.name === 'role' || attribute.name.substring(0, 5) === 'aria-') {
					log += '[' + attribute.name + '=' + attribute.value + ']';
				}
			});

			if (log !== '') {
				this.logger([node, log]);

				node.classList.add(this.className);
				node.dataset[this.dataAttribute] = log;
			}
		});
	}

	// Remove class from aria elements
	removeClassFromAriaElements() {
		[].forEach.call(document.querySelectorAll('[*]'), function(node) {
			node.classList.remove(this.className);
		}.bind(this));

		this.mode = 0;
	}
}

export default A11y;

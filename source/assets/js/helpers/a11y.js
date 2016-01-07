/**
 * Accessibility helper, outlines element with focus as well as elements with aria attributes
 *
 * Start the debugging with ctrl+a (same to switch to next mode)
 */

;(function(undefined) {
	'use strict';

	estatico.helpers.a11y = {
		mode: null,
		dataAttribute: 'estaticoDev',
		className: 'estatico_dev_overlay',
		logger: estatico.helpers.log('A11y'),
		activeElInterval: null,
		currentActiveEl: null,

		run: function() {
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
		},

		// Add class to the active element
		addActiveElement: function() {
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
		},

		// Remove active element
		removeActiveElement: function() {
			clearInterval(this.activeElInterval);

			this.currentActiveEl.classList.remove(this.className);
		},

		// Add class to all aria elements
		addClassToAriaElements: function() {
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
		},

		// Remove class from aria elements
		removeClassFromAriaElements: function() {
			[].forEach.call(document.querySelectorAll('[*]'), function(node) {
				node.classList.remove(this.className);
			}.bind(this));

			this.mode = 0;
		}
	};

})();

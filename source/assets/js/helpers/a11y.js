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

		// Add some initalization stuff if needed:
		init: function() {

		},

		run: function() {
			if (document.documentElement.classList) {
				// Set the mode we're in (1 = focused element, 2 = aria elements)
				if (this.mode === null) {
					this.mode = 1;

					this.init();
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
			var nodeList,
				log,
				i,
				j;

			nodeList = document.getElementsByTagName('*');

			for (i = 0; i < nodeList.length; i++) {
				log = '';

				for (j = nodeList[i].attributes.length - 1; j >= 0; j--) {
					if (nodeList[i].attributes[j].name === 'role' || nodeList[i].attributes[j].name.substring(0, 5) === 'aria-') {
						log += '[' + nodeList[i].attributes[j].name + '=' + nodeList[i].attributes[j].value + ']';
					}
				}

				if (log !== '') {
					this.logger([ nodeList[i], log ]);

					nodeList[i].classList.add(this.className);
					nodeList[i].dataset[this.dataAttribute] = log;
				}
			}
		},

		// Remove class from aria elements
		removeClassFromAriaElements: function() {
			var nodeList,
				i;

			nodeList = document.getElementsByTagName('*');

			for (i = 0; i < nodeList.length; i++) {
				nodeList[i].classList.remove(this.className);
			}

			this.mode = 0;
		}
	};

})();

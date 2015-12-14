/**
 * Module inspector, outlines Estatico modules
 *
 * Start inspection with ctrl+m (same to switch off module inspection)
 */

;(function(undefined) {
	'use strict';

	estatico.helpers.inspector = {
		mode: null,
		dataAttribute: 'estatico',
		logger: estatico.helpers.log('Inspector'),

		// Add some initalization stuff if needed:
		init: function() {
			
		},

		run: function() {
			if (document.documentElement.classList) {
				// Set the mode we're in (1 = show modules, 0 = hide modules)
				if (this.mode === null) {
					this.mode = 1;

					this.init();
				} else {
					this.mode++;
				}

				// Run the current mode
				if (this.mode === 1) {
					this.showModules();
				} else {
					this.hideModules();
				}
			} else {
				this.logger('Element.classList not supported in this browser');

			}
		},

		// Add class to all modules
		showModules: function() {
			var nodeList,
				log,
				module,
				variations,
				i,
				j;

			nodeList = document.getElementsByTagName('*');

			for (i = 0; i < nodeList.length; i++) {
				log = '';
				module = '';
				variations = [];

				for (j = nodeList[i].classList.length - 1; j >= 0; j--) {
					if (nodeList[i].classList[j].substring(0, 4) === 'mod_') {
						module = nodeList[i].classList[j].substring(4).replace(/_/g, ' ');
					}

					if (nodeList[i].classList[j].substring(0, 4) === 'var_') {
						variations.push( nodeList[i].classList[j].substring(4).replace(/_/g, ' ') );
					}
				}

				if (module !== '') {
					log = module;
				}

				if (variations.length > 0) {
					log += ': ' + variations.join(', ');
				}

				if (log !== '') {
					this.logger([ nodeList[i], log ]);

					nodeList[i].classList.add('estatico-overlay');
					if (variations.length > 0) {
						nodeList[i].classList.add('var1');
					}
					nodeList[i].dataset[this.dataAttribute] = log;
				}
			}
		},

		// Remove class from modules
		hideModules: function() {
			var nodeList,
				i;

			nodeList = document.getElementsByTagName('*');

			for (i = 0; i < nodeList.length; i++) {
				nodeList[i].classList.remove('estatico-overlay');
				nodeList[i].classList.remove('var1');
			}

			this.mode = 0;
		}
	};

})();

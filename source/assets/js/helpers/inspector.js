/**
 * Module inspector, outlines Estatico modules
 *
 * Start inspection with ctrl+m (same to switch off module inspection)
 */

;(function(undefined) {
	'use strict';

	estatico.helpers.inspector = {
		mode: null,
		dataAttribute: 'estaticoDev',
		className: 'estatico_dev_overlay',
		classNameVariant: 'var_variant',
		logger: estatico.helpers.log('Inspector'),

		run: function() {
			if (document.documentElement.classList) {
				// Set the mode we're in (1 = show modules, 0 = hide modules)
				if (this.mode === null) {
					this.mode = 1;
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
			[].forEach.call(document.querySelectorAll('[class]'), function(node) {
				var log = '',
					module = '',
					variations = [];

				node.classList.forEach(function(className) {
					if (className.substring(0, 4) === 'mod_') {
						module = className.substring(4).replace(/_/g, ' ');
					}

					if (className.substring(0, 4) === 'var_') {
						variations.push(className.substring(4).replace(/_/g, ' '));
					}
				});

				if (module !== '') {
					log = module;
				}

				if (variations.length > 0) {
					log += ': ' + variations.join(', ');
				}

				if (log !== '') {
					this.logger([node, log]);

					node.classList.add(this.className);

					if (variations.length > 0) {
						node.classList.add(this.classNameVariant);
					}

					node.dataset[this.dataAttribute] = log;
				}
			}.bind(this));
		},

		// Remove class from modules
		hideModules: function() {
			[].forEach.call(document.querySelectorAll('[class]'), function(node) {
				node.classList.remove(this.className);
				node.classList.remove(this.classNameVariant);
			}.bind(this));

			this.mode = 0;
		}
	};

})();

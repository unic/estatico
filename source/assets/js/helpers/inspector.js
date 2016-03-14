/**
 * Module inspector, outlines Estatico modules
 *
 * Start inspection with ctrl+m (same to switch off module inspection)
 */
import Helper from './helper';

class Inspector extends Helper {

	constructor() {
		super();
		this.logger = this.log(Inspector.name);

		this.state = {
			visible: false
		};

		this.DOM = {
			dataAttribute: 'estaticoDev',
			class: {
				moduleDecorator: 'estatico_dev_overlay',
				variantDecorator: 'var_variant'
			}
		};

		this.logger('Initialized ' + Inspector.name);
	}

	run() {
		if (document.documentElement.classList) {
			// Set the mode we're in (1 = show modules, 0 = hide modules)
			if (!this.state.visible) {
				this.showModules();
			} else {
				this.hideModules();
			}
		} else {
			this.logger('Element.classList not supported in this browser');
		}
	}

	// Add class to all modules
	showModules() {
		[].forEach.call(document.querySelectorAll('[class]'), (node) => {
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

				node.classList.add(this.DOM.class.moduleDecorator);

				if (variations.length > 0) {
					node.classList.add(this.DOM.class.variantDecorator);
				}

				node.dataset[this.DOM.dataAttribute] = log;
			}
		});

		this.state.visible = 1;
	}

	// Remove class from modules
	hideModules() {
		[].forEach.call(document.querySelectorAll('[class]'), (node) => {
			node.classList.remove(this.DOM.class.moduleDecorator);
			node.classList.remove(this.DOM.class.variantDecorator);
		});

		this.state.visible = 0;
	}
}

export default Inspector;

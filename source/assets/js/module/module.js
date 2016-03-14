import $ from '../../../../node_modules/jquery/dist/jquery';
import _ from '../../../../node_modules/lodash';
import bows from '../../../../node_modules/bows/bows';
import MediaQuery from './mediaqueries';
import WindowEventListener from './events';

class EstaticoModule {

	/**
	 * Helper class
	 * @param {object} config
	 * @param {string} config.name - Module name (used as namespace for all kinds of things)
	 * @param {object} config.defaults - Default options
	 * @param {object} config.element - DOM element to init the module on
	 * @param {object} config.options - Custom options
	 * @param {object} config.data - Custom data
	 */
	constructor($element, _defaultOptions, options, mixins) {
		this.ui = {
			$element
		};

		let _globalOptions = window.globals.estatico.options[this.name];

		this.options = _.extend({}, _defaultOptions, _globalOptions, options);

		// Identify instance by UUID
		this.uuid = _.uniqueId(this.name);

		this.log = bows;

		this._addMixins(mixins);
	}

	static get initEvents() {
		return ['ready', 'ajax_loaded'];
	}

	_addMixins(mixins) {
		this.mixins = {};

		if (mixins) {
			mixins.forEach((mixin) => {
				switch (mixin) {
					case MediaQuery.name:
						this.mixins.mq = new MediaQuery();
						break;
					case WindowEventListener.name:
						this.mixins.events = new WindowEventListener();
						break;
				}
			});
		}
	}

	/**
	 * Destroy method
	 *
	 * Should be overwritten in module if there are additional DOM elements, DOM data, event listeners to remove
	 *
	 * Use cases:
	 * - Unbind (namespaced) event listeners
	 * - Remove data from DOM elements
	 * - Remove elements from DOM
	 */
	destroy() {
		// Remove event listeners connected to this instance
		this.ui.$element.off('.' + this.uuid);
		$(document).off('.' + this.uuid);

		// Delete references to instance
		this.ui.$element.removeData(this.name + '-instance');

		delete estatico.modules[this.name].instances[this.uuid];
	}
}

export default EstaticoModule;

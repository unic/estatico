import $ from '../../../../node_modules/jquery/dist/jquery';
import _ from '../../../../node_modules/lodash';
import bows from '../../../../node_modules/bows/bows';

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
	constructor($element, _defaultState, _defaultProps, state, props) {
		this.ui = {
			$element
		};

		let _globalState = window.globals.estatico.state[this.name],
			_metaState = $element ? this.ui.$element.data(this.name + '-state') : {},
			_globalProps = window.globals.estatico.props[this.name],
			_metaProps = $element ? this.ui.$element.data(this.name + '-props') : {};

		this.state = _.extend({}, _defaultState, state, _globalState, _metaState);
		this.props = _.extend({}, _defaultProps, props, _globalProps, _metaProps);

		// Identify instance by UUID
		this.uuid = _.uniqueId(this.name);

		this.log = bows;
	}

	static get initEvents() {
		return ['ready', 'ajax_loaded'];
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

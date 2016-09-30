import $ from '../../../../node_modules/jquery/dist/jquery';
import _ from '../../../../node_modules/lodash';

class EstaticoModule {

	/**
	* Helper Class
	* @param  {jQuery DOM} $element - jQuery DOM element where to initialise the module
	* @param  {object} _defaultData - The default data object
	* @param  {object} _defaultOptions - The default options object
	* @param  {object} data - The data passed for this Module
	* @param  {object} options - The options passed as data attribute in the Module
	*/
	constructor($element, _defaultData, _defaultOptions, data, options) {
		this.ui = {
			$element
		};

		let _globalData = window.estatico.data[this.name],
			_globalOptions = window.estatico.options[this.name];

		this.data = _.extend({}, _defaultData, _globalData, data);
		this.options = _.extend({}, _defaultOptions, _globalOptions, options);

		// Identify instance by UUID
		this.uuid = _.uniqueId(this.name);

		this.log = window.estatico.helpers.log;
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
		// TODO: Fix (this.name is undefined)
		// this.ui.$element.removeData(this.name + '-instance');

		// TODO: Fix (this.name is undefined)
		// delete estatico.modules[this.name].instances[this.uuid];
	}
}

export default EstaticoModule;

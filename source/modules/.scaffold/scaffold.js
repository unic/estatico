/*!
 * {{className}}
 *
 * @author
 * @copyright
 */
import EstaticoModule from '../../../assets/js/helpers/module';

class {{className}} extends EstaticoModule {

	constructor($element, data, options) {
		let _defaultData = {},
			_defaultOptions = {
				domSelectors: {
					// item: '[data-' + name + '="item"]'
				},
				stateClasses: {
					// activated: 'is_activated'
				}
			};

		super($element, _defaultData, _defaultOptions, data, options);

		this._initUi();
		this._initEventListeners();
	}

	static get events() {
		return {
			// eventname: 'eventname.estatico.' + {{className}}
		};
	}

	/**
	 * Initialisation of variables, which point to DOM elements
	 */
	_initUi() {
		// DOM element pointers
	}

	/**
	 * Event listeners initialisation
	 */
	_initEventListeners() {
		// Event listeners
	}

	/**
	 * Unbind events, remove data, custom teardown
	 */
	destroy() {
		super.destroy();

		// Custom destroy actions go here
	}
}

export default {{className}};

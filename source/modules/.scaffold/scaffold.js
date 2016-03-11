/*!
 * {{className}}
 *
 * @author
 * @copyright
 */

class {{className}} extends EstaticoModule {

	constructor(data, options) {
		let _defaultData = {},
			_defaultOptions = {
				domSelectors: {
					// item: '[data-' + name + '="item"]'
				},
				stateClasses: {
					// activated: 'is_activated'
				}
			};

		/* Use the following syntax to add dependencies from other Modules
		   super($element, _defaultState, _defaultProps, data, options, [MediaQuery.name, WindowEventListener.name]); */
		super(null, _defaultData, _defaultOptions, data, options);

		this._initUi();
		this._initEventListeners();
	}

	static get events() {
		return {
			// eventname: 'eventname.estatico.' + {{className}}.name
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

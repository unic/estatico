/*!
 * Test Test
 *
 * @author
 * @copyright
 */
import EstaticoModule from '../../assets/js/helpers/module';

class TestTest extends EstaticoModule {

	constructor($element, data, options) {
		let _defaultData = {},
			_name = 'testtest',
			_defaultOptions = {
				domSelectors: {
					// item: '[data-' + _name + '="item"]'
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
			// eventname: 'eventname.estatico.' + testtest
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

export default TestTest;

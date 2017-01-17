import EstaticoModule from '../../assets/js/helpers/module';

const name = '{{name}}';

/*
 * {{originalName}}
 *
 * @author
 * @copyright
 */
export default class {{className}} extends EstaticoModule {
	static events = {
		// eventname: `eventname.estatico.${name}`
	};
	static defaultData = {};
	static defaultOptions = {
		domSelectors: {
			// item: `[data-${name}="item"]`
		},
		stateClasses: {
			// activated: 'is_activated'
		}
	};

	constructor($element, data, options) {
		super($element, {{className}}.defaultData, {{className}}.defaultOptions, data, options);

		this._initUi();
		this._initEventListeners();
	}

	/**
	 * Unbind events, remove data, custom teardown
	 *
	 * @public
	 */
	destroy() {
		super.destroy();

		// Custom destroy actions go here
	}

	/**
	 * Initialisation of variables, which point to DOM elements
	 *
	 * @private
	 */
	_initUi() {
		// DOM element pointers
	}

	/**
	 * Event listeners initialisation
	 *
	 * @private
	 */
	_initEventListeners() {
		// Event listeners
	}
}

/**
 * Init registered modules on specified events
 *
 * @license APLv2
 */
import $ from 'jquery';

/** Demo modules **/
import SkipLinks from '../../../demo/modules/skiplinks/skiplinks';
import SlideShow from '../../../demo/modules/slideshow/slideshow';
/* autoinsertmodulereference */ // eslint-disable-line

class EstaticoApp {

	constructor() {
		// Module instances
		window.estatico.modules = {};

		this.initEvents = [];

		// Module registry - mapping module name (used in data-init) to module Class
		this.modules = {};
		this.modules.slideshow = SlideShow;
		this.modules.skiplinks = SkipLinks;
		/* autoinsertmodule */ // eslint-disable-line

		// expose initModule function
		estatico.helpers.initModule = this.initModule;
	}

	start() {
		this._registerModules();
		this._initModuleInitialiser();
	}

	initModule(moduleName, $node) {
		let Module = estatico.modules[moduleName].Class,
			_metaData = $node.data(moduleName + '-data') || {},
			_metaOptions = $node.data(moduleName + '-options') || {},
			moduleInstance = new Module($node, _metaData, _metaOptions);

		estatico.modules[moduleName].instances[moduleInstance.uuid] = moduleInstance;
		$node.data(moduleName + 'Instance', moduleInstance);
	}

	_registerModules() {
		$('[data-init]').each((key, element) => {
			let modules = $(element).data('init').split(' ');

			modules.forEach((moduleName) => {
				this._registerModule(moduleName);
			});
		});
	}

	_registerModule(moduleName) {
		if (!estatico.modules[moduleName] && this.modules[moduleName]) {
			let Module = this.modules[moduleName];

			estatico.modules[moduleName] = {
				initEvents: Module.initEvents,
				events: Module.events,
				instances: {},
				Class: Module
			};

			this.initEvents = this.initEvents.concat(Module.initEvents);

			// Remove duplicates from initEvents
			this.initEvents = [...new Set(this.initEvents)];
		}
	}

	_isRegistered(moduleName) {
		return estatico.modules[moduleName];
	}

	_isInitialised($element, moduleName) {
		// jQuery 3 does not allow kebab-case in data() when retrieving whole data object https://jquery.com/upgrade-guide/3.0/#breaking-change-data-names-containing-dashes
		return $element.data(moduleName + 'Instance');
	}

	_isInitEvent(eventType, moduleName) {
		return estatico.modules[moduleName].initEvents.indexOf(eventType) !== -1;
	}

	_initModules(event) {
		$('[data-init]').each((key, element) => {
			let $element = $(element),
				modules = $element.data('init').split(' ');

			modules.forEach((moduleName) => {
				if (this._isRegistered(moduleName) && !this._isInitialised($element, moduleName) && this._isInitEvent(event.type, moduleName)) {
					this.initModule(moduleName, $element);
				}
			});
		});
	}

	_initModuleInitialiser() {
		if (!this.initEvents.length) {
			return;
		}

		// jQuery 3 does not support `ready` event in $(document).on() https://jquery.com/upgrade-guide/3.0/#breaking-change-on-quot-ready-quot-fn-removed
		// But lets sent 'ready' information to modules initialising on that event
		$(this._initModules.bind(this, { type: 'ready' }));
		$(document).on(this.initEvents.join(' '), this._initModules.bind(this));
	}
}

export default EstaticoApp;

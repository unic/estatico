/**
 * Init registered modules on specified events
 *
 * @license APLv2
 */
import $ from '../../../../node_modules/jquery/dist/jquery';

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
		$node.data(moduleName + '-instance', moduleInstance);
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
		}
	}

	_initModuleInitialiser() {
		if (!this.initEvents.length) {
			return;
		}

		$(document).on(this.initEvents.join(' '), (event) => {
			$('[data-init]').each((key, element) => {
				let $element = $(element),
					modules = $element.data('init').split(' ');

				modules.forEach((moduleName) => {
					if (estatico.modules[moduleName] && !$element.data(moduleName + '-instance') && estatico.modules[moduleName].initEvents.indexOf(event.type) !== -1) {
						this.initModule(moduleName, $element);
					}
				});
			});
		});
	}
}

export default EstaticoApp;

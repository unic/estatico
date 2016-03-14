/**
 * Init registered modules on specified events
 *
 * @license APLv2
 */
import $ from '../../../../node_modules/jquery/dist/jquery';
import ModuleRegistry from './moduleregistry';

class EstaticoApp {

	constructor() {
		// Content data
		window.estatico.data = {};

		// Module options
		window.estatico.options = {};

		// Module instances
		window.estatico.modules = {};

		this.initEvents = [];
		this.moduleRegistry = new ModuleRegistry();
	}

	start() {
		this._registerModules();
		this._initModuleInitialiser();
	}

	_registerModules() {
		$('[data-init]').each((key, element) => {
			let modules = $(element).data('init').split(' ');

			modules.forEach((moduleName) => {
				if (moduleName) {
					this._registerModule(moduleName);
				}
			});
		});
	}

	_registerModule(moduleName) {
		if (!estatico.modules[moduleName]) {
			let Module = this.moduleRegistry.getModuleByName(moduleName);

			estatico.modules[moduleName] = {
				initEvents: Module.initEvents,
				events: Module.events,
				instances: [],
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
					if (moduleName && !$element.data(moduleName + '-instance') &&
						estatico.modules[moduleName].initEvents.indexOf(event.type) !== -1) {
						let Module = this.moduleRegistry.getModuleByName(moduleName),
							_metaData = $element.data(moduleName + '-data') || {},
							_metaOptions = $element.data(moduleName + '-options') || {},
							moduleInstance = new Module($element, _metaData, _metaOptions);

						estatico.modules[moduleName].instances[moduleInstance.uuid] = moduleInstance;
						$(element).data(moduleName + '-instance', moduleInstance);
					}
				});
			});
		});
	}
}

export default EstaticoApp;

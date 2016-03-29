/**
 * Init registered modules on specified events
 *
 * @license APLv2
 */
import $ from '../../../../node_modules/jquery/dist/jquery';

/** Demo modules **/
import SkipLinks from '../../../demo/modules/skiplinks/skiplinks';
import Notification from '../../../demo/modules/notification/notification';
import SlideShow from '../../../demo/modules/slideshow/slideshow';
import HelloMessage from '../../../demo/modules/react/react';
/* autoinsertmodulereference */

class EstaticoApp {

	constructor() {
		// Module instances
		window.estatico.modules = {};

		this.initEvents = [];

		// Module registry - mapping module name (used in data-init) to module Class
		this.modules = {};
		this.modules.notification = Notification;
		this.modules.slideshow = SlideShow;
		this.modules.skiplinks = SkipLinks;
		this.modules.hellomessage = HelloMessage;
		/* autoinsertmodule */
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
		if (!estatico.modules[moduleName] && this.modules[moduleName]) {
			let Module = this.modules[moduleName];

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
						let Module = this.modules[moduleName],
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

/**
 * Init registered modules on specified events
 *
 * @license APLv2
 */
import $ from '../../../node_modules/jquery/dist/jquery';
import NotificationCenter from '../../demo/modules/notification/notificationcenter';
import SlideShow from '../../demo/modules/slideshow/slideshow';

// import '../../demo/modules/skiplinks/skiplinks';
// import '../../demo/modules/cookieconfirmation/cookieconfirmation';
// import '../../demo/modules/equalheight/equalheight';

class Estatico {

	constructor() {
		this.modules = {};
		this.initEvents = [];
	}

	static getModule(moduleName) {
		console.log(moduleName);
		switch (moduleName) {
			case 'NotificationCenter':
				return NotificationCenter;
			case 'SlideShow':
				return SlideShow;
			default:
				throw new Error(`Could not instantiate ${moduleName}.`);
		}
	}

	startApp() {
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
		if (!this.modules[moduleName]) {
			let Module = Estatico.getModule(moduleName);

			this.modules[moduleName] = {
				initEvents: Module.initEvents,
				events: Module.events,
				instances: []
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
						this.modules[moduleName].initEvents.indexOf(event.type) !== -1) {
						let Module = Estatico.getModule(moduleName),
							_metaState = $element.data(moduleName + '-state') || {},
							_metaProps = $element.data(moduleName + '-props') || {},
							moduleInstance = new Module($element, _metaState, _metaProps);

						this.modules[moduleName].instances[moduleInstance.uuid] = moduleInstance;
						$(element).data(moduleName + '-instance', moduleInstance);
					}
				});
			});
		});
	}
}

export default Estatico;

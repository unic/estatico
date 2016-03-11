import notification from '../../../demo/modules/notification/notification';
import slideshow from '../../../demo/modules/slideshow/slideshow';

// *autoinsertmodulereference*

class ModuleRegistry {
	constructor() {
		this.registry = new Map();
		this.registry.set('notification', notification);
		this.registry.set('slideshow', slideshow);

		// *autoinsertmodule*
	}

	getModuleByName(moduleName) {
		return this.registry.get(moduleName);
	}
}

export default ModuleRegistry;

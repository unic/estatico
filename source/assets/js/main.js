import '../../../node_modules/handlebars/dist/handlebars';
import _ from '../../../node_modules/lodash';

import './module/module';

// *autoinsertmodule*

import Estatico from './estatico';

window.globals = _.extend({
	estatico: {
		options: {}
	}
}, window.globals);

window.estatico = new Estatico();
window.estatico.startApp();

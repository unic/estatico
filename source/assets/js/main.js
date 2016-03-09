import '../../../node_modules/handlebars/dist/handlebars';
import _ from '../../../node_modules/lodash';

import './helpers/module';
import './helpers/events';
import './helpers/mediaqueries';

// *autoinsertmodule*

import Estatico from './estatico';

window.globals = _.extend({
	estatico: {
		state: {},
		props: {}
	}
}, window.globals);

window.estatico = new Estatico();
window.estatico.startApp();

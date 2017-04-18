import 'babel-polyfill';
import '../.tmp/modernizr';
import FontLoader from './helpers/fontloader';
import Helper from './helpers/helper';

window.estatico = window.estatico || {};
window.estatico.helpers = new Helper();

window.estatico = estatico.helpers.extend({
	data: {}, // Content data
	options: {} // Module options
}, window.estatico);

window.estatico.fontLoader = new FontLoader(window.estatico.options.fontLoaderUrl);

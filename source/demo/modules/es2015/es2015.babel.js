/* jshint esversion: 6 */

import $ from 'jquery';

console.log('Using jQuery version', $.fn.jquery);

export default {
	initEvents: ['ready', 'ajaxload']
};

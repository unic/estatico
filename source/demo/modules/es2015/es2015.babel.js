/* jshint esversion: 6 */

/*!
 * ES2015 demo
 *
 * @author
 * @copyright
 */

import $ from 'jquery';

console.log('ES2015 module using jQuery version', $.fn.jquery);

export default {
	initEvents: ['ready', 'ajaxload']
};

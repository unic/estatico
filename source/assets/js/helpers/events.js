/**
 * Debounced global resize and scroll event listeners triggering custom events to listen to
 * @author ThJ, Unic AG
 * @license All rights reserved Unic AG
 * @requires ../../vendor/jquery/jquery.js
 * @requires ../../.tmp/lodash.js
 */

;(function(window, document, $, Unic, undefined) {
	'use strict';

	var $document = $(document);

	$.extend(true, Unic, {
		events: {
			resize: 'unic_resize',
			scroll: 'unic_scroll'
		}
	});

	$(window)
		.on('resize.unic', _.debounce($.proxy(function(event) {
			$document.triggerHandler(Unic.events.resize, event);
		}, this), 50))
		.on('scroll.unic', _.debounce($.proxy(function(event) {
			$document.triggerHandler(Unic.events.scroll, event);
		}, this), 50));

})(window, document, jQuery, Unic);

/**
 * Debounced global resize and scroll event listeners triggering custom events to listen to
 * @author ThJ, Unic AG
 * @license All rights reserved Unic AG
 * @requires ../../vendor/jquery/jquery.js
 * @requires ../../.tmp/lodash.js
 */

;(function(window, document, $, _, Unic, undefined) {
	'use strict';

	var $document = $(document),
		interval = $.extend({
			resize: 50,
			scroll: 50
		}, Unic.settings && Unic.settings.eventInterval);

	$.extend(true, Unic, {
		events: {
			resize: 'unic_resize',
			scroll: 'unic_scroll'
		}
	});

	$(window)
		.on('resize.unic', _.debounce(_.bind(function(event) {
			$document.triggerHandler(Coop.events.resize, event);
		}, this), interval.resize))
		.on('scroll.unic', _.debounce(_.bind(function(event) {
			$document.triggerHandler(Coop.events.scroll, event);
		}, this), interval.scroll));

})(window, document, jQuery, _, Unic);

/**
 * Trigger custom events when changing breakpoint, get breakpoints from CSS properties
 *
 * @license APLv2
 *
 * @example
 * // Listen to custom (debounced) event to react to viewport changes:
 * $document.on(estatico.events.mq, function(event, prevBreakpoint, currentBreakpoint) {
 * 	console.log(prevBreakpoint); // { name: "small", value: "768px" }
 * 	console.log(parseInt(prevBreakpoint.value)); // "768"
 * });
 *
 * // Check the current breakpoint:
 * if (estatico.mq.currentBreakpoint.name === 'large') {
 * 	this.destroySmall();
 * 	this.initLarge();
 * }
 *
 * // Check the current viewport against a specific breakpoint:
 * if (parseInt(estatico.mq.currentBreakpoint.value) > parseInt(estatico.mq.breakpoints.small)) {
 * 	this.destroySmall();
 * 	this.initLarge();
 * }
 */

;(function($, undefined) {
	'use strict';

	function parseCssProperty(str) {
		return $.parseJSON($.trim(str.replace(/^('|")|(\\)|('|")$/g, '')));
	}

	var $document = $(document),
		events = {
			mq: 'mq.estatico'
		},
		$head = $document.find('head'),
		$title = $head.find('title'),
		breakpointsString = $head.css('font-family'),
		currentBreakpointString = $title.css('font-family'),
		breakpoints = parseCssProperty(breakpointsString),
		currentBreakpoint = parseCssProperty(currentBreakpointString);

	$document.on(estatico.events.resize + '.mq', function() {
		var breakpoint = parseCssProperty($title.css('font-family')),
			prevBreakpoint = estatico.mq.currentBreakpoint;

		if (breakpoint && breakpoint.name !== estatico.mq.currentBreakpoint.name) {
			estatico.mq.currentBreakpoint = breakpoint;

			$document.triggerHandler(events.mq, [prevBreakpoint, breakpoint]);
		}
	});

	// Save to global namespace
	$.extend(true, estatico, {
		events: events,
		mq: {
			breakpoints: breakpoints,
			currentBreakpoint: currentBreakpoint
		}
	});

})(jQuery);

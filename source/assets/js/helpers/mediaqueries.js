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
 * if (estatico.mq.query({ from: 'small' })) {
 * 	this.destroySmall();
 * 	this.initLarge();
 * }
 * // or
 * if (estatico.mq.query({ from: 'small', to: 'medium' })) {
 * 	this.destroySmall();
 * 	this.initMedium();
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

	function getBreakpointValue(breakpoint) {
		var value = 0;

		if (typeof breakpoints[breakpoint] !== 'undefined') {
			value = parseInt(breakpoints[breakpoint], 10);
		} else {
			throw 'Breakpoint not found: "' + breakpoint + '"';
		}

		return value;
	}

	function query(options) {
		var breakpointFrom, breakpointTo,
			breakpointCurrent = parseInt(estatico.mq.currentBreakpoint.value, 10);

		if (typeof options !== 'object') {
			// No or wrong arguments passed
			throw 'Illegal argument of type "' + typeof options + '", expected "object"';
		} else if (typeof options.to !== 'undefined' && typeof options.from !== 'undefined') {
			breakpointFrom = getBreakpointValue(options.from);
			breakpointTo = getBreakpointValue(options.to);

			// "from" cannot be larger than "to"
			if (breakpointFrom > breakpointTo) {
				throw 'Breakpoint ' + breakpointFrom + ' is larger than ' + breakpointTo + '';
			}

			// The breakpoint needs to smaller than the "to" (exclusive)
			// but larger or the same as "from" (inclusive)
			return breakpointFrom <= breakpointCurrent && breakpointCurrent < breakpointTo;
		} else if (typeof options.to !== 'undefined') {
			breakpointTo = getBreakpointValue(options.to);

			// Breakpoint needs to smaller than the "to" (exclusive)
			return breakpointCurrent < breakpointTo;
		} else if (typeof options.from !== 'undefined') {
			breakpointFrom = getBreakpointValue(options.from);

			// Breakpoint needs larger or the same as "from" (inclusive)
			return breakpointCurrent >= breakpointFrom;
		} else {
			throw 'No values for "to" or "from" received';
		}
	}

	// Save to global namespace
	$.extend(true, estatico, {
		events: events,
		mq: {
			query: query,
			breakpoints: breakpoints,
			currentBreakpoint: currentBreakpoint
		}
	});

})(jQuery);

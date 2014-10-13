/**
 * Trigger custom events when changing breakpoint
 * Use font-family and content from head element to communicate between CSS and JS
 * @author   Thomas Jaggi, Unic AG
 * Edited By Oriol Torrent, Unic AG
 * @license  All rights reserved Unic AG
 *
 * @requires ../../vendor/jquery/jquery.js
 *
 * @example
 * To use media queries in JS you can:
 *
 * 1. Listen to events so that your module can react to viewport changes. They are already debounced:
 * $document.on(Unic.events.mq, function(event, prevBreakpoint, currBreakpoint) {
 * 	console.log( prevBreakpoint ); // {small: "768px"}
 * 	console.log( prevBreakpoint.name ); // "small". Get previous breakpoint name.
 * 	console.log( prevBreakpoint.value ); // "768px". Get previous breakpoint size String.
 * 	console.log( parseInt(prevBreakpoint.value) ); // "768". Get previous breakpoint size Number.
 * });
 *
 * 2. Check the current breakpoint:
 * if (Unic.mq.currentBreakpoint.name === "large") {
 * 	this.destroySmall();
 * 	this.initLarge();
 * }
 *
 * 3. Check the current viewport against an specific size:
 * if (parseInt(Unic.mq.currentBreakpoint.value) > 768) {
 * 	this.destroySmall();
 * 	this.initLarge();
 * }
 */

(function(window, document, $, Unic, undefined) {
	'use strict';

	function parseCssProperty(str) {
		return $.parseJSON($.trim(str.replace(/^('|")|(\\)|('|")$/g, '')));
	}

	var $document = $(document),
		$head = $document.find('head'),
		breakpointsString = $head.css('font-family'),
		currentBreakpointString = $head.css('content'),
		/**
		 * breakpoints is a JSON-like object. Ex:
		 * {small: "768px", medium: "992px", large: "1200px"}
		 */
		breakpoints = parseCssProperty(breakpointsString),
		/**
		 * currentBreakpoint is a JSON-like object with name and value elements. Ex:
		 * {name: "large", value: "1200px"}
		 */
		currentBreakpoint = parseCssProperty(currentBreakpointString);

	$.extend(true, Unic, {
		events: {
			mq: 'unic_mq'
		},
		mq: {
			breakpoints: breakpoints,
			currentBreakpoint: currentBreakpoint
		}
	});

	$document.on(Unic.events.resize, function() {
		var breakpoint = parseCssProperty($head.css('content')),
			prevBreakpoint = Unic.mq.currentBreakpoint;

		if (breakpoint && breakpoint.name !== Unic.mq.currentBreakpoint.name) {
			Unic.mq.currentBreakpoint = breakpoint;

			$document.triggerHandler(Unic.events.mq, [prevBreakpoint, breakpoint]);
		}
	});

})(window, document, jQuery, Unic);

/**
 * Trigger custom events when changing breakpoint, get breakpoints from CSS properties
 *
 * @license APLv2
 *
 * @example
 * import MediaQuery from '../../../assets/js/modules/mediaqueries';
 *
 * // Listen to custom (debounced) event to react to viewport changes:
 * MediaQuery.addMQChangeListener(function(event, prevBreakpoint, currentBreakpoint) {
 * 	console.log(prevBreakpoint); // { name: "small", value: "768px" }
 * 	console.log(parseInt(prevBreakpoint.value)); // "768"
 * });
 *
 * // Check the current viewport against a specific breakpoint:
 * if (MediaQuery.query({ from: 'small' })) {
 * 	this.destroySmall();
 * 	this.initLarge();
 * }
 * // or
 * if (MediaQuery.query({ from: 'small', to: 'medium' })) {
 * 	this.destroySmall();
 * 	this.initMedium();
 * }
 */

import $ from 'jquery';

class MediaQuery {
	constructor() {
		this.$document = $(document);

		this.$head = this.$document.find('head');
		this.$title = this.$head.find('title');

		this.breakpointsString = this.$head.css('font-family');
		this.currentBreakpointString = this.$title.css('font-family');

		this.breakpoints = this.parseCssProperty(this.breakpointsString);
		this.currentBreakpoint = this.parseCssProperty(this.currentBreakpointString);

		// Save to global namespace
		$.extend(true, estatico, { events: {} });
		estatico.events.mq = 'mq.estatico';

		this.$document.on('debouncedresize.estatico.mq', () => {
			var breakpoint = this.parseCssProperty(this.$title.css('font-family')),
				prevBreakpoint = this.currentBreakpoint;

			if (breakpoint && breakpoint.name !== this.currentBreakpoint.name) {
				this.currentBreakpoint = breakpoint;
				this.$document.triggerHandler(estatico.events.mq, [prevBreakpoint, breakpoint]);
			}
		});
	}

	addMQChangeListener(callback, uuid) {
		this.$document.on(estatico.events.mq + '.' + uuid, (event, prevBreakpoint, breakpoint) => {
			callback(event, prevBreakpoint, breakpoint);
		});
	}

	parseCssProperty(str) {
		return $.parseJSON($.trim(str.replace(/^('|")|(\\)|('|")$/g, '')));
	}

	getBreakpointValue(breakpoint) {
		if (this.breakpoints[breakpoint] === undefined) {
			throw 'Breakpoint not found: "' + breakpoint + '"';
		}

		return parseInt(this.breakpoints[breakpoint], 10);
	}

	query(options) {
		var breakpointFrom, breakpointTo,
			breakpointCurrent = parseInt(this.currentBreakpoint.value, 10);

		if (typeof options !== 'object') {
			// No or wrong arguments passed
			throw 'Illegal argument of type "' + typeof options + '", expected "object"';
		}

		if (options.to === undefined && options.from === undefined) {
			throw 'No values for "to" or "from" received';
		}

		if (options.to !== undefined && options.from !== undefined) {
			breakpointFrom = this.getBreakpointValue(options.from);
			breakpointTo = this.getBreakpointValue(options.to);

			// "from" cannot be larger than "to"
			if (breakpointFrom > breakpointTo) {
				throw 'Breakpoint ' + breakpointFrom + ' is larger than ' + breakpointTo + '';
			}

			// The breakpoint needs to smaller than the "to" (exclusive)
			// but larger or the same as "from" (inclusive)
			return breakpointFrom <= breakpointCurrent && breakpointCurrent < breakpointTo;
		}

		if (options.to !== undefined) {
			// Breakpoint needs to smaller than the "to" (exclusive)
			return breakpointCurrent < this.getBreakpointValue(options.to);
		}

		if (options.from !== undefined) {
			// Breakpoint needs larger or the same as "from" (inclusive)
			return breakpointCurrent >= this.getBreakpointValue(options.from);
		}
	}
}

// Exports an INSTANCE
export default new MediaQuery();

/**
 * Add debounced global resize and scroll events
 *
 * @license APLv2
 *
 * @example
 * var globalEvents = require('./events.js');
 *
 * // Listen to debounced scroll event:
 * $(document}.on(globalEvents.scroll.key, function(event, originalEvent) {
 * 	console.log(originalEvent); // original scroll event
 * });
 */

'use strict';

var $ = require('jquery'),
	debounce = require('lodash.debounce');

var interval = {
		resize: 50,
		scroll: 50
	};

module.exports = {
	resize: {
		key: 'debouncedresize.estatico',
		attach: function() {
			$(window).on('resize.estatico', debounce(function(event) {
				$(document).triggerHandler(this.key, event);
			}.bind(this), interval.resize));
		}
	},
	scroll: {
		key: 'debouncedscroll.estatico',
		attach: function() {
			$(window).on('scroll.estatico', debounce(function(event) {
				$(document).triggerHandler(this.key, event);
			}.bind(this), interval.resize));
		}
	}
};

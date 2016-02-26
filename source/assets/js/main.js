'use strict';

var $ = require('jquery'),
	events = require('./helpers/events.js'),
	mediaqueries = require('./helpers/mediaqueries.js'),
	modules = {
		skiplinks: require('../../demo/modules/skiplinks/skiplinks.js'),
		slideshow: require('../../demo/modules/slideshow/slideshow.js'),
		es2015: require('../../demo/modules/es2015/es2015.babel.js')
	},
	initEvents = {};

// Create map of init events and corresponding modules
Object.keys(modules).forEach(function(module) {
	if (!modules[module].initEvents) {
		return;
	}

	modules[module].initEvents.forEach(function(initEvent) {
		if (!initEvents[initEvent]) {
			initEvents[initEvent] = [];
		}

		initEvents[initEvent].push(module);
	});
});

// Attach event listeners
Object.keys(initEvents).forEach(function(initEvent) {
	$(document).on(initEvent, function() {
		var initModules = initEvents[initEvent];

		$('[data-init]').each(function() {
			var $this = $(this),
				modules = $this.data('init').split(' ');

			modules.forEach(function(module) {
				if (initModules.indexOf(module) !== -1 && $.fn[module]) {
					$.fn[module].apply($this);
				}
			});
		});
	});
});

// Attach global events
events.mq = mediaqueries.event;

Object.keys(events).forEach(function(event) {
	events[event].attach();
});

// Save events to global namespace
$.extend(true, estatico, {
	events: events
});

/*!
 * {{originalName}}
 *
 * @author
 * @copyright
 */

'use strict';

var $ = require('jquery'),
	SuperClass = require('../../assets/js/helpers/module');

// globalEvents = require('../../assets/js/helpers/events'),
// mediaqueries = require('../../assets/js/helpers/mediaqueries');

var name = '{{name}}',
	events = {
		// eventname: 'eventname.estatico.' + name
	},
	defaults = {
		domSelectors: {
			// item: '[data-' + name + '="item"]'
		},
		stateClasses: {
			// isActive: 'is_active'
		}
	},
	data = {
		// items: ["Item 1", "Item 2"]
	};

/**
 * Create an instance of the module
 * @constructor
 * @param {object} element - The DOM element to bind the module
 * @param {object} options - Options overwriting the defaults
 */
function Module(element, options) {
	this._helper = SuperClass;

	this._helper({
		name: name,
		element: element,
		defaults: defaults,
		options: options,
		events: events,
		data: data
	});
}

Module.prototype = $.extend(true, {}, SuperClass.prototype, Module.prototype);

/**
 * Initialize module, bind events.
 * @method
 * @public
 */
Module.prototype.init = function() {
	// console.log('Module "{{name}}" initialized');
};

/**
 * Unbind events, remove data, custom teardown
 * @method
 * @public
 */
Module.prototype.destroy = function() {
	// Unbind events, remove data
	SuperClass.prototype.destroy.apply(this);

	// Custom teardown (removing added DOM elements etc.)
	// If there is no need for a custom teardown, this method can be removed
};

// Make the plugin available through jQuery (and the global project namespace)
SuperClass.register(Module, name, {
	events: events
});

module.exports = {
	Module: Module,
	initEvents: ['ready', 'ajaxload'],
	events: events
};

/**
 * @class       unicmodule
 * @classdesc   SuperClass to handle plugins more easy
 * @author      Oriol Torrent, Unic AG
 * Edited By    Rosmarie Maurer-Wysseier, Unic AG
 * @license     All rights reserved Unic AG
 *
 * @requires ../../vendor/jquery/jquery.js
 */

;(function(window, document, $, Unic, undefined) {
	'use strict';

	// undefined is used here as the undefined global variable in ECMAScript 3 is
	// mutable (ie. it can be changed by someone else). undefined isn't really being
	// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
	// can no longer be modified.

	// window and document are passed through as local variable rather than global
	// as this (slightly) quickens the resolution process and can be more efficiently
	// minified (especially when both are regularly referenced in your plugin).

	// Prefix for data attribute where the plugin instance is stored
	var events = Unic.modules.PluginInitEvents = {},
		dataNamespace = 'plugin_';

	// The actual plugin constructor
	/**
	 * Constructs an instance of the class.
	 * @param {string} name The pluginName
	 * @param {object} defaults The default options of the plugin
	 * @param {object} element The actual DOM element
	 * @param {object} options The options of this particular instance
	 */
	Unic.modules.PluginHelper = function(name, defaults, element, options) {
		var meta;

		this.pluginName = name.toLowerCase();

		this.$element = $(element);

		// Grab plugin options provided via data properties in the html element. Ex:
		// <div class='main_nav' data-mainnav-options='{'optionA':'someCoolOptionString'}'>
		meta = this.$element.data(this.pluginName + '-options');

		// jQuery has an extend method which merges the contents of two or
		// more objects, storing the result in the first object. The first object
		// is generally empty as we don't want to alter the default options for
		// future instances of the plugin
		this.options = $.extend(true, {}, defaults, options, meta);

		// Keep a reference to the wrapper object in the element
		this.$element.data(dataNamespace + this.pluginName, this);

		this.init();
	};

	/**
	 * Init function, should be implemented for every instance inheriting this class.
	 */
	Unic.modules.PluginHelper.prototype.init = function() {

	};

	/**
	 * Destroy function, should be implemented for every instance inheriting this class.
	 * For different use-cases, we can do here some cleanup like:
	 * - Unbind the namespaced EventHandlers
	 * - remove element from DOM
	 *
	 * Usage from inside a plugin:
	 * this.destroy();
	 * Usage from outside a plugin:
	 * jQuery('[data-example=init]').example('destroy');
	 */
	Unic.modules.PluginHelper.prototype.destroy = function() {
		// remove all events in the this.pluginName namespace
		this.$element.off('.' + this.pluginName);
		// unset Plugin data instance
		this.$element.removeData(dataNamespace + this.pluginName);
		this.$element.removeData(this.pluginName);
	};



	/**
	 * Registers the plugin within jQuery. Prevents multiple instantiations.
	 * Allows to call all public functions (not starting with underscore) to be called
	 * through jQuery plugin e.g. $(element).pluginName('functionName', arg1, arg2)
	 *
	 * @param {function} PluginClass The constructor of the plugin
	 * @param {string} pluginName The name of the plugin
	 * @param {array} initEvents List of events to init the plugin on
	 */
	Unic.modules.PluginHelper.register = function(PluginClass, pluginName, initEvents) {
		Unic.modules[pluginName.charAt(0).toUpperCase() + pluginName.substr(1).toLowerCase()] = PluginClass;

		$.fn[pluginName] = function(options) {
			var args = arguments;

			if (options === undefined || typeof options === 'object') {
				return this.each(function() {
					if (!$.data(this, dataNamespace + pluginName)) {
						Unic.modules[pluginName].pluginClass = new PluginClass(this, options);
					}
				});
			} else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
				if (this && this.length <= 1) {
					var instance = this.data(dataNamespace + pluginName);

					if (instance instanceof PluginClass && typeof instance[options] === 'function') {
						return instance[options].apply(instance, Array.prototype.slice.call(args, 1));
					}
				} else {
					return this.each(function() {
						var instance = $.data(this, dataNamespace + pluginName);

						if (instance instanceof PluginClass && typeof instance[options] === 'function') {
							instance[options].apply(instance, Array.prototype.slice.call(args, 1));
						}
					});
				}
			} else {
				throw 'Illegal usage of the plugin: ' + pluginName;
			}
		};

		// Plugins can provide a list of events like "ready" where they are automatically initialized
		// This allows for one single DOM lookup per event
		if (initEvents) {
			if (typeof initEvents !== 'object') {
				initEvents = [initEvents];
			}

			for (var i = 0, event; i < initEvents.length; i++) {
				event = initEvents[i];

				if (typeof events[event] === 'undefined') {
					events[event] = [];
				}

				events[event].push(pluginName);
			}
		}
	};

})(window, document, jQuery, Unic);

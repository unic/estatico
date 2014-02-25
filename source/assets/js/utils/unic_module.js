/**
 * SuperClass to handle plugins more easy
 * @author OrT, RoW, Unic AG
 * @license All rights reserved Unic AG
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

	// Holds the pluginName
	var pluginName = '';

	// The actual plugin constructor
	/**
	 * Constructs an instance of the class.
	 * @param {string} name The pluginName
	 * @param {object} defaults The default options of the plugin
	 * @param {object} element The actual DOM element
	 * @param {object} options The options of this particular instance
	 */
	Unic.modules.PluginHelper = function(name, defaults, element, options) {
		pluginName = name.toLowerCase();

		var meta;
		this.$element = $(element);

		// Grab plugin options provided via data properties in the html element. Ex:
		// <div class='main_nav' data-mainnav-options='{'optionA':'someCoolOptionString'}'>
		meta = this.$element.data(pluginName+'-options');

		// jQuery has an extend method which merges the contents of two or
		// more objects, storing the result in the first object. The first object
		// is generally empty as we don't want to alter the default options for
		// future instances of the plugin
		this.options = $.extend({}, defaults, options, meta);

		// Keep a reference to the wrapper object in the element
		this.$element.data('plugin_'+pluginName, this);

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
	 * this.destroy(pluginName);
	 * Usage from outside a plugin:
	 * jQuery('[data-example=init]').example('destroy', 'example');
	 *
	 * @param  {string} pluginToDestroy [description: the name of the plugin to be destroyed]
	 */
	Unic.modules.PluginHelper.prototype.destroy = function(pluginToDestroy) {
		// We need to provide the pluginName because "init()" and "destroy()" are public methods
		// and they can be called from the outside. If pluginName was not provided
		// it would be the last initialized plugin instead of the one we would like to destroy.

		// Check if there's a name passed in the arguments
		// If no arguments, throw Error
		if (!arguments.length || typeof(pluginToDestroy) === 'undefined') {
			throw 'Missing plugin name parameter';
			// If arguments: populate pluginNames with every passed argument
		} else {
			pluginName = pluginToDestroy.toLowerCase();
		}

		// remove all events in the pluginName namespace
		this.$element.off('.' + pluginName);
		// unset Plugin data instance
		this.$element.removeData( 'plugin_' + pluginName );
		this.$element.removeData( pluginName );
	};



	/**
	 * Registers the plugin within jQuery. Prevents multiple instantiations.
	 * Allows to call all public functions (not starting with underscore) to be called
	 * through jQuery plugin e.g. $(element).pluginName('functionName', arg1, arg2)
	 *
	 * @param {function} PluginClass The constructor of the plugin
	 * @param {string} pluginName The name of the plugin
	 */
	Unic.modules.PluginHelper.register = function(PluginClass, pluginName) {
		Unic.modules[pluginName.charAt(0).toUpperCase() + pluginName.substr(1).toLowerCase()] = PluginClass;

		$.fn[pluginName] = function(options) {
			var args = arguments;
			if (options === undefined || typeof options === 'object') {
				return this.each(function() {
					if (!$.data(this, 'plugin_' + pluginName)) {
						// $.data(this, 'plugin_' + pluginName, new PluginClass(this, options));
						new PluginClass(this, options);
					}
				});
			} else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
				if(this && this.length <= 1) {
					var instance = this.data('plugin_' + pluginName);
					if (instance instanceof PluginClass && typeof instance[options] === 'function') {
						return instance[options].apply(instance, Array.prototype.slice.call(args, 1));
					}
				} else {
					return this.each(function() {
						var instance = $.data(this, 'plugin_' + pluginName);
						if (instance instanceof PluginClass && typeof instance[options] === 'function') {
							instance[options].apply(instance, Array.prototype.slice.call(args, 1));
						}
					});
				}
			} else {
				throw 'Illegal usage of the plugin: ' + pluginName;
			}
		};
	};

})(window, document, jq_1_10_2, Unic);

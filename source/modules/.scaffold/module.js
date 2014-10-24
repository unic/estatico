/**
 * @class       {{pascalCase}}
 * @classdesc   Plugin representing a {{titleCase}}
 * @author      XY, Unic AG
 * Edited By
 * @copyright   Unic AG
 *
 * //@requires ../../assets/vendor/xy/xy.js
 */

(function(window, document, $, Unic, undefined) {
	'use strict';

	var // $document = $(document),
		pluginName = '{{camelCase}}',
		events = {
			/* eventname: pluginName +'_eventname' */
		},
		defaults = {
			domSelectors: {
				item: '[data-' + pluginName + '="item"]'
			},
			stateClasses: {
			}
		};

	// Globally accessible data like event names
	Unic.modules[pluginName] = {
		events: events
	};

	/**
	 * Create an instance of the module
	 * @constructor
	 * @param {object} element - The DOM element to bind the module
	 * @param {object} options - Options overwriting the defaults
	 */
	function Plugin(element, options) {
		// Call super constructor
		this.helper = Unic.modules.PluginHelper;
		this.helper(pluginName, defaults, element, options);
	}

	Plugin.prototype = $.extend(true, {}, Unic.modules.PluginHelper.prototype, Plugin.prototype);

	/**
	 * Initialize module, bind events.
	 * @method
	 * @public
	 */
	Plugin.prototype.init = function() {
		console.log('{{camelCase}}');
	};

	// Make the plugin available through jQuery (and the global project namespace)
	Unic.modules.PluginHelper.register(Plugin, pluginName, ['ready', 'ajax_loaded']);

})(window, document, jQuery, Unic);

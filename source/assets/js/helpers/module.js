/**
 * Helper class to register modules as jQuery plugins and do some other magic
 *
 * @license APLv2
 */

;(function($, undefined) {
	'use strict';

	var initEvents = {}, // Map of init events and corresponding modules
		SuperClass; // The helper class

	/**
	 * Helper class
	 * @param {object} config
	 * @param {string} config.name - Module name (used as namespace for all kinds of things)
	 * @param {object} config.defaults - Default options
	 * @param {object} config.element - DOM element to init the module on
	 * @param {object} config.options - Custom options
	 * @param {object} config.data - Custom data
	 */
	SuperClass = function(config) {
		// Save things
		this.name = config.name;

		this.$element = $(config.element);

		// Handle options
		this._defaults = config.defaults;
		this._options = config.options;
		this._metaOptions = this.$element.data(this.name + '-options');
		this._globalOptions = estatico.options[this.name];

		this.options = $.extend(true, {}, this._defaults, this._options, this._globalOptions, this._metaOptions);

		// Handle data
		this._data = config.data;
		this._globalData = estatico.data[this.name];
		this._metaData = this.$element.data(this.name + '-data');

		this.data = $.extend(true, {}, this._data, this._globalData, this._metaData);

		// Identify instance by UUID
		this.uuid = _.uniqueId(this.name);

		// Save instance
		estatico.modules[this.name].instances[this.uuid] = this;

		// Have fun
		this.init();
	};

	/**
	 * Init method
	 *
	 * Should likely be overwritten in module (otherwise nothing will happen on init)
	 */
	SuperClass.prototype.init = function() {

	};

	/**
	 * Destroy method
	 *
	 * Should be overwritten in module if there are additional DOM elements, DOM data, event listeners to remove
	 *
	 * Use cases:
	 * - Unbind (namespaced) event listeners
	 * - Remove data from DOM elements
	 * - Remove elements from DOM
	 */
	SuperClass.prototype.destroy = function() {
		// Remove event listeners connected to this instance
		this.$element.off('.' + this.uuid);

		$(document).off('.' + this.uuid);

		// Delete references to instance
		this.$element.removeData(this.name + '-instance');

		delete estatico.modules[this.name].instances[this.uuid];
	};

	/**
	 * Register the module as jQuery plugin, auto-init at specified events
	 *
	 * Allows to call all public methods (not starting with underscore).
	 * E.g. $(element).moduleName('methodName', arg1, arg2)
	 *
	 * @param {function} Class - Constructor
	 * @param {string} name - Module name (used as namespace for all kind of things)
	 * @param {object} config
	 * @param {array} config.initEvents - List of events to initialize the module on
	 */
	SuperClass.register = function(Class, name, config) {
		// Register jQuery plugin
		$.fn[name] = function(options) {
			var args = arguments,
				value;

			if (options === undefined || typeof options === 'object') {
				// Init module
				return this.each(function() {
					var $this = $(this),
						instance = $this.data(name + '-instance');

					// Check if the module was already instantiated
					if (instance === undefined) {
						instance = new Class(this, options);

						// Save instance to DOM element data
						$this.data(name + '-instance', instance);
					}
				});
			} else if (typeof options === 'string') {
				// Private method, throw error
				if (options.substr(0, 1) === '_') {
					throw '"' + options + '" is a private method';
				}

				// Loop through elements
				this.each(function() {
					var instance = $(this).data(name + '-instance');

					// No module instance found, throw error
					if (!(instance instanceof Class)) {
						throw 'Instance of "' + name + '" module not found';
					}

					// Method not found, throw error
					if (typeof instance[options] !== 'function') {
						throw '"' + name + '" has no method "' + options + '"';
					}

					value = instance[options].apply(instance, Array.prototype.slice.call(args, 1));

					// Stop if method returned a value
					if (value) {
						return false;
					}
				});

				// Return either value or jQuery collection
				if (value) {
					return value;
				} else {
					return this;
				}
			}
		};

		// Modules can provide a list of events like 'ready' where they are automatically initialized
		// This allows for one single DOM lookup per event
		if (config.initEvents) {
			if (typeof config.initEvents !== 'object') {
				config.initEvents = [config.initEvents];
			}

			for (var i = 0, initEvent; i < config.initEvents.length; i++) {
				initEvent = config.initEvents[i];

				if (typeof initEvents[initEvent] === 'undefined') {
					initEvents[initEvent] = [];
				}

				initEvents[initEvent].push(name);
			}
		}

		// Save to global namespace
		estatico.modules[name] = {
			instances: {},
			events: config.events,
			Class: Class
		};
	};

	// Save to global namespace
	$.extend(true, estatico, {
		modules: {},
		helpers: {
			SuperClass: SuperClass
		}
	});

	// Reference rather than clone
	estatico.helpers.initEvents = initEvents;

})(jQuery);

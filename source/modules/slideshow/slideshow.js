/**
 * Carousel
 * @author ThJ, Unic AG
 * @license All rights reserved Unic AG
 */

(function(window, document, $, Unic, undefined) {
	'use strict';

	var $document = $(document);

	var pluginName = 'slideshow',
		events = {/* eventname: pluginName +'_eventname' */},
		defaults = {
			domSelectors: {
				item: '[data-' + pluginName + '="item"]',
				prev: '[data-' + pluginName + '="prev"]',
				next: '[data-' + pluginName + '="next"]'
			},
			stateClasses: {
				isActivated: 'is_activated'
			},
			initialItem: 0,
			animationDuration: 300
		};

	// Globally accessible data like event names
	Unic.modules[pluginName] = {
		events: events
	};

	/**
	 * Create an instance of the module
	 * @param {object} element The DOM element to bind the module
	 * @param {object} options Options overwriting the defaults
	 * @constructor
	 */
	var Plugin = function(element, options) {
		// Call super constructor
		this.helper = Unic.modules.PluginHelper;
		this.helper(pluginName, defaults, element, options);
	};

	Plugin.prototype = $.extend(true, {}, Unic.modules.PluginHelper.prototype, Plugin.prototype);

	/**
	 * Initialize module, bind events
	 */
	Plugin.prototype.init = function() {
		this.currentItem = -1;

		this.$items = this.$element.find(this.options.domSelectors.slide).hide();

		this.$element
			.on('click.' + pluginName, this.options.domSelectors.prev, _.bind(function(event) {
				event.preventDefault();

				this.prev();
			}, this))
			.on('click.' + pluginName, this.options.domSelectors.next, _.bind(function(event) {
				event.preventDefault();

				this.next();
			}, this));

		// Exemplary resize listener
		$document.on(Unic.events.resize, function(event, originalEvent) {
			console.log(originalEvent);
		});

		// Exemplary scroll listener
		$document.on(Unic.events.scroll, function(event, originalEvent) {
			console.log(originalEvent);
		});

		this.show(this.options.initialItem);
	};

	Plugin.prototype.show = function(index) {
		if (index === this.currentItem) {
			return;
		}

		if (index >= this.$items.length) {
			index = 0;
		} else if (index < 0) {
			index = this.$items.length - 1;
		}

		this.$items.eq(this.currentItem).fadeOut(this.options.animationDuration);
		this.$items.eq(index).fadeIn(this.options.animationDuration);

		this.currentItem = index;
	};

	Plugin.prototype.prev = function() {
		this.goTo(this.currentItem - 1);
	};

	Plugin.prototype.next = function() {
		this.goTo(this.currentItem + 1);
	};

	// Make the plugin available through jQuery (and the global project namespace)
	Unic.modules.PluginHelper.register(Plugin, pluginName, ['ready', 'ajax_loaded']);

})(window, document, jQuery, Unic);

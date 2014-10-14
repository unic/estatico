/**
 * @class       slideshow
 * @classdesc   Plugin representing a Slideshow.
 * @author      Thomas Jaggi, Unic AG
 * Edited By
 * @copyright   Unic AG
 *
 * @requires ../../assets/vendor/jquery-touchswipe/jquery.touchSwipe.js
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
	 * @param {object} element - The DOM element to bind the module
	 * @param {object} options - Options overwriting the defaults
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
	 * @method
	 * @public
	 */
	Plugin.prototype.init = function() {
		var buttons = Unic.templates['modules/slideshow/_slideshow_button']({});

		this.currentItem = -1;

		this.$items = this.$element.find(this.options.domSelectors.item).hide();

		this.$element
			.append(buttons)
			.on('click.' + pluginName, this.options.domSelectors.prev, _.bind(function(event) {
				event.preventDefault();

				this.prev();
			}, this))
			.on('click.' + pluginName, this.options.domSelectors.next, _.bind(function(event) {
				event.preventDefault();

				this.next();
			}, this))
			.addClass(this.options.stateClasses.isActivated);

		// Exemplary touch detection
		// if (Modernizr.touchevents) {
			// Init touchSwipe
		// }

		// Exemplary resize listener
		$document.on(Unic.events.resize, function(event, originalEvent) {
			console.log('slideshow.js', originalEvent);
		});

		// Exemplary scroll listener
		$document.on(Unic.events.scroll, function(event, originalEvent) {
			console.log('slideshow.js', originalEvent);
		});

		// Exemplary media query listener
		this.resize();

		$document.on(Unic.events.mq, _.bind(function() {
			this.resize();
		}, this));

		this.show(this.options.initialItem);
	};

	/**
	 * Shows a specific slide according the given index.
	 * @method
	 * @public
	 * @param {Number} index - The index of the slide to show as integer.
	 */
	Plugin.prototype.show = function(index) {
		if (index === this.currentItem) {
			return;
		}

		if (index >= this.$items.length) {
			index = 0;
		} else if (index < 0) {
			index = this.$items.length - 1;
		}

		this.$items.eq(this.currentItem).slideUp(this.options.animationDuration);
		this.$items.eq(index).slideDown(this.options.animationDuration);

		this.currentItem = index;
	};

	/**
	 * Shows the previous slide in the slideshow.
	 * @method
	 * @public
	 */
	Plugin.prototype.prev = function() {
		this.show(this.currentItem - 1);
	};

	/**
	 * Shows the next slide in the slideshow.
	 * @method
	 * @public
	 */
	Plugin.prototype.next = function() {
		this.show(this.currentItem + 1);
	};

	/**
	 * Does things based on current viewport.
	 * @method
	 * @public
	 */
	Plugin.prototype.resize = function() {
		if (parseInt(Unic.mq.currentBreakpoint.value) > parseInt(Unic.mq.breakpoints.small)) {
			console.log('slideshow.js', 'Viewport: Above small breakpoint');
		} else {
			console.log('slideshow.js', 'Viewport: Below small breakpoint');
		}
	};

	// Make the plugin available through jQuery (and the global project namespace)
	Unic.modules.PluginHelper.register(Plugin, pluginName, ['ready', 'ajax_loaded']);

})(window, document, jQuery, Unic);

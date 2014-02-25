/**
 * @class       Carousel
 * @classdesc   Wrapper to initialize swiper into every instance
 * @requires    ../../assets/vendor/swiper/dist/idangerous.swiper.js
 * @author      Oriol Torrent Florensa OrT, Unic AG
 *
 * Edited by    Oriol Torrent, Unic AG - 02.04.2014
 */

;(function(window, document, $, Unic, undefined) {
	"use strict";

	// globals
	var $document = $(document);

	// Create the defaults once
	var pluginName = 'carousel',
		events = {},
		defaults = {
			wrapperClass: 'u_swiper_wrapper',
			slideClass: 'u_swiper_slide',
			slideActiveClass: 'u_swiper_slide_active',
			slideVisibleClass: 'u_swiper_slide_visible',
			noSwipingClass: 'u_swiper_no_swiping',
			paginationElementClass: 'u_swiper_pagination_switch',
			paginationActiveClass: 'u_swiper_active_switch',
			paginationVisibleClass: 'u_swiper_visible_switch',
			slideDuplicateClass: 'u_swiper_slide_duplicate',
			pagination: '.u_swiper_pagination',
			mode: 'horizontal',
			calculateHeight: true,
			speed: 600,
			loop: true,
			// grabCursor: true,
			paginationClickable: true
		};
	pluginName = pluginName.toLowerCase();

	// Globally accessible data like event names
	Unic.modules[pluginName] = {
		events: events
	};


	/**
	 * Represents each carousel
	 * @param {object} element - The DOM element to bin the module.
	 * @param {object} options - Options overwriting the defaults.
	 * @constructor
	 */
	var Plugin = function(element, options) {
		// Call super constructor
		this.helper = Unic.modules.PluginHelper;
		this.helper(pluginName, defaults, element, options);

		// Security
		// this.options.numericOption = !isNaN( parseInt(this.options.numericOption, 10) ) ? parseInt(this.options.numericOption, 10) : this._defaults.numericOption;

		// Grab here common structural elements if needed
		// this. = this..find('[data-'+pluginName+'-part=header]');
		// this.   = this..find('[data-'+pluginName+'-part=body]');
	};
	Plugin.prototype = $.extend(true, {}, Unic.modules.PluginHelper.prototype, Plugin.prototype);


	/**
	 * Initialize module, bind events
	 * @method
	 * @public
	 */
	Plugin.prototype.init = function() {
		this.$swiper = this.$element.find('[data-' + pluginName + '-swiper]');
		this.$trigers = this.$element.find('[data-' + pluginName + '-triger]');
		this.$slides = this.$element.find('.u_swiper_slide');

		this.options.originalSlidesPerView = this.options.slidesPerView;
		this.$swiper.swiper(this.options);

		if (this.$slides.length > this.options.slidesPerView) {
			this.$element.on('click.' + pluginName, '[data-' + pluginName + '-triger]', $.proxy(this._toggleDirection, this));
		} else {
			this.$trigers.hide();
		}

		// $document.on(Unic.modules.jsqueries.events.EVENT_MQ_FROMWIDE_ENTER, $.proxy(this._setSlidesPerView, this, 4));
		// $document.on(Unic.modules.jsqueries.events.EVENT_MQ_FROMDESKTOPTOWIDE_ENTER, $.proxy(this._setSlidesPerView, this, 3));
		// //$document.on(Unic.modules.jsqueries.events.EVENT_MQ_FROMTABLETTODESKTOP_ENTER, $.proxy(this._setSlidesPerView, this, 2));
		// $document.on(Unic.modules.jsqueries.events.EVENT_MQ_FROMTABLETLANDSCAPETODESKTOP_ENTER, $.proxy(this._setSlidesPerView, this, 2));
		// //$document.on(Unic.modules.jsqueries.events.EVENT_MQ_FROMTABLETTOTABLETLANDSCAPE_ENTER, $.proxy(this._setSlidesPerView, this, 1));
		// // $document.on(Unic.modules.jsqueries.events.EVENT_MQ_TOTABLET_ENTER, $.proxy(this._setSlidesPerView, this, 2));
		// $document.on(Unic.modules.jsqueries.events.EVENT_MQ_TOTABLETLANDSCAPE_ENTER, $.proxy(this._setSlidesPerView, this, 1));

		// $document.jsqueries('checkJSQuery', 'fromWide');
		// $document.jsqueries('checkJSQuery', 'fromDesktopToWide');
		// // $document.jsqueries('checkJSQuery', 'fromTabletToDesktop');
		// $document.jsqueries('checkJSQuery', 'fromTabletLandscapeToDesktop');
		// // $document.jsqueries('checkJSQuery', 'fromTabletToTabletLandscape');
		// // $document.jsqueries('checkJSQuery', 'toTablet');
		// $document.jsqueries('checkJSQuery', 'toTabletLandscape');
	};



	/**
	 * Adds behaviour to arrows for each carusel
	 * @param  {object} event the event that triggers this method
	 * @method
	 * @private
	 */
	Plugin.prototype._toggleDirection = function(event) {
		var $currLink = $(event.currentTarget),
			direction = $currLink.attr('data-' + pluginName + '-triger');

		event.preventDefault();

		if (direction === 'next') {
			this.$swiper.data('swiper').swipeNext();
		} else if (direction === 'previous') {
			this.$swiper.data('swiper').swipePrev();
		}
	};


	Plugin.prototype._setSlidesPerView = function (numSlides) {
		if (this.options.originalSlidesPerView > 1) {
			if (!numSlides) numSlides = 4;
			if (numSlides == 3 && $('.'+this.options.wrapperClass).hasClass('u_cards_even_wrapper')) numSlides = 2;
			this.$swiper.data('swiper').params.slidesPerView = numSlides;
		}
		this.$swiper.data('swiper').reInit();
	};




	// Make the plugin available through jQuery
	Unic.modules.PluginHelper.register(Plugin, pluginName);

	// Bind the module on particular events and elements
	$document.on('ready ajax_loaded', function() {
		$.fn[pluginName].apply($('[data-' + pluginName + '~=init]'), [{
			// Options
		}]);
	});

})(window, document, jQuery, Unic);

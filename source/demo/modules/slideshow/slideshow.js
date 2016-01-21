/*!
 * Slideshow module
 */

;(function($, undefined) {
	'use strict';

	var name = 'slideshow',
		events = {
			slide: 'slide.estatico.' + name
		},
		defaults = {
			domSelectors: {
				slides: '[data-' + name + '="slides"]',
				slide: '[data-' + name + '="slide"]',
				nav: '[data-' + name + '="nav"]',
				prev: '[data-' + name + '="prev"]',
				next: '[data-' + name + '="next"]'
			},
			stateClasses: {
				isActivated: 'is_activated'
			},
			initialItem: 0,
			animationDuration: 300,
			url: '/mocks/demo/modules/slideshow/slideshow.json?delay=5000'
		},
		data = {
			i18n: {
				prev: 'Previous Slide',
				next: 'Next Slide'
			}
		},
		log = estatico.helpers.log(name);

	/**
	 * Create an instance of the module
	 * @param {object} element - DOM element to init the module on
	 * @param {object} options - Options overwriting the defaults
	 * @constructor
	 */
	function Module(element, options) {
		this._helper = estatico.helpers.SuperClass;

		this._helper({
			name: name,
			element: element,
			defaults: defaults,
			options: options,
			events: events,
			data: data
		});
	}

	Module.prototype = $.extend(true, {}, estatico.helpers.SuperClass.prototype, Module.prototype);

	/**
	 * Initialize module, bind events
	 * @method
	 * @public
	 */
	Module.prototype.init = function() {
		var navTemplate = Handlebars.partials['demo/modules/slideshow/_slideshow_nav'],
			request;

		this.currentItem = -1;
		this.slideTemplate = Handlebars.partials['demo/modules/slideshow/_slideshow_slide'];

		this.$wrapper = this.$element.find(this.options.domSelectors.slides);
		this.$slides = this.$element.find(this.options.domSelectors.slide);
		this.$nav = $(navTemplate(this.data));

		this.$element
			.append(this.$nav)
			.on('click.estatico.' + this.uuid, this.options.domSelectors.prev, function(event) {
				event.preventDefault();

				this.prev();
			}.bind(this))
			.on('click.estatico.' + this.uuid, this.options.domSelectors.next, function(event) {
				event.preventDefault();

				this.next();
			}.bind(this))
			.addClass(this.options.stateClasses.isActivated);

		// Exemplary AJAX request to mocked data with optional delay parameter (works with local preview server only)
		request = $.ajax(this.options.url).done(function(response) {
			// Loop through slides and add them
			if (response.slides) {
				response.slides.forEach(function(slide) {
					this.add(slide);
				}.bind(this));
			}
		}.bind(this)).fail(function(jqXHR) {
			log('NOO!', jqXHR.status, jqXHR.statusText);
		});

		// Exemplary touch detection
		if (Modernizr.touchevents) {
			log('Touch support detected');
		}

		// Exemplary debounced resize listener (uuid used to make sure it can be unbound per plugin instance)
		$(document).on(estatico.events.resize + '.' + this.uuid, function(event, originalEvent) {
			log(originalEvent);
		});

		// Exemplary debounced scroll listener (uuid used to make sure it can be unbound per plugin instance)
		$(document).on(estatico.events.scroll + '.' + this.uuid, function(event, originalEvent) {
			log(originalEvent);
		});

		this.resize();

		// Exemplary media query listener (uuid used to make sure it can be unbound per plugin instance)
		$(document).on(estatico.events.mq + '.' + this.uuid, function() {
			this.resize();
		}.bind(this));

		this.show(this.options.initialItem);
	};

	/**
	 * Shows a specific slide according the given index.
	 * @method
	 * @public
	 * @param {Number} index - The index of the slide to show as integer.
	 */
	Module.prototype.show = function(index) {
		if (index === this.currentItem) {
			return;
		}

		if (index >= this.$slides.length) {
			index = 0;
		} else if (index < 0) {
			index = this.$slides.length - 1;
		}

		this.$slides.eq(this.currentItem).stop(true, true).slideUp(this.options.animationDuration);
		this.$slides.eq(index).stop(true, true).slideDown(this.options.animationDuration);

		this.currentItem = index;

		this.$element.trigger(events.slide, index);
	};

	/**
	 * Shows the previous slide in the slideshow.
	 * @method
	 * @public
	 */
	Module.prototype.prev = function() {
		this.show(this.currentItem - 1);
	};

	/**
	 * Shows the next slide in the slideshow.
	 * @method
	 * @public
	 */
	Module.prototype.next = function() {
		this.show(this.currentItem + 1);
	};

	/**
	 * Add slide.
	 * @method
	 * @public
	 */
	Module.prototype.add = function(data) {
		var slide = this.slideTemplate(data),
			$slide = $(slide);

		this.$slides = this.$slides.add($slide);

		$slide.appendTo(this.$wrapper);
	};

	/**
	 * Does things based on current viewport.
	 * @method
	 * @public
	 */
	Module.prototype.resize = function() {
		if (estatico.mq.query({ from: 'small' })) {
			log('Viewport: Above small breakpoint');
		} else {
			log('Viewport: Below small breakpoint');
		}
	};

	/**
	 * Unbind events, remove data, custom teardown
	 * @method
	 * @public
	 */
	Module.prototype.destroy = function() {
		// Unbind events, remove data
		estatico.helpers.SuperClass.prototype.destroy.apply(this);

		// Remove custom DOM elements
		this.$nav.remove();

		// Remove style definitions applied by $.slideUp / $.slideDown
		this.$slides.removeAttr('style');
	};

	// Make the plugin available through jQuery (and the global project namespace)
	estatico.helpers.SuperClass.register(Module, name, {
		initEvents: ['ready', 'ajaxload'],
		events: events
	});

})(jQuery);

import $ from '../../../../node_modules/jquery/dist/jquery';
import EstaticoModule from '../../../assets/js/modules/module';
import MediaQuery from '../../../assets/js/modules/mediaqueries';
import WindowEventListener from '../../../assets/js/modules/events';

var templates = {
		nav: require('./_slideshow_nav.js.hbs'),
		slide: require('./_slideshow_slide.js.hbs')
	};

class SlideShow extends EstaticoModule {

	constructor($element, data, options) {
		let _defaultData = {
			i18n: {
				prev: 'Previous Slide',
				next: 'Next Slide'
			}
		},
		_defaultOptions = {
			initialItem: 0,
			animationDuration: 300,
			url: '/mocks/demo/modules/slideshow/slideshow.json?delay=5000',
			stateClasses: {
				activated: 'is_activated'
			},
			domSelectors: {
				slides: '[data-' + SlideShow.name + '="slides"]',
				slide: '[data-' + SlideShow.name + '="slide"]',
				nav: '[data-' + SlideShow.name + '="nav"]',
				prev: '[data-' + SlideShow.name + '="prev"]',
				next: '[data-' + SlideShow.name + '="next"]'
			}
		};

		super($element, _defaultData, _defaultOptions, data, options, [MediaQuery.name, WindowEventListener.name]);

		this.currentItem = -1;
		this.logger = this.log(SlideShow.name);

		this._initUi();
		this._initEventListeners();
		this._fetchSlides();

		this.resize();
		this.show(this.options.initialItem);
	}

	static get events() {
		return {
			slide: 'slide.estatico.' + SlideShow.name
		};
	}

	/**
	 * Shows a specific slide according the given index.
	 * @method
	 * @public
	 * @param {Number} index - The index of the slide to show as integer.
	 */
	show(index) {
		if (index === this.currentItem) {
			return;
		}

		if (index >= this.ui.$slides.length) {
			index = 0;
		} else if (index < 0) {
			index = this.ui.$slides.length - 1;
		}

		this.ui.$slides.eq(this.currentItem).stop(true, true).slideUp(this.options.animationDuration);
		this.ui.$slides.eq(index).stop(true, true).slideDown(this.options.animationDuration);

		this.currentItem = index;

		this.ui.$element.trigger(SlideShow.events.slide, index);
	}

	/**
	 * Shows the previous slide in the slideshow.
	 * @method
	 * @public
	 */
	prev() {
		this.show(this.currentItem - 1);
	}

	/**
	 * Shows the next slide in the slideshow.
	 * @method
	 * @public
	 */
	next() {
		this.show(this.currentItem + 1);
	}

	/**
	 * Add slide.
	 * @method
	 * @public
	 */
	add(data) {
		var slide = templates.slide(data);

		$(slide).appendTo(this.ui.$wrapper);
	}

	/**
	 * Does things based on current viewport.
	 * @method
	 * @public
	 */
	resize() {
		if (this.mixins.mq.query({ from: 'small' })) {
			this.logger('Viewport: Above small breakpoint');
		} else {
			this.logger('Viewport: Below small breakpoint');
		}
	}

	_initUi() {
		this.ui.$wrapper = this.ui.$element.find(this.options.domSelectors.slides);
		this.ui.$slides = this.ui.$element.find(this.options.domSelectors.slide);
		this.ui.$nav = $(templates.nav(this.data));
		this.ui.$element
			.append(this.ui.$nav);

	}

	_initEventListeners() {
		this.ui.$element
			.on('click.' + SlideShow.name + '.' + this.uuid, this.options.domSelectors.prev, (event) => {
				event.preventDefault();
				this.prev();
			})
			.on('click.' + SlideShow.name + '.' + this.uuid, this.options.domSelectors.next, (event) => {
				event.preventDefault();
				this.next();
			})
			.addClass(this.options.stateClasses.activated);

		// Exemplary touch detection
		if (Modernizr.touchevents) {
			this.logger('Touch support detected');
		}

		// Exemplary debounced resize listener (uuid used to make sure it can be unbound per plugin instance)
		this.mixins.events.addResizeListener(() => {
			this.logger('originalEvent');
		});

		// Exemplary debounced scroll listener (uuid used to make sure it can be unbound per plugin instance)
		this.mixins.events.addScrollListener((event, originalEvent) => {
			this.logger(originalEvent);
		});

		// Exemplary media query listener (uuid used to make sure it can be unbound per plugin instance)
		this.mixins.mq.addMQChangeListener(this.resize.bind(this));
	}

	_fetchSlides() {
		// Exemplary AJAX request to mocked data with optional delay parameter (works with local preview server only)
		$.ajax(this.options.url).done((response) => {
			// Loop through slides and add them
			if (response.slides) {
				response.slides.forEach((slide) => {
					this.add(slide);
				});
			}
		}).fail((jqXHR) => {
			this.logger('NOO!', jqXHR.status, jqXHR.statusText);
		});
	}

	/**
	 * Unbind events, remove data, custom teardown
	 * @method
	 * @public
	 */
	destroy() {
		super.destroy();

		// Remove custom DOM elements
		this.ui.$nav.remove();

		// Remove style definitions applied by $.slideUp / $.slideDown
		this.ui.$slides.removeAttr('style');
	}
}

export default SlideShow;

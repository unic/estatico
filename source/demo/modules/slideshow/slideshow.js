import $ from '../../../../node_modules/jquery/dist/jquery';
import EstaticoModule from '../../../assets/js/module/module';
import MediaQuery from '../../../assets/js/module/mediaqueries';
import WindowEventListener from '../../../assets/js/module/events';

var templates = {
		nav: require('./_slideshow_nav.js.hbs'),
		slide: require('./_slideshow_slide.js.hbs')
	};

class SlideShow extends EstaticoModule {

	constructor($element, state, props) {
		let _defaultState = {
			currentItem: -1
		},
		_defaultProps = {
			initialItem: 0,
			animationDuration: 300,
			url: '/mocks/demo/modules/slideshow/slideshow.json?delay=5000',
			i18n: {
				prev: 'Previous Slide',
				next: 'Next Slide'
			}
		};

		super($element, _defaultState, _defaultProps, state, props, [MediaQuery.name, WindowEventListener.name]);

		this.logger = this.log(SlideShow.name);

		this.domSelectors = {
			slides: '[data-' + SlideShow.name + '="slides"]',
			slide: '[data-' + SlideShow.name + '="slide"]',
			nav: '[data-' + SlideShow.name + '="nav"]',
			prev: '[data-' + SlideShow.name + '="prev"]',
			next: '[data-' + SlideShow.name + '="next"]'
		};

		this._initUi();
		this._initEventListeners();
		this._fetchSlides();

		this.resize();
		this.show(this.props.initialItem);
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

		this.ui.$slides.eq(this.state.currentItem).stop(true, true).slideUp(this.props.animationDuration);
		this.ui.$slides.eq(index).stop(true, true).slideDown(this.props.animationDuration);

		this.state.currentItem = index;

		this.ui.$element.trigger(SlideShow.events.slide, index);
	}

	/**
	 * Shows the previous slide in the slideshow.
	 * @method
	 * @public
	 */
	prev() {
		this.show(this.state.currentItem - 1);
	}

	/**
	 * Shows the next slide in the slideshow.
	 * @method
	 * @public
	 */
	next() {
		this.show(this.state.currentItem + 1);
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
		this.ui.$wrapper = this.ui.$element.find(this.domSelectors.slides);
		this.ui.$slides = this.ui.$element.find(this.domSelectors.slide);
		this.ui.$nav = $(templates.nav(this.props));
		this.ui.$element
			.append(this.ui.$nav)
			.on('click.' + SlideShow.name + '.' + this.uuid, this.domSelectors.prev, (event) => {
				event.preventDefault();
				this.prev();
			})
			.on('click.' + SlideShow.name + '.' + this.uuid, this.domSelectors.next, (event) => {
				event.preventDefault();
				this.next();
			})
			.addClass('is_activated');
	}

	_initEventListeners() {
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
			this.logger('originalEvent');
		});

		// Exemplary media query listener (uuid used to make sure it can be unbound per plugin instance)
		this.mixins.mq.addMQChangeListener(this.resize.bind(this));
	}

	_fetchSlides() {
		// Exemplary AJAX request to mocked data with optional delay parameter (works with local preview server only)
		$.ajax(this.props.url).done((response) => {
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

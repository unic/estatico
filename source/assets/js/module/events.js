import $ from '../../../../node_modules/jquery/dist/jquery';
import debounce from '../../../../node_modules/lodash/function/debounce';

/**
 * Add debounced global resize and scroll events
 *
 * @license APLv2
 *
 * @example
 * // Listen to debounced scroll event:
 * $document.on(estatico.events.resize, function(event, originalEvent) {
 * 	console.log(originalEvent); // original scroll event
 * });
 */

class WindowEventListener {

	constructor() {
		this.$window = $(window);

		this.interval = {
			resize: 50,
			scroll: 50
		};
	}

	addResizeListener(callback) {
		this.$window.on('resize.estatico', () => {
			debounce(callback, this.interval.resize)();
		});
	}

	addScrollListener(callback) {
		this.$window.on('scroll.estatico', () => {
			debounce(callback, this.interval.scroll)();
		});
	}
}

export default WindowEventListener;

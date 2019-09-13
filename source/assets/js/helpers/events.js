import $ from 'jquery';
import debounce from 'lodash/debounce';
import throttle from 'raf-throttle';

/**
 * Adds debounced and throttled global resize and scroll events and generates public methods for adding handlers
 * e.g. for resize: addDebouncedResizeListener, for scroll: addDebouncedScrollListener
 *
 * @license APLv2
 *
 * @example
 * // Listen to debounced scroll event:
 * import WindowEventListener from './events';
 * WindowEventListener.addDebouncedScrollListener((originalEvent, event) => {
 *		this.log(event, originalEvent);
 * });
 */

class WindowEventListener {

	constructor() {
		this.$window = $(window);

		let events = {
			resize: {
				interval: 50
			},
			scroll: {
				interval: 50
			}
		};

		for (let eventName of Object.keys(events)) {
			this._registerDebouncedEvent(eventName, events[eventName]);
			this._registerThrottledEvent(eventName, events[eventName]);
		}
	}

	/**
	 * Window event has only one debounced handler.
	 * Achieved by triggering another fake event, which is the one we subscribe to
	 * @param {String} eventName
	 * @param {Object} config
	 * @private
	 */
	_registerDebouncedEvent(eventName, config) {
		let debouncedEventName = `debounced${eventName}.estatico`,
			methodName = eventName.charAt(0).toUpperCase() + eventName.slice(1);

		this.$window.on(eventName, debounce(function(event) {
			$(document).triggerHandler(debouncedEventName, event);
		}.bind(this), config.interval));

		// adds a public shorthand method, e.g. addResizeListener to the WindowEventListener class
		this[`addDebounced${methodName}Listener`] = this._addEventListener.bind(this, debouncedEventName);
		this[`removeDebounced${methodName}Listener`] = this._removeEventListener.bind(this, debouncedEventName);

		// Save to global namespace
		$.extend(true, estatico, { events: {} });
		estatico.events[debouncedEventName.split('.')[0]] = debouncedEventName;
	}

	/**
	 * Window event has only one throttled handler.
	 * Achieved by triggering another fake event, which is the one we subscribe to
	 * @param {String} eventName
	 * @private
	 */
	_registerThrottledEvent(eventName) {
		let throttledEventName = `throttled${eventName}.estatico`,
			methodName = eventName.charAt(0).toUpperCase() + eventName.slice(1);

		this.$window.on(eventName, throttle(function(event) {
			$(document).triggerHandler(throttledEventName, event);
		}.bind(this)));

		// adds a public shorthand method, e.g. addResizeListener to the WindowEventListener class
		this[`addThrottled${methodName}Listener`] = this._addEventListener.bind(this, throttledEventName);
		this[`removeThrottled${methodName}Listener`] = this._removeEventListener.bind(this, throttledEventName);

		// Save to global namespace
		$.extend(true, estatico, { events: {} });
		estatico.events[throttledEventName.split('.')[0]] = throttledEventName;
	}

	/**
	 * Adds callback as an event listener to the fake event.
	 * Uses unique ID if provided (might be handy to remove instance-specific handlers).
	 * @param {String} eventName
	 * @param {Function} callback
	 * @param {String} uuid - optional
	 * @private
	 */
	_addEventListener(eventName, callback, uuid) {
		if (uuid) {
			eventName = eventName + '.' + uuid;
		}

		$(document).on(eventName, callback);
	}

	/**
	 * Remove a callback from a fake event
	 * Uses unique ID if provided (might be handy to remove instance-specific handlers).
	 * @param {String} eventName
	 * @param {String} uuid - optional
	 * @private
	 */
	_removeEventListener(eventName, uuid) {
		if (uuid) {
			eventName = eventName + '.' + uuid;
		}

		$(document).off(eventName);
	}
}

// Exports an INSTANCE
export default new WindowEventListener();

import $ from 'jquery';
import debounce from 'lodash/debounce';
import throttle from 'lodash/throttle';

/**
 * Adds debounced global resize and scroll events and generates public methods for adding handlers
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
				interval: 50,
				throttleInterval: 10
			},
			scroll: {
				interval: 50,
				throttleInterval: 10
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
	 * @param eventName
	 * @param config
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
		estatico.events[eventName] = debouncedEventName;
	}

	_registerThrottledEvent(eventName, config) {
		let throttledEventName = `throttled${eventName}.estatico`,
			methodName = eventName.charAt(0).toUpperCase() + eventName.slice(1);

		this.$window.on(eventName, throttle(function(event) {
			$(document).triggerHandler(throttledEventName, event);
		}.bind(this), config.throttleInterval));

		// adds a public shorthand method, e.g. addResizeListener to the WindowEventListener class
		this[`addThrottled${methodName}Listener`] = this._addEventListener.bind(this, throttledEventName);
		this[`removeThrottled${methodName}Listener`] = this._removeEventListener.bind(this, throttledEventName);

		// Save to global namespace
		$.extend(true, estatico, { events: {} });
		estatico.events[eventName] = throttledEventName;
	}

	/**
	 * Adds callback as an event listener to the fake event.
	 * Uses unique ID if provided (might be handy to remove instance-specific handlers).
	 * @param eventName
	 * @param callback
	 * @param uuid
	 * @private
	 */
	_addEventListener(eventName, callback, uuid) {
		if (uuid) {
			eventName = eventName + '.' + uuid;
		}

		$(document).on(eventName, callback);
	}

	_removeEventListener(eventName, uuid) {
		if (uuid) {
			eventName = eventName + '.' + uuid;
		}

		$(document).off(eventName);
	}
}

// Exports an INSTANCE
export default new WindowEventListener();

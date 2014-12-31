;(function(window, document, $, Unic, undefined) {
	'use strict';

	var $document = $(document),
		pluginName = 'slideshow',
		$node = $('.mod_' + pluginName).eq(0),
		instance;

	// Setup QUnit module
	module('slideshow', {
		setup: function() {
			instance = $node.data('plugin_' + pluginName);
		},
		teardown: function() {
			instance.destroy();

			// Re-init
			$.fn[pluginName].apply($node, [{
				// Options
			}]);
		}
	});

	test('Test correct plugin registration', function(assert) {
		expect(2);

		assert.equal(typeof instance, 'object', 'Plugin instance is an object');
		assert.equal(typeof $.fn[pluginName], 'function', 'Plugin function registered to jQuery');
	});

	test('Test correct plugin init', function(assert) {
		expect(9);

		var $buttons = $node.find('button[data-' + pluginName + ']'),
			events = $._data($node.get(0), 'events'),
			docEvents = $._data($document.get(0), 'events'),
			clickEvents = _.filter(events.click, function(event) {
				return event.namespace === pluginName;
			}),
			resizeEvent = _.filter(docEvents[Unic.events.resize], function(event) {
				return event.namespace === instance.uuid;
			}),
			scrollEvent = _.filter(docEvents[Unic.events.scroll], function(event) {
				return event.namespace === instance.uuid;
			}),
			mqEvent = _.filter(docEvents[Unic.events.mq], function(event) {
				return event.namespace === instance.uuid;
			});

		assert.equal($buttons.length, 2, 'Two buttons found');

		_.each(clickEvents, function(event) {
			assert.equal(event.namespace, pluginName, 'Click events in correct namespace');
		});

		assert.equal(clickEvents.length, 2, 'Two click events attached to slideshow');

		assert.equal(events.click[0].selector, '[data-' + pluginName + '="prev"]', 'Prev button event reporting correct selector');
		assert.equal(events.click[1].selector, '[data-' + pluginName + '="next"]', 'Next button event reporting correct selector');

		assert.equal(resizeEvent.length, 1, 'Resize event set');
		assert.equal(scrollEvent.length, 1, 'Scroll event set');
		assert.equal(mqEvent.length, 1, 'Media-query event set');
	});

	test('Test correct plugin destroy', function(assert) {
		expect(5);

		instance.destroy();

		var $buttons = $node.find('button[data-' + pluginName + ']'),
			events = $._data($node.get(0), 'events'),
			docEvents = $._data($document.get(0), 'events'),
			resizeEvent = _.filter(docEvents[Unic.events.resize], function(event) {
				return event.namespace === instance.uuid;
			}),
			scrollEvent = _.filter(docEvents[Unic.events.scroll], function(event) {
				return event.namespace === instance.uuid;
			}),
			mqEvent = _.filter(docEvents[Unic.events.mq], function(event) {
				return event.namespace === instance.uuid;
			});
		assert.equal($buttons.length, 0, 'No more button found');

		assert.equal(typeof(events), 'undefined', 'No more click events attached to slideshow');

		assert.equal(resizeEvent.length, 0, 'Resize event unset');
		assert.equal(scrollEvent.length, 0, 'Scroll event unset');
		assert.equal(mqEvent.length, 0, 'Media-query event unset');
	});

	test('Test whether clicking prev button updates "currentItem" property', function(assert) {
		expect(1);

		var $button = $node.find('button.next');

		$button.trigger('click');

		assert.equal(instance.currentItem, 1, 'currentItem is 1');
	});

	test('Test whether "show" method updates "currentItem" property', function(assert) {
		expect(1);

		instance.show(2);

		assert.equal(instance.currentItem, 2, 'currentItem is 2');
	});

})(window, document, jQuery, Unic);

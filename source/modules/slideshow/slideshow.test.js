;(function(window, document, $, Unic, undefined) {
	'use strict';

	var $node,
		$document = $(document),
		pluginName = 'slideshow',
		originalHTML = null;

	module('slideshow', {
		setup: function(){
			$node = $('.mod_' + pluginName);

			$node.slideshow('destroy');

			if (originalHTML === null) {
				originalHTML = $node.html();
			} else {
				$node.html(originalHTML);
			}

			$.fn[pluginName].apply($('[data-init=' + pluginName +']'), [{
				// Options
			}]);
		},
		teardown: function() {
			$node.slideshow('destroy');

			$node.hide().children().remove();
		}
	});

	test('Test correct Plugin registration', function(assert) {
		expect(2);

		var instance = $node.data('plugin_slideshow');

		assert.equal(typeof instance, 'object', 'Plugin instance is an object');
		assert.equal(typeof $.fn[pluginName], 'function', 'Plugin function registered to jQuery');
	});

	test('Test correct Plugin init', function(assert) {
		expect(9);

		var $buttons = $node.find('button[data-slideshow]'),
			events = $._data($node.get(0), 'events'),
			docEvents = $._data($document.get(0), 'events');

		assert.equal($buttons.length, 2, 'Two buttons found');

		var clickEvents = _.filter(events['click'], function(event){
			return event.namespace === pluginName;
		});
		_.each(clickEvents, function(event){
			assert.equal(event.namespace, pluginName, 'Event in correct Namespace');
		});
		assert.equal(clickEvents.length, 2, 'Two Events attached to slideshow');

		var prevEvent = events.click[0];
		assert.equal(prevEvent.selector, '[data-slideshow="prev"]', 'Prev-Button Event correct selector');

		var nextEvent = events.click[1];
		assert.equal(nextEvent.selector, '[data-slideshow="next"]', 'Next-Button Event correct selector');

		var resizeEvent = _.filter(docEvents[Unic.events.resize], function(event){
			return event.namespace === pluginName;
		});
		assert.equal(resizeEvent.length, 1, 'Resize-Event set');

		var scrollEvent = _.filter(docEvents[Unic.events.scroll], function(event){
			return event.namespace === pluginName;
		});
		assert.equal(scrollEvent.length, 1, 'Scroll-Event set');

		var mqEvent = _.filter(docEvents[Unic.events.mq], function(event){
			return event.namespace === pluginName;
		});
		assert.equal(mqEvent.length, 1, 'MediaQuery-Event set');
	});

	test('Test correct Plugin destroy', function(assert) {
		expect(5);

		$node.slideshow('destroy');

		var $buttons = $node.find('button[data-slideshow]'),
			events = $._data($node.get(0), 'events'),
			docEvents = $._data($document.get(0), 'events');

		assert.equal($buttons.length, 0, 'No more button found');
		assert.equal(typeof(events), 'undefined', 'No more click events attached to slideshow');

		var resizeEvent = _.filter(docEvents[Unic.events.resize], function(event){
			return event.namespace === pluginName;
		});
		assert.equal(resizeEvent.length, 0, 'Resize-Event unset');

		var scrollEvent = _.filter(docEvents[Unic.events.scroll], function(event){
			return event.namespace === pluginName;
		});
		assert.equal(scrollEvent.length, 0, 'Scroll-Event unset');

		var mqEvent = _.filter(docEvents[Unic.events.mq], function(event){
			return event.namespace === pluginName;
		});
		assert.equal(mqEvent.length, 0, 'MediaQuery-Event unset');
	});

	test('Test whether clicking prev button updates "currentItem" property', function(assert) {
		expect(1);

		var $button = $node.find('button.next'),
			instance = $node.data('plugin_slideshow');

		$button.trigger('click');

		assert.equal(instance.currentItem, 1, 'currentItem is 1');
	});

	test('Test whether "show" method updates "currentItem" property', function(assert) {
		expect(1);

		var instance = $node.data('plugin_slideshow');

		instance.show(2);

		assert.equal(instance.currentItem, 2, 'currentItem is 2');
	});

})(window, document, jQuery, Unic);

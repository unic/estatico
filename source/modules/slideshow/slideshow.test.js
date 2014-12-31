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
		expect(6);

		var instance = $node.data('plugin_slideshow'),
			$buttons = $node.find('button[data-slideshow]'),
			events = $._data($node.get(0), 'events'),
			docEvents = $._data($document.get(0), 'events');

		assert.equal($buttons.length, 2, 'Two buttons found');
		assert.equal(events.click.length, 2, 'Two Events attached to slideshow');

		_.each(events.click, function(event){
			assert.equal(event.namespace, pluginName, 'Event in correct Namespace');
		});

		var prevEvent = events.click[0];
		assert.equal(prevEvent.selector, '[data-slideshow="prev"]', 'Prev-Button Event correct selector');

		var nextEvent = events.click[1];
		assert.equal(nextEvent.selector, '[data-slideshow="next"]', 'Next-Button Event correct selector');

		// TODO : The docEvents do not have namespace set?
		console.log(docEvents);

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

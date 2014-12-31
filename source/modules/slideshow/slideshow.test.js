;(function(window, document, $, Unic, undefined) {
	'use strict';

	var $node,
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

	test('Test whether plugin instance was saved on DOM element', function(assert) {
		expect(1);

		var $slideshow = $('.mod_slideshow'),
			instance = $slideshow.data('plugin_slideshow');

		assert.ok(typeof instance === 'object', 'Plugin instance is an object');
	});

	test('Test whether nav buttons were added', function(assert) {
		expect(1);

		var $slideshow = $('.mod_slideshow'),
			$buttons = $slideshow.find('button[data-slideshow]');

		assert.ok($buttons.length === 2, 'Two buttons found');
	});

	test('Test whether clicking prev button updates "currentItem" property', function(assert) {
		expect(1);

		var $slideshow = $('.mod_slideshow'),
			$button = $slideshow.find('button.next'),
			instance = $slideshow.data('plugin_slideshow');

		$button.trigger('click');

		assert.ok(instance.currentItem === 1, 'currentItem is 1');
	});

	test('Test whether "show" method updates "currentItem" property', function(assert) {
		expect(1);

		var $slideshow = $('.mod_slideshow'),
			instance = $slideshow.data('plugin_slideshow');

		instance.show(2);

		assert.ok(instance.currentItem === 2, 'currentItem is 2');
	});

})(window, document, jQuery, Unic);

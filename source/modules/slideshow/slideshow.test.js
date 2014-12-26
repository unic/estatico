'use strict';

QUnit.test('Test whether plugin instance was saved on DOM element', function(assert) {
	var $slideshow = $('.mod_slideshow'),
		instance = $slideshow.data('plugin_slideshow');

	assert.ok(typeof instance === 'object', 'Plugin instance is an object');
});

QUnit.test('Test whether nav buttons were added', function(assert) {
	var $slideshow = $('.mod_slideshow'),
		$buttons = $slideshow.find('button[data-slideshow]');

	assert.ok($buttons.length === 2, 'Two buttons found');
});

QUnit.test('Test whether clicking "prev" button updates currentItem property', function(assert) {
	var $slideshow = $('.mod_slideshow'),
		$button = $slideshow.find('button.next'),
		instance = $slideshow.data('plugin_slideshow');

	$button.trigger('click');

	assert.ok(instance.currentItem === 1, 'currentItem is 1');
});

'use strict';

var QUnit = require('qunitjs'),
	$ = require('jquery');

var moduleName = 'slideshow',
	$node = $('.mod_' + moduleName).eq(0),
	instance;

// Setup QUnit module
QUnit.module('slideshow', {
	setup: function() {
		instance = $node.data(moduleName + '-instance');
	},

	teardown: function() {
		instance.destroy();

		// Re-init
		$.fn[moduleName].apply($node, [{
			// Options
		}]);
	}
});

QUnit.test('Test correct plugin registration', function(assert) {
	QUnit.expect(2);

	assert.equal(typeof instance, 'object', 'Plugin instance is an object');
	assert.equal(typeof $.fn[moduleName], 'function', 'Plugin function registered to jQuery');
});

QUnit.test('Test correct plugin init', function(assert) {
	QUnit.expect(7);

	var $buttons = $node.find('button[data-' + moduleName + ']'),
		events = $._data($node.get(0), 'events') || {},
		docEvents = $._data(document, 'events'),
		clickEvents = $.grep(events.click || [], function(event) {
			return $.inArray(instance.uuid, event.namespace.split('.')) !== -1;
		}),

		resizeEvent = $.grep(docEvents[estatico.events.resize.key.split('.')[0]] || [], function(event) {
			return $.inArray(instance.uuid, event.namespace.split('.')) !== -1;
		}),

		scrollEvent = $.grep(docEvents[estatico.events.scroll.key.split('.')[0]] || [], function(event) {
			return $.inArray(instance.uuid, event.namespace.split('.')) !== -1;
		}),

		mqEvent = $.grep(docEvents[estatico.events.mq.key.split('.')[0]] || [], function(event) {
			return $.inArray(instance.uuid, event.namespace.split('.')) !== -1;
		});

	assert.equal($buttons.length, 2, 'Two buttons found');

	assert.equal(clickEvents.length, 2, 'Two click events attached to slideshow');

	assert.equal(events.click[0].selector, '[data-' + moduleName + '="prev"]', 'Prev button event reporting correct selector');
	assert.equal(events.click[1].selector, '[data-' + moduleName + '="next"]', 'Next button event reporting correct selector');

	assert.equal(resizeEvent.length, 1, 'Resize event set');
	assert.equal(scrollEvent.length, 1, 'Scroll event set');
	assert.equal(mqEvent.length, 1, 'Media-query event set');
});

QUnit.test('Test correct plugin destroy', function(assert) {
	QUnit.expect(5);

	instance.destroy();

	console.log(estatico.events);

	var $buttons = $node.find('button[data-' + moduleName + ']'),
		events = $._data($node.get(0), 'events') || {},
		docEvents = $._data(document, 'events'),
		clickEvents = $.grep(events.click || [], function(event) {
			return $.inArray(instance.uuid, event.namespace.split('.')) !== -1;
		}),

		resizeEvent = $.grep(docEvents[estatico.events.resize.key.split('.')[0]] || [], function(event) {
			return $.inArray(instance.uuid, event.namespace.split('.')) !== -1;
		}),

		scrollEvent = $.grep(docEvents[estatico.events.scroll.key.split('.')[0]] || [], function(event) {
			return $.inArray(instance.uuid, event.namespace.split('.')) !== -1;
		}),

		mqEvent = $.grep(docEvents[estatico.events.mq.key.split('.')[0]] || [], function(event) {
			return $.inArray(instance.uuid, event.namespace.split('.')) !== -1;
		});

	assert.equal($buttons.length, 0, 'No more button found');

	assert.equal(clickEvents.length, 0, 'No more click events attached to slideshow');

	assert.equal(resizeEvent.length, 0, 'Resize event unset');
	assert.equal(scrollEvent.length, 0, 'Scroll event unset');
	assert.equal(mqEvent.length, 0, 'Media-query event unset');
});

QUnit.test('Test whether clicking prev button updates "currentItem" property', function(assert) {
	QUnit.expect(1);

	var $button = $node.find('button.next');

	$button.trigger('click');

	assert.equal(instance.currentItem, 1, 'currentItem is 1');
});

QUnit.test('Test whether "show" method updates "currentItem" property', function(assert) {
	QUnit.expect(1);

	instance.show(2);

	assert.equal(instance.currentItem, 2, 'currentItem is 2');
});

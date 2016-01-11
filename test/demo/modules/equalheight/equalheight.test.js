;(function($, undefined) {
	'use strict';

	var name = 'equalheight',
		$node = $('.mod_' + name).eq(0),
		instance;

	// Setup QUnit module
	module('equalheight', {
		setup: function() {
			instance = Modernizr.flexbox ? undefined : $node.data(name + '-instance');
		},

		teardown: function() {
			if (!Modernizr.flexbox) {
				instance.destroy();

				// Re-init
				$.fn[name].apply($node, [{
					// Options
				}]);
			}
		}
	});

	test('Test correct plugin registration', function(assert) {
		expect(2);

		assert.equal(
			typeof instance,
			Modernizr.flexbox ? 'undefined' : 'object',
			Modernizr.flexbox ? 'Flexbox supported: plugin instance is undefined' : 'Flexbox NOT supported: Plugin instance is an object'
		);
		assert.equal(
			typeof $.fn[name],
			Modernizr.flexbox ? 'undefined' : 'function',
			Modernizr.flexbox ? 'Flexbox supported: Plugin function not registered to jQuery' : 'Flexbox NOT supported: Plugin function registered to jQuery'
		);
	});

	test('Test correct plugin init', function(assert) {
		var docEvents, resizeEvent;

		expect(1);

		docEvents = $._data(document, 'events');
		resizeEvent = $.grep(docEvents[estatico.events.resize.split('.')[0]] || [], function(event) {
			return $.inArray(instance.uuid, event.namespace.split('.')) !== -1;
		});

		assert.equal(
			resizeEvent.length,
			Modernizr.flexbox ? 0 : 1,
			Modernizr.flexbox ? 'Flexbox supported: Resize event not needed' : 'Flexbox NOT supported: Resize event set'
		);
	});

	test('Test correct plugin destroy', function(assert) {
		var docEvents, resizeEvent;

		expect(1);

		if (!Modernizr.flexbox) {
			instance.destroy();
		}

		docEvents = $._data(document, 'events');
		resizeEvent = $.grep(docEvents[estatico.events.resize.split('.')[0]] || [], function(event) {
			return $.inArray(instance.uuid, event.namespace.split('.')) !== -1;
		});

		assert.equal(
			resizeEvent.length,
			0,
			Modernizr.flexbox ? 'Flexbox supported: nothing needed' : 'Flexbox NOT supported: Resize event unset'
		);
	});

})(jQuery);

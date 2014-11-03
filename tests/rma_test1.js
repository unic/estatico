;(function($, window, document, Unic, undefined) {
	'use strict';

	var $document = $(document),
			$node,
			pluginName = 'cart';

	QUnit.module('Cart', {
		setup: function(){
			Unic.testData.setup();

			$node = $('.js_' + pluginName + '_tests');
		},
		teardown: function() {
			Unic.testData.teardown();
		}
	});

	QUnit.test('Cart initialized', function(){
		var eventHandler = $._data( $node.find('[data-'+ pluginName +'=init]').get(0), 'events' );
		ok(eventHandler['click'], 'click-event is bound');
		ok(eventHandler['click'][0].namespace, 'click-event is in correct namespace');

		var docEventHandler = $._data( document, "events" );
		ok(docEventHandler[Unic.modules.product.EVENT_PRODUCT_SELECT], 'product.EVENT_PRODUCT_SELECT is bound');
	});

	QUnit.test('add product to cart - whitebox', function(){
		equal($node.find('[data-' + pluginName + '=init]').children().length, '0', 'Cart is empty before click');

		$document.trigger(Unic.modules.product.EVENT_PRODUCT_SELECT, {id: '111', name: "Banana"});

		var $entry = $node.find('[data-' + pluginName + '=init]').children();
		equal($entry.length, '1', 'Cart has 1 entry after click');
		equal($entry.text().replace(/[\s\n\r]+/g, "") .replace('delete', ''), 'Banana111', 'Cart has the right entry');
	});

	QUnit.test('add product to cart - blackbox', function(){
		equal($node.find('[data-' + pluginName + '=init]').children().length, '0', 'Cart is empty before click');

		$document.find('[data-product=item]:eq(0)').click();

		var $entry = $node.find('[data-' + pluginName + '=init]').children();
		equal($entry.length, '1', 'Cart has 1 entry after click');
		equal($entry.text().replace(/[\s\n\r]+/g, "") .replace('delete', ''), 'Banana111', 'Cart has the right entry');
	});

	QUnit.test('remove product from cart', function(){
		$document.trigger(Unic.modules.product.EVENT_PRODUCT_SELECT, {id: '111', name: "Banana"});

		var $entry = $node.find('[data-' + pluginName + '=init]').children();
		equal($entry.length, '1', 'Cart has 1 entry');

		$entry.find('[data-' + pluginName + '=remove]').click();

		equal($node.find('[data-' + pluginName + '=init]').children().length, '0', 'Cart is empty after remove');
	});

})(jQuery, window, document, Unic);

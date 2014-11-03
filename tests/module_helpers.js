;(function($, window, document, Unic, undefined) {
	'use strict';

	var $document = $(document);

	Unic.testData = Unic.testData || {};
	Unic.testData.$originalNode = Unic.testData.$originalNode || $('.js_tests');
	Unic.testData.originalHtml = Unic.testData.originalHtml || Unic.testData.$originalNode.html();

	Unic.testData.setup = function(){
		Unic.testData.$originalNode.show();

		if (!Unic.testData.firstRun) {
			Unic.testData.firstRun = 'done';
		}
		else {
			Unic.testData.$originalNode.html(Unic.testData.originalHtml);

			// Cannot trigger ready, therefore call the init here.
			$.fn['cart'].apply($('[data-cart=init]'), [{
				// Options
			}]);

			// Cannot trigger ready, therefore call the init here.
			$.fn['product'].apply($('[data-product=init]'), [{
				// Options
			}]);

			// Cannot trigger ready, therefore call the init here.
			$.fn['itemcount'].apply($('[data-itemcount=init]'), [{
				// Options
			}]);
		}
	};
	Unic.testData.teardown = function(){
		Unic.testData.$originalNode.hide().children().remove();

		Unic.testData.$originalNode.find('[data-cart=init]').off('.cart');
		Unic.testData.$originalNode.find('[data-product=init]').off('.product');
		Unic.testData.$originalNode.find('[data-itemcount=init]').off('.itemcount');

		$document.off(Unic.modules.cart.EVENT_PRODUCT_ADDED);
		$document.off(Unic.modules.cart.EVENT_PRODUCT_REMOVED);
		$document.off(Unic.modules.product.EVENT_PRODUCT_SELECT);
	};

})(jQuery, window, document, Unic);

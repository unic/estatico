/**
 * Load and init QUnit
 */

'use strict';

var $ = require('jquery'),
	QUnit = require('qunitjs'),
	css = require('qunitjs/qunit/qunit.css');

QUnit.config.autostart = false;

$(document).on('ready', function(){
	var $container = $('#qunit'),
		$button = $('<button>Run QUnit tests</button>'),
		startTests = function() {
			$container.show();
			$button.remove();

			QUnit.start();
		};

	if ($.isEmptyObject(QUnit.urlParams)) {
		$container.hide();

		$button
			.insertAfter($container)
			.on('click', function() {
				startTests();
			});
	} else {
		startTests();
	}
});

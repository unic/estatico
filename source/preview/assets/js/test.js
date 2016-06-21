/**
 * Handles the QUnit-functionality for estatico.
 *
 */

'use strict';

import $ from '../../../../node_modules/jquery/dist/jquery';
import QUnit from 'qunitjs';
// import css from 'qunitjs/qunit/qunit.css';

QUnit.config.autostart = false;

$(document).on('ready', function(){
	let $container = $('#qunit'),
		$button = $('<button>Run QUnit tests</button>'),
		startTests() {
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

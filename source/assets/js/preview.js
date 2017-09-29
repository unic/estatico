import $ from 'jquery';

$(function() {
	let initialVariant = window.location.hash.substr(1),
		reservedIds = [/* 'changelog', 'documentation'*/],
		selectVariant = () => {
			let currentVariant = window.location.hash.substr(1),
				$currentVariant = $('#' + currentVariant),
				event;

			if (!$currentVariant.length) {
				return;
			}

			$currentVariant.prop('checked', true);

			if (typeof window.CustomEvent === 'function') {
				event = new CustomEvent('force_init');
			} else {
				event = document.createEvent('CustomEvent');

				event.initCustomEvent('force_init', true, true, {});
			}

			setTimeout(function() {
				document.dispatchEvent(event);
			}, 0);
		};

	// Persist variant changes to URL
	$('[name="variants"]').on('change', (event) => {
		window.location.hash = $(event.target).attr('id');
	});

	// Select variant on hashChange
	$(window).on('hashchange', () => {
		selectVariant();
	});

	// Select initial variant
	setTimeout(() => {
		if (initialVariant && reservedIds.indexOf(initialVariant) === -1) {
			selectVariant();

			$('html, body').scrollTop(0);
		}
	}, 0);

});

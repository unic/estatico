import $ from 'jquery';

$(function() {
	let initialVariant = window.location.hash.substr(1),
		reservedIds = [/* 'changelog', 'documentation'*/],
		selectVariant = () => {
			let currentVariant = window.location.hash.substr(1),
				$currentVariant = currentVariant.length ? $('#' + currentVariant) : $([]);
			
			setTimeout(() => {
				if ($currentVariant.length && initialVariant && reservedIds.indexOf(initialVariant) === -1) {
					$currentVariant.prop('checked', true);
					$(document).trigger('force_init');
					$('html, body').scrollTop(0);
				}
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
	selectVariant();
});

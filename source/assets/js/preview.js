import $ from 'jquery';

$(function() {
	let initialVariant = window.location.hash.substr(1);

	const reservedIds = [/* 'changelog', 'documentation'*/],
		$variants = $('[name="variants"]'),
		selectVariant = () => {
			const currentVariant = window.location.hash.substr(1);
			let $currentVariant = $([]);

			if (currentVariant.length) {
				$currentVariant = $('#' + currentVariant);
			} else if ($variants.length) {
				$currentVariant = $variants.first();
			}

			if (!initialVariant) {
				initialVariant = $currentVariant[0].id;
			}

			window.requestAnimationFrame(() => {
				if ($currentVariant.length && initialVariant && reservedIds.indexOf(initialVariant) === -1) {
					$currentVariant.prop('checked', true);
					window.dispatchEvent(new Event('resize'));
					$(document).trigger('force_init');
				}
			});
		};

	// Persist variant changes to URL
	$variants.on('change', (event) => {
		window.location.hash = $(event.target).attr('id');
	});

	// Select variant on hashChange
	$(window).on('hashchange', selectVariant);

	// Select initial variant
	selectVariant();
});

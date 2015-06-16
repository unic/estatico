/**
 * Init registered modules on specified events
 *
 * @license APLv2
 */

;(function($, undefined) {
	'use strict';

	var $document = $(document),
		initEvents = estatico.helpers.initEvents || {},
		keys = $.map(initEvents, function(modules, event) {
			return event;
		});

	if (keys.length === 0) {
		return;
	}

	$document.on(keys.join(' '), function(event) {
		var initPlugins = initEvents[event.type];

		$('[data-init]').each(function() {
			var $this = $(this),
				plugins = $this.data('init').split(' ');

			for (var i = 0; i < plugins.length; i++) {
				if ($.inArray(plugins[i], initPlugins) !== -1) {
					$.fn[plugins[i]].apply($this);
				}
			}
		});
	});

})(jQuery);

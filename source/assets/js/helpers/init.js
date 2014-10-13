/**
 * @class       initevents
 * @classdesc   Init registered modules.
 * @author      Thomas Jaggi, Unic AG
 * Edited By
 * @license     All rights reserved Unic AG
 *
 * @requires ../../vendor/jquery/jquery.js
 * @requires ../../.tmp/lodash.js
 * @requires module.js
 */

;(function(window, document, $, _, Unic, undefined) {
	'use strict';

	var initEvents = _.keys(Unic.modules.PluginInitEvents);

	if (initEvents.length === 0) {
		return;
	}

	$(document).on(initEvents.join(' '), function(event) {
		var initPlugins = Unic.modules.PluginInitEvents[event.type];

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
})(window, document, jQuery, _, Unic);

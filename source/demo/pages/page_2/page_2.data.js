'use strict';

var dataHelper = require('../../../../helpers/data.js');

module.exports = dataHelper.getExtendedData({
	meta: {
		title: 'Demo: 02 Page (custom teasers)'
	},
	title: 'Page (custom teasers)',
	text: 'This page demonstrates the inclusion of a module with custom data.',
	modules: {
		skiplinks: require('../../modules/skiplinks/skiplinks.data.js'),
		teasers: {
			teasers: dataHelper.tools.map(['Custom Teaser 1', 'Custom Teaser 2', 'Custom Teaser 3'], function(value) {
				return {
					title: value,
					text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.'
				};
			})
		}
	}
});

'use strict';

var dataHelper = require('../../../../helpers/data.js');

module.exports = dataHelper.getExtendedData({
	meta: {
		title: 'Demo: 01 Page'
	},
	title: 'Page',
	text: 'This page demonstrates the inclusion of a module.',
	modules: {
		skiplinks: dataHelper.tools.requireNew('../../modules/skiplinks/skiplinks.data.js'),
		teasers: dataHelper.tools.requireNew('../../modules/teasers/teasers.data.js')
	}
});

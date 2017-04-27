'use strict';

var dataHelper = require('../../../../helpers/data.js');

module.exports = dataHelper.getExtendedData({
	meta: {
		title: 'Demo: 05 Unit test on page',
		testScripts: [
			dataHelper.getTestScriptPath('../../modules/slideshow/slideshow.test.js')
		]
	},
	title: 'Unit test',
	text: 'This page demonstrates the customized initialization of a module and allows to run its JavaScript unit tests.',
	modules: {
		skiplinks: dataHelper.tools.requireNew('../../modules/skiplinks/skiplinks.data.js'),
		slideshow: dataHelper.tools.requireNew('../../modules/slideshow/slideshow.data.js')
	}
});

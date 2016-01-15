'use strict';

var _ = require('lodash'),
	requireNew = require('require-new'),
	dataHelper = require('../../../../helpers/data.js'),
	defaultData = requireNew('../../../data/default.data.js');

var data = _.merge(defaultData, {
		meta: {
			title: 'Demo: 05 Unit test on page',
			testScripts: [
				dataHelper.getTestScriptPath('../../modules/slideshow/slideshow.test.js')
			]
		},
		title: 'Unit test',
		text: 'This page demonstrates the customized initialization of a module and allows to run its JavaScript unit tests.',
		modules: {
			skiplinks: requireNew('../../modules/skiplinks/skiplinks.data.js'),
			slideshow: requireNew('../../modules/slideshow/slideshow.data.js')
		}
	});

module.exports = data;

'use strict';

var _ = require('lodash'),
	requireNew = require('require-new'),
	dataHelper = require('../../../../helpers/data.js'),
	defaultData = requireNew('../../../data/default.data.js');

var data = _.merge(defaultData, {
		meta: {
			title: 'Demo: Slideshow',
			jira: 'JIRA-4',
			code: dataHelper.getTemplateCode('slideshow.hbs'),
			documentation: dataHelper.getDocumentation('slideshow.md'),
			testScripts: [
				dataHelper.getTestScriptPath('slideshow.test.js')
			],
			mocks: [
				{
					description: null,
					data: dataHelper.getDataMock('slideshow.mock.js')
				}
			]
		},
		slides: _.map(['600/201', '600/202', '600/203'], function(size, index) {
			return {
				src: 'http://www.fillmurray.com/' + size,
				alt: 'Bill Murray ' + (index + 1)
			};
		}),

		i18n: {
			prev: 'Previous Slide',
			next: 'Next Slide'
		}
	});

module.exports = data;

'use strict';

var _ = require('lodash'),
	requireNew = require('require-new'),
	dataHelper = requireNew('../../../../helpers/data.js'),
	handlebarsHelper = requireNew('../../../../helpers/handlebars.js'),
	defaultData = requireNew('../../../data/default.data.js'),

	moduleData = {
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
	},
	template = dataHelper.getFileContent('slideshow.hbs'),
	compiledTemplate = handlebarsHelper.Handlebars.compile(template)(moduleData),
	data = _.merge(defaultData, moduleData, {
		meta: {
			title: 'Demo: Slideshow',
			className: 'SlideShow',
			jira: 'JIRA-4',
			demo: compiledTemplate,
			code: {
				handlebars: dataHelper.getFormattedHandlebars(template),
				html: dataHelper.getFormattedHtml(compiledTemplate),
				data: dataHelper.getFormattedJson(moduleData)
			},
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
		}
	});

module.exports = data;

'use strict';

var _ = require('lodash'),
	requireNew = require('require-new'),
	dataHelper = requireNew('../../../../helpers/data.js'),
	handlebarsHelper = requireNew('../../../../helpers/handlebars.js'),
	defaultData = requireNew('../../../data/default.data.js'),

	moduleData = {
		links: [
			{
				href: '#main',
				accesskey: 1,
				title: '[ALT + 1]',
				label: 'Skip to content'
			}
		]
	},
	template = dataHelper.getFileContent('skiplinks.hbs'),
	compiledTemplate = handlebarsHelper.Handlebars.compile(template)(moduleData),
	data = _.merge(defaultData, moduleData, {
		meta: {
			title: 'Demo: Skiplinks',
			jira: 'JIRA-5',
			demo: compiledTemplate,
			code: {
				handlebars: dataHelper.getFormattedHandlebars(template),
				html: dataHelper.getFormattedHtml(compiledTemplate),
				data: dataHelper.getFormattedJson(moduleData)
			}
		}
	});

module.exports = data;

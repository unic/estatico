'use strict';

var _ = require('lodash'),
	requireNew = require('require-new'),
	dataHelper = requireNew('../../../../helpers/data.js'),
	handlebarsHelper = requireNew('../../../../helpers/handlebars.js'),
	defaultData = requireNew('../../../data/default.data.js'),

	moduleData = {},
	template = dataHelper.getFileContent('media.hbs'),
	compiledTemplate = handlebarsHelper.Handlebars.compile(template)(moduleData),
	data = _.merge(defaultData, moduleData, {
		meta: {
			title: 'Demo: Media demo',
			jira: 'JIRA-3',
			demo: compiledTemplate,
			code: {

				// handlebars: dataHelper.getFormattedHandlebars(template)
				html: dataHelper.getFormattedHtml(compiledTemplate)

				// data: dataHelper.getFormattedJson(moduleData)
			}
		}
	});

module.exports = data;

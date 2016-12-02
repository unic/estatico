'use strict';

var _ = require('lodash'),
	requireNew = require('require-new'),
	dataHelper = requireNew('../../../../helpers/data.js'),
	handlebarsHelper = requireNew('../../../../helpers/handlebars.js'),
	defaultData = requireNew('../../../data/default.data.js'),

	moduleData = {},
	template = dataHelper.getFileContent('imageversions.hbs'),
	compiledTemplate = handlebarsHelper.compile(template)(moduleData),
	data = _.merge(defaultData, {
		meta: {
			title: 'Demo: Image versions',
			demo: compiledTemplate,
			code: {

				// handlebars: dataHelper.getFormattedHandlebars(template),
				html: dataHelper.getFormattedHtml(compiledTemplate)

				// data: dataHelper.getFormattedJson(moduleData)
			},
			documentation: dataHelper.getDocumentation('imageversions.md')
		},
		module: moduleData
	});

module.exports = data;

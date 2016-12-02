'use strict';

var _ = require('lodash'),
	requireNew = require('require-new'),
	dataHelper = requireNew('../../../helpers/data.js'),
	handlebarsHelper = requireNew('../../../helpers/handlebars.js'),
	defaultData = requireNew('../../data/default.data.js'),

	moduleData = {}, // Add data to be passed to the module template
	template = dataHelper.getFileContent('{{name}}.hbs'),
	compiledTemplate = handlebarsHelper.compile(template)(moduleData),
	data = _.merge(defaultData, {
		meta: {
			title: '{{originalName}}',
			className: '{{className}}',
			keyName: '{{keyName}}',
			jira: 'ESTATICO-*',
			demo: compiledTemplate,
			code: {
				handlebars: dataHelper.getFormattedHandlebars(template),
				html: dataHelper.getFormattedHtml(compiledTemplate),
				data: dataHelper.getFormattedJson(moduleData)
			},
			documentation: dataHelper.getDocumentation('{{name}}.md')
		},
		module: moduleData
	});

module.exports = data;

'use strict';

var _ = require('lodash'),
	requireNew = require('require-new'),
	dataHelper = requireNew('../../../../helpers/data.js'),
	handlebarsHelper = requireNew('../../../../helpers/handlebars.js'),
	defaultData = requireNew('../../../data/default.data.js'),
	teaserData = requireNew('../teaser/teaser.data.js'),

	moduleData = {
		teasers: _.map(['Teaser 1', 'Teaser 2', 'Teaser 3', 'Teaser 4'], function(value) {
			return _.merge({}, teaserData, {
				title: value
			});
		})
	},
	template = dataHelper.getFileContent('teasers.hbs'),
	compiledTemplate = handlebarsHelper.compile(template)(moduleData),
	data = _.merge(defaultData, moduleData, {
		meta: {
			title: 'Demo: Teasers',
			jira: 'JIRA-1',
			feature: 'Feature X',
			demo: compiledTemplate,
			code: {
				handlebars: dataHelper.getFormattedHandlebars(template),
				html: dataHelper.getFormattedHtml(compiledTemplate),
				data: dataHelper.getFormattedJson(moduleData)
			}
		}
	});

module.exports = data;

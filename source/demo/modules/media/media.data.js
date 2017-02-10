'use strict';

var _ = require('lodash'),
	requireNew = require('require-new'),
	dataHelper = requireNew('../../../../helpers/data.js'),
	handlebarsHelper = requireNew('../../../../helpers/handlebars.js'),
	defaultData = requireNew('../../../data/default.data.js'),

	template = dataHelper.getFileContent('media.hbs'),
	data = _.merge(defaultData, {
		meta: {
			title: 'Demo: Media demo',
			jira: 'JIRA-3'
		},
		props: {}
	}),
	variants = [
		{
			meta: {
				title: 'Default',
				desc: 'Default implementation'
			}
		}
	].map(function(variant) {
		var variantProps = _.merge({}, data, variant).props,
			compiledVariant = handlebarsHelper.Handlebars.compile(template)(variantProps),
			variantData = _.merge({}, data, variant, {
				meta: {
					demo: compiledVariant

					// code: {
					// 	handlebars: dataHelper.getFormattedHandlebars(template),
					// 	html: dataHelper.getFormattedHtml(compiledVariant),
					// 	data: dataHelper.getFormattedJson(variantProps)
					// }
				}
			});

		return variantData;
	});

data.variants = variants;

module.exports = data;

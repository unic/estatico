'use strict';

var _ = require('lodash'),
	requireNew = require('require-new'),
	dataHelper = requireNew('../../../../helpers/data.js'),
	handlebarsHelper = requireNew('../../../../helpers/handlebars.js'),
	defaultData = requireNew('../../../data/default.data.js'),

	template = dataHelper.getFileContent('skiplinks.hbs'),
	data = _.merge(defaultData, {
		meta: {
			title: 'Demo: Skiplinks',
			jira: 'JIRA-5'
		},
		props: {
			links: [
				{
					href: '#main',
					accesskey: 1,
					title: '[ALT + 1]',
					label: 'Skip to content'
				}
			]
		}
	}),
	variants = _.mapValues({
		default: {
			meta: {
				title: 'Default',
				desc: 'Default implementation'
			}
		}
	}, function(variant) {
		var variantProps = _.merge({}, data, variant).props,
			compiledVariant = handlebarsHelper.Handlebars.compile(template)(variantProps),
			variantData = _.merge({}, data, variant, {
				meta: {
					demo: compiledVariant,
					code: {
						handlebars: dataHelper.getFormattedHandlebars(template),
						html: dataHelper.getFormattedHtml(compiledVariant),
						data: dataHelper.getFormattedJson(variantProps)
					}
				}
			});

		return variantData;
	});

data.variants = variants;

module.exports = data;

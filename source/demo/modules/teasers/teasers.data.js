'use strict';

var _ = require('lodash'),
	requireNew = require('require-new'),
	dataHelper = requireNew('../../../../helpers/data.js'),
	handlebarsHelper = requireNew('../../../../helpers/handlebars.js'),
	defaultData = requireNew('../../../data/default.data.js'),
	teaserData = requireNew('../teaser/teaser.data.js').props,

	template = dataHelper.getFileContent('teasers.hbs'),
	data = _.merge(defaultData, {
		meta: {
			title: 'Demo: Teasers',
			jira: 'JIRA-1',
			feature: 'Feature X'
		},
		props: {
			teasers: _.map(['Teaser 1', 'Teaser 2', 'Teaser 3', 'Teaser 4'], function(value) {
				return _.merge({}, teaserData, {
					title: value
				});
			})
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
			compiledVariant = function() {
				return handlebarsHelper.Handlebars.compile(template())(variantProps);
			},
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

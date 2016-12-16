'use strict';

var _ = require('lodash'),
	requireNew = require('require-new'),
	dataHelper = requireNew('../../../../helpers/data.js'),
	handlebarsHelper = requireNew('../../../../helpers/handlebars.js'),
	defaultData = requireNew('../../../data/default.data.js'),

	moduleData = {
		title: 'Teaser title',
		text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.'
	},
	template = dataHelper.getFileContent('teaser.hbs'),
	compiledTemplate = handlebarsHelper.compile(template)(moduleData),
	data = _.merge(defaultData, moduleData, {
		meta: {
			title: 'Demo: Teaser with module variants',
			demo: compiledTemplate

			// code: {
			// 	handlebars: dataHelper.getFormattedHandlebars(template),
			// 	html: dataHelper.getFormattedHtml(compiledTemplate),
			// 	data: dataHelper.getFormattedJson(moduleData)
			// }
		}
	}),
	variants = [
		{
			meta: {
				title: 'Default',
				desc: 'Default implemention.'
			}
		},
		{
			meta: {
				title: 'No text',
				desc: 'Used when there are no words.'
			},
			title: 'Teaser title'
		},
		{
			meta: {
				title: 'Inverted',
				desc: 'Used at night. Set `variant` to `var_inverted`.'
			},
			title: 'Teaser title',
			text: 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
			variant: 'var_inverted'
		}
	].map(function(variant) {
		var compiledVariant = handlebarsHelper.compile(template)(variant),
			variantData = _.merge({}, data, variant, {
				meta: {
					demo: compiledVariant,
					code: {
						handlebars: dataHelper.getFormattedHandlebars(template),
						html: dataHelper.getFormattedHtml(compiledVariant),
						data: dataHelper.getFormattedJson(variant)
					}
				}
			});

		// delete variantData.meta.code.handlebars;

		return variantData;
	});

data.variants = variants;

module.exports = data;

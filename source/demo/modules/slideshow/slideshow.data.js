'use strict';

var _ = require('lodash'),
	requireNew = require('require-new'),
	dataHelper = requireNew('../../../../helpers/data.js'),
	handlebarsHelper = requireNew('../../../../helpers/handlebars.js'),
	defaultData = requireNew('../../../data/default.data.js'),

	template = dataHelper.getFileContent('slideshow.hbs'),
	data = _.merge(defaultData, {
		meta: {
			title: 'Demo: Slideshow',
			className: 'SlideShow',
			jira: 'JIRA-4',
			documentation: dataHelper.getDocumentation('slideshow.md'),
			testScripts: [
				'slideshow.test.js'
			],
			mocks: [
				{
					description: null,
					data: dataHelper.getDataMock('slideshow.mock.js')
				}
			]
		},
		props: {
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

'use strict';

var _ = require('lodash'),
	requireNew = require('require-new'),
	glob = require('glob'),
	path = require('path'),
	spriteTask = require('../../../../gulp/media/svgsprite.js'),
	dataHelper = requireNew('../../../../helpers/data.js'),
	handlebarsHelper = requireNew('../../../../helpers/handlebars.js'),
	defaultData = requireNew('../../../data/default.data.js'),

	template = dataHelper.getFileContent('svgsprite.hbs'),
	sprites = _.mapValues(spriteTask.taskConfig.src, function(globs) {
		var files = [];

		globs.forEach(function(item) {

			var paths = glob.sync(item);

			paths = paths.map(function(file) {
				return path.basename(file, path.extname(file));
			});

			files = files.concat(paths);
		});

		return files;
	}),
	data = _.merge(defaultData, {
		meta: {
			title: 'Demo: SVG icons',
			jira: 'ESTATICO-212',
			documentation: dataHelper.getDocumentation('svgsprite.md')
		},
		props: {
			svgSprites: JSON.stringify(JSON.parse(defaultData.props.svgSprites || '[]').concat([
				'/assets/media/svg/demo.svg'
			])),
			preview: sprites
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

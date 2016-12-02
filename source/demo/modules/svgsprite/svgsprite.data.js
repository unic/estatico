'use strict';

var _ = require('lodash'),
	requireNew = require('require-new'),
	glob = require('glob'),
	path = require('path'),
	spriteTask = require('../../../../gulp/media/svgsprite.js'),
	dataHelper = requireNew('../../../../helpers/data.js'),
	handlebarsHelper = requireNew('../../../../helpers/handlebars.js'),
	defaultData = requireNew('../../../data/default.data.js'),

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

	moduleData = {
		svgSprites: JSON.stringify(JSON.parse(defaultData.svgSprites || '[]').concat([
			'/assets/media/svg/demo.svg'
		])),
		preview: sprites
	},
	template = dataHelper.getFileContent('svgsprite.hbs'),
	compiledTemplate = handlebarsHelper.compile(template)(moduleData),
	data = _.merge(defaultData, {
		meta: {
			title: 'Demo: SVG icons',
			jira: 'ESTATICO-212',
			demo: compiledTemplate,
			code: {
				handlebars: dataHelper.getFormattedHandlebars(template),
				html: dataHelper.getFormattedHtml(compiledTemplate)
			},
			documentation: dataHelper.getDocumentation('svgsprite.md')
		},
		module: moduleData
	});

module.exports = data;

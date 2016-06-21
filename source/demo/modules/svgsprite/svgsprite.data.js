'use strict';

var _ = require('lodash'),
	requireNew = require('require-new'),
	glob = require('glob'),
	path = require('path'),
	spriteTask = require('../../../../gulp/media/svgsprite.js'),
	dataHelper = require('../../../../helpers/data.js'),
	defaultData = requireNew('../../../data/default.data.js');

var sprites = _.mapValues(spriteTask.taskConfig.src, function(globs) {
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
			code: dataHelper.getTemplateCode('svgsprite.hbs'),
			documentation: dataHelper.getDocumentation('svgsprite.md')
		},
		svgSprites: JSON.stringify(JSON.parse(defaultData.svgSprites || '[]').concat([
			'/assets/media/svg/demo.svg'
		])),
		preview: sprites
	});

module.exports = data;

'use strict';

/**
 * @function `gulp html`
 * @desc Compile Twig templates to HTML. Use `.data.js` files for - surprise! - data.
 */

var gulp = require('gulp');

var taskName = 'html',
	taskConfig = {
		src: [
			'./source/*.twig',
			'./source/pages/**/*.twig',
			'./source/demo/pages/**/*.twig',
			'./source/modules/**/!(_)*.twig',
			'./source/demo/modules/**/!(_)*.twig',
			'./source/preview/styleguide/*.twig'
		],
		srcBase: './source',
		srcModulePreview: './source/preview/layouts/module.twig',
		includes: [
			'source/layouts/*.twig',
			'source/modules/**/*.twig',
			'source/demo/modules/**/*.twig',
			'source/preview/**/*.twig'
		],
		dest: './build/',
		watch: [
			'source/*.twig',
			'source/layouts/*.twig',
			'source/pages/**/*.twig',
			'source/demo/pages/**/*.twig',
			'source/modules/**/*.twig',
			'source/demo/modules/**/*.twig',
			'source/preview/**/*.twig',
			'source/data/**/*.data.js',
			'source/pages/**/*.data.js',
			'source/demo/pages/**/*.data.js',
			'source/modules/**/*.data.js',
			'source/demo/modules/**/*.data.js',
			'source/preview/**/*.data.js',
			'source/modules/**/*.md',
			'source/demo/modules/**/*.md',
			'source/assets/css/data/colors.html'
		]
	},
	includeCache = {};

gulp.task(taskName, function(cb) {
	var helpers = require('require-dir')('../../helpers'),
		plumber = require('gulp-plumber'),
		livereload = require('gulp-livereload'),
		util = require('gulp-util'),
		requireNew = require('require-new'),
		path = require('path'),
		fs = require('fs'),
		tap = require('gulp-tap'),
		rename = require('gulp-rename'),

		// Format HTML (disabled due to incorrect resulting indentation)
		// prettify = require('gulp-prettify'),
		_ = require('lodash');

	var modulePreviewTemplate;

	helpers.twig.registerIncludes(taskConfig.includes, includeCache);

	gulp.src(taskConfig.src, {
			base: './source'
		})
		.pipe(plumber())
		.pipe(tap(function(file) {
			var content = file.contents.toString(),
				dataFile = util.replaceExtension(file.path, '.data.js'),
				data = (function() {
					try {
						return requireNew(dataFile);
					} catch (err) {
						helpers.errors({
							task: taskName,
							message: 'Error reading "' + path.relative('./', dataFile) + '": ' + err,
							stack: err.stack
						});

						return {};
					}
				})(),

				mergedData;

			// Render template
			try {
				// Precompile module demo and variants
				if (file.path.indexOf(path.sep + 'modules' + path.sep) !== -1) {
					modulePreviewTemplate = modulePreviewTemplate || fs.readFileSync(taskConfig.srcModulePreview, 'utf8');

					data.demo = helpers.twig.render(content, data);

					// Compile variants
					if (data.variants) {
						data.variants = data.variants.map(function(variant) {
							variant.demo = helpers.twig.render(content, variant);
						});

						mergedData = _.extend({}, _.omit(data, ['project', 'env', 'meta', 'variants']), {
								meta: {
									title: 'Default',
									desc: 'Default implemention.'
								}
							}
						);

						data.variants.unshift(mergedData);
					}

					// Replace file content with preview template
					content = modulePreviewTemplate;
				}

				file.contents = new Buffer(helpers.twig.render(content, data));
			} catch (err) {
				helpers.errors({
					task: taskName,
					message: 'Error rendering "' + path.relative('./', file.path) + '": ' + err

					// stack: err.stack
				});
			}
		}).on('error', helpers.errors))

		// Relativify absolute paths
		.pipe(tap(function(file) {
			var content = file.contents.toString(),
				relPathPrefix = path.join(path.relative(file.path, './source'));

			relPathPrefix = relPathPrefix
				.replace(new RegExp('\\' + path.sep, 'g'), '/') // Normalize path separator
				.replace(/\.\.$/, ''); // Remove trailing ..

			content = content.replace(/('|")\//g, '$1' + relPathPrefix);

			file.contents = new Buffer(content);
		}))

		// .pipe(prettify({
		// 	indent_with_tabs: true,
		// 	max_preserve_newlines: 1
		// }))
		.pipe(rename({
			extname: '.html'
		}))
		.pipe(gulp.dest(taskConfig.dest))
		.on('finish', function() {
			livereload.reload();

			cb();
		});
});

module.exports = {
	taskName: taskName,
	taskConfig: taskConfig
};

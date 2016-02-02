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
		partials: [
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
	};

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
		_ = require('lodash'),
		twig = require('gulp-twig'),
		Twig = require('twig');

	var modulePreviewTemplate;

	gulp.src(taskConfig.src, {
			base: './source'
		})
		.pipe(tap(function(file) {
			var dataFile = util.replaceExtension(file.path, '.data.js'),
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

				moduleTemplate,
				mergedData;

			// Precompile module demo and variants
			if (file.path.indexOf(path.sep + 'modules' + path.sep) !== -1) {
				moduleTemplate = file.contents.toString();
				modulePreviewTemplate = modulePreviewTemplate || fs.readFileSync(taskConfig.srcModulePreview, 'utf8');

				data.demo = Twig.twig({
					data: moduleTemplate
				}).render(data);

				// Compile variants
				if (data.variants) {
					data.variants = data.variants.map(function(variant) {
						variant.demo = Twig.twig({
							data: moduleTemplate
						}).render(variant);

						return variant;
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
				file.contents = new Buffer(modulePreviewTemplate);
			}

			// Save data by file name
			file.data = data;
		}))
		.pipe(plumber())
		.pipe(twig({
			includes: taskConfig.partials,
			data: function(file) {
				return file.data;
			},

			getIncludeId: function(filePath) {
				return path.relative('./source', filePath);
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

'use strict';

/**
 * @function `gulp html`
 * @desc Compile Handlebars templates to HTML. Use `.data.js` files for - surprise! - data.
 * By default, a very basic dependency graph makes sure that only the necessary files are rebuilt on changes. Add the `--skipHtmlDependencyGraph` flag to disable this behavior and just build everything all the time.
 */

var gulp = require('gulp'),
	util = require('gulp-util');

var taskName = 'html',
	taskConfig = {
		src: [
			'./source/*.hbs',
			'./source/pages/**/*.hbs',
			'./source/demo/pages/**/*.hbs',
			'./source/modules/**/!(_)*.hbs',
			'./source/demo/modules/**/!(_)*.hbs',
			'./source/preview/styleguide/*.hbs'
		],
		srcModulePreview: './source/preview/layouts/module.hbs',
		partials: [
			'source/layouts/*.hbs',
			'source/modules/**/*.hbs',
			'source/demo/modules/**/*.hbs',
			'source/preview/**/*.hbs'
		],
		partialPathBase: './source',
		dest: './build/',
		watch: [
			'source/*.hbs',
			'source/layouts/*.hbs',
			'source/pages/**/*.hbs',
			'source/demo/pages/**/*.hbs',
			'source/modules/**/*.hbs',
			'source/demo/modules/**/*.hbs',
			'source/preview/**/*.hbs',
			'source/data/**/*.data.js',
			'source/pages/**/*.data.js',
			'source/demo/pages/**/*.data.js',
			'source/modules/**/*.data.js',
			'source/demo/modules/**/*.data.js',
			'source/preview/**/*.data.js',
			'source/modules/**/*.md',
			'source/demo/modules/**/*.md',
			'source/assets/css/data/colors.html'
		],
		returnChangedFileOnWatch: !util.env.skipHtmlDependencyGraph
	},
	task = function(config, cb, changedFile) {
		var helpers = require('require-dir')('../../helpers'),
			plumber = require('gulp-plumber'),
			livereload = require('gulp-livereload'),
			requireNew = require('require-new'),
			path = require('path'),
			fs = require('fs'),
			tap = require('gulp-tap'),
			rename = require('gulp-rename'),

			// Format HTML (disabled due to incorrect resulting indentation)
			// prettify = require('gulp-prettify'),
			_ = require('lodash'),
			handlebars = require('gulp-hb'),
			through = require('through2');

		var compileTemplate = function(template, data) {
				try {
					return helpers.handlebars.compile(template)(data);
				} catch (err) {
					helpers.errors({
						task: taskName,
						message: err.message
					});

					return '';
				}
			},

			modulePreviewTemplate;

		gulp.src(config.src, {
				base: './source'
			})
			.pipe(through.obj(function(file, enc, done) {
				if (!changedFile) {
					this.push(file);
					return done();
				}

				// Create dependency graph of currently piped file
				var dependencyGraph = new helpers.dependencygraph(file.path, {
						pattern: /{{>[\s-]*"(.*?)"(.*?)}}/g,
						resolvePath: function(match) {
							var resolvedPath = path.resolve('./source/', match + '.hbs');

							if (!fs.existsSync(resolvedPath)) {
								util.log(util.colors.cyan(taskName), util.colors.red(resolvedPath + ' not found'));
							}

							return resolvedPath;
						}
					}),
					dataDependencyGraph = new helpers.dependencygraph(file.path.replace(path.extname(file.path), '.data.js'), {
						pattern: /requireNew\(\'(.*?\.data\.js)\'\)/g,
						resolvePath: function(match, filePath) {
							var resolvedPath = path.resolve(path.dirname(filePath), match);

							return resolvedPath;
						}
					});

				// Add data files to main graph
				dependencyGraph.combine(dataDependencyGraph);

				// Add .md file to graph
				dependencyGraph.add(file.path.replace(path.extname(file.path), '.md'));

				// Check if the changed file is part or the currently piped file's dependency graph
				// Remove file from pipeline otherwise
				if (dependencyGraph.contains(changedFile)) {
					util.log(util.colors.cyan(taskName), 'Rebuilding ' + file.path + ' ...');

					this.push(file);
				}

				done();
			}))
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
					modulePreviewTemplate = modulePreviewTemplate || fs.readFileSync(config.srcModulePreview, 'utf8');

					data.demo = compileTemplate(moduleTemplate, data);

					// Compile variants
					if (data.variants) {
						data.variants = data.variants.map(function(variant) {
							variant.demo = compileTemplate(moduleTemplate, variant);

							return variant;
						});

						mergedData = _.extend({}, _.omit(data, ['project', 'env', 'meta', 'variants']), {
								meta: {
									title: 'Default',
									desc: 'Default implementation.'
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
			.pipe(handlebars({
				handlebars: helpers.handlebars,
				partials: config.partials,
				parsePartialName: function(options, file) {
					var filePath = file.path;

					// Relative to base
					filePath = path.relative(config.partialPathBase, filePath);

					// Remove extension
					filePath = filePath.replace(path.extname(filePath), '');

					// Use forward slashes on every OS
					filePath = filePath.replace(new RegExp('\\' + path.sep, 'g'), '/');

					return filePath;
				},

				bustCache: true,
				dataEach: function(context, file) {
					return file.data;
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
			.pipe(gulp.dest(config.dest))
			.on('finish', function() {
				livereload.reload();

				cb();
			});
	};

gulp.task(taskName, function(cb) {
	return task(taskConfig, cb);
});

module.exports = {
	taskName: taskName,
	taskConfig: taskConfig,
	task: task
};

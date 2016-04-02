'use strict';

/**
 * @function `gulp scaffold`
 * @desc Scaffold new module or page, add references to module to `main.scss` and `main.js` unless specified otherwise.
 *
 * * Prompts for type and details of new element.
 * * Non-interactive mode: `gulp scaffold --interactive=false --type={Module|Page|Demo Module|Demo Page} --name="Hello World" --createScript={true|false} --createStyles={true|false}`
 */

var gulp = require('gulp');

var taskName = 'scaffold',
	taskConfig = {
		types: {
			module: {
				name: 'Module',
				src: './source/modules/.scaffold',
				dest: './source/modules/',
				hasAssets: true
			},
			page: {
				name: 'Page',
				src: './source/pages/.scaffold',
				dest: './source/pages/',
				allowUnderscores: true
			},
			demoModule: {
				name: 'Demo Module',
				src: './source/modules/.scaffold',
				dest: './source/demo/modules/',
				hasAssets: true
			},
			demoPage: {
				name: 'Demo Page',
				src: './source/pages/.scaffold',
				dest: './source/demo/pages/',
				allowUnderscores: true
			}
		},
		registerStyles: {
			src: './source/assets/css/main.scss',
			insertionPoint: '//*autoinsertmodule*',
			insertionPrefix: '@import "',
			insertionSuffix: '";\n'
		},
		registerScript: {
			src: './source/assets/js/main.js',
			insertionPoint: ' * //*autoinsertmodule*',
			insertionPrefix: ' * @requires ',
			insertionSuffix: '.js\n'
		},

		// Generated dynamically
		scaffold: {
			name: null,
			originalName: null,
			previousName: 'scaffold',
			deletePrevious: false,
			src: null,
			dest: null,
			createStyles: false,
			createScript: false,
			replaceContentExtensions: ['.js', '.scss', '.hbs', '.md'],
			replaceContent: function(content, config) {
				return content.replace(/\{\{name\}\}/g, config.name)
					.replace(/\{\{originalName\}\}/g, config.originalName);
			}
		}
	},
	getTaskScaffoldConfig = function(config, cb) {
		var helpers = require('require-dir')('../../helpers'),
			scaffoldConfig = {},
			hasAssets;

		// Get custom config and pass to task
		helpers.scaffold.getType(config.types, {
				prompt: 'What do you want to create?'
			})
			.then(function(response) {
				scaffoldConfig.src = response.src;
				scaffoldConfig.dest = response.dest;

				hasAssets = response.hasAssets;

				return helpers.scaffold.getName(response.name, response.dest, {
					allowUnderscores: response.allowUnderscores
				});
			})
			.then(function(response) {
				scaffoldConfig.name = response.sanitized;
				scaffoldConfig.originalName = response.original;

				if (hasAssets) {
					return helpers.scaffold.getAssetsToCreate();
				}
			})
			.then(function(response) {
				if (response) {
					scaffoldConfig.createStyles = response.styles;
					scaffoldConfig.createScript = response.script;
				}

				cb(scaffoldConfig);
			})
			.catch(helpers.errors);
	},

	task = function(config, cb) {
		var tap = require('gulp-tap'),
			through = require('through2'),
			path = require('path'),
			rename = require('gulp-rename'),
			helpers = require('require-dir')('../../helpers'),
			livereload = require('gulp-livereload'),
			deleteTask = require('./delete'),
			_ = require('lodash'),
			merge = require('merge-stream');

		var src = path.join(config.scaffold.src, '/**'),
			dest = path.join(config.scaffold.dest, config.scaffold.name),
			stylesFound,
			scriptFound;

		gulp.src(src)

			// Replace {{name|originalName}}
			.pipe(tap(function(file) {
				if (!file.stat.isDirectory() && config.scaffold.replaceContentExtensions.indexOf(path.extname(file.path)) !== -1) {
					var content = file.contents.toString();

					content = config.scaffold.replaceContent(content, config.scaffold);

					file.contents = new Buffer(content);
				}
			}))

			// Skip creation of SCSS file if specified
			.pipe(through.obj(function(file, enc, done) {
				var match = (path.extname(file.path) === '.scss');

				if (match) {
					stylesFound = true;

					if (config.scaffold.createStyles) {
						this.push(file);
					}
				} else {
					this.push(file);
				}

				done();
			}))

			// Skip creation of JS file if specified
			.pipe(through.obj(function(file, enc, done) {
				var match = (path.extname(file.path) === '.js' && !path.basename(file.path).match(/.data.js$/));

				if (match) {
					scriptFound = true;

					if (config.scaffold.createScript) {
						this.push(file);
					}
				} else {
					this.push(file);
				}

				done();
			}))

			// Rename files as specified in scaffolding config
			.pipe(rename(function(filePath) {
				filePath.basename = filePath.basename.replace(config.scaffold.previousName, config.scaffold.name);
			}))
			.pipe(gulp.dest(dest))
			.on('end', function() {
				var dest = path.join(config.scaffold.dest, config.scaffold.name),
					destAssets = path.join(dest, config.scaffold.name),
					tasks = [],
					callback = function(fn) {
						if (tasks.length > 0) {
							merge(tasks).on('finish', fn);
						} else {
							fn();
						}
					},

					registerStyles,
					registerScript,
					deleteConfig;

				// Add @import to main.scss
				if (config.scaffold.createStyles && stylesFound) {
					registerStyles = gulp.src(config.registerStyles.src)
						.pipe(tap(function(file) {
							file.contents = helpers.scaffold.addModule(file, destAssets, config.registerStyles);
						}))
						.pipe(gulp.dest(path.dirname(config.registerStyles.src)))
						.pipe(livereload());

					tasks.push(registerStyles);
				}

				// Add @requires to main.js
				if (config.scaffold.createScript && scriptFound) {
					registerScript = gulp.src(config.registerScript.src)
						.pipe(tap(function(file) {
							file.contents = helpers.scaffold.addModule(file, destAssets, config.registerScript);
						}))
						.pipe(gulp.dest(path.dirname(config.registerScript.src)))
						.pipe(livereload());

					tasks.push(registerScript);
				}

				// Delete original files if specified
				if (config.scaffold.deletePrevious) {
					deleteConfig = _.merge({}, config, {
						scaffold: {
							name: config.scaffold.previousName,
							deregisterStyles: config.scaffold.createStyles,
							deregisterScript: config.scaffold.createScript
						}
					});

					callback(function() {
						deleteTask.task(deleteConfig, cb);
					});
				} else {
					callback(cb);
				}
			});
	};

gulp.task(taskName, function(cb) {
	var _ = require('lodash');

	getTaskScaffoldConfig(taskConfig, function(scaffoldConfig) {
		var config = _.merge(taskConfig, {
				scaffold: scaffoldConfig
			});

		task(config, cb);
	});
});

module.exports = {
	taskName: taskName,
	taskConfig: taskConfig,
	task: task,
	getTaskScaffoldConfig: getTaskScaffoldConfig
};

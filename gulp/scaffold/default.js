'use strict';

/**
 * @function `gulp scaffold`
 * @desc Scaffold new module or page, add references to module to `main.scss` and `main.js`.
 *
 * * Prompts for type and details of new element.
 * * Non-interactive mode: `gulp scaffold --interactive=false type={Module|Page} name="My Module"`
 */

var gulp = require('gulp');

var taskName = 'scaffold',
	taskConfig = {
		srcModule: './source/modules/.scaffold/*',
		srcPage: './source/pages/.scaffold/*',
		destPrefixModule: './source/modules/',
		destPrefixPage: './source/pages/',
		srcStyles: './source/assets/css/main.scss',
		srcScripts: './source/assets/js/main.js'
	};

gulp.task(taskName, function(cb) {
	var helpers = require('require-dir')('../../helpers'),
		livereload = require('gulp-livereload'),
		util = require('gulp-util'),
		tap = require('gulp-tap'),
		_ = require('lodash'),
		ignore = require('gulp-ignore'),
		rename = require('gulp-rename'),
		changeCase = require('change-case'),
		inquirer = require('inquirer'),
		fs = require('fs'),
		path = require('path'),
		merge = require('merge-stream');

	var getName = function(originalName, type) {
			var name = changeCase.snake(originalName);

			// Only pages are allowed to contain underscores
			return (type === 'Module') ? name.replace(/_/g, '') : name;
		},
		getSrcPath = function(type) {
			return (type === 'Module') ? taskConfig.srcModule : taskConfig.srcPage;
		},
		getDestPath = function(name, type) {
			var prefix = (type === 'Module') ? taskConfig.destPrefixModule : taskConfig.destPrefixPage;

			return prefix + name;
		},
		validatePath = function(originalName, type) {
			var name = getName(originalName, type),
				destPath = getDestPath(name, type);

			if (fs.existsSync(destPath)) {
				return type + ' with the name "' + name + '" already exists';
			} else {
				return true;
			}
		},
		callback = function(originalName, cb, options) {
			var name,
				srcPath,
				destPath,
				validate;

			options = _.merge({
				type: 'Module',
				createScript: true,
				createStyles: true
			}, options);

			name = getName(originalName, options.type);
			srcPath = getSrcPath(options.type);
			destPath = getDestPath(name, options.type);

			if (util.env.interactive === 'false') {
				if (!name) {
					helpers.errors({
						task: taskName,
						message: '--name not specified'
					});

					return cb();
				}

				validate = validatePath(name, options.type);

				if (validate !== true) {
					helpers.errors({
						task: taskName,
						message: validate
					});

					return cb();
				}
			}

			gulp.src(srcPath)
				// Replace {{name|originalName}}
				.pipe(tap(function(file) {
					var content = file.contents.toString()
							.replace(/\{\{name\}\}/g, name)
							.replace(/\{\{originalName\}\}/g, originalName);

					file.contents = new Buffer(content);
				}))
				// Skip creation of SCSS file if specified
				.pipe((options.type === 'Module' && options.createStyles) ? util.noop() : ignore.exclude('*.scss'))
				// Skip creation of JS file if specified
				.pipe((options.type === 'Module' && options.createScript) ? util.noop() : ignore.exclude('*!(.data).js'))
				.pipe(rename(function(path) {
					if (path.basename.match('.data')) {
						path.extname = '.data' + path.extname;
					}

					path.basename = name;
				}))
				.pipe(gulp.dest(destPath))
				.on('end', function() {
					var tasks = [],
						css,
						js;

					if (options.type === 'Module' && options.createStyles) {
						// Add @import to main.scss
						css = gulp.src(taskConfig.srcStyles)
							.pipe(tap(function(file) {
								var cssImport = '@import "' + name + '/' + name + '";\n//*autoinsertmodule*',
									content = file.contents.toString().replace(/\/\/\*autoinsertmodule\*/, cssImport);

								file.contents = new Buffer(content);
							}))
							.pipe(gulp.dest(path.dirname(taskConfig.srcStyles)))
							.pipe(livereload());

						tasks.push(css);
					}

					if (options.type === 'Module' && options.createScript) {
						// Add @requires to main.js
						js = gulp.src(taskConfig.srcScripts)
							.pipe(tap(function(file) {
								var cssImport = '@requires ../../modules/' + name + '/' + name + '.js\n * //*autoinsertmodule*',
									content = file.contents.toString().replace(/\/\/\*autoinsertmodule\*/, cssImport);

								file.contents = new Buffer(content);
							}))
							.pipe(gulp.dest(path.dirname(taskConfig.srcScripts)))
							.pipe(livereload());

						tasks.push(js);
					}

					// Make sure the main task finishes only after the sub tasks are done
					if (tasks.length > 0) {
						merge(tasks).on('finish', cb);
					} else {
						cb();
					}
				});
		};

	if (util.env.interactive !== 'false') {
		inquirer.prompt([
			{
				type: 'list',
				name: 'type',
				message: 'What do you want to create?',
				choices: ['Module', 'Page']
			},
			{
				type: 'input',
				name: 'name',
				message: 'What is the name of your module?',
				validate: function(value) {
					var validate = validatePath(value, 'Module');

					if (value) {
						return validate;
					} else {
						return 'Please enter a name';
					}
				},
				when: function(answers) {
					return answers.type === 'Module';
				}
			},
			{
				type: 'input',
				name: 'name',
				message: 'What is the name of your page?',
				validate: function(value) {
					var validate = validatePath(value, 'Page');

					if (value) {
						return validate;
					} else {
						return 'Please enter a name';
					}
				},
				when: function(answers) {
					return answers.type === 'Page';
				}
			},
			{
				type: 'confirm',
				name: 'createScript',
				message: 'Do you want me to create and register a JavaScript file?',
				default: true,
				when: function(answers) {
					return answers.type === 'Module';
				}
			},
			{
				type: 'confirm',
				name: 'createStyles',
				message: 'Do you want me to create and register a SCSS file?',
				default: true,
				when: function(answers) {
					return answers.type === 'Module';
				}
			}
		], function(answers) {
			callback(answers.name, cb, answers);
		});
	} else {
		callback(util.env.name, cb, {
			type: util.env.type,
			createStyles: (util.env.createStyles !== 'false'),
			createScript: (util.env.createScript !== 'false')
		});
	}
});

module.exports = {
	taskName: taskName,
	taskConfig: taskConfig
};

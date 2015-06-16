'use strict';

/**
 * @function `gulp scaffold:delete`
 * @desc Remove modules, pages or all demo files and delete references in `main.scss` and `main.js`.
 *
 * * Prompts for type and name of element to be deleted.
 * * Non-interactive mode: `gulp scaffold:delete --interactive=false type={Module|Page} name=my_module`
 */

var gulp = require('gulp');

var taskName = 'scaffold:delete',
	taskConfig = {
		srcModules: './source/modules/',
		srcPages: './source/pages/',
		srcDemos: './source/demo/',
		srcStyles: './source/assets/css/main.scss',
		srcScripts: './source/assets/js/main.js'
	};

gulp.task(taskName, function(cb) {
	var helpers = require('require-dir')('../../helpers'),
		livereload = require('gulp-livereload'),
		util = require('gulp-util'),
		tap = require('gulp-tap'),
		inquirer = require('inquirer'),
		glob = require('glob'),
		del = require('del'),
		fs = require('fs'),
		path = require('path'),
		merge = require('merge-stream');

	var getDirs = function(dir) {
			var dirs = glob.sync(dir + '*').filter(function(file) {
					return fs.statSync(file).isDirectory();
				}).map(function(file) {
					return path.basename(file);
				});

			if (dirs.length > 0) {
				return dirs;
			} else {
				return [{
					name: '(Nothing found)',
					value: false
				}];
			}
		},
		deleteModule = function(name, cb) {
			var css = gulp.src(taskConfig.srcStyles)
					.pipe(tap(function(file) {
						var content = file.contents.toString().replace('@import "' + name + '/' + name + '";\n', '');

						file.contents = new Buffer(content);
					}))
					.pipe(gulp.dest(path.dirname(taskConfig.srcStyles)))
					.pipe(livereload()),
				js = gulp.src(taskConfig.srcScripts)
					.pipe(tap(function(file) {
						var content = file.contents.toString().replace(' * @requires ../../modules/' + name + '/' + name + '.js\n', '');

						file.contents = new Buffer(content);
					}))
					.pipe(gulp.dest(path.dirname(taskConfig.srcScripts)))
					.pipe(livereload());

			merge([css, js]).on('finish', function() {
				del(path.join(taskConfig.srcModules, name), cb);
			});
		},
		deletePage = function(name, cb) {
			del(path.join(taskConfig.srcPages, name), cb);
		},
		deleteDemos = function(cb) {
			var css = gulp.src(taskConfig.srcStyles)
					.pipe(tap(function(file) {
						var content = file.contents.toString().replace(/\/\/\*startdemomodules\*[\s\S]*\/\/\*enddemomodules\*\n/g, '');

						file.contents = new Buffer(content);
					}))
					.pipe(gulp.dest(path.dirname(taskConfig.srcStyles)))
					.pipe(livereload()),
				js = gulp.src(taskConfig.srcScripts)
					.pipe(tap(function(file) {
						var content = file.contents.toString().replace(/ \* \/\/\*startdemomodules\*[\s\S]*\* \/\/\*enddemomodules\*\n/g, '');

						file.contents = new Buffer(content);
					}))
					.pipe(gulp.dest(path.dirname(taskConfig.srcScripts)))
					.pipe(livereload());

			merge([css, js]).on('finish', function() {
				del(taskConfig.srcDemos, cb);
			});
		},
		callback = function(type, cb, options) {
			if (type === 'Demos') {
				deleteDemos(cb);
			} else {
				if (!options.name) {
					helpers.errors({
						task: taskName,
						message: '--name not specified'
					});

					return cb();
				}

				if (type === 'Module') {
					deleteModule(options.name, cb);
				} else if (type === 'Page') {
					deletePage(options.name, cb);
				}
			}
		};

	if (util.env.interactive !== 'false') {
		inquirer.prompt([
			{
				type: 'list',
				name: 'type',
				message: 'What do you want to delete?',
				choices: ['Module', 'Page', 'Demos']
			},
			{
				type: 'list',
				name: 'name',
				message: 'Which one?',
				choices: getDirs(taskConfig.srcModules),
				when: function(answers) {
					return answers.type === 'Module';
				}
			},
			{
				type: 'list',
				name: 'name',
				message: 'Which one?',
				choices: getDirs(taskConfig.srcPages),
				when: function(answers) {
					return answers.type === 'Page';
				}
			}
		], function(answers) {
			callback(answers.type, cb, answers);
		});
	} else {
		callback(util.env.type, cb, {
			name: util.env.name
		});
	}
});

module.exports = {
	taskName: taskName,
	taskConfig: taskConfig
};

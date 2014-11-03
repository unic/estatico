'use strict';

/**
 * Required tasks for unittesting.
 */

var gulp = require('gulp'),
		helpers = require('require-dir')('../../helpers'),
		path = require('path'),
		_ = require('lodash'),

		// Plugins (both "gulp-*" and "gulp.*")
		plugins = require('gulp-load-plugins')({
			pattern: 'gulp{-,.}*',
			replaceString: /gulp(\-|\.)/
		});

gulp.task('qunit:default', function() {
	var data = {};

	return gulp.src([
		'./source/{,pages/,modules/**/}!(_)*.hbs'
	])
	.pipe(plugins.tap(function(file) {
		var fileName = path.relative('./source/', file.path).replace(path.extname(file.path), '').replace(/\\/g, '/'),
				dataFile = plugins.util.replaceExtension(file.path, '.json'),
				fileData = {
					previewUrl: plugins.util.replaceExtension(fileName, '.html'),
				},
				modulePrepend = new Buffer('{{#extend "assets/vendor/unic-preview/layouts/layout"}}{{#replace "content"}}'),
				moduleAppend = new Buffer('{{/replace}}{{/extend}}'),
				testScripts = [];

		// Find JSON file with the same name as the template
		try {
			fileData = _.merge(fileData, JSON.parse(fs.readFileSync(dataFile)));
		} catch (err) {}

		if (file.path.indexOf('modules') !== -1) {
			fileData.isModule = true;
			fileData.code = file.contents.toString();

			// Wrap modules with custom layout for preview purposes
			file.contents = Buffer.concat([modulePrepend, file.contents, moduleAppend]);
		}

		// Find QUnit test files to include
		if (fileData.runTests && fileData.testScripts) {
			fileData.testScripts = glob.sync(fileData.testScripts).map(function(filePath) {
				return path.join('./test/', path.relative('./source/', filePath));
			});
		}

		// Save data for later use
		data[fileName] = fileData;
	}));
});

/**
 * Copy QUnit test files
 */
gulp.task('qunit:copy', function() {
	return gulp.src([
		'./source/assets/vendor/qunit/qunit/*',
		'./source/modules/**/*.test.js'
	], {
		base: './source/'
	})
			.pipe(gulp.dest('./build/test/'));
});

/**
 * Run QUnit tests
 */
gulp.task('qunit:test', function() {
	var ignoreFiles = [];

	return gulp.src('./build/{pages/,modules/**/}*.html')
			.pipe(plugins.tap(function(file) {
				// Ignore files without a qunit script reference
				if (file.contents.toString().search('assets/vendor/qunit/qunit/qunit.js') === -1) {
					ignoreFiles.push(file.path);

					return;
				}

				// Fix absolute file paths
				file.contents = new Buffer(file.contents.toString().replace('<head>', '<head><base href="/' + path.resolve('./build') + '/">').replace(/\"\//g, '"'));
			}))
			.pipe(plugins.ignore.exclude(function(file) {
				return _.indexOf(ignoreFiles, file.path) !== -1;
			}))
			.pipe(gulp.dest('./test/'))
			.pipe(plugins.qunit().on('error', function(err) {
				process.exit(1);
			}));
});

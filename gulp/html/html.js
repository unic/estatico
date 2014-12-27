'use strict';

/**
 * Compile Handlebars templates to HTML
 * Make content of data/FILENAME.json available to template engine
 */

var gulp = require('gulp'),
	helpers = require('require-dir')('../../helpers'),
	plumber = require('gulp-plumber'),
	livereload = require('gulp-livereload'),
	util = require('gulp-util'),
	fs = require('fs'),
	path = require('path'),
	glob = require('glob'),
	_ = require('lodash'),
	tap = require('gulp-tap'),
	path = require('path'),
	// prettify = require('gulp-prettify'),
	highlight = require('highlight').Highlight,
	unicHandlebars = require('gulp-unic-handlebars');

function getJsonData(file) {
	if (!fs.existsSync(file)) {
		return {};
	}

	try {
		return JSON.parse(fs.readFileSync(file));
	} catch (err) {
		helpers.errors({
			task: 'html',
			message: 'Error reading "'+ path.relative('./source/', file) +'": ' + err
		});
	}
}

gulp.task('html', function() {
	var data = {},
		defaultFileData = _.merge(getJsonData('./source/data/default.json'), {
			env: util.env
		}),
		modules = glob.sync('./source/modules/**/*.json'),
		// Create object of module data with file name as key
		moduleData = _.object(_.map(modules, function(file) {
			return path.basename(file, path.extname(file));
		}), _.map(modules, function(file) {
			return getJsonData(file);
		})),
		// Create array of icon names for styleguide
		iconData = _.map(glob.sync('./source/{assets/media/,modules/**/}icons/*'), function(file) {
			return path.basename(file).replace(path.extname(file), '');
		});

	return gulp.src([
			'./source/{,pages/,modules/**/,styleguide/sections/}!(_)*.hbs'
		])
		.pipe(tap(function(file) {
			var fileName = path.relative('./source/', file.path).replace(path.extname(file.path), '').replace(/\\/g, '/'),
				dataFile = util.replaceExtension(file.path, '.json'),
				fileData = _.merge(getJsonData(dataFile), {
					styleguide: {
						previewUrl: util.replaceExtension(fileName, '.html')
					}
				}),
				modulePrepend = '{{#extend "styleguide/layouts/module"}}{{#replace "content"}}',
				moduleAppend = '{{/replace}}{{/extend}}',
				qunitInsert = '{{#append "scripts"}}{{> "styleguide/partials/qunit"}}{{/append}}',
				qunitInsertPoint = '{{/extend}}',
				content = null;

			// Add custom data based on file type
			if (fileName.indexOf('modules') !== -1) {
				fileData = _.merge({
					styleguide: {
						// Save module markup as string
						code: highlight(file.contents.toString()),
						type: 'module'
					}
				}, fileData);

				// Wrap modules with custom layout for preview purposes
				content = modulePrepend + file.contents.toString() + moduleAppend;
			} else if (fileName.indexOf('styleguide') !== -1) {
				fileData = _.merge({
					// Save array of icons
					icons: iconData,
					styleguide: {
						type: 'styleguide'
					}
				}, fileData);
			} else {
				fileData = _.merge({
					// Save every module's data
					modules: moduleData,
					styleguide: {
						type: 'page'
					}
				}, fileData);
			}

			// Find QUnit test files and add markup
			if (fileData.runTests && fileData.testScripts) {
				fileData.testScripts = glob.sync(fileData.testScripts).map(function(filePath) {
					return path.join('./test/', path.relative('./source/', filePath));
				});

				content = content || file.contents.toString();

				// Append markup layout block
				content = content.replace(qunitInsertPoint, qunitInsert + qunitInsertPoint);
			}

			// Save data by file name
			data[fileName] = _.merge({}, defaultFileData, fileData);

			// Save file content if it was altered
			if (content) {
				file.contents = new Buffer(content);
			}
		}))
		.pipe(plumber())
		.pipe(unicHandlebars({
			data: function(file) {
				var fileName = path.relative('./source/', file.path).replace(path.extname(file.path), '').replace(/\\/g, '/');

				return data[fileName] || {};
			},
			partials: './source/{,layouts/,pages/,modules/**/,styleguide/**/}*.hbs',
			extension: '.html'
		}).on('error', helpers.errors))
		// .pipe(prettify({
		// 	indent_with_tabs: true,
		// 	max_preserve_newlines: 1
		// }))
		.pipe(gulp.dest('./build'))
		.on('end', function() {
			var templateData = _.merge(defaultFileData, {
					pages: [],
					modules: [],
					styleguide: []
				});

			// Sort by filename and split into pages and modules
			_.sortBy(data, function(fileData, fileName) {
				return fileName;
			}).map(function(fileData) {
				if (fileData.styleguide.type === 'module') {
					templateData.modules.push(fileData);
				} else if (fileData.styleguide.type === 'styleguide') {
					templateData.styleguide.push(fileData);
				} else {
					templateData.pages.push(fileData);
				}
			});

			// Create index for preview purposes
			gulp.src('./source/styleguide/index.hbs')
				.pipe(plumber())
				.pipe(unicHandlebars({
					extension: '.html',
					data: templateData
				}).on('error', helpers.errors))
				.pipe(gulp.dest('./build'))
				.pipe(livereload({
					auto: false
				}));
		});
});

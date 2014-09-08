'use strict';

/**
 * Compile Handlebars templates to HTML
 * Make content of data/FILENAME.json available to template engine
 */

var gulp = require('gulp'),
	fs = require('fs'),
	_ = require('lodash'),
	//frontMatter = require('gulp-front-matter'),
	//appendTemplateData = require('gulp-append-template-data'),
	//generateSiteIndex = require('gulp-generate-site-index'),
	//consolidate = require('gulp-consolidate'),
	livereload = require('gulp-livereload'),
	tinylr = require('tiny-lr'),
	server = tinylr(),
	tap = require('gulp-tap'),
	path = require('path'),
	util = require('gulp-util'),
	unicHandlebars = require('gulp-unic-handlebars'),
	prettify = require('gulp-prettify');

gulp.task('html', function () {
	var data = {};

	return gulp.src([
		'./source/{,pages/,modules/**/}!(_)*.hbs'
	])
		.pipe(tap(function (file) {
			var fileName = path.relative('./source/', file.path).replace(path.extname(file.path), '').replace(/\\/g, '/'),
				dataFile = util.replaceExtension(file.path, '.json'),
				fileData = {
					previewUrl: util.replaceExtension(fileName, '.html')
				},
				modulePrepend = new Buffer('{{#extend "assets/vendor/unic-preview/layouts/layout"}}{{#replace "content"}}'),
				moduleAppend = new Buffer('{{/replace}}{{/extend}}');

			// Find JSON file with the same name as the template
			try {
				fileData = _.merge(fileData, JSON.parse(fs.readFileSync(dataFile)));
			} catch (err) {
				// TODO: handle errors
				//this.emit('error', new util.PluginError(pluginName, err));
			}

			if (file.path.indexOf('modules') !== -1) {
				fileData.isModule = true;
				fileData.code = file.contents.toString();

				// Wrap modules with custom layout for preview purposes
				file.contents = Buffer.concat([modulePrepend, file.contents, moduleAppend]);
			}

			// Save data for later use
			data[fileName] = fileData;
		}))
		.pipe(unicHandlebars({
			data: function (filePath) {
				var fileName = path.relative('./source/', filePath).replace(path.extname(filePath), '').replace(/\\/g, '/');

				return data[fileName] || {};
			},
			partials: './source/{,layouts/,pages/,modules/**/,assets/vendor/unic-preview/**/}*.hbs',
			extension: '.html',
			cachePartials: false
		}))
		.pipe(prettify({
			indent_with_tabs: true,
			max_preserve_newlines: 1
		}))
		.pipe(gulp.dest('./build'))
		.on('end', function () {
			// TODO: add this as a different required task
			var templateData = {
				pages: [],
				modules: []
			};

			// Sort by filename and split into pages and modules
			data = _.sortBy(data, function (value, key) {
				return key;
			}).map(function (value) {
				if (value.isModule) {
					templateData.modules.push(value);
				} else {
					templateData.pages.push(value);
				}
			});

			// Create index for preview purposes
			gulp.src('./source/assets/vendor/unic-preview/index.hbs')
				.pipe(unicHandlebars({
					extension: '.html',
					data: templateData,
					cachePartials: false
				}))
				.pipe(gulp.dest('./build'))
				.pipe(livereload(server));
		});
});

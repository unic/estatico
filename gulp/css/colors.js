'use strict';

/**
 * Import colors from ColorSchemer HTML export file
 *
 * Save Sass variables to source/assets/css/globals/_colors.scss
 * Save JSON file to source/styleguide/sections/colors.json (extending _colors.json)
 */

var gulp = require('gulp'),
	helpers = require('require-dir')('../../helpers'),
	plumber = require('gulp-plumber'),
	fs = require('fs'),
	path = require('path'),
	rename = require('gulp-rename'),
	_ = require('lodash'),
	tap = require('gulp-tap'),
	cheerioParse = require('cheerio').load,
	unicHandlebars = require('gulp-unic-handlebars'),
	merge = require('merge-stream');

function getHtml(file) {
	try {
		return fs.readFileSync(file).toString();
	} catch (err) {
		helpers.errors({
			task: 'css:colors',
			message: 'Error reading "'+ path.relative('./source/', file) +'": ' + err
		});
	}
}

// Parse HTML and return array of color objects with "name" and "hexValue" properties
function extractColors(html) {
	var $ = cheerioParse(html),
		colors = [];

	$.root().find('.caption').each(function() {
		var $color = $(this),
			$name = $color.contents().eq(0),
			$hex = $color.contents().eq(1);

		if ($name.length && $hex.length) {
			colors.push({
				name: $name.text().replace(/[^a-zA-Z ]/g, ''),
				hexValue: $hex.text().split(' ')[1]
			});
		}
	});

	return colors;
}

gulp.task('css:colors', function() {
	var html = getHtml('./source/assets/css/data/colors.html'),
		colors = extractColors(html),

		writeSass = gulp.src('./source/assets/css/templates/_colors.scss')
			.pipe(plumber())
			.pipe(unicHandlebars({
				data: {
					colors: colors
				}
			}).on('error', helpers.errors))
			.pipe(gulp.dest('./source/assets/.tmp')),

		writeJson = gulp.src('./source/styleguide/sections/_colors.json')
			.pipe(plumber())
			.pipe(tap(function(file) {
				var data = JSON.parse(file.contents.toString());

				// Extend content of _colors.json with extracted colors
				// Allows for definition of additional properties like "showInStyleguide"
				_.each(colors, function(color) {
					var styleguideColor = _.find(data.colors, function(styleguideColor) {
							return color.name === styleguideColor.name;
						});

					if (styleguideColor) {
						_.extend(styleguideColor, color);
					} else {
						data.colors.push(color);
					}
				});

				file.contents = new Buffer(JSON.stringify(data, null, '\t'));

				return file;
			}).on('error', helpers.errors))
			.pipe(rename('colors.json'))
			.pipe(gulp.dest('./source/styleguide/sections'));

	return merge(writeSass, writeJson);
});

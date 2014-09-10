'use strict';

/**
 * Generate icon font
 * Generate SCSS file based on handlebars template
 */

var gulp = require('gulp'),
	errorHandler = require('gulp-unic-errors'),
	plumber = require('gulp-plumber'),
	size = require('gulp-size'),
	iconfont = require('gulp-iconfont'),
	unicHandlebars = require('gulp-unic-handlebars'),
	_ = require('lodash');

gulp.task('media:iconfont', function () {
	return gulp.src([
			'./source/assets/media/icons/*.svg',
			'./source/modules/**/icons/*.svg'
		])
		.pipe(iconfont({
			fontName: 'Icons',
			normalize: true
		}))
		.on('codepoints', function (codepoints, options) {
			codepoints = _.map(codepoints, function (codepoint) {
				return {
					name: codepoint.name,
					codepoint: codepoint.codepoint.toString(16).toUpperCase()
				};
			});

			gulp.src('./source/assets/css/templates/iconfont.scss')
				.pipe(plumber())
				.pipe(unicHandlebars({
					data: {
						codepoints: codepoints,
						options: _.merge(options, {
							fontPath: '../fonts/icons/'
						})
					}
				}).on('error', errorHandler))
				.pipe(gulp.dest('./source/assets/.tmp/'));
		})
		.pipe(size({
			title: 'media:iconfont'
		}))
		.pipe(gulp.dest('./build/assets/fonts/icons/'));
});

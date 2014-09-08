'use strict';

/**
 * Generate icon font
 * Generate SCSS file based on handlebars template
 */

var gulp = require('gulp'),
	iconfont = require('gulp-iconfont'),
	//consolidate = require('gulp-consolidate'),
	unicHandlebars = require('gulp-unic-handlebars'),
	size = require('gulp-size'),
	_ = require('lodash');

gulp.task('media:iconfont', function () {
	return gulp.src([
			'./source/assets/media/iconfont/*.svg',
			'./source/modules/**/iconfont/*.svg'
		])
		.pipe(iconfont({
			fontName: 'Icons'
		}))
		.on('codepoints', function (codepoints, options) {
			codepoints = _.map(codepoints, function (codepoint) {
				return {
					name: codepoint.name,
					codepoint: codepoint.codepoint.toString(16).toUpperCase()
				};
			});

			gulp.src('./source/assets/css/templates/icons.scss')
				.pipe(unicHandlebars({
					data: {
						codepoints: codepoints,
						options: _.merge(options, {
							fontPath: '../fonts/icons/'
						})
					}
				}))
				.pipe(gulp.dest('./source/assets/.tmp/'));
		})
		.pipe(size({
			title: 'media:iconfont'
		}))
		.pipe(gulp.dest('./build/assets/fonts/icons/'));
});


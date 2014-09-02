'use strict';

var gulp = require('gulp'),
	iconfont = require('gulp-iconfont'),
	consolidate = require('gulp-consolidate'),
	_ = require('lodash');

/**
 * Generate icon font
 * Generate SCSS file based on handlebars template
 */
gulp.task('iconfont', function() {
	return gulp.src([
		'./source/assets/media/iconfont/*.svg',
		'./source/modules/**/iconfont/*.svg'
	])
		.pipe(iconfont({
			fontName: 'Icons'
		}))
			.on('codepoints', function(codepoints, options) {
				codepoints = _.map(codepoints, function(codepoint) {
					return {
						name: codepoint.name,
						codepoint: codepoint.codepoint.toString(16).toUpperCase()
					};
				});

				gulp.src('./source/assets/css/templates/icons.scss')
					.pipe(consolidate('handlebars', {
						codepoints: codepoints,
						options: _.merge(options, {
							fontPath: '../fonts/icons/'
						})
					}))
					.pipe(gulp.dest('./source/assets/.tmp/'));
			})
		.pipe(gulp.dest('./build/assets/fonts/icons/'));
});

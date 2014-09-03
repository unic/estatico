'use strict';

/**
 * Generate sprite image from input files (can be of mixed file type)
 * Generate SCSS file based on mustache template
 *
 * See https://github.com/twolfson/gulp.spritesmith
 */

var gulp = require('gulp'),
	size = require('gulp-size'),
	spritesmith = require('gulp.spritesmith');

gulp.task('media:pngsprite', function () {
	var spriteData = gulp.src([
			'./source/assets/media/pngsprite/*.png',
			'./source/modules/**/pngsprite/*.png'
		])
		.pipe(spritesmith({
			imgName: 'sprite.png',
			cssName: 'sprite.scss',
			imgPath: '../media/sprite.png',
			cssTemplate: './source/assets/css/templates/sprite.scss',
			engine: 'pngsmith'
		}));

	spriteData.css.pipe(gulp.dest('./source/assets/.tmp/'));

	return spriteData.img
		.pipe(size({
			title: 'media:pngsprite'
		}))
		.pipe(gulp.dest('./build/assets/media/'));
});

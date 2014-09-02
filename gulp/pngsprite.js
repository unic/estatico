'use strict';

var gulp = require('gulp'),
	spritesmith = require('gulp.spritesmith');

/**
 * Generate sprite image from input files (can be of mixed file type)
 * Generate SCSS file based on mustache template
 *
 * See https://github.com/twolfson/gulp.spritesmith
 */
gulp.task('pngsprite', function () {
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

	return spriteData.img.pipe(gulp.dest('./build/assets/media/'));
});


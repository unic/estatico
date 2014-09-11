'use strict';

/**
 * Generate sprite image from input files (can be of mixed file type)
 * Generate SCSS file based on mustache template
 *
 * See https://github.com/twolfson/gulp.spritesmith
 */

var gulp = require('gulp'),
	errorHandler = require('gulp-unic-errors'),
	plumber = require('gulp-plumber'),
	size = require('gulp-size'),
	spritesmith = require('gulp.spritesmith'),
	tap = require('gulp-tap'),
	_ = require('lodash'),
	unicHandlebars = require('gulp-unic-handlebars');

gulp.task('media:pngsprite', function(cb) {
	var spriteData = {},
		streams = gulp.src([
			'./source/assets/media/pngsprite/*.png',
			'./source/modules/**/pngsprite/*.png'
		])
		.pipe(spritesmith({
			imgName: 'sprite.png',
			cssName: 'sprite.json',
			imgPath: '../media/sprite.png',
			cssFormat: 'json',
			engine: 'pngsmith'
		}));

	streams.img
		.pipe(size({
			title: 'media:pngsprite'
		}))
		.pipe(gulp.dest('./build/assets/media/'));

	streams.css
		.pipe(tap(function(file) {
			spriteData = JSON.parse(file.contents.toString());
		}))
		.on('end', function() {
			var images = {};

			// Normalize data to be consistent with iconfont.js and dataurls.js
			_.each(spriteData, function(data, key) {
				images[key] = {
					dimensions: {
						x: data.width,
						y: data.height
					},
					position: {
						x: data.offset_x,
						y: data.offset_y
					},
					url: data.escaped_image
				};
			});

			gulp.src('./source/assets/css/templates/pngsprite.scss')
				.pipe(plumber())
				.pipe(unicHandlebars({
					data: {
						images: images
					}
				}).on('error', errorHandler))
				.pipe(gulp.dest('./source/assets/.tmp/'));

			cb();
		});
});

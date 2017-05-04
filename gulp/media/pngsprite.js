'use strict';

/**
 * @function `gulp media:pngsprite`
 * @desc Generate sprite image from input files (using `gulp.spritesmith`) and generate Sass file (based on Twig template).
 */

var gulp = require('gulp');

var taskName = 'media:pngsprite',
	taskConfig = {
		src: [
			'./source/assets/media/pngsprite/*.png',
			'./source/modules/**/pngsprite/*.png',
			'./source/demo/modules/**/pngsprite/*.png'
		],
		dest: './build/assets/media/',
		srcStyles: './source/assets/css/templates/_pngsprite.scss',
		destStyles: './source/assets/.tmp/',
		relImg: '../media/sprite.png',
		watch: [
			'source/assets/media/pngsprite/*.png',
			'source/modules/**/pngsprite/*.png',
			'source/demo/modules/**/pngsprite/*.png'
		]
	};

gulp.task(taskName, function(cb) {
	var helpers = require('require-dir')('../../helpers'),
		plumber = require('gulp-plumber'),
		size = require('gulp-size'),
		spritesmith = require('gulp.spritesmith'),
		tap = require('gulp-tap'),
		_ = require('lodash'),
		twig = require('gulp-twig');

	var spriteData = {},
		streams = gulp.src(taskConfig.src)
		.pipe(spritesmith({
			imgName: 'sprite.png',
			cssName: 'sprite.json',
			imgPath: taskConfig.relImg,
			cssFormat: 'json'
		}));

	streams.img
		.pipe(size({
			title: taskName
		}))
		.pipe(gulp.dest(taskConfig.dest));

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
						x: data.offset_x, // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
						y: data.offset_y // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
					},
					url: data.escaped_image // jscs:ignore requireCamelCaseOrUpperCaseIdentifiers
				};
			});

			gulp.src(taskConfig.srcStyles)
				.pipe(plumber())
				.pipe(twig({
					data: {
						images: images
					}
				}).on('error', helpers.errors))
				.pipe(gulp.dest(taskConfig.destStyles));

			cb();
		});
});

module.exports = {
	taskName: taskName,
	taskConfig: taskConfig
};

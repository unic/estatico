'use strict';

/**
 * @function `gulp media:svgsprite`
 * @desc Fetches multiple svg files and creates a svg sprite which can later be referenced to from within the html code as described in this article
 * https://css-tricks.com/svg-symbol-good-choice-icons/
 */

var gulp = require('gulp');

var taskName = 'media:svgsprite',
	taskConfig = {
		src: {
			base: [
				'./source/assets/media/svg/**/*.svg'
			],

			// Example for custom sprite
			demo: [
				'./source/demo/modules/svgsprite/svg/*.svg'
			]
		},
		dest: './build/assets/media/svg',
		watch: [
			'source/assets/media/svg/**/*.svg',
			'source/modules/**/svg/**/*.svg',
			'source/demo/modules/**/svg/**/*.svg'
		]
	};

gulp.task(taskName, function(cb) {
	var svgstore = require('gulp-svgstore'),
		imagemin = require('gulp-imagemin'),
		rename = require('gulp-rename'),
		merge = require('merge-stream'),
		names = Object.keys(taskConfig.src),
		files = Object(taskConfig.src),
		i = names.length,
		sprites = [];

	while (i--) {
		var sprite = gulp
			.src(files[names[i]])
			.pipe(imagemin({
				svgoPlugins: [
					{
						cleanupIDs: {
							remove: false
						}
					},
					{
						cleanupNumericValues: {
							floatPrecision: 2
						}
					},
					/* {
						removeAttrs: {
							attrs: ['fill']
						}
					}, */
					{
						removeStyleElement: true
					},
					{
						removeTitle: true
					}
				],
				multipass: true
			}))
			.pipe(svgstore({
				inlineSvg: true
			}))
			.pipe(rename({
				basename: names[i]
			}))
			.pipe(gulp.dest(taskConfig.dest));

		sprites.push(sprite);
	}

	if (sprites.length > 0) {
		merge(sprites).on('finish', cb);
	} else {
		cb();
	}
});

module.exports = {
	taskName: taskName,
	taskConfig: taskConfig
};

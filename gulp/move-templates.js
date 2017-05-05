'use strict';

/**
 * @function `gulp movetemplates`
 * @desc Move templates into drupal directory
 */

var gulp = require('gulp');
var es = require('event-stream');

var taskName = 'move:templates',
	taskConfig = [
		{
			src: './source/modules/block/**/*.twig',
			dest: '../site/web/themes/custom/estatico/templates/block'
		},
		{
			src: './source/modules/field/**/*.twig',
			dest: '../site/web/themes/custom/estatico/templates/field'
		},
		{
			src: './source/modules/html/**/*.twig',
			dest: '../site/web/themes/custom/estatico/templates/html'
		},
		{
			src: './source/modules/menu/**/*.twig',
			dest: '../site/web/themes/custom/estatico/templates/menu'
		},
		{
			src: './source/modules/node/**/*.twig',
			dest: '../site/web/themes/custom/estatico/templates/node'
		},
		{
			src: './source/modules/page/**/*.twig',
			dest: '../site/web/themes/custom/estatico/templates/page'
		},
		{
			src: './source/modules/region/**/*.twig',
			dest: '../site/web/themes/custom/estatico/templates/region'
		},
		{
			src: './source/modules/other/**/*.twig',
			dest: '../site/web/themes/custom/estatico/templates/other'
		}
	];

gulp.task(taskName, function() {
	var streams = [];

	for (let conf of taskConfig) {
		streams.push(
			gulp.src(conf.src).pipe(gulp.dest(conf.dest))
		);
	}

	return es.concat(streams);
});

module.exports = {
	taskName: taskName,
	taskConfig: taskConfig
};

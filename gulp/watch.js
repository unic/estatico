'use strict';

var gulp = require('gulp'),
	tinylr = require('tiny-lr'),
	server = tinylr()/*,
	handleErrors = require('../utils/handleErrors')*/;

/**
 * Run specific tasks when specific files have changed
 */
gulp.task('watch', function() {
	// Listen on port 35729
	server.listen(35729, function (err) {
		if (err) {
			// handleErrors(err);
			return console.log(err);
		}

		gulp.watch([
			'source/{,*/}*.html',
			'source/data/*.json',
			'source/modules/**/*.html'
		], ['html']);

		gulp.watch([
			'source/assets/css/*.scss',
			'source/assets/.tmp/*.scss',
			'source/modules/**/*.scss'
		], ['css']);

		gulp.watch([
			'source/assets/js/{,**/}*.js',
			'source/assets/.tmp/*.js',
			'source/modules/**/*.js'
		], ['jshint', 'js-head', 'js-main']);

		gulp.watch([
			'source/assets/pngsprite/*.png',
			'source/modules/**/pngsprite/*.png'
		], ['pngsprite']);

		gulp.watch([
			'source/assets/iconfont/*.svg',
			'source/modules/**/iconfont/*.svg'
		], ['iconfont']);
	});
});


'use strict';

/**
 * Run specific tasks when specific files have changed
 */

var gulp = require('gulp'),
	tinylr = require('tiny-lr'),
	server = tinylr();

gulp.task('watch', function () {
	// Listen on port 35729
	server.listen(35729, function (err) {
		if (err) {
			return console.log(err);
		}

		gulp.watch([
			'source/{,pages/,modules/**/}*.hbs',
			'source/{,pages/,modules/**/}*.json',
			'source/{,pages/,modules/**/,styleguide/**/}*.hbs',
			'source/{,pages/,modules/**/,styleguide/**/}*.json'
		], ['html']);

		gulp.watch([
			'source/assets/css/*.scss',
			'source/assets/.tmp/*.scss',
			'source/modules/**/*.scss'
		], ['css:default', 'css:styleguide']);

		gulp.watch([
			'source/assets/js/{,**/}*.js',
			'source/assets/.tmp/*.js',
			'source/modules/**/*.js'
		], ['js:hint', 'js:head', 'js:main']);

		gulp.watch([
			'source/assets/pngsprite/*.png',
			'source/modules/**/pngsprite/*.png'
		], ['media:pngsprite']);

		gulp.watch([
			'source/assets/iconfont/*.svg',
			'source/modules/**/iconfont/*.svg'
		], ['media:iconfont']);
	});
});

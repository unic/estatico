'use strict';

/**
 * Run specific tasks when specific files have changed
 */

var gulp = require('gulp');

gulp.task('watch', function() {
	gulp.watch([
		'source/layouts/*.hbs',
		'source/data/*.json',
		'source/pages/*.hbs',
		'source/pages/*.json',
		'source/modules/**/*.hbs',
		'source/modules/**/*.json',
		'source/styleguide/{,**/}*.hbs',
		'source/styleguide/**/*.json'
	], ['html']);

	gulp.watch([
		'source/assets/css/{,**/}*.scss',
		'source/assets/.tmp/*.scss',
		'source/modules/**/*.scss',
		'source/styleguide/assets/css/*.scss',
	], ['css:default']);

	gulp.watch([
		'source/assets/js/{,**/}*.js',
		'source/assets/.tmp/*.js',
		'source/modules/**/*.js'
	], ['js:lint', 'js:default']);

	gulp.watch([
		'source/modules/**/*.js.hbs',
	], ['js:templates']);

	gulp.watch([
		'source/assets/pngsprite/*.png',
		'source/modules/**/pngsprite/*.png'
	], ['media:pngsprite']);

	gulp.watch([
		'source/assets/icons/*.svg',
		'source/modules/**/icons/*.svg'
	], ['media:iconfont', 'media:dataurls']);
});

'use strict';

/**
 * @function `gulp sync`
 * @desc Sync domain
 */

var gulp = require('gulp'),
	browserSync = require('browser-sync').create(),
	fs = require('fs'),
	taskName = 'sync';

if( fs.existsSync('./domain.json') ) {
	var domain;
	fs.readFile('./domain.json', 'utf8', function (err,data) {
	  if (err) {
	    return console.log(err);
	  }
		return domain = data;
	});
}

gulp.task('sync', function() {
	browserSync.init({
		proxy: domain,
		startPath: "",
		files: '../site/web/themes/estatico/assets/css/*.css',
		https: true,
		open: 'internal',
		reloadOnRestart: true,
    injectChanges: true
	});

	gulp.watch([
		'source/modules/**/*.twig',
		'source/assets/css/**/*.scss',
		'source/assets/.tmp/**/*.scss',
		'source/modules/**/*.scss',
		'source/assets/js/**/*.js',
		'source/assets/js/**/*.jsx',
		'source/assets/.tmp/**/*.js',
		'source/modules/**/*.js',
		'source/modules/**/*.jsx'
	]).on('change', function() {
		gulp.start('rebuild', function() {
			browserSync.reload({stream: true});
		});
	});
});

module.exports = {
	taskName: taskName,
	taskConfig: {}
};

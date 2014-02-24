'use strict';

var gulp = require('gulp'),

	// Plugins
	plugins = require('gulp-load-plugins')();


// Styles
gulp.task('css', function() {
	return gulp.src('./source/assets/css/main.scss')
		.pipe(plugins.rubySass({
			loadPath: [
				'source/assets/vendor',
				'source/modules'
			],
			style: plugins.util.env.production ? 'compressed' : 'expanded'
		}))
		// .pipe(plugins.autoprefixer('last 2 version'))
		.pipe(gulp.dest('./build/assets/css'));
});

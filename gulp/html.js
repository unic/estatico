'use strict';

/**
 * Compile Handlebars templates to HTML
 * Make content of data/FILENAME.json available to template engine
 */

var gulp = require('gulp'),
	frontMatter = require('gulp-front-matter'),
	appendTemplateData = require('gulp-append-template-data'),
	generateSiteIndex = require('gulp-generate-site-index'),
	consolidate = require('gulp-consolidate'),
	livereload = require('gulp-livereload'),
	tinylr = require('tiny-lr'),
	server = tinylr();

gulp.task('html', function() {
	return gulp.src(['./source/{,pages/}*.html'])
		.pipe(frontMatter({
			property: 'frontmatter'
		}))
		.pipe(appendTemplateData())
		/*.pipe(generateSiteIndex({
			filesForIndex: './source/pages*//*.html',
			indexWrapperProperty: 'pages'
		}))*/
		.pipe(consolidate('handlebars', function(file) {
			return file.data;
		}))
		.pipe(frontMatter()) // Pipe through gulp-front-matter once more to remove front matter data from the generated files (handlebars does re-add it)
		.pipe(gulp.dest('./build'))
		.pipe(livereload(server));
});

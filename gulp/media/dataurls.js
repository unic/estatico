'use strict';

/**
 * Generate SCSS file with base64 encoded SVG data urls and PNG fallbacks
 */

var gulp = require('gulp'),
	errorHandler = require('gulp-unic-errors'),
	plumber = require('gulp-plumber'),
	size = require('gulp-size'),
	livereload = require('gulp-livereload'),
	flatten = require('gulp-flatten'),
	unicColorizeSvgs = require('gulp-unic-colorize-svgs'),
	path = require('path'),
	unicSaveIconData = require('gulp-unic-save-icon-data'),
	imagemin = require('gulp-imagemin'),
	ifCond = require('gulp-if'),
	gm = require('gulp-gm'),
	raster = require('gulp-raster'),
	rename = require('gulp-rename'),
	unicHandlebars = require('gulp-unic-handlebars'),
	base64 = require('gulp-base64'),

	// Check platform
	isWindows = (process.platform === 'win32');

gulp.task('media:dataurls', function() {
	var icons = {};

	return gulp.src([
			'./source/assets/media/icons/*.svg',
			'./source/modules/**/icons/*.svg'
		])
		// Use flat file structure (move every icon into same directory)
		.pipe(flatten())
		// Save paths and dimensions
		.pipe(unicColorizeSvgs({
			colors: {
				'default': {
					primary: '000000',
					active: 'A4C400'
				},
				// Use: @include iconDataurl(FILENAME, "primary") and @include iconDataurl(FILENAME, "active")

				// Example 1: Custom colors for file "twitter"
				// twitter: {
				// 	primary: 'CC3300',
				// 	active: '33CC00'
				// },
				// Use: @include iconDataurl("twitter", "primary") and @include iconDataurl("twitter", "active")

				// Example 2: Custom colors and keys for file "twitter"
				// twitter: {
				// 	something: 'CC3300',
				// 	something_else: '33CC00',
				// 	something_different: '3300CC'
				// },
				// Use: @include iconDataurl("twitter", "something"), @include iconDataurl("twitter", "something_else"), @include iconDataurl("twitter", "something_different")

				// Example 3: No coloring for file "twitter", only original file
				// twitter: {}
				// Use: @include iconDataurl("twitter")
			},
			replaceColor: function(content, hex) {
				return content.replace(/fill="#(.*?)"/g, 'fill="#' + hex + '"');
			},
			replacePath: function(path, name) {
				return path.replace(/\.svg/, '--' + name + '.svg');
			}
		}))
		.pipe(unicSaveIconData({
			getRelativeUrls: function(fileName) {
				var url = path.relative('css/', path.join('media/icons', fileName)).replace(new RegExp('\\' + path.sep, 'g'), '/');

				return {
					svg: url,
					png: url.replace(path.extname(fileName), '.png')
				};
			},
			variantPrefix: '--'
		}).on('icons', function(data) {
			// Save icon data
			icons = data;
		}))
		// Optimize SVGs
		.pipe(imagemin({
			svgoPlugins: isWindows ? [
				{
					removeXMLProcInst: false
				}
			] : null // XML tag is necessary for GraphicsMagick / ImageMagick (see below)
		}))
		.pipe(size({
			title: 'media:icons (SVG files)'
		}))
		.pipe(gulp.dest('./build/assets/media/icons/'))
		// Create PNGs (use GraphicsMagick / ImageMagick on Windows since PhantomJS tends to hang there)
		.pipe(ifCond(
			isWindows,
			gm(function(file) {
				return file.setFormat('png').transparent('#ffffff');
			}, {
				imageMagick: true
			}),
			raster()
		).on('error', errorHandler))
		.pipe(rename({
			extname: '.png'
		}))
		// Optimize PNGs
		.pipe(imagemin())
		.pipe(size({
			title: 'media:icons (PNG files)'
		}))
		.pipe(gulp.dest('./build/assets/media/icons/'))
		// Create SCSS file
		.on('end', function() {
			gulp.src('./source/assets/css/templates/_dataurls.scss')
				.pipe(plumber())
				.pipe(unicHandlebars({
					data: {
						icons: icons
					}
				}).on('error', errorHandler))
				.pipe(base64({
					baseDir: './build/assets/css/'
				}))
				.pipe(size({
					title: 'media:icons (CSS base64)'
				}))
				.pipe(gulp.dest('./source/assets/.tmp/'))
				.pipe(livereload({
					auto: false
				}));
		});
});

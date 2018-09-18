'use strict';

/**
 * @function `gulp media:dataurls`
 * @desc Generate Sass file with base64 encoded SVG data urls and PNG fallbacks.
 */

var gulp = require('gulp');

var taskName = 'media:dataurls',
	taskConfig = {
		src: [
			'./source/assets/media/icons/*.svg',
			'./source/modules/**/icons/*.svg',
			'./source/demo/modules/**/icons/*.svg'
		],
		dest: './build/assets/media/icons/',
		srcStyles: './source/assets/css/templates/_dataurls.scss',
		destStyles: './source/assets/.tmp/',
		relStyles: './build/assets/css/',
		relIcons: '../media/icons/',
		postCssPlugins: {
			url: {
				url: 'inline',
				basePath: '../../../../build/assets/media/'
			}
		},
		watch: [
			'source/assets/media/icons/*.svg',
			'source/modules/**/icons/*.svg',
			'source/demo/modules/**/icons/*.svg'
		]
	};

gulp.task(taskName, function(cb) {
	var helpers = require('require-dir')('../../helpers'),
		plumber = require('gulp-plumber'),
		size = require('gulp-size'),
		livereload = require('gulp-livereload'),
		flatten = require('gulp-flatten'),
		colorize = require('gulp-colorize-svgs'),
		path = require('path'),
		tap = require('gulp-tap'),
		svgDimensions = require('gulp-svg-dimensions'),
		imagemin = require('gulp-imagemin'),
		through = require('through2'),
		svg2png = require('convert-svg-to-png'),
		rename = require('gulp-rename'),
		handlebars = require('gulp-hb'),
		postCss = require('gulp-postcss'),
		postCssUrl = require('postcss-url'),
		postCssScss = require('postcss-scss');

	var pathSeparator = '--',
		icons = {};

	gulp.src(taskConfig.src)

		// Use flat file structure (move every icon into same directory)
		.pipe(flatten())

		// Create colorized versions and add them to stream
		.pipe(colorize({
			colors: {
				default: {
					primary: '000000',
					active: 'A4C400'
				}

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

			replacePath: function(path, colorKey) {
				return path.replace(/\.svg/, pathSeparator + colorKey + '.svg');
			}
		}))

		// Save dimensions
		.pipe(svgDimensions())

		// Save paths and dimensions
		.pipe(tap(function(file) {
			var fileName = path.basename(file.path),
				name = fileName.replace('.svg', ''),
				relPath = path.join(taskConfig.relIcons, fileName).replace(new RegExp('\\' + path.sep, 'g'), '/'),
				relPathPng = relPath.replace('.svg', '.png'),
				parts = name.split(pathSeparator),
				variant = 'default',
				dimensions = (file.data && file.data.dimensions) ? file.data.dimensions : {};

			// Split iconName into name and variant (e.g. color)
			if (parts.length > 1) {
				name = parts[0];
				variant = parts[1];
			}

			// Save name and dimensions once
			if (!icons[name]) {
				icons[name] = {
					name: name,
					dimensions: dimensions,
					urls: {}
				};
			}

			// Save each variant
			icons[name].urls[variant] = {
				svg: relPath,
				png: relPathPng
			};
		}))

		// Optimize SVGs
		.pipe(imagemin())
		.pipe(size({
			title: 'media:icons (SVG files)'
		}))
		.pipe(gulp.dest(taskConfig.dest))

		// Create PNGs using PhantomJS
		.pipe(through.obj(async function(file, enc, done) {
			try {
				file.contents = await svg2png.convert(file.contents);
			} catch(err) {
				err.plugin = 'convert-svg-to-png';

				helpers.errors(err);
			}

			return done(null, file);
		}))
		.pipe(rename({
			extname: '.png'
		}))

		// Optimize PNGs
		.pipe(imagemin())
		.pipe(size({
			title: 'media:icons (PNG files)'
		}))
		.pipe(gulp.dest(taskConfig.dest))

		// Create SCSS file
		.on('end', function() {
			gulp.src(taskConfig.srcStyles)
				.pipe(plumber())
				.pipe(handlebars({
					data: {
						icons: icons
					}
				}).on('error', helpers.errors))
				.pipe(postCss([
					postCssUrl(taskConfig.postCssPlugins.url)
				], {
					syntax: postCssScss
				}))
				.pipe(size({
					title: 'media:icons (CSS)'
				}))
				.pipe(gulp.dest(taskConfig.destStyles))
				.pipe(livereload())
				.on('end', function() {
					cb();
				});
		});
});

module.exports = {
	taskName: taskName,
	taskConfig: taskConfig
};

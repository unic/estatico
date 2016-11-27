'use strict';

/**
 * @function `gulp css`
 * @desc Compile Sass to CSS (using `LibSass`), run autoprefixer on the generated CSS.
 * By default, a very basic dependency graph makes sure that only the necessary files are rebuilt on changes. Add the `--skipCssDependencyGraph` flag to disable this behavior and just build everything all the time.
 */

var gulp = require('gulp'),
	util = require('gulp-util');

var taskName = 'css',
	taskConfig = {
		src: [
			'./source/assets/css/*.scss',
			'./source/preview/assets/css/*.scss'
		],
		devSrc: [
			'./source/assets/css/dev.scss'
		],
		srcBase: './source/',
		include: [
			'./source/assets/css/',
			'./source/modules/'
		],
		dest: './build/',
		watch: [
			'source/assets/css/**/*.scss',
			'source/assets/.tmp/**/*.scss',
			'source/modules/**/*.scss',
			'source/demo/modules/**/*.scss',
			'source/preview/assets/css/**/*.scss'
		],
		plugins: {
			autoprefixer: 'last 2 version'
		},
		returnChangedFileOnWatch: !util.env.skipCssDependencyGraph
	},
	task = function(config, cb, changedFile) {
		var helpers = require('require-dir')('../../helpers'),
			plumber = require('gulp-plumber'),
			size = require('gulp-size'),
			livereload = require('gulp-livereload'),
			sourcemaps = require('gulp-sourcemaps'),
			libSass = require('gulp-sass'),
			postCSS = require('gulp-postcss'),
			autoprefixer = require('autoprefixer'),
			cssMinify = require('gulp-minify-css'),
			rename = require('gulp-rename'),
			lazypipe = require('lazypipe'),
			ignore = require('gulp-ignore'),
			path = require('path'),
			through = require('through2'),
			fs = require('fs');

		// Optionally build dev styles
		if (util.env.dev) {
			config.src = config.src.concat(config.devSrc);
		}

		var writeSourceMaps = lazypipe()
				.pipe(sourcemaps.write, '.', {
					includeContent: false,
					sourceRoot: config.srcBase
				}),
			excludeSourcemaps = lazypipe()
				.pipe(ignore.exclude, function(file) {
					return path.extname(file.path) === '.map';
				}),

			minify = lazypipe()
				.pipe(gulp.dest, config.dest)
				.pipe(excludeSourcemaps)
				.pipe(cssMinify)
				.pipe(rename, {
					suffix: '.min'
				})
				.pipe(writeSourceMaps);

		gulp.src(config.src, {
			base: config.srcBase
		})
			.pipe(through.obj(function(file, enc, done) {
				if (!changedFile) {
					this.push(file);
					return done();
				}

				// Create dependency graph of currently piped file
				var dependencyGraph = new helpers.dependencygraph(file.path, {
						pattern: /@import "(.*?)"/g,
						resolvePath: function(match) {
							var resolvedPath = path.resolve('./source/assets/css', match + '.scss'),
								prefixedResolvedPath;

							// Retry with leading underscore if not found
							if (!fs.existsSync(resolvedPath)) {
								prefixedResolvedPath = resolvedPath.replace(path.basename(resolvedPath), '_' + path.basename(resolvedPath));

								// Retry with .css extensions if still not found
								if (!fs.existsSync(prefixedResolvedPath)) {
									resolvedPath = resolvedPath.replace(path.extname(resolvedPath), '.css');
								} else {
									resolvedPath = prefixedResolvedPath;
								}
							}

							if (!fs.existsSync(resolvedPath)) {
								util.log(util.colors.cyan(taskName), util.colors.red(resolvedPath + ' not found'));
							}

							return resolvedPath;
						}
					});

				// Check if the changed file is part or the currently piped file's dependency graph
				// Remove file from pipeline otherwise
				if (dependencyGraph.contains(changedFile)) {
					// util.log(util.colors.cyan(taskName), 'Rebuilding ' + file.path + ' ...');

					this.push(file);
				}

				done();
			}))
			.pipe(plumber())
			.pipe(sourcemaps.init())
			.pipe(libSass.sync({
				includePaths: config.include
			}).on('error', helpers.errors))
			.pipe(postCSS([
				autoprefixer(config.plugins.autoprefixer)
			]).on('error', helpers.errors))
			.pipe(writeSourceMaps())
			.pipe(util.env.dev ? util.noop() : minify())
			.pipe(size({
				title: taskName,
				showFiles: true
			}))
			.pipe(gulp.dest(config.dest))
			.pipe(excludeSourcemaps())
			.pipe(livereload())
			.on('end', cb);
	};

gulp.task(taskName, ['css:lint'], function(cb) {
	return task(taskConfig, cb);
});

module.exports = {
	taskName: taskName,
	taskConfig: taskConfig,
	task: task
};

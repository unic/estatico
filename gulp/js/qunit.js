'use strict';

/**
 * @function `gulp js:qunit`
 * @desc Run QUnit tests (using PhantomJS).
 */

var gulp = require('gulp'),
	util = require('gulp-util');

var taskName = 'js:qunit',
	taskConfig = {
		srcTests: [
			'./source/preview/assets/js/test.js',
			'./source/modules/**/*.test.js',
			'./source/demo/modules/**/*.test.js'
		],
		srcCustomJS: './source/preview/assets/js/phantomjs.js',
		srcTestsBase: './',
		srcTestsPattern: /\/modules\//,
		destTests: './build/test/',
		srcTemplates: [
			'./build/pages/**/*.html',
			'./build/demo/pages/**/*.html',
			'./build/modules/**/*.html',
			'./build/demo/modules/**/*.html',
			'!./build/**/*.qunit.html'
		],
		srcTemplatesBase: './build/',
		watch: [
			'source/modules/**/*.test.js',
			'source/demo/modules/**/*.test.js'
		],
		hasWebpackWatch: true,
		viewports: {
			tablet: { width: 700, height: 1000 },
			mobile: { width: 400, height: 1000 },
			desktop: { width: 1400, height: 1000 }
		},
		phantomJS: ['--web-security=no']
	};

gulp.task(taskName, function(cb) {
	var helpers = require('require-dir')('../../helpers'),
		path = require('path'),
		through = require('through2'),
		webpack = require('webpack'),
		rename = require('gulp-rename'),
		qunit = require('gulp-qunit'),
		del = require('del'),
		glob = require('glob'),
		vinylPaths = require('vinyl-paths'),
		_ = require('lodash'),
		lazypipe = require('lazypipe'),
		tap = require('gulp-tap'),
		plumber = require('gulp-plumber');

	var compiler,
		src = [],
		runQUnit = lazypipe(),
		runTests = function(config, changedFiles, cb) {
			gulp.src(config.srcTemplates, {
				base: config.srcTemplatesBase
			})
				.pipe(through.obj(function(file, enc, done) {
					var content = file.contents.toString(),
						polyfillsPath = path.resolve(config.destTests, config.srcCustomJS),
						changedFileMatch;

					// Ignore files without a reference to a changed file
					changedFileMatch = changedFiles.filter(function(filePath) {
						return (content.search(filePath) !== -1);
					});

					if (!changedFileMatch.length) {
						return done();
					}

					// Insert PhantomJS-specific code (autostart config, polyfills, e.g.)
					content = content.replace('</body>', '<script src="' + polyfillsPath + '"></script></body>');

					file.contents = new Buffer(content);

					this.push(file);

					done();
				}))

				// Temporarily save to file system since gulp-qunit does not read from stream
				.pipe(rename(function(filePath) {
					filePath.basename += '.qunit';
				}))
				.pipe(gulp.dest(config.srcTemplatesBase))

				// Run tests
				.pipe(plumber())
				.pipe(runQUnit().on('error', function(err) {
					helpers.errors({
						task: taskName,
						message: err.message
					});
				}))

				// Delete temporary files
				.pipe(vinylPaths(del))
				.on('finish', cb);
		},
		compilerCallback = function(err, stats) {
			var changedFiles = Object.keys(stats.compilation.assets).filter(function(asset) {
					return stats.compilation.assets[asset].emitted;
				});

			helpers.webpack.log(err, stats, taskName);

			runTests(taskConfig, changedFiles, cb);
		};

	// Resolve test paths
	taskConfig.srcTests.forEach(function(fileGlob) {
		src = src.concat(glob.sync(fileGlob));
	});

	// Add polyfills to files to be copied
	src = src.concat(taskConfig.srcCustomJS);

	// Prepare viewports
	_.each(taskConfig.viewports, function(viewport) {
		runQUnit = runQUnit
			.pipe(tap, function() {
				if (viewport) {
					util.log('Testing viewport ' + JSON.stringify(viewport));
				} else {
					util.log('Testing default viewport');
				}
			})
			.pipe(qunit, {
				page: {
					viewportSize: viewport
				},
				'phantomjs-options': taskConfig.phantomJS
			});
	});

	// Prepare test-config
	compiler = webpack({
		// Create a map of entries, i.e. {'assets/js/main': './source/assets/js/main.js'}
		entry: helpers.webpack.getEntries(src, taskConfig.srcTestsBase),
		module: {
			loaders: [
				{
					test: /qunit\.js$/,
					loader: 'expose?QUnit'
				},
				{
					test: /\.css$/,
					loader: 'style-loader!css-loader'
				}
			]
		},
		externals: function(context, request, callback) {
			if (request === 'jquery') {
				return callback(null, 'jQuery');
			} else if (request === 'qunitjs' && taskConfig.srcTestsPattern.test(context)) {
				return callback(null, 'QUnit');
			}

			callback();
		},

		output: {
			path: taskConfig.destTests,
			filename: '[name].js'
		}
	});

	if (util.env.watch && !util.env.skipWebpackWatch) {
		cb = _.once(cb);

		compiler.watch({}, compilerCallback);
	} else {
		compiler.run(compilerCallback);
	}
});

module.exports = {
	taskName: taskName,
	taskConfig: taskConfig
};

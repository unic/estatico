'use strict';

var gulp = require('gulp'),

	// Plugins (both "gulp-*" and "gulp.*")
	plugins = require('gulp-load-plugins')({
		pattern: 'gulp{-,.}*',
		replaceString: /gulp(\-|\.)/
	}),

	// Helpers
	_ = require('lodash'),
	exec = require('child_process').exec,
	runSequence = require('run-sequence'),
	path = require('path'),
	fs = require('fs'),

	// Handlebars
	handlebars = require('handlebars'),

	// Livereload
	livereload = require('tiny-lr'),
	server = livereload(),

	// Static file server
	connect = require('connect'),
	connectLivereload = require('connect-livereload'),
	connectServeStatic = require('serve-static'),
	http = require('http'),
	open = require('open');


// Make handlebars layout helpers available
require('handlebars-layouts')(handlebars);


/**
 * Compile Handlebars templates to HTML
 * Make content of PAGENAME.json (or MODULENAME.json) available to template engine
 */
gulp.task('html', function() {
	var data = {};

	return gulp.src([
		'./source/{,pages/,modules/**/}!(_)*.hbs'
	])
		.pipe(plugins.tap(function(file) {
			var fileName = path.relative('./source/', file.path).replace(path.extname(file.path), '').replace(/\\/g, '/'),
				dataFile = plugins.util.replaceExtension(file.path, '.json'),
				fileData = {
					previewUrl: plugins.util.replaceExtension(fileName, '.html'),
				},
				modulePrepend = new Buffer('{{#extend "assets/vendor/unic-preview/layouts/layout"}}{{#replace "content"}}'),
				moduleAppend = new Buffer('{{/replace}}{{/extend}}');

			// Find JSON file with the same name as the template
			try {
				fileData = _.merge(fileData, JSON.parse(fs.readFileSync(dataFile)));
			} catch (err) {}

			if (file.path.indexOf('modules') !== -1) {
				fileData.isModule = true;
				fileData.code = file.contents.toString();

				// Wrap modules with custom layout for preview purposes
				file.contents = Buffer.concat([modulePrepend, file.contents, moduleAppend]);
			}

			// Save data for later use
			data[fileName] = fileData;
		}))
		.pipe(plugins.unicHandlebars({
			data: function(filePath) {
				var fileName = path.relative('./source/', filePath).replace(path.extname(filePath), '').replace(/\\/g, '/');

				return data[fileName] || {};
			},
			partials: './source/{,layouts/,pages/,modules/**/,assets/vendor/unic-preview/**/}*.hbs',
			extension: '.html'
		}))
		.pipe(plugins.prettify({
			indent_with_tabs: true,
			max_preserve_newlines: 1
		}))
		.pipe(gulp.dest('./build'))
		.on('end', function() {
			var templateData = {
					pages: [],
					modules: []
				};

			// Sort by filename and split into pages and modules
			data = _.sortBy(data, function(value, key) {
				return key;
			}).map(function(value) {
				if (value.isModule) {
					templateData.modules.push(value);
				} else {
					templateData.pages.push(value);
				}
			});

			// Create index for preview purposes
			gulp.src('./source/assets/vendor/unic-preview/index.hbs')
				.pipe(plugins.unicHandlebars({
					extension: '.html',
					data: templateData
				}))
				.pipe(gulp.dest('./build'))
				.pipe(plugins.livereload(server));
		});
});

/**
 * Compile Sass to CSS
 * Run autoprefixer on the generated CSS
 */
gulp.task('css', function() {
	return gulp.src([
		'./source/assets/css/*.scss'
	])
		.pipe(plugins.rubySass({
			loadPath: [
				'source/assets/vendor',
				'source/modules'
			],
			style: plugins.util.env.production ? 'compressed' : 'expanded',
			fullException: true
		}))
		.pipe(plugins.autoprefixer('last 2 version'))
		.pipe(plugins.size({
			title: 'css'
		}))
		.pipe(gulp.dest('./build/assets/css'))
		.pipe(plugins.livereload(server));
});

/**
 * Hint files using .jshintrc
 */
gulp.task('js:hint', function() {
	return gulp.src([
			'./source/assets/js/*.js',
			'./source/modules/**/*.js',
			'!./source/assets/vendor/*.js'
	])
		.pipe(plugins.cached('linting'))
		.pipe(plugins.jshint('.jshintrc'))
		.pipe(plugins.jshint.reporter('jshint-stylish'))
		.pipe(plugins.jshint.reporter('fail'))
			.on('error', function(err) {
				console.log('[ERROR] ' + err.message + '.');
				process.exit(1);
			});
});

/**
 * Generate head.js
 */
gulp.task('js:head', function() {
	return gulp.src([
		'./source/assets/js/head.js'
	])
		.pipe(plugins.resolveDependencies({
			pattern: /\* @requires [\s-]*(.*?\.js)/g,
			log: true
		}))
		.pipe(plugins.concat('head.js'))
		.pipe(plugins.util.env.production ? plugins.uglify() : plugins.util.noop())
		.pipe(plugins.size({
			title: 'js:head'
		}))
		.pipe(gulp.dest('./build/assets/js'))
		.pipe(plugins.livereload(server));
});

/**
 * Generate main.js
 */
gulp.task('js:main', function() {
	return gulp.src([
		'./source/assets/js/main.js'
	])
		.pipe(plugins.resolveDependencies({
			pattern: /\* @requires [\s-]*(.*?\.js)/g,
			log: true
		}))
		.pipe(plugins.concat('main.js'))
		.pipe(plugins.util.env.production ? plugins.uglify() : plugins.util.noop())
		.pipe(plugins.size({
			title: 'js:main'
		}))
		.pipe(gulp.dest('./build/assets/js'))
		.pipe(plugins.livereload(server));
});

/**
 * Precompile JS templates (optional)
 */
gulp.task('js:templates', function() {
	return gulp.src([
		'./source/modules/**/*.hbs'
	])
		.pipe(plugins.unicHandlebars({
			precompile: true,
			partials: './source/modules/**/*.hbs'
		}))
		.pipe(plugins.defineModule('plain', { // RequireJS: use 'amd' over plain and uncomment lines below
			// require: {
			// 	Handlebars: 'handlebars'
			// },
			context: {
				handlebars: 'Handlebars.template(<%= contents %>)'
			},
			wrapper: '<%= handlebars %>'
		}))
		.pipe(plugins.declare({
			namespace: 'Unic.templates',
			processName: function(filePath) {
				// Use "modules/x/y" as partial name, e.g.
				var name = path.relative('./source/', filePath);

				return plugins.util.replaceExtension(name, '');
			}
		}))
		.pipe(plugins.concat('templates.js'))
		.pipe(gulp.dest('./source/assets/.tmp/'))
		.pipe(plugins.livereload(server));
});

/**
 * Generate customized Modernizr build in source/assets/.tmp/
 * Using Customizr, crawl through project files and gather up references to Modernizr tests
 *
 * See https://github.com/doctyper/customizr
 */
gulp.task('js:modernizr', function() {
	return gulp.src([
		'./source/assets/css/*.scss',
		'./source/modules/**/*.scss',
		'./source/assets/js/*.js',
		'./source/modules/**/*.js',
		'!./source/assets/vendor/*.js'
	])
		.pipe(plugins.modernizr({}))
		.pipe(plugins.util.env.production ? plugins.uglify() : plugins.util.noop())
		.pipe(gulp.dest('./source/assets/.tmp'));
});

/**
 * Generate customized lodash build in source/assets/.tmp/
 */
gulp.task('js:lodash', function(cb) {
	var cmdDir = 'node_modules/.bin/',
		targetDir = 'source/assets/.tmp/',
		targetFile = 'lodash.js',
		relTargetPath = path.relative(cmdDir, targetDir + targetFile),
		modules = ['debounce'],
		args = [
			'include=' + modules.join(','),
			'-o',
			relTargetPath,
			'-d'
		];

	// Create source/assets/.tmp directory if not already present
	if (!fs.existsSync(targetDir)) {
		fs.mkdirSync(targetDir, function(err) {
			if (err) {
				console.log(err);
			}
		});
	}

	exec('cd ' + cmdDir + ' && lodash ' + args.join(' '), cb);
});

/**
 * Generate icon font
 * Generate SCSS file based on handlebars template
 */
gulp.task('media:iconfont', function() {
	return gulp.src([
		'./source/assets/media/iconfont/*.svg',
		'./source/modules/**/iconfont/*.svg'
	])
		.pipe(plugins.iconfont({
			fontName: 'Icons'
		}))
			.on('codepoints', function(codepoints, options) {
				codepoints = _.map(codepoints, function(codepoint) {
					return {
						name: codepoint.name,
						codepoint: codepoint.codepoint.toString(16).toUpperCase()
					};
				});

				gulp.src('./source/assets/css/templates/icons.scss')
					.pipe(plugins.unicHandlebars({
						data: {
							codepoints: codepoints,
							options: _.merge(options, {
								fontPath: '../fonts/icons/'
							})
						}
					}))
					.pipe(gulp.dest('./source/assets/.tmp/'));
			})
		.pipe(plugins.size({
			title: 'media:iconfont'
		}))
		.pipe(gulp.dest('./build/assets/fonts/icons/'));
});

/**
 * Generate sprite image from input files (can be of mixed file type)
 * Generate SCSS file based on mustache template
 *
 * See https://github.com/twolfson/gulp.spritesmith
 */
gulp.task('media:pngsprite', function () {
	var spriteData = gulp.src([
			'./source/assets/media/pngsprite/*.png',
			'./source/modules/**/pngsprite/*.png'
	])
		.pipe(plugins.spritesmith({
			imgName: 'sprite.png',
			cssName: 'sprite.scss',
			imgPath: '../media/sprite.png',
			cssTemplate: './source/assets/css/templates/sprite.scss',
			engine: 'pngsmith'
		}));

	spriteData.css.pipe(gulp.dest('./source/assets/.tmp/'));

	return spriteData.img
		.pipe(plugins.size({
			title: 'media:pngsprite'
		}))
		.pipe(gulp.dest('./build/assets/media/'));
});

/**
 * Copy specific media files to build directory
 */
gulp.task('media:copy', function() {
	return gulp.src([
			'./source/assets/fonts/{,**/}*',
			'./source/assets/media/*.*',
			'./source/tmp/media/*'
	], {
		base: './source/'
	})
		.pipe(plugins.size({
			title: 'media:copy'
		}))
		.pipe(gulp.dest('./build'));
});

/**
 * Remove build folder
 */
gulp.task('clean', function() {
	return gulp.src([
		'build'
	], {
		read: false
	})
		.pipe(plugins.clean());
});

/**
 * Run specific tasks when specific files have changed
 */
gulp.task('watch', function() {
	// Listen on port 35729
	server.listen(35729, function (err) {
		if (err) {
			return console.log(err);
		}

		gulp.watch([
			'source/{,pages/,modules/**/}*.hbs',
			'source/{,pages/,modules/**/}*.json'
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

/**
 * Create build directory
 */
gulp.task('build', function(callback) {
	// Currently, the modernizr task cannot run in parallel with other tasks. This should get fixed as soon as Modernizr 3 is published and the plugin is officially released.
	runSequence('clean', ['js:lodash', 'media:iconfont', 'media:pngsprite'], 'js:modernizr', ['html', 'css', 'js:hint', 'js:head', 'js:main', 'media:copy'], callback);
});

/**
 * Serve build directory
 */
gulp.task('serve', function() {
	var app = connect()
			.use(connectLivereload())
			.use(connectServeStatic('build')),
		server = http.createServer(app).listen(9000);

	server.on('listening', function() {
		open('http://localhost:9000');
	});

	// Clean on exit
	process.on('SIGINT', function () {
		exec('gulp clean', function () {
			process.exit(0);
		});
	});
});

/**
 * Default task: Create connect server with livereload functionality
 * Serve build directory
 */
gulp.task('default', function(callback) {
	runSequence(['build', 'watch'], 'serve', callback);
});

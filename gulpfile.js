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
	path = require('path'),
	es = require('event-stream'),

	// Handlebars
	handlebars = require('handlebars'),

	// Livereload
	livereload = require('tiny-lr'),
	server = livereload(),

	// Static file server
	connect = require('connect'),
	connectLivereload = require('connect-livereload'),
	http = require('http'),
	open = require('open');

// Apply handlebar helpers
require('handlebars-layouts')(handlebars);


/**
 * Compile Handlebars templates to HTML
 * Make content of data/FILENAME.json available to FILENAME.html
 */
gulp.task('html', function() {
	return gulp.src('./source/*.html')
		.pipe(plugins.appendData({
			property: 'data',
			getRelativePath: function(file) {
				var fileName = plugins.util.replaceExtension(path.basename(file.path), '.json');

				return path.join('data', fileName);
			}
		}))
		.pipe(plugins.consolidate('handlebars', function(file) {
			return _.merge({
				partials: {
					slideshow: 'modules/carousel/carousel',
					layout: 'layouts/layout'
				}
			}, file.data);
		}))
		.pipe(gulp.dest('./build'))
		.pipe(plugins.livereload(server));
});

/**
 * Compile Sass to CSS
 * Run autoprefixer on the generated CSS
 */
gulp.task('css', function() {
	return gulp.src('./source/assets/css/main.scss')
		.pipe(plugins.rubySass({
			loadPath: [
				'source/assets/vendor',
				'source/modules'
			],
			style: plugins.util.env.production ? 'compressed' : 'expanded',
			fullException: true
		}))
		.pipe(plugins.autoprefixer('last 2 version'))
		.pipe(gulp.dest('./build/assets/css'))
		.pipe(plugins.livereload(server));
});

/**
 * Hint files
 * Generate head.js
 * Generate main.js
 */
gulp.task('js', function() {
	gulp.src([
			'./source/assets/js/*.js',
			'!./source/assets/vendor/*.js'
		])
		.pipe(plugins.jshint('.jshintrc'))
		.pipe(plugins.jshint.reporter('jshint-stylish'));

	gulp.src('./source/assets/js/head.js')
		.pipe(plugins.resolveDependencies({
			pattern: /\* @requires [\s-]*(.*?\.js)/g,
			log: true
		}))
		.pipe(plugins.concat('head.js'))
		.pipe(plugins.util.env.production ? plugins.uglify() : plugins.util.noop())
		.pipe(gulp.dest('./build/assets/js'))
		.pipe(plugins.livereload(server));

	gulp.src('./source/assets/js/main.js')
		.pipe(plugins.resolveDependencies({
			pattern: /\* @requires [\s-]*(.*?\.js)/g,
			log: true
		}))
		.pipe(plugins.concat('main.js'))
		.pipe(plugins.util.env.production ? plugins.uglify() : plugins.util.noop())
		.pipe(gulp.dest('./build/assets/js'))
		.pipe(plugins.livereload(server));
});

/**
 * Precompile JS templates
 */
gulp.task('js-templates', function() {
	gulp.src('./source/modules/**/*.html')
		.pipe(plugins.handlebars())
		.pipe(plugins.defineModule('plain'))
		.pipe(plugins.declare({
			namespace: 'Unic.templates'
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
gulp.task('modernizr', function() {
	return gulp.src([
			'./source/assets/css/*.scss',
			'./source/modules/**/*.scss',
			'./source/assets/js/*.js',
			'./source/modules/**/*.js',
			'!./source/assets/vendor/*.js'
		])
		.pipe(plugins.modernizr({}))
		.pipe(plugins.util.env.production ? uglify() : plugins.util.noop())
		.pipe(gulp.dest('./source/assets/.tmp'));
});

/**
 * Generate customized lodash build in source/assets/.tmp/
 */
gulp.task('lodash', function() {
	var modules = ['template', 'each', 'debounce'],
		args = [
			'include=' + modules.join(','),
			'-o',
			'source/assets/.tmp/lodash.js',
			'-d'
		];

	exec('lodash ' + args.join(' '));
});

/**
 * Generate icon font
 * Generate SCSS file based on handlebars template
 */
gulp.task('iconfont', function() {
	gulp.src([
			'./source/assets/media/iconfont/*.svg',
			'./source/modules/**/iconfont/*.svg'
		])
		.pipe(plugins.iconfont({
			fontName: 'Icons'
		}))
			.on('codepoints', function(codepoints, options) {
				gulp.src('./source/assets/vendor/unic-iconfont-template/icons.scss.hbs')
					.pipe(plugins.consolidate('handlebars', {
						codepoints: codepoints,
						options: _.merge(options, {
							fontPath: '../fonts/'
						})
					}))
					.pipe(plugins.rename('icons.scss'))
					.pipe(gulp.dest('./source/assets/.tmp/'));
			})
		.pipe(gulp.dest('./build/assets/fonts/icons/'));
});

/**
 * Generate sprite image from input files (can be of mixed file type)
 * Generate SCSS file based on mustache template
 *
 * See https://github.com/twolfson/gulp.spritesmith
 */
gulp.task('pngsprite', function () {
	var spriteData = gulp.src([
			'./source/assets/media/pngsprite/*',
			'./source/modules/**/pngsprite/*'
		]).pipe(plugins.spritesmith({
			imgName: 'sprite.png',
			cssName: 'sprite.scss',
			imgPath: '../media/sprite.png',
			cssTemplate: './source/assets/vendor/unic-pngsprite-template/sprite.scss'
		}));

	spriteData.css.pipe(gulp.dest('./source/assets/.tmp/'));

	return spriteData.img.pipe(gulp.dest('./build/assets/media/'));
});

/**
 * Copy specific media files to build directory
 */
gulp.task('media', function() {
	return gulp.src([
				'./source/assets/fonts/{,**/}*',
				'./source/assets/media/*',
				'./source/tmp/media/*'
			], {
			base: './source/'
		})
		.pipe(gulp.dest('./build'));
});

/**
 * Remove build folder
 */
gulp.task('clean', function() {
	return gulp.src(['build'], {
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
			return console.log(err)
		};

		gulp.watch([
			'source/{,*/}*.html',
			'source/data/*.json',
			'source/modules/**/*.html'
		], 'html');

		gulp.watch([
			'source/assets/css/*.scss',
			'source/assets/.tmp/*.scss',
			'source/modules/**/*.scss'
		], 'css');

		gulp.watch([
			'source/assets/js/{,**/}*.js',
			'source/assets/.tmp/*.js',
			'source/modules/**/*.js'
		], 'js');

		gulp.watch([
			'source/assets/pngsprite/*',
			'source/modules/**/pngsprite/*'
		], 'pngsprite');

		gulp.watch([
			'source/assets/iconfont/*.svg',
			'source/modules/**/iconfont/*.svg'
		], 'iconfont');
	});
});

/**
 * Run special tasks which are not part of server or build
 */
gulp.task('setup', ['modernizr'], function() {
	gulp.start('iconfont', 'pngsprite', 'lodash');
});

/**
 * Create build directory
 */
gulp.task('build', ['clean'], function() {
	gulp.start('html', 'css', 'js', 'media');
});

/**
 * Create connect server with livereload functionality
 * Serve build directory
 */
gulp.task('server', ['html', 'css', 'js', 'media', 'watch'], function() {
	var app = connect()
			.use(connectLivereload())
			.use(connect.static('build')),
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
 * Default task (when using "$ gulp")
 *
 * Recreate build directory and start preview server
 */
gulp.task('default', ['clean'], function() {
	gulp.start('server');
});

'use strict';

var gulp = require('gulp'),

	// Plugins
	plugins = require('gulp-load-plugins')(),

	// Helpers
	_ = require('lodash'),
	exec = require('child_process').exec,

	// Spriting
	spritesmith = require('gulp.spritesmith'),

	// Livereload
	livereload = require('tiny-lr'),
	server = livereload(),
	connect = require('connect'),
	connectLivereload = require('connect-livereload'),
	http = require('http'),
	open = require('open');


/**
 * HTML task
 *
 * Compiles Swig templates to HTML
 * Adds YAML front matter data to file object
 */
gulp.task('html', function() {
	var getTemplateData = function(file) {
			var data = {};

			_.each(file.frontmatter, function(val, key) {
				data[key] = val;
			});

			return data;
		};

	return gulp.src('./source/*.html')
		.pipe(plugins.frontMatter({
			property: 'frontmatter',
			remove: true
		}))
		.pipe(plugins.swig({
			data: getTemplateData,
			defaults: {
				cache: false
			}
		}))
		.pipe(gulp.dest('./build'))
		.pipe(plugins.livereload(server));
});

/**
 * CSS task
 *
 * Compiles Sass to CSS
 * Runs autoprefixer on the generated CSS
 */
gulp.task('css', function() {
	return gulp.src('./source/assets/css/main.scss')
		.pipe(plugins.rubySass({
			loadPath: [
				'source/assets/vendor',
				'source/modules'
			],
			style: plugins.util.env.production ? 'compressed' : 'expanded'
		}))
		.pipe(plugins.autoprefixer('last 2 version'))
		.pipe(gulp.dest('./build/assets/css'))
		.pipe(plugins.livereload(server));
});

/**
 * JS task
 *
 * Hints files
 * Generates head.js
 * Generates main.js
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
 * Modernizr task
 *
 * Generates customized Modernizr build in source/assets/vendor/.tmp/
 * Using Customizr, crawls through project files and gathers up references to Modernizr tests
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
		.pipe(gulp.dest('./source/assets/vendor/.tmp'));
});

/**
 * Lodash task
 *
 * Generates customized lodash build in source/assets/vendor/.tmp/
 */
gulp.task('lodash', function() {
	var modules = ['template', 'each', 'debounce'],
		args = [
			'include=' + modules.join(','),
			'-o',
			'source/assets/vendor/.tmp/lodash.js',
			'-d'
		];

	exec('lodash ' + args.join(' '));
});

/**
 * Icon font task
 *
 * Generates icon font and SCSS file
 */
gulp.task('iconfont', function() {
	gulp.src(['./source/assets/media/icons/*.svg'])
		.pipe(plugins.iconfontCss({
			fontName: 'Icons',
			path: './source/assets/css/templates/_icons.scss',
			targetPath: '../../css/_icons.scss',
			fontPath: '../fonts/icons/'
		}))
		.pipe(plugins.iconfont({
			fontName: 'Icons'
		}))
		.pipe(gulp.dest('./source/assets/fonts/icons/'));
});

/**
 * Media task
 *
 * Copies specific media files to build
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
 * Spriting
 *
 * Generates sprite image from input files (can be of mixed file type)
 * Generates SCSS file based on mustache template
 *
 * See https://github.com/twolfson/gulp.spritesmith
 */
gulp.task('sprite', function () {
	var spriteData = gulp.src([
			'./source/assets/media/sprite/*',
			'./source/modules/**/sprite/*'
		]).pipe(spritesmith({
			imgName: 'sprite.png',
			cssName: '_sprite.scss',
			imgPath: '../media/sprite.png',
			cssTemplate: './source/assets/css/templates/_sprite.scss'
		}));

	spriteData.img.pipe(gulp.dest('./source/assets/media/'));
	spriteData.css.pipe(gulp.dest('./source/assets/css/'));
});

/**
 * Clean-up task
 *
 * Removes build folder
 */
gulp.task('clean', function() {
	return gulp.src(['build'], {
			read: false
		})
		.pipe(plugins.clean());
});

/**
 * Watch task
 *
 * Runs specific tasks when specific files have changed
 */
gulp.task('watch', function() {
	// Listen on port 35729
	server.listen(35729, function (err) {
		if (err) {
			return console.log(err)
		};

		gulp.watch(['source/{,*/}*.html', 'source/modules/**/*.html'], ['html']);
		gulp.watch(['source/assets/css/*.scss', 'source/modules/**/*.scss'], ['css']);
		gulp.watch(['source/assets/js/{,**/}*.js', 'source/modules/**/*.js'], ['js']);
	});
});

/**
 * Setup task
 *
 * Runs special tasks which are not part of server or build
 */
gulp.task('setup', function() {
	gulp.start('modernizr', 'lodash');
});

/**
 * Build task
 *
 * Creates build directory
 */
gulp.task('build', ['clean'], function() {
	gulp.start('html', 'css', 'js', 'media');
});

/**
 * Preview server task
 *
 * Creates Node connect server with livereload functionality
 * Serves build directory
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
 * Recreates build directory and starts preview server
 */
gulp.task('default', ['clean'], function() {
	gulp.start('server');
});

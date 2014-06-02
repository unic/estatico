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


// Make handlebars layout helpers available
require('handlebars-layouts')(handlebars);


/**
 * Compile Handlebars templates to HTML
 * Make content of data/FILENAME.json available to template engine
 */
gulp.task('html', function() {
	return gulp.src([
		'./source/{,styleguide/,pages/}*.html'
	])
		.pipe(plugins.frontMatter({
			property: 'frontmatter'
		}))
		.pipe(plugins.appendTemplateData({
			partialGlob: './source/{,layouts/**/,modules/**/,pages/,styleguide/**/}*.html'
		}))
		.pipe(plugins.consolidate('handlebars', function(file) {
			return file.data;
		}))
		.pipe(plugins.frontMatter()) // Pipe through gulp-front-matter once more to remove front matter data from the generated files (handlebars does re-add it)
		.pipe(gulp.dest('./build'))
		.pipe(plugins.livereload(server));
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
		.pipe(gulp.dest('./build/assets/css'))
		.pipe(plugins.livereload(server));
});

/**
 * Hint files
 * Generate head.js
 * Generate main.js
 */
gulp.task('jshint', function() {
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

gulp.task('js-head', function() {
	return gulp.src([
		'./source/assets/js/head.js'
	])
		.pipe(plugins.resolveDependencies({
			pattern: /\* @requires [\s-]*(.*?\.js)/g,
			log: true
		}))
		.pipe(plugins.concat('head.js'))
		.pipe(plugins.util.env.production ? plugins.uglify() : plugins.util.noop())
		.pipe(gulp.dest('./build/assets/js'))
		.pipe(plugins.livereload(server));
});

gulp.task('js-main', function() {
	return gulp.src([
		'./source/assets/js/main.js'
	])
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
 * Precompile JS templates (for demo purposes)
 */
gulp.task('js-templates', function() {
	return gulp.src([
		'./source/modules/**/*.html'
	])
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
		.pipe(plugins.util.env.production ? plugins.uglify() : plugins.util.noop())
		.pipe(gulp.dest('./source/assets/.tmp'));
});

// Use wrapper to prevent the slightly buggy modernizr task from "breaking the chain"
gulp.task('modernizr-wrapper', function(cb) {
	exec('node_modules/.bin/gulp modernizr', cb)
});

/**
 * Generate customized lodash build in source/assets/.tmp/
 */
gulp.task('lodash', function(cb) {
	var modules = ['debounce'],
		args = [
			'include=' + modules.join(','),
			'-o',
			'source/assets/.tmp/lodash.js',
			'-d'
		];

	exec('node_modules/.bin/lodash ' + args.join(' '), cb);
});

/**
 * Generate icon font
 * Generate SCSS file based on handlebars template
 */
gulp.task('iconfont', function() {
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
					.pipe(plugins.consolidate('handlebars', {
						codepoints: codepoints,
						options: _.merge(options, {
							fontPath: '../fonts/icons/'
						})
					}))
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

	return spriteData.img.pipe(gulp.dest('./build/assets/media/'));
});

/**
 * Copy specific media files to build directory
 */
gulp.task('media', function() {
	return gulp.src([
			'./source/assets/fonts/{,**/}*',
			'./source/assets/media/*.*',
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
			'source/{,*/}*.html',
			'source/data/*.json',
			'source/modules/**/*.html',
			'source/styleguide/**/*.html'
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
		], ['jshint', 'js-head', 'js-main']);

		gulp.watch([
			'source/assets/pngsprite/*.png',
			'source/modules/**/pngsprite/*.png'
		], ['pngsprite']);

		gulp.watch([
			'source/assets/iconfont/*.svg',
			'source/modules/**/iconfont/*.svg'
		], ['iconfont']);
	});
});

/**
 * Create build directory
 */
gulp.task('build', function(callback) {
	runSequence('clean', ['lodash', 'modernizr-wrapper', 'iconfont', 'pngsprite'], ['html', 'css', 'jshint', 'js-head', 'js-main', 'media'], callback);
});

/**
 * Serve build directory
 */
gulp.task('serve', function() {
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
 * Default task: Create connect server with livereload functionality
 * Serve build directory
 */
gulp.task('default', function(callback) {
	runSequence(['build', 'watch'], 'serve', callback);
});

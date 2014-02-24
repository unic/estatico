'use strict';

var gulp = require('gulp'),

	// Plugins
	plugins = require('gulp-load-plugins')(),

	// Helpers
	_ = require('lodash'),

	// Livereload
	livereload = require('tiny-lr'),
	server = livereload(),
	connect = require('connect'),
	connectLivereload = require('connect-livereload'),
	http = require('http'),
	open = require('open');


// HTML
gulp.task('html', function() {
	var templateData = function(file) {
			var data = {
					cache: false
				};

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
		.pipe(plugins.consolidate('swig', templateData))
		.pipe(gulp.dest('./build'))
		.pipe(plugins.livereload(server));
});

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
		.pipe(plugins.autoprefixer('last 2 version'))
		.pipe(gulp.dest('./build/assets/css'))
		.pipe(plugins.livereload(server));
});

// Scripts
gulp.task('js', function() {
	gulp.src([
			'./source/assets/js/*.js',
			'!./source/assets/vendor/*.js',
			'!./source/assets/js/.tmp/*.js'
		])
		.pipe(plugins.jshint('.jshintrc'))
		.pipe(plugins.jshint.reporter('jshint-stylish'));

	gulp.src('./source/assets/js/head.js')
		.pipe(plugins.resolveDependencies({
			pattern: /\/\/= require (.*?\.js)/g,
			log: true
		}))
		.pipe(plugins.concat('head.js'))
		.pipe(plugins.util.env.production ? plugins.uglify() : plugins.util.noop())
		.pipe(gulp.dest('./build/assets/js'))
		.pipe(plugins.livereload(server));

	gulp.src('./source/assets/js/main.js')
		.pipe(plugins.resolveDependencies({
			pattern: /\/\/= require (.*?\.js)/g,
			log: true
		}))
		.pipe(plugins.concat('main.js'))
		.pipe(plugins.util.env.production ? plugins.uglify() : plugins.util.noop())
		.pipe(gulp.dest('./build/assets/js'))
		.pipe(plugins.livereload(server));
});

gulp.task('modernizr', function() {
	return gulp.src([
			'./source/assets/js/*.js',
			'./source/assets/css/*.scss',
			'!./source/assets/js/.tmp/modernizr.js'
		])
		.pipe(plugins.modernizr({}))
		.pipe(plugins.util.env.production ? uglify() : plugins.util.noop())
		.pipe(gulp.dest('./source/assets/js/.tmp'));
});

gulp.task('lodash', function() {
	var args = [
			'include=' + ['template', 'each', 'debounce'].join(','),
			'-o',
			'source/assets/js/.tmp/lodash.js',
			'-d'
		];

	require('child_process').exec('lodash ' + args.join(' '));
});

// Fonts
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

// Media
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

// Sprite
// gulp.task('sprite', function() {
// 	return gulp.src('./source/assets/media/*.png')
// 		.pipe(plugins.spritesmith({
// 			cssTargetPath: '../css/_sprite.scss',
// 			imgPath: '../media/',
// 		}))
// 		.pipe(gulp.dest('./build/assets/media'));
// });

// Clean
gulp.task('clean', function() {
	return gulp.src(['build'], {
			read: false
		})
		.pipe(plugins.clean());
});

// Watch
gulp.task('watch', function() {
	// Listen on port 35729
	server.listen(35729, function (err) {
		if (err) {
			return console.log(err)
		};

		gulp.watch('source/{,*/}*.html', ['html']);
		gulp.watch('source/modules/**/*.html', ['html']);
		gulp.watch('source/assets/css/*.scss', ['css']);
		gulp.watch('source/modules/**/*.scss', ['css']);
		gulp.watch('source/assets/js/{,**/}*.js', ['js']);
		gulp.watch('source/modules/**/*.js', ['js']);
	});
});

// Connect server
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

// Build
gulp.task('build', ['clean'], function() {
	gulp.start('html', 'css', 'js', 'media');
});

// Default task
gulp.task('default', ['clean'], function() {
	gulp.start('server');
});

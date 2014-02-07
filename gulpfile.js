'use strict';

// Load plugins
var exec = require('child_process').exec,
	_ = require('lodash'),
	gulp = require('gulp'),
	plugins = require('gulp-load-plugins')(),
	livereload = require('tiny-lr'),
	server = livereload(),
	connect = require('connect'),
	connectLivereload = require('connect-livereload'),
	http = require('http'),
	open = require('open');


var config = {
		swig: {
			//
		},
		sass: {
			//
		},
		autoprefixer: 'last 2 version',
		modernizr: {
			// excludeTests: ['supports']
		},
		lodash: {
			include: ['template', 'each', 'debounce']
		},
		paths: {
			sass: [
				'source/assets/vendor'
			],
			jshint: [
				'./source/assets/js/*.js',
				'!./source/assets/vendor/*.js',
				'!./source/assets/js/.tmp/*.js'
			],
			head: [
				'./source/assets/js/.tmp/modernizr.js',
				'./source/assets/js/head.js'
			],
			main: [
				'./source/assets/vendor/jquery/jquery.js',
				'./source/assets/js/.tmp/lodash.js',
				'./source/assets/js/*.js',
				'!./source/assets/js/.tmp/modernizr.js',
				'!./source/assets/js/head.js'
			],
			modernizr: [
				'./source/assets/js/*.js',
				'./source/assets/css/*.scss',
				'!./source/assets/js/.tmp/modernizr.js'
			],
			lodash: 'source/assets/js/.tmp/lodash.js'
		},
		server: {
			port: 9000
		},
		livereload: {
			port: 35729
		}
	};


// HTML
gulp.task('html', function() {
	var swigConfig = function(file) {
			var frontmatter = {};

			_.each(file.frontmatter, function(val, key) {
				frontmatter[key] = val;
			});

			return frontmatter;
		};

	return gulp.src('./source/*.html')
		.pipe(plugins.frontMatter({
			property: 'frontmatter',
			remove: true
		}))
		.pipe(plugins.consolidate('swig', swigConfig))
		.pipe(gulp.dest('./build'))
		.pipe(plugins.livereload(server));
});

// Styles
gulp.task('css', function() {
	var sassConfig = _.merge({
			loadPath: config.paths.sass,
			style: plugins.util.env.production ? 'compressed' : 'expanded'
		}, config.sass);

	return gulp.src('./source/assets/css/main.scss')
		.pipe(plugins.rubySass(sassConfig))
		.pipe(plugins.autoprefixer(config.autoprefixer))
		.pipe(gulp.dest('./build/assets/css'))
		.pipe(plugins.livereload(server));
});

// Scripts
gulp.task('js', function() {
	gulp.src(config.paths.jshint)
		.pipe(plugins.jshint('.jshintrc'))
		.pipe(plugins.jshint.reporter('jshint-stylish'));

	gulp.src(config.paths.head)
		.pipe(plugins.concat('head.js'))
		.pipe(plugins.util.env.production ? uglify() : plugins.util.noop())
		.pipe(gulp.dest('./build/assets/js'))
		.pipe(plugins.livereload(server));

	gulp.src(config.paths.main)
		.pipe(plugins.concat('main.js'))
		.pipe(plugins.util.env.production ? uglify() : plugins.util.noop())
		.pipe(gulp.dest('./build/assets/js'))
		.pipe(plugins.livereload(server));
});

gulp.task('modernizr', function() {
	return gulp.src(config.paths.modernizr)
		.pipe(plugins.modernizr(config.modernizr))
		.pipe(plugins.util.env.production ? uglify() : plugins.util.noop())
		.pipe(gulp.dest('./source/assets/js/.tmp'));
});

gulp.task('lodash', function() {
	var args = [
			'include=' + config.lodash.include.join(','),
			'-o',
			config.paths.lodash,
			'-d'
		];

	exec('lodash ' + args.join(' '));
});

// Fonts
gulp.task('iconfont', function() {
	gulp.src(['./source/assets/media/icons/*.svg'])
		.pipe(plugins.iconfontCss({
			path: './source/assets/css/templates/_icons.scss',
			targetPath: '../../css/_icons.scss'
		}))
		.pipe(plugins.iconfont({
			fontName: 'Icons'
		}))
		.pipe(gulp.dest('./source/assets/fonts/icons/'));
});

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
	server.listen(config.livereload.port, function (err) {
		if (err) {
			return console.log(err)
		};

		gulp.watch('source/{,*/}*.html', ['html']);
		gulp.watch('source/assets/css/*.scss', ['css']);
		gulp.watch('source/assets/js/*.js', ['js']);
	});
});

// Connect server
gulp.task('server', ['html', 'css', 'js', 'watch'], function() {
	var app = connect()
			.use(connectLivereload())
			.use(connect.static('build')),
		server = http.createServer(app).listen(config.server.port);

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
	gulp.start('html', 'css', 'js');
});

// Default task
gulp.task('default', ['clean'], function() {
	gulp.start('server');
});

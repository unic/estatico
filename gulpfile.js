// Load plugins
var gulp = require('gulp'),
	gutil = require('gulp-util'),
	consolidate = require('gulp-consolidate'),
	sass = require('gulp-ruby-sass'),
	autoprefixer = require('gulp-autoprefixer'),
	jshint = require('gulp-jshint'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	clean = require('gulp-clean'),
	livereload = require('gulp-livereload'),
	lr = require('tiny-lr'),
	server = lr(),
	connect = require('connect'),
	http = require('http'),
	open = require('open'),
	modernizr = require('gulp-modernizr'),
	frontmatter = require('gulp-front-matter'),
	exec = require('child_process').exec,
	_ = require('lodash');


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
		.pipe(frontmatter({
			property: 'frontmatter',
			remove: true
		}))
		.pipe(consolidate('swig', swigConfig))
		.pipe(gulp.dest('./build'))
		.pipe(livereload(server));
});

// Styles
gulp.task('css', function() {
	var sassConfig = _.merge({
			loadPath: config.paths.sass,
			style: gutil.env.production ? 'compressed' : 'expanded'
		}, config.sass);

	return gulp.src('./source/assets/css/main.scss')
		.pipe(sass(sassConfig))
		.pipe(autoprefixer(config.autoprefixer))
		.pipe(gulp.dest('./build/assets/css'))
		.pipe(livereload(server));
});

// Scripts
gulp.task('js', function() {
	gulp.src(config.paths.jshint)
		.pipe(jshint('.jshintrc'))
		.pipe(jshint.reporter('jshint-stylish'));

	gulp.src(config.paths.head)
		.pipe(concat('head.js'))
		.pipe(gutil.env.production ? uglify() : gutil.noop())
		.pipe(gulp.dest('./build/assets/js'))
		.pipe(livereload(server));

	gulp.src(config.paths.main)
		.pipe(concat('main.js'))
		.pipe(gutil.env.production ? uglify() : gutil.noop())
		.pipe(gulp.dest('./build/assets/js'))
		.pipe(livereload(server));
});

gulp.task('modernizr', function() {
	return gulp.src(config.paths.modernizr)
		.pipe(modernizr(config.modernizr))
		.pipe(gutil.env.production ? uglify() : gutil.noop())
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

// Clean
gulp.task('clean', function() {
	return gulp.src(['build'], {
			read: false
		})
		.pipe(clean());
});

// Watch
gulp.task('watch', function() {
	// Listen on port 35729
	server.listen(35729, function (err) {
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
			.use(require('connect-livereload')())
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
	gulp.start('html', 'css', 'js');
});

// Default task
gulp.task('default', ['clean'], function() {
	gulp.start('server');
});

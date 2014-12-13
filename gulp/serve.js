'use strict';

/**
 * Serve build directory
 */

var gulp = require('gulp'),
	exec = require('child_process').exec,
	connect = require('connect'),
	connectLivereload = require('connect-livereload'),
	connectServeStatic = require('serve-static'),
	url = require('url'),
	http = require('http'),
	open = require('open');

gulp.task('serve', function() {
	var app = connect()
			.use(connectLivereload())
			.use(function(req, res, next) {
				var parts = url.parse(req.url, true),
					delay = parts.query.delay || 0;

				// Respond to optional 'delay' parameter
				// Example: http://localhost:9000/tmp/data/test.json&delay=5000
				setTimeout(function() {
					next();
				}, delay);
			})
			.use(connectServeStatic('build')),
		server = http.createServer(app).listen(9000);

	server.on('listening', function() {
		open('http://localhost:9000');
	});

	// Clean on exit
	process.on('SIGINT', function() {
		exec('gulp clean', function() {
			process.exit(0);
		});
	});
});

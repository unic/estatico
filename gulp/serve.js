'use strict';

var gulp = require('gulp'),
	exec = require('child_process').exec,
	connect = require('connect'),
	connectLivereload = require('connect-livereload'),
	http = require('http'),
	open = require('open');

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


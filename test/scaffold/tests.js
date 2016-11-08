'use strict';

var helpers = require('../../helpers/tests.js'),
	del = require('del'),
	_ = require('lodash'),
	gulp = require('gulp');

module.exports = {
	before: function(done) {
		this.timeout(10000);

		var task = require('../../gulp/scaffold/default.js'),

			// Configuration of task should use fixtures as src and results directory in testcase folder as dest
			// All paths should be relative to gulpfile.js
			testTaskConfig = _.merge({}, task.taskConfig, {
				scaffold: {
					src: './source/modules/.scaffold',
					dest: './test/scaffold/results/',
					originalName: 'Test Test',
					name: 'testtest',
					className: 'TestTest',
					keyName: 'testTest',
					createStyles: true,
					createScript: true
				},
				registerStyles: {
					src: './test/scaffold/results/register/main.scss'
				},
				registerScript: {
					src: './test/scaffold/results/register/main.js'
				}
			});

		// Moving fixtures to register JS and SCSS in
		gulp.src('./test/scaffold/fixtures/register/*', {
			base: './test/scaffold/fixtures'
		})
			.pipe(gulp.dest('./test/scaffold/results'))
			.on('finish', function() {
				// Calling the task function
				task.task(testTaskConfig, done);
			});
	},

	// Using task name as key
	default: function() {
		helpers.compareResultFilesToExpected('scaffold');
	},

	after: function(done) {
		// Removing temporary results directory after test execution
		del(__dirname + '/results').then(function() {
			done();
		});
	}
};

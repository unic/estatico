'use strict';

var helpers = require('../../helpers/tests.js'),
	del = require('del');

module.exports = {
	before: function(done) {
		this.timeout(5000);

		var task = require('../../gulp/css/default.js'),

			// Configuration of task should use fixtures as src and results directory in testcase folder as dest
			// All paths should be relative to gulpfile.js
			testTaskConfig = {
				src: './test/css/fixtures/assets/css/*.scss',
				srcBase: './test/css/fixtures/',
				include: './test/css/fixtures/assets/css/',
				dest: './test/css/results/',
				plugins: {
					autoprefixer: 'last 2 version'
				}
			};

		// Calling the task function
		task.task(testTaskConfig, done);
	},

	// Using task name as key
	default: function() {
		helpers.compareResultFilesToExpected('css');
	},

	after: function(done) {

		// Removing temporary results directory after test execution
		del(__dirname + '/results', done);
	}
};

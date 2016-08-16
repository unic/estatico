'use strict';

var helpers = require('../../helpers/tests.js'),
	del = require('del');

module.exports = {
	before: function(done) {
		this.timeout(10000);

		var task = require('../../gulp/js/default.js'),

			// Configuration of task should use fixtures as src and results directory in testcase folder as dest
			// All paths should be relative to gulpfile.js
			testTaskConfig = {
				src: [
					'./test/js/fixtures/assets/js/main.js'
				],
				srcBase: './test/js/fixtures/assets/js/',
				dest: './test/js/results/assets/js/',
				destBase: './test/js/results/assets/js/'
			};

		// Calling the task function
		task.task(testTaskConfig, done);
	},

	// Using task name as key
	default: function() {
		helpers.compareResultFilesToExpected('js');
	},

	after: function(done) {
		// Removing temporary results directory after test execution
		del(__dirname + '/results', done);
	}
};

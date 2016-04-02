'use strict';

var helpers = require('../../helpers/tests.js'),
	del = require('del');

module.exports = {
	before: function(done) {
		this.timeout(5000);

		var task = require('../../gulp/media/imageversions.js'),

		// Configuration of task should use fixtures as src and results directory in testcase folder as dest
		// All paths should be relative to gulpfile.js
			testTaskConfig = {
				src: [
					'./test/imageversions/fixtures/'
				],
				fileExtensionPattern: '*.{jpg, png}',
				configFileName: 'imageversions.config.js',
				srcBase: './test/imageversions/fixtures/',
				dest: './test/imageversions/results/'
			};

		// Calling the task function
		task.task(testTaskConfig, done);

		//
	},

	// Using task name as key
	default: function(done) {
		helpers.compareImagesToExpected('imageversions', done);
	},

	after: function(done) {
		// Removing temporary results directory after test execution
		del(__dirname + '/results', done);
	}
};

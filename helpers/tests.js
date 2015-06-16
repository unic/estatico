var should = require('should'),
	glob = require('glob'),
	path = require('path'),
	fs = require('fs');

module.exports = {
	compareResultFilesToExpected: function(testCaseFolderName) {
		var	pathPrefix = __dirname + '/../test/' + testCaseFolderName,
			expectedResults = glob.sync(pathPrefix + '/expected/**/*', {
				nodir: true
			});

		// Compares files from expected folder and the results of gulp task, executed with fixtures as test data
		expectedResults.forEach(function(testFile) {
			var expectedFile = path.relative(pathPrefix + '/expected/', testFile),
				resultFile = path.resolve(pathPrefix + '/results/' + expectedFile);

			fs.readFileSync(resultFile, 'utf8').trim().should.equal(fs.readFileSync(testFile, 'utf8').trim(), expectedFile);
		});
	}
};

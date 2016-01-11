var should = require('should'),
	glob = require('glob'),
	path = require('path'),
	fs = require('fs');

module.exports = {
	compareResultFilesToExpected: function(testCaseFolderName, options) {
		var	pathPrefix = __dirname + '/../test/' + testCaseFolderName,
			expectedResults = glob.sync(pathPrefix + '/expected/**/*', {
				nodir: true
			});

		// Compares files from expected folder and the results of gulp task, executed with fixtures as test data
		expectedResults.forEach(function(expectedFilePath) {
			var expectedFileName = path.relative(pathPrefix + '/expected/', expectedFilePath),
				resultFilePath = path.resolve(pathPrefix + '/results/' + expectedFileName),
				expectedFile,
				resultFile;

			if (options && options.asBuffer) {
				expectedFile = fs.readFileSync(expectedFilePath);
				resultFile = fs.readFileSync(resultFilePath);
				resultFile.compare(expectedFile).should.equal(0, expectedFilePath);
			} else {
				// reading files as strings and trimming them - good for non-binary files
				expectedFile = fs.readFileSync(expectedFilePath, 'utf8').trim();
				resultFile = fs.readFileSync(resultFilePath, 'utf8').trim();
				resultFile.should.equal(expectedFile, expectedFilePath);
			}
		});
	}
};

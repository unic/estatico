'use strict';

var should = require('should'), // jshint ignore:line
	glob = require('glob'),
	path = require('path'),
	fs = require('fs'),
	stringComparison = function(expectedFilePath, resultFilePath) {
		// reading files as strings and trimming them - good for non-binary files
		var expectedFile = fs.readFileSync(expectedFilePath, 'utf8').trim(),
			resultFile = fs.readFileSync(resultFilePath, 'utf8').trim();

		resultFile.should.equal(expectedFile, expectedFilePath);
	},

	bufferComparison = function() {
		var expectedFile = fs.readFileSync(expectedFilePath),
			resultFile = fs.readFileSync(resultFilePath);

		resultFile.compare(expectedFile).should.equal(0, expectedFilePath);
	};

module.exports = {
	compareResultFilesToExpected: function(testCaseFolderName, options) {
		var	pathPrefix = path.join(__dirname, '/../test/', testCaseFolderName),
			expectedResults = glob.sync(pathPrefix + '/expected/**/*', {
				nodir: true
			});

		// Compares files from expected folder and the results of gulp task, executed with fixtures as test data
		expectedResults.forEach(function(expectedFilePath) {
			var expectedFileName = path.relative(pathPrefix + '/expected/', expectedFilePath),
				resultFilePath = path.resolve(pathPrefix + '/results/' + expectedFileName);

			if (options && options.asBuffer) {
				bufferComparison(expectedFilePath, resultFilePath);
			} else {
				stringComparison(expectedFilePath, resultFilePath);
			}
		});
	},

	compareResultImagesToExpected: function(testCaseFolderName, callback) {
		var pathPrefix = path.join(__dirname, '/../test/', testCaseFolderName),
			expectedResults = glob.sync(pathPrefix + '/expected/**/*', {
				nodir: true
			}),
			filesChecked = 0,
			unequalFiles = [],
			gm = require('gm'),
			onFilesChecked = function() {
				if (filesChecked < expectedResults.length) {
					setTimeout(onFilesChecked, 50);
				} else {
					try {
						unequalFiles.length.should.equal(0, 'Images different from expected: ' + unequalFiles.join(', '));
						callback();
					} catch (error) {
						callback(error);
					}
				}
			};

		// Compares files from expected folder and the results of gulp task, executed with fixtures as test data
		expectedResults.forEach(function(expectedFilePath) {
			var expectedFileName = path.relative(pathPrefix + '/expected/', expectedFilePath),
				resultFilePath = path.resolve(pathPrefix + '/results/' + expectedFileName);

			gm.compare(expectedFilePath, resultFilePath, 0.01, function(error, equal) {
				filesChecked++;
				if (!equal) {
					unequalFiles.push(expectedFilePath);
				}
			});
		});

		onFilesChecked();
	}
};

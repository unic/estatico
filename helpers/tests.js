'use strict';

var should = require('should'), // jshint ignore:line
	glob = require('glob'),
	path = require('path'),
	fs = require('fs'),
	Promise = require('promise'),
	gm = require('gm'),

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

	compareImagesToExpected: function(testCaseFolderName, cb) {
		var pathPrefix = path.join(__dirname, '/../test/', testCaseFolderName),
			expectedResults = glob.sync(pathPrefix + '/expected/**/*', {
				nodir: true
			});

		console.log('Starting image comparison...');

		Promise.all(expectedResults.map(function(expectedFilePath) {
			var expectedFileName = path.relative(pathPrefix + '/expected/', expectedFilePath),
				resultFilePath = path.resolve(pathPrefix + '/results/' + expectedFileName);

			return new Promise(function(resolve, reject) {
				gm.compare(expectedFilePath, resultFilePath, 0.01, function(error, equal) {
					if (equal) {
						resolve();
					} else {
						reject(expectedFileName + ': differs from expected.');
					}
				});
			});
		})).then(function(message) {
			console.log('All images are equal.');
			cb();
		},

		function(error) {
			cb(new Error(error));
		});
	}
};

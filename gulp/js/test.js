'use strict';

/**
 * @function `gulp js:test`
 * @desc Open built HTML files in headless Chrome, report console errors and run QUnit tests.
 */

var gulp = require('gulp');

var taskName = 'js:test',
	taskConfig = {
		src: [
			'./build/pages/**/*.html',
			'./build/demo/pages/**/*.html',
			'./build/modules/**/*.html',
			'./build/demo/modules/**/*.html'
		],
		viewports: [
			{ width: 700, height: 1000 },
			{ width: 400, height: 1000 },
			{ width: 1400, height: 1000 }
		]
	};

gulp.task(taskName, function() {
	var helpers = require('require-dir')('../../helpers'),
		puppeteer = require('puppeteer'),
		util = require('gulp-util'),
		glob = require('glob'),
		path = require('path');

	function runTests(page, file) {
		return page.evaluate(function() {
			return new Promise(function (resolve, reject) {
				if (typeof QUnit === 'undefined') {
					return resolve();
				}

				var details = [];

				QUnit.start();

				QUnit.testDone(function(results) {
					details.push(results);
				});

				QUnit.done(function(summary) {
					resolve({
						details: details,
						summary: summary
					});
				});
			});
		}).then(function(results) {
			if (!results) {
				return;
			}

			var error;

			results.details.forEach(function(test) {
				if (test.failed === 0) {
					util.log(util.colors.green(`✓ ${test.name}`));
				} else {
					util.log(util.colors.red(`× ${test.name}`));

					test.assertions.filter(function(assertion) {
						return !assertion.result;
					}).forEach(function(assertion) {
						util.log(util.colors.red(`Failing assertion: ${assertion.message}`));
					});
				}
			});

			if (results.summary.failed > 0) {
				error = {
					message: `Error in ${file}`,
					task: taskName
				};

				if (!util.env.dev) {
					return browser.close().then(function() {
						helpers.errors(error);
					});
				}

				helpers.errors(error);
			}

			return results;
		});
	}

	// Create array of resolved paths
	var src = taskConfig.src.reduce(function(paths, pathGlob) {
			var resolvedGlob = glob.sync(pathGlob).map(function(file) {
					return path.resolve(file);
				});

			return paths.concat(resolvedGlob);
		}, []);

	return puppeteer.launch({
		// headless: false
	}).then(function(browser) {
		return browser.newPage().then(function(page) {
			var pages = Promise.resolve();

			page.on('pageerror', function(err) {
				var error = {
						task: taskName,
						message: err.message
					};

				if (!util.env.dev) {
					return browser.close().then(function() {
						helpers.errors(error);
					});
				}

				helpers.errors(error);
			});

			page.on('error', console.log);

			// page.on('console', function(msg) {
			// 	console.log(msg.text);
			// });

			// page.on('request', function(req) {
			// 	if (!req.url.match(/data\:/)) {
			// 		console.log(req.url);
			// 	}
			// });

			src.forEach(function(file) {
				pages = pages.then(function() {
					util.log(util.colors.cyan('Testing'), file);

					return page.goto('file://' + file, {
						// waitUntil: 'domcontentloaded'
					}).then(function() {
						var tests = Promise.resolve();

						taskConfig.viewports.forEach(function(viewport, i) {
							tests = tests.then(function() {
								return page.setViewport(viewport).then(function() {
									if (i > 0) {
										return page.reload();
									}

									return page;
								}).then(function() {
									util.log(util.colors.cyan('Viewport'), viewport);

									return runTests(page, file);
								});
							});
						});

						return tests;
					});
				});
			});

			return pages;
		}).then(function() {
			return browser.close();
		}).catch(function(err) {
			console.log(err);

			return browser.close();
		});
	});
});

module.exports = {
	taskName: taskName,
	taskConfig: taskConfig
};

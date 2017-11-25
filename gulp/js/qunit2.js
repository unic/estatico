'use strict';

/**
 * @function `gulp html:test`
 * @desc Open built HTML files in headless Chrome and report errors.
 */

var gulp = require('gulp');

var taskName = 'js:qunit2',
	taskConfig = {
		src: './build/demo/modules/slideshow/*.html'
	};

gulp.task(taskName, function() {
	var helpers = require('require-dir')('../../helpers'),
		puppeteer = require('puppeteer'),
		util = require('gulp-util'),
		glob = require('glob'),
		path = require('path');

	var files = glob.sync(taskConfig.src).map(function(file) {
			return path.resolve(file);
		});

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

			files.forEach(function(file) {
				pages = pages.then(function() {
					util.log(util.colors.cyan('Testing'), file);

					return page.goto('file://' + file, {
						// waitUntil: 'domcontentloaded'
					}).then(function() {
						return page.evaluate(function() {
							return new Promise(function (resolve, reject) {
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
						});
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

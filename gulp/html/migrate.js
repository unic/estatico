'use strict';

/**
 * @function `gulp html:migrate`
 * @desc Transform old `.json` data files to `.data.js`.
 */

var gulp = require('gulp');

var taskName = 'html:migrate',
	taskConfig = {
		src: [
			'./source/data/**/*.json',
			'./source/pages/**/*.json',
			'./source/modules/**/*.json',
			'./source/preview/styleguide/**/*.json'
		],
		dest: './source/'
	};

gulp.task(taskName, function(cb) {
	var tap = require('gulp-tap'),
		path = require('path'),
		rename = require('gulp-rename'),
		inquirer = require('inquirer'),
		del = require('del'),
		vinylPaths = require('vinyl-paths');

	var vp = vinylPaths();

	gulp.src(taskConfig.src, {
			base: './source'
		})
		.pipe(vp)
		.pipe(tap(function(file) {
			var content = file.contents.toString(),
				dataHelperPath = path.relative(path.dirname(file.path), path.resolve(__dirname, '../../helpers/data.js')),
				defaultDataPath = path.relative(path.dirname(file.path), path.resolve(__dirname, '../../source/data/default.data.js')),
				prepend = new Buffer('\'use strict\';\n\nvar _ = require(\'lodash\'),\n\trequireNew = require(\'require-new\'),\n\tdataHelper = require(\'' + dataHelperPath + '\'),\n\tdefaultData = requireNew(\'' + defaultDataPath + '\');\n\nvar data = _.merge(defaultData, '),
				append = new Buffer(');\n\nmodule.exports = data;\n');

			// Remove trailing new line
			content = content.trim();

			// Increase indentation
			content = content.replace(/\n\t/g, '\n\t\t');
			content = content.replace(/\n}/, '\n\t}');

			// Use single over double quotes, escape existing single quotes
			content = content.replace(/'/g, '\\\'');
			content = content.replace(/"/g, '\'');

			// Remove quotes from keys
			content = content.replace(/'(.*?)'\:/g, '$1:');

			// Rename 'styleguide' property to 'meta'
			content = content.replace(/styleguide\:/g, 'meta:');

			content = new Buffer(content);

			file.contents = Buffer.concat([prepend, content, append]);
		}))
		.pipe(rename({
			extname: '.data.js'
		}))
		.pipe(gulp.dest(taskConfig.dest))

		// Delete original files
		.on('end', function() {
			inquirer.prompt([
				{
					type: 'confirm',
					name: 'delete',
					message: 'Do you want me to delete the following JSON files? ' + JSON.stringify(vp.paths),
					default: false
				}
			], function(answers) {
				if (answers.delete) {
					del(vp.paths, cb);
				} else {
					cb();
				}
			});
		});
});

module.exports = {
	taskName: taskName,
	taskConfig: taskConfig
};

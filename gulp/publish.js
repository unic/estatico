"use strict";

const gulp = require('gulp'),
      util = require('gulp-util');

const dest = util.env.publishDest,
      taskName = 'publish',
      taskConfig = {
          src: './build/assets/**',
          watch: './build/assets/**',
          dest: dest,
          isEnabled: !!dest,
          returnChangedFileOnWatch: true
      },
      task = function(config, cb, changedFile) {
        gulp.src(changedFile ? changedFile : config.src, {
                base: './build/assets'
            })
            .pipe(gulp.dest(config.dest))
            .on('end', cb);
	};

gulp.task(taskName, function(cb) {
	return task(taskConfig, cb);
});;


module.exports = {
	taskName: taskName,
	taskConfig: taskConfig,
	task: task
};
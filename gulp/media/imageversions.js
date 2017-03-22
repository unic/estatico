'use strict';

/**
 * @function `gulp media:imageversions`
 * @desc Creates versions of images, based on configuration, located in imageversions.js file in the same folder as original image. See /source/demo/modules/imageversions module for more details and further documentation.
 * Depends on GraphicsMagick being installed.
 */

var gulp = require('gulp');

var taskName = 'media:imageversions',
	taskConfig = {
		// paths to configs
		src: [
			'./source/assets/media/',
			'./source/modules/**/media/',
			'./source/demo/modules/**/media/'
		],
		watch: [
			'source/assets/media/',
			'source/modules/**/media/',
			'source/demo/modules/**/media/'
		],
		fileExtensionPattern: '*.{jpg, png}',
		configFileName: 'imageversions.config.js',
		srcBase: './source/',
		dest: './build/'
	},
	task = function(config, cb) {
		var helpers = require('require-dir')('../../helpers'),
			plumber = require('gulp-plumber'),
			tap = require('gulp-tap'),
			gm = require('gm'),
			path = require('path'),
			_ = require('lodash'),
			through = require('through2'),
			gutil = require('gulp-util'),
			requireNew = require('require-new'),
			glob = require('glob'),
			buffer = require('vinyl-buffer'),
			imagemin = require('gulp-imagemin'),
			extensionRegExp = '(\\.\\w+)$',
			extension = new RegExp(extensionRegExp),

			morphImage = function(imgData, focus, newSize) {
				// calculating proportion coefficient for future size
				var k = newSize.width / newSize.height,
					Wm, Hm, fx2, fy2;

				// calculating necessary crop values
				Wm = imgData.imgSize.width;
				Hm = Math.round(imgData.imgSize.width / k);

				if (Hm > imgData.imgSize.height) {
					Hm = imgData.imgSize.height;
					Wm = Math.round(imgData.imgSize.height * k);
				}

				fx2 = Math.round(focus.width * Wm / imgData.imgSize.width);
				fy2 = Math.round(focus.height * Hm / imgData.imgSize.height);

				// crop
				// params: resulting width, resulting height, left top corner x coordinate, left top corner y coordinate
				imgData.img.crop(Wm, Hm, focus.width - fx2, focus.height - fy2);

				// resize crop result to requested size
				imgData.img.resize(newSize.width, newSize.height, '!');

				return imgData.img;
			},

			combineConfigs = function(configPaths) {
				var mergedConfig = {};

				// Going through all existing configs and creating one universal, where keys are paths to original files
				_.each(configPaths, function(configPath) {
					// resolving glob paths
					glob(configPath, function(er, files) {
						_.each(files, function(file) {
							var sizeConfig = (function() {
								try {
									return requireNew(path.resolve(file));
								} catch (err) {
									return {};
								}
							})();

							_.forOwn(sizeConfig, function(value, key) {
								var newKey = path.relative('./', path.join(path.dirname(file), '/', key));

								sizeConfig[newKey] = value;
								delete sizeConfig[key];
							});

							mergedConfig = _.assign(mergedConfig, sizeConfig);
						});
					});
				});

				return mergedConfig;
			},

			configPaths = _.map(config.src, function(path) {
				return path + config.configFileName;
			}),

			mergedConfig = combineConfigs(configPaths);

		gulp.src(
			_.map(config.src, function(path) {
				return path + config.fileExtensionPattern;
			}),

			{
				base: config.srcBase
			})
			.pipe(plumber())

			// Checking if an image has defined crops and if yes - push it further through version creating pipe
			.pipe(through.obj(function(imgData, enc, done) {
				// getting config for current image
				var crops = mergedConfig[path.relative('./', imgData.path)],
					fileName;

				if (!crops) {
					return done();
				}

				fileName = path.resolve(imgData.path);

				// attaching additional data to image file object to pipe further
				imgData.imgCrops = crops;
				imgData.img = gm(fileName).noProfile();

				// calculating original image size asynchronously
				imgData.img.size(function(err, size) {
					if (err) {
						err.task = taskName;

						this.emit('error', err);
					}

					// attaching size to image file object
					imgData.imgSize = size;

					return done(null, imgData);
				}.bind(this));
			}).on('error', helpers.errors))

			// Creating versions
			.pipe(through.obj(function(imgData, enc, done) {
				if (!imgData.img || !imgData.imgSize || !imgData.imgCrops) {
					return done();
				}

				// 1. Iterate through all defined crops
				// 2. Get resizing and cropping values
				// 3. Call morphImage procedure
				// 4. Generate version file name
				// 5. Add generated file to stream
				imgData.imgCrops.forEach(function(crop) {
					var newPath,
						newSizeValues = [],
						focusPointCoordinates = [],
						focusPoint = {},
						fileNamePostfix,
						img,
						newFile;

					if (typeof crop === 'string') {
						newSizeValues = crop.split('x');
						fileNamePostfix = crop;
					} else if (crop.size) {
						newSizeValues = crop.size.split('x');
						fileNamePostfix = crop.size;

						if (crop.focusPoint) {
							focusPointCoordinates = crop.focusPoint.split(',');
							fileNamePostfix += '_' + crop.focusPoint;
						}
					}

					// if only one dimension is defined
					else {

						// if only width is defined
						if (crop.width || typeof crop === 'number') {
							if (crop.width) {
								newSizeValues[0] = crop.width;
							} else if (typeof crop === 'number') {
								newSizeValues[0] = crop;
							}

							newSizeValues[1] = Math.floor(imgData.imgSize.height * newSizeValues[0] / imgData.imgSize.width);
						}

						// if only height is defined
						else if (crop.height) {
							newSizeValues[1] = crop.height;
							newSizeValues[0] = Math.floor(imgData.imgSize.width * newSizeValues[1] / imgData.imgSize.height);
						}

						fileNamePostfix = newSizeValues[0] + 'x' + newSizeValues[1];
					}

					// setting focus point
					if (focusPointCoordinates.length > 0) {
						focusPoint = { width: focusPointCoordinates[0], height: focusPointCoordinates[1] };
					} else {
						// default focus point is image center
						focusPoint = {
							width: imgData.imgSize.width / 2,
							height: imgData.imgSize.height / 2
						};
					}

					// image transformation based on size and focus point
					img = morphImage(imgData, focusPoint, { width: newSizeValues[0], height: newSizeValues[1] });

					// forming a file name for generated version
					newPath = imgData.path.replace(extension, '_' + fileNamePostfix + '$1');

					// adding a new image file to stream
					newFile = new gutil.File({
						base: imgData.base,
						path: newPath,
						contents: img.stream()
					});

					this.push(newFile);
				}.bind(this));

				done();
			}))
			.pipe(buffer()) // need to convert streams to buffers, to be able to use imagemin
			.pipe(imagemin())
			.pipe(tap(function(file) {
				console.log('Generated image version: ' + path.relative(config.srcBase, file.path));
			}))
			.pipe(gulp.dest(config.dest))
			.on('finish', cb);
	};

gulp.task(taskName, function(cb) {
	return task(taskConfig, cb);
});

module.exports = {
	taskName: taskName,
	taskConfig: taskConfig,
	task: task
};

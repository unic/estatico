'use strict';

var util = require('gulp-util'),
	data = {
		project: 'Estático',
		env: util.env,
		svgSprites: JSON.stringify([
			'/assets/media/svg/base.svg'
		])
	};

module.exports = data;

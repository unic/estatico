'use strict';

var util = require('gulp-util'),
	data = {
		meta: {
			project: 'KPT VPK'
		},
		env: util.env,
		props: {
			svgSprites: JSON.stringify([

				// Disabled since there are no icons by default
				// '/assets/media/svg/base.svg'
			])
		}
	};

module.exports = data;

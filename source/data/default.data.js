'use strict';

var util = require('gulp-util'),
	tree = require('./tree.data.js'),
	data = {
		meta: {
			project: 'KPT-VPK Components library'
		},
		env: util.env,
		tree: tree,
		props: {
			svgSprites: JSON.stringify([

				// Disabled since there are no icons by default
				// '/assets/media/svg/base.svg'
			])
		}
	};

module.exports = data;

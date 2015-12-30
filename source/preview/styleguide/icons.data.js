'use strict';

var _ = require('lodash'),
	requireNew = require('require-new'),
	defaultData = requireNew('../../data/default.data.js'),
	glob = require('glob'),
	path = require('path');

var data = _.merge(defaultData, {
		meta: {
			title: 'Icons (font variant)',
		},
		icons: _.map(glob.sync('./source/{,demo/}{assets/media/,modules/**/}icons/*'), function(file) {
			return path.basename(file).replace(path.extname(file), '');
		}),
		sizes: [16, 32, 48, 72],
		additionalLayoutClass: 'sg_icons'
	});

module.exports = data;

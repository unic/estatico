'use strict';

var _ = require('lodash'),
	requireNew = require('require-new'),
	defaultData = requireNew('../../../data/default.data.js');

var data = _.merge(defaultData, {
		meta: {
			title: 'Demo: 01 Page'
		},
		title: 'Page',
		text: 'This page demonstrates the inclusion of a module.',
		modules: {
			skiplinks: requireNew('../../modules/skiplinks/skiplinks.data.js'),
			teasers: requireNew('../../modules/teasers/teasers.data.js')
		}
	});

module.exports = data;

'use strict';

var _ = require('lodash'),
	requireNew = require('require-new'),
	defaultData = requireNew('../../../data/default.data.js'),
	data = _.merge(defaultData, {
		meta: {
			title: 'Demo: 01 Page'
		},
		props: {
			title: 'Page',
			text: 'This page demonstrates the inclusion of a module.',
			modules: {
				skiplinks: requireNew('../../modules/skiplinks/skiplinks.data.js').props,
				teasers: requireNew('../../modules/teasers/teasers.data.js').props
			}
		}
	});

module.exports = data;

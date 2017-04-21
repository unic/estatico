'use strict';

var _ = require('lodash'),
	requireNew = require('require-new'),
	defaultData = requireNew('../../../data/default.data.js'),
	data = _.merge(defaultData, {
		meta: {
			title: 'Demo: Image versions'
		}
	});

module.exports = data;

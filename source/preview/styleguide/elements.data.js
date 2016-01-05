'use strict';

var _ = require('lodash'),
	requireNew = require('require-new'),
	defaultData = requireNew('../../data/default.data.js');

var data = _.merge(defaultData, {
		meta: {
			title: 'Elements',
		},
		additionalLayoutClass: 'sg_elements'
	});

module.exports = data;

'use strict';

var _ = require('lodash'),
	requireNew = require('require-new'),
	defaultData = requireNew('../../data/default.data.js');

var data = _.merge(defaultData, {
		title: 'Elements',
		additionalLayoutClass: 'sg_elements'
	});

module.exports = data;

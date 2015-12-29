'use strict';

var _ = require('lodash'),
	requireNew = require('require-new'),
	dataHelper = require('../../../helpers/data.js'),
	defaultData = requireNew('../../data/default.data.js');

var data = _.merge(defaultData, {
		title: 'Forms',
		additionalLayoutClass: 'sg_forms'
	});

module.exports = data;

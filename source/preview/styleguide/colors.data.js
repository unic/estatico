'use strict';

var _ = require('lodash'),
	requireNew = require('require-new'),
	dataHelper = require('../../../helpers/data.js'),
	defaultData = requireNew('../../data/default.data.js');

var data = _.merge(defaultData, {
		title: 'Colors',
		colors: dataHelper.getColors('../../assets/css/data/colors.html')
	});

module.exports = data;

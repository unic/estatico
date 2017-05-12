'use strict';

var _ = require('lodash'),
	requireNew = require('require-new'),
	dataHelper = require('../helpers/data.js'),
	defaultData = requireNew('./data/default.data.js'),

	data = _.merge(defaultData, {
		meta: {
			documentation: dataHelper.getDocumentation('index.md')
		}
	});

module.exports = data;

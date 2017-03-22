'use strict';

var _ = require('lodash'),
	requireNew = require('require-new'),
	dataHelper = require('../../../../helpers/data.js'),
	defaultData = requireNew('../../../data/default.data.js');

var data = _.merge(defaultData, {
		meta: {
			title: 'Demo: Image versions',
			code: dataHelper.getTemplateCode('imageversions.hbs'),
			documentation: dataHelper.getDocumentation('imageversions.md')
		}
	});

module.exports = data;

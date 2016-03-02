'use strict';

var _ = require('lodash'),
	requireNew = require('require-new'),
	dataHelper = require('../../../../helpers/data.js'),
	defaultData = requireNew('../../../data/default.data.js');

var data = _.merge(defaultData, {
		meta: {
			title: 'Demo: Babel: React',
			code: dataHelper.getTemplateCode('react.hbs'),
			documentation: dataHelper.getDocumentation('react.md')
		}
	});

module.exports = data;

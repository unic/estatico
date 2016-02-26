'use strict';

var _ = require('lodash'),
	requireNew = require('require-new'),
	dataHelper = require('../../../../helpers/data.js'),
	defaultData = requireNew('../../../data/default.data.js');

var data = _.merge(defaultData, {
		meta: {
			title: 'Demo: ES2015 with Babel',
			code: dataHelper.getTemplateCode('es2015.hbs'),
			documentation: dataHelper.getDocumentation('es2015.md')
		}
	});

module.exports = data;

'use strict';

var _ = require('lodash'),
	requireNew = require('require-new'),
	dataHelper = require('../../../helpers/data.js'),
	defaultData = requireNew('../../data/default.data.js');

var data = _.merge(defaultData, {
		meta: {
			title: 'Test Test',
			className: 'TestTest',
			keyName: 'testTest',
			code: dataHelper.getTemplateCode('testtest.hbs'),
			documentation: dataHelper.getDocumentation('testtest.md')
		}
	});

module.exports = data;

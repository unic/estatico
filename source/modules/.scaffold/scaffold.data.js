'use strict';

var _ = require('lodash'),
	requireNew = require('require-new'),
	dataHelper = require('../../../helpers/data.js'),
	defaultData = requireNew('../../data/default.data.js'),
	data = _.merge(defaultData, {
		meta: {
			title: '{{originalName}}',
			className: '{{className}}',
			keyName: '{{keyName}}',
			code: dataHelper.getTemplateCode('{{name}}.hbs'),
			documentation: dataHelper.getDocumentation('{{name}}.md')
		}
	});

module.exports = data;

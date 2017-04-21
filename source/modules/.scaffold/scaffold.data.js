'use strict';

var _ = require('lodash'),
	requireNew = require('require-new'),
	defaultData = requireNew('../../data/default.data.js'),
	data = _.merge(defaultData, {
		meta: {
			title: '{{originalName}}',
			className: '{{className}}',
			keyName: '{{keyName}}'
		}
	});

module.exports = data;

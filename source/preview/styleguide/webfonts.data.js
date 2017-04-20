'use strict';

var _ = require('lodash'),
	requireNew = require('require-new'),
	defaultData = requireNew('../../data/default.data.js'),
	data = _.merge(defaultData, {
		meta: {
			title: 'Webfonts'
		},
		fonts: [{
			family: 'Helvetica',
			variants: [
				{
					weight: 400,
					style: 'normal'
				},
				{
					weight: 700,
					style: 'normal'
				}
			]
		}],
		additionalLayoutClass: 'sg_fonts'
	});

module.exports = data;

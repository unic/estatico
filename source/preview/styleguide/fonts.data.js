'use strict';

var _ = require('lodash'),
	requireNew = require('require-new'),
	defaultData = requireNew('../../data/default.data.js');

var data = _.merge(defaultData, {
		title: 'Fonts',
		fonts: [
			{
				family: 'Arial',
				font: [
					{
						weight: [400],
						style: ['normal'],
						size: [48, 24, 18]
					},
					{
						weight: [700],
						style: ['normal', 'italic'],
						size: [72, 56]
					}
				]
			},
			{
				family: 'Courier',
				font: [
					{
						weight: [400, 700],
						style: ['normal'],
						size: [96, 72, 48]
					}
				]
			}
		],
		additionalLayoutClass: 'sg_fonts'
	});

module.exports = data;

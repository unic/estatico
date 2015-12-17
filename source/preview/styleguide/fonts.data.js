'use strict';

var _ = require('lodash'),
	requireNew = require('require-new'),
	defaultData = requireNew('../../data/default.data.js');

var data = _.merge(defaultData, {
	title: 'Fonts',
	fonts: [{
		family: 'Roboto',
		font: [{
			weight: [400, 700],
			style: ['normal', 'italic'],
			size: [16]
		}]
	}, {
		family: 'Courier',
		font: [{
			weight: [400, 700],
			style: ['normal'],
			size: [12, 16, 22]
		}]
	}]
});

module.exports = data;

'use strict';

var _ = require('lodash'),
	fs = require('fs'),
	data = require('../npm-shrinkwrap.json'),
	jenkinsData = require('./npm-shrinkwrap.json');

_.extend(data.dependencies, jenkinsData.dependencies);

try {
	fs.writeFileSync(__dirname + '/../npm-shrinkwrap.json', JSON.stringify(data, null, 2) + '\n');
} catch(e) {
	console.log(e);

	process.exit(1);
}

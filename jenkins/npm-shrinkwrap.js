'use strict';

var fs = require('fs'),
	data = require('../npm-shrinkwrap.json'),
	jenkinsData = require('./npm-shrinkwrap.json');

for (var prop in jenkinsData.dependencies) {
	if (jenkinsData.dependencies.hasOwnProperty(prop)) {
		data.dependencies[prop] = jenkinsData.dependencies[prop];
	}
}

try {
	fs.writeFileSync(__dirname + '/../npm-shrinkwrap.json', JSON.stringify(data, null, 2) + '\n');
} catch(e) {
	console.log(e);

	process.exit(1);
}

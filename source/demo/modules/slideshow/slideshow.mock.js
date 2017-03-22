'use strict';

var _ = require('lodash');

var data = {
		slides: _.map(['600/204', '600/205', '600/206'], function(size, index) {
			return {
				src: 'http://www.fillmurray.com/' + size,
				alt: 'Bill Murray ' + (index + 4)
			};
		})
	};

module.exports = data;

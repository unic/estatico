/* jshint esversion: 6 */

/*!
 * React demo
 *
 * @author
 * @copyright
 */

import $ from 'jQuery';
import React from 'react';
import ReactDOM from 'react-dom';

ReactDOM.render(
	<h1>Hello React world!</h1>,
	$('[data-init~="react"]').get(0)
);

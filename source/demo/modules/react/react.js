/*!
 * React demo
 *
 * @author
 * @copyright
 */

import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';

//
class HelloMessage extends React.Component {
	render() {
		return (
			<h1>Hello React world!</h1>
		);
	}
}

ReactDOM.render(
	<HelloMessage />,
	$('[data-init~="hellomessage"]').get(0)
);

export default HelloMessage;

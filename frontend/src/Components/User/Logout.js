import React from 'react';
import {Redirect} from 'react-router-dom';

class Logout extends React.Component {
	constructor(props) {
		super(props);

		localStorage.removeItem(`JWT`);
		localStorage.removeItem(`UserID`);
		this.props.updateLogin(false);
	}

	render() {
		return (
			<Redirect to="/" />
		)
	}
}

export default Logout;
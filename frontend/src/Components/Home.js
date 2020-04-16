import React from 'react';
import Login from './Login';
import Register from './Register';

class Home extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		if(this.props.loggedIn === false) {
			return (
				<>
					<Login loggedIn={this.props.loggedIn} updateLogin={this.props.updateLogin} />
					<Register loggedIn={this.props.loggedIn} updateLogin={this.props.updateLogin} />
				</>
			)
		} else {
			return (<h1>Home</h1>)
		}
	}
}

export default Home;
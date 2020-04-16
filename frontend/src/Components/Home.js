import React from 'react';
import Login from './Login';
import Register from './Register';

class Home extends React.Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		document.title = "Home - GCOrg";
	}

	render() {
		if(this.props.loggedIn === false) {
			return (
				<>
					<Login loggedIn={this.props.loggedIn} updateLogin={this.props.updateLogin} noTitle/>
					<Register loggedIn={this.props.loggedIn} updateLogin={this.props.updateLogin} noTitle/>
				</>
			)
		} else {
			return (<h1>Home</h1>)
		}
	}
}

export default Home;
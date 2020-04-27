import React from 'react';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

class navbar extends React.Component {
	constructor(props) {
		super(props);
	}

	async componentDidMount() {
		let accessString = localStorage.getItem(`JWT`);
		let uID = localStorage.getItem(`UserID`);

		if (uID === null) {
			this.props.updateLogin(false);
		}

		if (accessString === null) {
			this.props.updateLogin(false);
		}
	}

	render() {

		if (this.props.loggedIn === true) {
			return (
				<Navbar bg="dark" variant="dark" expand="lg">
					<Navbar.Brand>GCOrg</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav className="mr-auto">
							<Nav.Link href="/">Home</Nav.Link>
							<Nav.Link href={"/profile/e/" + localStorage.getItem(`UserID`)}>Edit Profile</Nav.Link>
							<Nav.Link href={"/community/find"}>Find Communities</Nav.Link>
							<Nav.Link href="/logout">Logout</Nav.Link>
						</Nav>
					</Navbar.Collapse>
				</Navbar>
			);
		} else {
			return (
				<Navbar bg="dark" variant="dark" expand="lg">
					<Navbar.Brand>GCOrg</Navbar.Brand>
					<Navbar.Toggle aria-controls="basic-navbar-nav" />
					<Navbar.Collapse id="basic-navbar-nav">
						<Nav className="mr-auto">
							<Nav.Link href="/">Home</Nav.Link>
							<Nav.Link href="/login">Login</Nav.Link>
							<Nav.Link href="/register">Register</Nav.Link>
						</Nav>
					</Navbar.Collapse>
				</Navbar>
			);
		}
	}

}

export default navbar;

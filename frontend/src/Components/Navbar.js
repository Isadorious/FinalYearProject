import React from 'react';
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";

class navbar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false
    }
  }

  async componentDidMount() {
    let accessString = localStorage.getItem(`JWT`);
		if (accessString === null) {
			this.setState({
			loggedIn: true,
			});
		} else {
      this.setState({
        loggedIn: false,
      });
    }
  }

  render() {
    return (
      <div id="nav">
          <div>
          <Navbar bg="dark" variant="dark" expand="lg">
            <Navbar.Brand>GCOrg</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="mr-auto">
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/login">Login</Nav.Link>
                <Nav.Link href="/register">Register</Nav.Link>
                <Nav.Link href="/profile/e/">Edit Profile</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Navbar>
          </div>
      </div>
    );
  }

}

export default navbar;

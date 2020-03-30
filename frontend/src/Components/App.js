import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams
} from 'react-router-dom';
import Login from "./Login";
import Register from "./Register";
import Navbar from "react-bootstrap/Navbar";
import Nav from "react-bootstrap/Nav";
import EditProfile from "./EditProfile";

function App() {
  return (
    <div className="App">
      <Router>
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
          <Switch>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/profile/e/:id" component={EditProfile} />
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

function Home() {
  return <h2>Home page</h2>;
}

export default App;

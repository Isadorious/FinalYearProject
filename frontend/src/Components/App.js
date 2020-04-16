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
import Navbar from "./Navbar";
import EditProfile from "./EditProfile";
import Home from "./Home";

class App extends React.Component {
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
      <div className="App">
        <Router>
          <div>
          <Navbar />
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

}

export default App;

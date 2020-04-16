import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
  Redirect
} from 'react-router-dom';
import Login from "./Login";
import Register from "./Register";
import Navbar from "./Navbar";
import EditProfile from "./EditProfile";
import Home from "./Home";
import Logout from './Logout';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false
    }

    this.updateLoggedIn = this.updateLoggedIn.bind(this);
  }

  async componentDidMount() {
    let accessString = localStorage.getItem(`JWT`);
		if (accessString === null) {
			this.setState({
			loggedIn: false,
			});
		} else {
      this.setState({
        loggedIn: true,
      });
    }
  }

  updateLoggedIn(status) {
		if(status === true) {
			this.setState({loggedIn: true})
		} else if(status === false) {
      this.setState({loggedIn: false});
		}
	}

  render() {
    return (
      <div className="App">
        <Router>
          <div>
          <Navbar loggedIn={this.state.loggedIn} updateLogin={this.updateLoggedIn} />
            <Switch>
              <Route path="/login"> 
                <Login loggedIn={this.state.loggedIn} updateLogin={this.updateLoggedIn} /> 
              </Route>
              <Route path="/register" component={Register} />
              <Route path="/profile/e/:id" component={EditProfile} />
              <Route path="/logout">
                <Logout updateLogin={this.updateLoggedIn} />
              </Route>
              <Route path="/" component={Home}/>
            </Switch>
          </div>
        </Router>
      </div>
    );
  }

}

export default App;

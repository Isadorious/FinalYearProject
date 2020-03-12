import React from 'react';
const axios = require('axios');

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
                        username: '',
                        password: '',
                    };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
    }
    
    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name] : value
        });
    }

    async handleLogin(e) {
        e.preventDefault();

        const uname = this.state.username;
        const pword = this.state.password;

        await axios
            .post('http://localhost:9000/api/users/login', {
                    username: uname,
                    password: pword
            })
            .then(response => {
                console.log(response.data.auth);
                console.log(response.data.message);
                console.log(response.data.token);
            })
            .catch(error => {
                console.log(error.data)
            });

    }
    
    render() {
        return(
        <form id="loginForm">
            <label>
                Username:
                <input type="text" name="username" value={this.state.username} onChange={this.handleInputChange} />
            </label>
            <br></br>
            <label>
                Password:
                <input type="password" name="password" value={this.state.password} onChange={this.handleInputChange} />
            </label>
            <br />
            <button onClick={this.handleLogin}>Login</button>
        </form>
        )}
}

export default LoginForm;
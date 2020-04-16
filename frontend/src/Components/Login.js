import React from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import {Redirect} from "react-router-dom";
const axios = require('axios');

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
                        username: '',
                        password: '',
                        alertShown: false,
                        alertMessage: `unable to login`,
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

        this.setState({alertShown: false, alertMessage: `Unable to login`});

        const uname = this.state.username;
        const pword = this.state.password;

        await axios
            .post('http://localhost:9000/api/users/login', {
                    username: uname,
                    password: pword
            })
            .then(response => {
                if(response.data.message === 'User logged in successfully!' && response.data.auth === true)
                {
                    localStorage.setItem(`JWT`, response.data.token);
                    localStorage.setItem(`UserID`, response.data.id);
                    this.props.updateLogin(true);
                } else {
                    if(response.data.message === `Missing credentials`)
                    {
                        this.setState({alertMessage: `Please enter your username and password`});
                    } else if (response.data.message === `unable to find username`) {
                        this.setState({alertMessage: `Incorrect username`});
                    } else if (response.data.message === `passwords do not match`) {
                        this.setState({alertMessage: `Incorrect password`});
                    }
                    this.setState({alertShown: true});
                }
            })
            .catch(error => {
                console.log(error.data)
            });

    }

    componentDidMount() {
        document.title = "Login - GCOrg";
    }
    
    render() {
        if(this.props.loggedIn === true)
        {
            return(
                <Redirect to="/" />
            )
        } else {
            return(
                <Container>
                    <Row>
                        <Col>
                            <Form id="registerLoginForm">
                                <Alert variant="danger" show={this.state.alertShown}>
                                    Login Error: {this.state.alertMessage}
                                </Alert>
                                <Form.Group controlId="usernameControl">
                                    <Form.Label>Username:</Form.Label>
                                    <Form.Control name="username" type="text" placeholder="Username" value={this.state.username} onChange={this.handleInputChange}/>
                                </Form.Group>
                                <Form.Group controlId="passwordControl">
                                    <Form.Label>Password:</Form.Label>
                                    <Form.Control name="password" type="password" placeholder="Password" value={this.state.password} onChange={this.handleInputChange} />
                                </Form.Group>
                                <Button variant="secondary" type="submit" onClick={this.handleLogin}>Login</Button>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            )
        }
}
}

export default LoginForm;
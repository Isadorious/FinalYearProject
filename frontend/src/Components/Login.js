import React from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
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
            <Container>
                <Row>
                    <Col>
                        <Form>
                            <Form.Group controlId="usernameControl">
                                <Form.Label>Username:</Form.Label>
                                <Form.Control type="text" placeholder="Username"/>
                            </Form.Group>
                            <Form.Group controlId="passwordControl">
                                <Form.Label>Password:</Form.Label>
                                <Form.Control type="password" placeholder="Password" />
                            </Form.Group>
                            <Button variant="secondary" type="submit" onClick={this.handleLogin}>Login</Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        )}
}

export default LoginForm;
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

const React = require('react');
const Axios = require('axios');

class RegisterForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            password_rpt: '',
            nickname: '',
            description: '',
            dateOfBirth: new Date(),
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleRegister = this.handleRegister.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name] : value
        });
    }

    async handleRegister(e) {
        e.preventDefault();


        if(this.state.password !== this.state.password_rpt)
        {
            return alert("Passwords don't match");
        }

        await Axios
            .post('http://localhost:9000/api/users', {
                username: this.state.username,
                password: this.state.password,
                email: this.state.email,
                nickname: this.state.nickname,
                description: this.state.description,
                dateOfBirth: this.state.dateOfBirth,
            })
            .then(response => {
                console.log(response);
                alert(response.data.message);
            })
            .catch(error => {
                console.log(error);
                alert(error.data)
            });
    }

    componentDidMount() {
        if(this.props.noTitle === undefined) {
            document.title = "Register - GCOrg";
        }
    }

    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <Form id="registerLoginForm">
                            <Form.Group controlId="usernameControl">
                                <Form.Label>Username:</Form.Label>
                                <Form.Control name="username" type="text" placeholder="Username" value={this.state.username} onChange={this.handleInputChange} />
                            </Form.Group>

                            <Form.Group controlId="emailControl">
                                <Form.Label>Email:</Form.Label>
                                <Form.Control name="email" type="email" placeholder="Please enter your email" value={this.state.email} onChange={this.handleInputChange} />
                            </Form.Group>

                            <Form.Group controlId="nicknameControl">
                                <Form.Label>Display Name:</Form.Label>
                                <Form.Control name="nickname" type="text" placeholder="This should be different to your username and doesn't have to be unique" value={this.state.nickname} onChange={this.handleInputChange} />
                            </Form.Group>

                            <Form.Group controlId="passwordControl">
                                <Form.Label>Password:</Form.Label>
                                <Form.Control name="password" type="password" placeholder="Password" value={this.state.password} onChange={this.handleInputChange} />
                            </Form.Group>

                            <Form.Group controlId="passwordRptControl">
                                <Form.Label>Repeat Password:</Form.Label>
                                <Form.Control name="password_rpt" type="password" placeholder="Repeat password" value={this.state.password_rpt} onChange={this.handleInputChange} />
                            </Form.Group>

                            <Form.Group controlId="dateOfBirthControl">
                                <Form.Label>Date of Birth:</Form.Label>
                                <Form.Control name="dateOfBirth" type="date" placeholder="Date of Birth" value={this.state.dateOfBirth} onChange={this.handleInputChange} />
                            </Form.Group>

                            <Button variant="secondary" type="submit" onClick={this.handleRegister}>Register</Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default RegisterForm;
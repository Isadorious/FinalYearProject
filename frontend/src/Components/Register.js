const React = require('react');
const Axios = require('axios');

class RegisterForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
            email: '',
            password: '',
            nickname: '',
            description: '',
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

        await Axios
            .post('http://localhost:9000/api/users', {
                username: this.state.username,
                password: this.state.password,
                email: this.state.email,
                nickname: this.state.nickname,
                description: this.state.description
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

    render() {
        return (
            <form id="registerForm">
                <label>
                    Username:
                    <input type="text" name="username" value={this.state.username} onChange={this.handleInputChange} />
                </label>
                <br />
                <label>
                    Email:
                    <input type="text" name="email" value={this.state.email} onChange={this.handleInputChange} />
                </label>
                < br />
                <label>
                    Password:
                    <input type="password" name="password" value={this.state.password} onChange={this.handleInputChange} />
                </label>
                <br />
                <label>
                    Nickname:
                    <input type="text" name="nickname" value={this.state.nickname} onChange={this.handleInputChange} />
                </label>
                <br />
                <label>
                    Description:
                    <textarea name="description" value={this.state.description} onChange={this.handleInputChange} />
                </label>
                <br />
                <button onClick={this.handleRegister}>Register</button>
            </form>
        )
    }
}

export default RegisterForm;
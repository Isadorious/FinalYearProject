import React from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Axios from 'axios';
import Loading from '../Utils/Loading';
import UploadAvatar from './UploadAvatar';
import Avatar from './Avatar';
import Error from '../Utils/Error';

class ProfileForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			newPassword: '',
			rptNewPassword: '',
			email: '',
			nickname: '',
			description: '',
			profilePicture: '',
			dateOfBirth: new Date(),
			currentPassword: '',
			error: false,
			errorMessage: `Unable to update user data`,
			errorStatusCode: 500,
			alertShown: false,
			alertMessage: `Unable to update user details`,
			loading: true,
		};

		this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSave = this.handleSave.bind(this);
	}

	handleInputChange(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		this.setState({
			[name]: value
		});
	}

	async componentDidMount() {
		document.title = "Edit Profile - GCOrg";

		let accessString = localStorage.getItem(`JWT`);
		if (accessString === null) {
			this.setState({
				error: true,
				errorMessage: `Unable to load user details from local storage`,
				errorStatusCode: 401,
				loading: false,
			});
			return;
		}

		let uID = localStorage.getItem(`UserID`);
		if (uID === null) {
			this.setState({
				error: true,
				errorMessage: `Unable to load user details from local storage`,
				errorStatusCode: 401,
				loading: false,
			});
			return;
		}

		if (uID !== this.props.match.params.id) {
			this.setState({
				error: true,
				errorMessage: `Can't modify other users data!`,
				errorStatusCode: 401,
				loading: false,
			});
			return;
		}

		await Axios
			.get(`${process.env.REACT_APP_API_URL}/api/users/` + uID, {
				headers: { Authorization: `JWT ${accessString}` }
			})
			.then(response => {
				let data = response.data;

				console.log(data.user);

				if (data.message === "Found user successfully!") {
					this.setState({
						username: data.user.username,
						email: data.user.email,
						nickname: data.user.nickname,
						description: data.user.description,
						dateOfBirth: new Date(data.user.dateOfBirth),
						profilePicture: data.user.profilePicture,
						loading: false,
					});
				}
			})
	}

	async handleSave(e) {
		e.preventDefault();

		this.setState({ alertShown: false, alertMessage: `Unable to update user details` })

		let accessString = localStorage.getItem(`JWT`);
		if (accessString === null) {
			this.setState({
				error: true,
				errorMessage: `Unable to load user details from local storage`,
				errorStatusCode: 401,
			});
		}

		let uID = localStorage.getItem(`UserID`);
		if (uID === null) {
			this.setState({
				error: true,
				errorMessage: `Unable to load user details from local storage`,
				errorStatusCode: 401,
			});
		}

		if (this.state.newPassword !== this.state.rptNewPassword) {
			this.setState({ alertMessage: `New passwords do not match`, alertShown: true });
			return;
		}
		await Axios
			.put(`${process.env.REACT_APP_API_URL}/api/users/` + uID, {
				headers: { Authorization: `JWT ${accessString}` },
				nickname: this.state.nickname,
				profilePicture: this.state.profilePicture,
				description: this.state.description,
				email: this.state.email,
				password: this.state.newPassword,
			})
			.then(response => {
				if (response.data.message === 'User updated!') {
					alert(`User updated!`);
				} else {
					this.setState({ alertShown: true });
				}
			})
	}

	render() {
		if (this.state.loading === true) {
			return (<Loading />)
		} else if(this.state.error === true) {
			return (<Error statusCode={this.state.errorStatusCode} message={this.state.errorMessage}/>)
		} else {
			console.log(typeof(this.state.dateOfBirth));
			return (
				< >
					<Container>
						<Row>
							<Col>
								<Avatar avatar={`${process.env.REACT_APP_API_URL}/` + this.state.profilePicture} />					
							</Col>
						</Row>
						<Row>
							<Col>
								<Form id="registerLoginForm">
									<Alert variant="danger" show={this.state.alertShown}>
										Error: {this.state.alertMessage}
									</Alert>
									<Form.Group controlId="usernameControl">
										<Form.Label>Username:</Form.Label>
										<Form.Control readOnly name="username" type="text" placeholder="Username" value={this.state.username} onChange={this.handleInputChange} />
									</Form.Group>

									<Form.Group controlId="dateOfBirthControl">
										<Form.Label>Date of Birth:</Form.Label>
										<Form.Control readOnly name="dateOfBirth" type="date" placeholder="Date of Birth" value={this.state.dateOfBirth.toLocaleDateString('en-CA')} onChange={this.handleInputChange} />
									</Form.Group>

									<Form.Group controlId="nicknameControl">
										<Form.Label>Display Name:</Form.Label>
										<Form.Control name="nickname" type="text" placeholder="This should be different to your username and doesn't have to be unique" value={this.state.nickname} onChange={this.handleInputChange} />
									</Form.Group>

									<Form.Group controlId="descriptionControl">
										<Form.Label>About Me:</Form.Label>
										<Form.Control name="description" as="textarea" placeholder="Tell us a little about yourself" value={this.state.description} onChange={this.handleInputChange} />
									</Form.Group>

									<Form.Group controlId="passwordControl">
										<Form.Label>Password:</Form.Label>
										<Form.Control name="newPassword" type="password" placeholder="Password" value={this.state.newPassword} onChange={this.handleInputChange} />
									</Form.Group>

									<Form.Group controlId="passwordRptControl">
										<Form.Label>Repeat Password:</Form.Label>
										<Form.Control name="rptNewPassword" type="password" placeholder="Repeat password" value={this.state.rptNewPassword} onChange={this.handleInputChange} />
									</Form.Group>

									<Form.Group controlId="emailControl">
										<Form.Label>Email:</Form.Label>
										<Form.Control name="email" type="email" placeholder="Please enter your email" value={this.state.email} onChange={this.handleInputChange} />
									</Form.Group>

									<Button variant="secondary" type="submit" onClick={this.handleSave}>Save Changes</Button>
								</Form>
							</Col>
						</Row>
						<Row>
							<Col>
								<UploadAvatar />
							</Col>
						</Row>
					</Container>
				</>
			)
		}
	}
}

export default ProfileForm;
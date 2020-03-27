import React from 'react';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
import Axios from 'axios';

class ProfileForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			username: '',
			password: '',
			rpt_password: '',
			email: '',
			nickname: '',
			description: '',
			profilePicture: '',
			dateOfBirth: '',
			userID: '',
		};

		this.handleInputChange = this.handleInputChange.bind(this);
	}

	handleInputChange(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		this.setState({
			[name] : value
		});
	}

	componentDidMount() {
		this.setState({userID: this.props.match.params.id});

		document.title = "Edit Profile - GCOrg";
	}

	async handleSave(e) {
		e.preventDefault();
	}

	render() {
		return (
			<Container>
				<Row>
					<Col>
						<Alert variant="danger">
							User ID: {this.state.userID}
						</Alert>
					</Col>
				</Row>
			</Container>
		)
	}
}

export default ProfileForm;
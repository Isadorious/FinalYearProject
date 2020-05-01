import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Loading from '../Utils/Loading';
import Error from '../Utils/Error';
import Axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class StaffMember extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			error: false,
			errorMessage: 'Unable to get data',
            errorStatusCode: 500,
            username: '',
		}

		this.promoteUser = this.promoteUser.bind(this);
		this.demoteUser = this.demoteUser.bind(this);
		this.getStaffMember = this.getStaffMember.bind(this);

	}

	async componentDidMount() {

		//Check the user is logged in
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

		await this.getStaffMember();

	}

	async getStaffMember() {
		let accessString = localStorage.getItem(`JWT`);
		await Axios
		.get(`${process.env.REACT_APP_API_URL}/api/users/` + this.props.id, {
			headers: { Authorization: `JWT ${accessString}` }
		}).then(response => {
			let data = response.data;

			this.setState({
				loading: false,
				username: data.user.username,
			});
		}).catch(error => {
			this.setState({
				error: true,
				errorMessage: `Unable to retrieve data`,
				loading: false,
			});
		})
	}

	promoteUser() {
		this.props.handlePromote(this.state.username);
	}

	demoteUser() {
		this.props.handleDemote(this.state.username);
	}

	async componentDidUpdate() {
		if(this.state.username === undefined) {
			await this.getStaffMember();
		}
	}

	render() {
		if (this.state.loading === true) {
			return (<Loading />)
		} else if (this.state.error === true) {
			return (<Error statusCode={this.state.errorStatusCode} message={this.state.errorMessage} />)
		} else {
			return (
				<Container style={{border: "0.1rem",}}>
					<Row>
						<Col>
                            <p style={{textAlign: "center"}}>{this.state.username}</p>
						</Col>
						<Col>
                            <Button id="promoteStaff" onClick={this.promoteUser} variant="primary">Promote</Button> 
                        </Col>
						<Col>
						    <Button id="demoteStaff" onClick={this.demoteUser} variant="danger">Demote</Button> 
                    	</Col>
					</Row>
				</Container>
			)

		}
	}

}

export default StaffMember;
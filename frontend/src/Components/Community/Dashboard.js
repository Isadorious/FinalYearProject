import React from 'react';
import Error from '../Utils/Error';
import Axios from 'axios';
import Loading from '../Utils/Loading';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

class CommunityDashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			error: false,
			errorMessage: 'Unable to get community data',
			errorStatusCode: 500,
			userPermission: 'None',
			communityID: '',
			calendars: [],
			name: '',
			description: '',
			logo: '',
			banner: '',
			showStaffModal: false,
		}

		this.handleStaffOpen = this.handleStaffOpen.bind(this);
		this.handleStaffClose = this.handleStaffClose.bind(this);
	}

	componentDidMount() {
		document.title = "Community - GCOrg";

		// Load community data, check the user is logged in
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

		await Axios
			.get('http://localhost:9000/api/communities/' + this.props.match.params.id, {
				headers: { Authorization: `JWT ${accessString}` }
			}).then(response => {
				let data = response.data;

				document.title = `${data.communityName} - GCOrg`;
				this.setState({
					communityID: data.communityID,
					name: data.communityName,
					description: data.description,
					logo: data.logo,
					banner: data.banner,
					calendars: data.calendarsID,
					loading: false,
				});
			}).catch(error => {
				this.setState({
					error: true,
					errorMessage: `Unable to retrieve community data`,
					loading: false,
				});
			})
	}

	handleStaffOpen() {
		this.setState({ showStaffModal: true });
	}

	handleStaffClose() {
		this.setState({ showStaffModal: false });
	}

	render() {
		if (this.state.loading === true) {
			return (<Loading />)
		} else if (this.state.error === true) {
			return (<Error statusCode={this.state.errorStatusCode} message={this.state.errorMessage} />)
		} else {
			<Container>
				<Modal show={this.state.showStaffModal} onHide={this.handleStaffClose}>
					<Modal.Header closeButton>
						<Modal.Title>Edit Community Staff</Modal.Title>
					</Modal.Header>
				</Modal>
				<Col>
					<Row>
						<Button id="communityStaff" onClick={this.handleStaffOpen}>Community Staff</Button>
					</Row>
				</Col>
			</Container>
		}
	}

}

export default CommunityDashboard;
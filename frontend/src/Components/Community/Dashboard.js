import React from 'react';
import Error from '../Utils/Error';
import Axios from 'axios';
import Loading from '../Utils/Loading';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import ManageStaff from './ManageStaff';
import EditCommunity from './EditCommunity';
import CreateCalendar from '../Calendar/CreateCalendar';

class CommunityDashboard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			error: false,
			errorMessage: 'Unable to get community data',
			errorStatusCode: 500,
			communityModerators: [],
			communityAdmins: [],
			communityID: '',
			calendars: [],
			name: '',
			description: '',
			logo: '',
			banner: '',
			showStaffModal: false,
			showEditModal: false,
			userPermission: 0,
		}

		this.handleStaffOpen = this.handleStaffOpen.bind(this);
		this.handleStaffClose = this.handleStaffClose.bind(this);
		this.handleCommunityFollow = this.handleCommunityFollow.bind(this);
		this.handleEditOpen = this.handleEditOpen.bind(this);
		this.handleEditClose = this.handleEditClose.bind(this);
		this.handleCreateOpen = this.handleCreateOpen.bind(this);
		this.handleCreateClose = this.handleCreateClose.bind(this);
	}

	async componentDidMount() {
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
					userPermission: data.permission,
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

	handleEditOpen() {
		this.setState({showEditModal: true});
	}

	handleEditClose() {
		this.setState({showEditModal: false});
	}

	handleCreateOpen() {
		this.setState({showCreateModal: true});
	}

	handleCreateClose() {
		this.setState({showCreateModal: false});
	}

	async handleCommunityFollow() {
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
				
				// Get the user object
				await Axios
					.get(`http://localhost:9000/api/users/${uID}`, {
						headers: { Authorization: `JWT ${accessString}` }
					}).then(response => {
						let communities = response.data.user.communities;
						communities.push(this.props.match.params.id);
						return Axios.put(`http://localhost:9000/api/users/${uID}`, {
							headers: {Authorization: `JWT ${accessString}`},
							communities,
						});
					})
					.then(response => {
						if (response.data.message === 'User updated!') {
							alert(`Now following!`);
						}
						else {
							alert(`Failed to follow community`)
						}
					})
					.catch(error => {
						this.setState({
							error: true,
							errorMessage: `Unable to retrieve data`,
							loading: false,
						});
					})		
	}

	render() {
		if (this.state.loading === true) {
			return (<Loading />)
		} else if (this.state.error === true) {
			return (<Error statusCode={this.state.errorStatusCode} message={this.state.errorMessage} />)
		} else {
			let buttons; 
			if(this.state.userPermission === 3) {
				buttons = 
				<>
					<Button id="communityStaff" className={"dashboardButton"} onClick={this.handleStaffOpen}>Community Staff</Button>
					<Button id="editCommunity" className={"dashboardButton"} onClick={this.handleEditOpen}>Edit Community</Button>
					<Button id="createCalendar" className={"dashboardButton"} onClick={this.handleCreateOpen}>Create Calendar</Button>
					<Button id="deleteCommunity" className={"dashboardButton float-right"} variant={"danger"}>Delete Community</Button>
				</>
			}

			if(this.state.userPermission === 2) {
				buttons = 
				<>
					<Button id="communityStaff" className={"dashboardButton"} onClick={this.handleStaffOpen}>Community Staff</Button>
					<Button id="editCommunity" className={"dashboardButton"} onClick={this.handleEditOpen}>Edit Community</Button>
					<Button id="createCalendar" className={"dashboardButton"} onClick={this.handleCreateOpen}>Create Calendar</Button>
					<Button id="followCommunity" className={"dashboardButton float-right"} onClick={this.handleCommunityFollow}>Follow</Button>
				</>
			}

			if(this.state.userPermission == 1) {
				buttons =
				<>
					<Button id="followCommunity" className={"dashboardButton"} onClick={this.handleCommunityFollow}>Follow</Button>
				</>
			}

			if(this.state.userPermission == 0) {
				buttons =
				<>
					<Button id="followCommunity" className={"dashboardButton"} onClick={this.handleCommunityFollow}>Follow</Button>
				</>
			}

			return (
				<Container>
					<Modal show={this.state.showStaffModal} onHide={this.handleStaffClose}>
						<Modal.Header closeButton>
							<Modal.Title>Edit Community Staff</Modal.Title>
						</Modal.Header>
						<ManageStaff id={this.props.match.params.id}/>
					</Modal>
					<Modal show={this.state.showEditModal} onHide={this.handleEditClose}>
						<Modal.Header closeButton>
							<Modal.Title>Edit Community</Modal.Title>
						</Modal.Header>
						<EditCommunity id={this.props.match.params.id}/>
					</Modal>
					<Modal show={this.state.showCreateModal} onHide={this.handleCreateClose}>
						<Modal.Header closeButton>
							<Modal.Title>Create Calendar</Modal.Title>
						</Modal.Header>
						<CreateCalendar communityID={this.props.match.params.id}/>
					</Modal>
					<Row>
						<Col>
							{buttons}
						</Col>
					</Row>
				</Container>
			)

		}
	}

}

export default CommunityDashboard;
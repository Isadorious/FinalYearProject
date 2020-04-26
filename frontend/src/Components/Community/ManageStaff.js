import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Loading from '../Utils/Loading';
import Error from '../Utils/Error';
import Axios from 'axios';
import StaffMember from './StaffMember';

class ManageStaffForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			error: false,
			errorMessage: 'Unable to load staff data',
			errorStatus: 500,
			loading: true,
			communityStaffID: [],
			communityAdminsID: [],
			usernameToFind: '',
		}

		this.handleInputChange = this.handleInputChange.bind(this);
		this.handlePromote = this.handlePromote.bind(this);
		this.handlePromoteFromSearch = this.handlePromoteFromSearch.bind(this);
		this.handleDemoteFromSearch = this.handleDemoteFromSearch.bind(this);
		this.handleDemote = this.handleDemote.bind(this);

	}

	async componentDidMount() {
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
			.get('http://localhost:9000/api/communities/' + this.props.id, {
				headers: { Authorization: `JWT ${accessString}` }
			}).then(response => {
				let data = response.data;

				this.setState({
					communityAdminsID: data.communityAdminsID,
					communityStaffID: data.communityStaffID,
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

	handleInputChange(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		this.setState({
			[name]: value
		});
	}

	async handlePromoteFromSearch() {
		await this.handlePromote(this.state.usernameToFind);
	}

	async handlePromote(username) {

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

		await Axios.get(`http://localhost:9000/api/users?username=${username}`, {
			headers: {Authorization: `JWT ${accessString}`}
		}).then(response => {
				const user = response.data.user

				if (user === undefined) {
					alert('Unable to find user');
					return;
				} else {
		
					const isStaff = this.state.communityStaffID.includes(user._id);
					const isAdmin = this.state.communityAdminsID.includes(user._id);
		
					if (isStaff === true) {
						let adminIDs = this.state.communityAdminsID;
						adminIDs.push(user._id);
		
						let staffIDs = this.state.communityStaffID;
						const index = staffIDs.indexOf(user._id);
		
						if (index > -1) {
							staffIDs.splice(index, 1);
						}

						Axios
							.put('http://localhost:9000/api/communities/' + this.props.id, {
								communityAdminsID: adminIDs, 
								communityStaffID: staffIDs,
							}, {
								headers: { Authorization: `JWT ${accessString}` },
							})
							.then(response => {
								if (response.data.message === 'Community updated!') {
									this.setState({ communityStaffID: staffIDs });
									this.setState({ communityAdminsID: adminIDs });
								} else {
									console.log(response.data);
									alert(response.data);
								}
							})
					} else if (isAdmin === true) {
						alert(`${user.username} is already an admin!`);
					} else {
						let communityStaff = this.state.communityStaffID;
						communityStaff.push(user._id);
		
						Axios
							.put('http://localhost:9000/api/communities/' + this.props.id, {
								communityStaffID: communityStaff,
							}, {
								headers: { Authorization: `JWT ${accessString}` },
							})
							.then(response => {
								if (response.data.message === 'Community updated!') {
									this.setState({ communityStaffID: communityStaff });
								} else {
									console.log(response.data);
									alert(response.data);
								}
							})
					}
				}
		}).catch(error => {
			alert(`Unable to find user`);
			console.log(error);
		})
	}

	async handleDemoteFromSearch() {
		this.handleDemote(this.state.usernameToFind);
	}

	async handleDemote(username) {
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

		await Axios.get(`http://localhost:9000/api/users?username=${username}`, {
			headers: {Authorization: `JWT ${accessString}`}
		}).then(response => {
				const user = response.data.user

				if (user === undefined) {
					alert('Unable to find user');
					return;
				} else {
		
					const isStaff = this.state.communityStaffID.includes(user._id);
					const isAdmin = this.state.communityAdminsID.includes(user._id);
		
					if (isStaff === true) {
						// Remove user from staff array
						let staffIDs = this.state.communityStaffID;
						const index = staffIDs.indexOf(user._id);
		
						if (index > -1) {
							staffIDs.splice(index, 1);
						}
		
						Axios
							.put('http://localhost:9000/api/communities/' + this.props.id, {
								communityStaffID: staffIDs,
							}, {
								headers: { Authorization: `JWT ${accessString}` },
							})
							.then(response => {
								if (response.data.message === 'Community updated!') {
									this.setState({ communityStaffID: staffIDs });
								} else {
									console.log(response.data);
									alert(response.data);
								}
							})
					} else if (isAdmin === true) {
						// Remove user from admin array
						// Add user to staff array
						let adminIDs= this.state.communityAdminsID;
						const index = adminIDs.indexOf(user._id);
		
						if(index > -1)
						{
							adminIDs.splice(index, 1);
						}
		
						let staffIDs = this.state.communityStaffID;
						staffIDs.push(user._id);
		
						Axios
							.put('http://localhost:9000/api/communities/' + this.props.id, {
								communityAdminsID: adminIDs,
								communityStaffID: staffIDs,
							}, {
								headers: { Authorization: `JWT ${accessString}` },
							})
							.then(response => {
								if (response.data.message === 'Community updated!') {
									this.setState({ communityAdminsID: adminIDs});
									this.setState({ communityStaffID: staffIDs});	
								} else {
									console.log(response.data);
									alert(response.data);
								}
							})
					} else {
						alert(`${user.username} is not a staff member!`);
					}
				}
		}).catch(error => {
			console.log(error);
			alert(`Unable to find user`);
		})
	}

	render() {
		if (this.state.loading === true) {
			return (<Loading />)
		} else if (this.state.error === true) {
			return (<Error statusCode={this.state.errorStatusCode} message={this.state.errorMessage} />)
		} else {
			const staff = this.state.communityStaffID.map((staffID) =>
				<React.Fragment key={staffID}><StaffMember id={staffID} handlePromote={this.handlePromote} handleDemote={this.handleDemote} /><hr /></React.Fragment>
			)
			const admins = this.state.communityAdminsID.map((adminID) => 
				<React.Fragment key={adminID}><StaffMember id={adminID} handlePromote={this.handlePromote} handleDemote={this.handleDemote} /><hr /></React.Fragment>
			)
			return (
				<Form id="addStaff" className={"modalForm"}>
					<Form.Group>
						<Form.Label>User to promote:</Form.Label>
						<Form.Control name="usernameToFind" type="text" placeholder="User to promote" value={this.state.usernameToFind} onChange={this.handleInputChange} />
					</Form.Group>
					<Button variant="primary" type="button" onClick={this.handlePromoteFromSearch}>Find and promote user</Button>
					<Button variant="danger" type="button" onClick={this.handleDemoteFromSearch}>Find and demote user</Button>
					<br />
					<h5>Staff</h5>
					{staff}
					<h5>Admins</h5>
					{admins}
				</Form>
			)
		}
	}
}

export default ManageStaffForm;
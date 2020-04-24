import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Loading from '../Utils/Loading';
import Error from '../Utils/Error';
import Axios from 'axios';

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
			users: [],
			usernameToFind: '',
		}

		this.handleInputChange = this.handleInputChange.bind(this);
		this.handlePromote = this.handlePromote.bind(this);

	}

	componentDidMount() {
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
			.get('http://localhost:9000/api/users/', {
				headers: { Authorization: `JWT ${accessString}` }
			}).then(response => {
				let data = response.data;

				if(data.message === `found users`)
				{
					this.setState({
						users: data.users,
					});
				} else {
					alert(data.message);
				}
			}).catch(error => {
				this.setState({
					error: true,
					errorMessage: `Unable to retrieve user data`,
					loading: false,
				});
			})

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
            [name] : value
        });
	}
	
	handlePromote(e) {
		e.preventDefault();

		const user = this.state.users.find(u => u.username === this.state.usernameToFind);

		if(user !== undefined)
		{
			alert('Unable to find user');
			return;
		} else {
			let communityStaff = this.state.communityStaffID;
			communityStaff.push(user._id);
			this.setState({communityStaffID: communityStaff});

			await Axios
			.put('http://localhost:9000/api/communities/' + this.props.id, {
				headers: { Authorization: `JWT ${accessString}` },
				communityStaffID: this.state.communityStaffID,
			})
			.then(response => {
				if (response.data.message === 'Community updated!') {
					alert(`Community updated!`);
				} else {
					alert(response.data);
				}
			})
		}
	}

	render() {
		if (this.state.loading === true) {
			return(<Loading />)
		} else if (this.state.error === true) {
			return (<Error statusCode={this.state.errorStatusCode} message={this.state.errorMessage}/>)
		} else {
			<Form id="addStaff" className={"modalForm"}>
				<Form.Group>
					<Form.Label>User to promote:</Form.Label>
					<Form.Control name="usernameToFind" type="text" placeholder="User to promote" value={this.state.usernameToFind} onChange={this.handleInputChange} />
				</Form.Group>
				<Button variant="secondary" type="submit" onClick={this.handlePromote}>Find and promote user</Button>
			</Form>
		}
	}
}

export default ManageStaffForm;
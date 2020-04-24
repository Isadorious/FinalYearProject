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
			moderators: [],
			admins: [],
			users: [],
			usernameToFind: '',
		}
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
	}
}

export default ManageStaffForm;
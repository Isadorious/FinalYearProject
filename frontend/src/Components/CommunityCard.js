import React from 'react';
import Card from 'react-bootstrap/Card';
import Axios from 'axios';
import Loading from './Loading';
import Error from './Error';

class CommunityCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			logo: '',
			banner: '',
			description: '',
			loading: true,
			error: false,
			errorMessage: 'Unable to load community',
			errorStatusCode: 500,
		}
	}

	// Community Name
	// Community Logo
	// Community Banner
	// Community Description

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

		if(this.props.communityID === undefined)
		{
			this.setState({
				error: true, 
				errorMessage: 'Community ID not supplied',
				loading: false
			});
			return;
		}

		await Axios
		.get('http://localhost:9000/api/communities/' + this.props.communityID, {
			headers: {Authorization: `JWT ${accessString}`}
		}).then(response => {
			let data = response.data;

			this.setState({
				name: data.community.name,
				description: data.community.description,
				logo: data.community.logo,
				banner: data.community.banner,
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

	render() {
		if(this.state.loading === true) {
			return (
				<Card id="loading">
					<Loading />
				</Card>
			)
		} else if(this.state.error == true) {
			return (			
				<Card id="error">
					<Error message={this.state.errorMessage}/>
				</Card>
				)
		} else {
			return (
				<Card id={this.props.communityID}>
					<Card.Img variant="top" src={'http://localhost:9000/' + this.banner} />
					<Card.Body>
						<Card.Title>{this.state.name}</Card.Title>
						<Card.Text>{this.state.description}</Card.Text>
					</Card.Body>
				</Card>
			)
		}
	}
}

export default CommunityCard;
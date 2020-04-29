import React from 'react';
import Card from 'react-bootstrap/Card';
import Axios from 'axios';
import Loading from '../Utils/Loading';
import Error from '../Utils/Error';
import { Link } from 'react-router-dom';

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
			visible: true,
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

		if (this.props.communityID === undefined) {
			this.setState({
				error: true,
				errorMessage: 'Community ID not supplied',
				loading: false
			});
			return;
		}

		await Axios
			.get('http://localhost:9000/api/communities/' + this.props.communityID, {
				headers: { Authorization: `JWT ${accessString}` }
			}).then(response => {
				let data = response.data;

				if (data.description.length > 100) {
					var res = data.description.substring(0, 96);
					res += "..."
					data.description = res;
				}

				this.setState({
					name: data.communityName,
					description: data.description,
					logo: data.logo,
					banner: data.banner,
					loading: false,
				});
			}).catch(error => {
				if (error.response.status == 404) {
					this.setState({
						visible: false,
					})
				}
				this.setState({
					error: true,
					errorMessage: `Unable to retrieve community data`,
					loading: false,
				});
			})
	}

	render() {
		if (this.state.visible === false) {
			return (<></>)
		} else if (this.state.loading === true) {
			return (
				<Card id="loading" className={"infoCard"}>
					<Loading />
				</Card>
			)
		} else if (this.state.error == true) {
			return (
				<Card id="error" className={"infoCard"}>
					<Error message={this.state.errorMessage} />
				</Card>
			)
		} else {
			return (
				<Card id={this.props.communityID} className={"infoCard"}>
					<Card.Img variant="top" src={'http://localhost:9000/' + this.banner} />
					<Card.Body>
						<Card.Title>{this.state.name}</Card.Title>
						<Card.Text>{this.state.description}</Card.Text>
						<Link to={`/community/${this.props.communityID}`} className={"stretched-link"} />
					</Card.Body>
				</Card>
			)
		}
	}
}

export default CommunityCard;
import React from 'react';
import Card from 'react-bootstrap/Card';
import Axios from 'axios';
import Loading from '../Utils/Loading';
import Error from '../Utils/Error';
import { Link } from 'react-router-dom';

class CustomStructureCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			numFields: 0,
			loading: true,
			error: false,
			errorMessage: 'Unable to load Custom Data Structure',
			errorStatusCode: 500,
			visible: true,
		}
	}

	// Structure Name

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

		if (!this.props.structureID) {
			this.setState({
				error: true,
				errorMessage: 'Structure ID not supplied',
				loading: false
			});
			return;
		}

		if (!this.props.communityID) {
			this.setState({
				error: true,
				errorMessage: 'Community ID not supplied',
				loading: false
			});
			return;
		}

		await Axios
			.get(`${process.env.REACT_APP_API_URL}/api/communities/${this.props.communityID}/structures/${this.props.structureID}`, {
				headers: { Authorization: `JWT ${accessString}` }
			}).then(response => {
				let data = response.data;
				const numFields = data.DisplayKeyPairs.length;
				this.setState({
					name: data.customDataName,
					numFields: numFields,
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
					errorMessage: `Unable to retrieve custom structure data`,
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
					<Card.Body>
						<Card.Title>{this.state.name}</Card.Title>
						<Card.Text>Fields: {this.state.numFields}</Card.Text>
						<Link to={`/community/${this.props.communityID}/structures/${this.props.structureID}`} className={"stretched-link"} />
					</Card.Body>
				</Card>
			)
		}
	}
}

CustomStructureCard.defaultProps = {
	structureID: false,
	communityID: false,
}

export default CustomStructureCard;
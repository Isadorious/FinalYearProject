import React from 'react';
import Error from '../Utils/Error';
import Axios from 'axios';
import Loading from '../Utils/Loading';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

class CommunityFinder extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			error: false,
			errorMessage: 'Unable to get community data',
			errorStatusCode: 500,
			communities: [],
			showStaffModal: false,
			communityName: '',
			communityID: '',
		}

		this.handleSearch = this.handleSearch.bind(this);
	}

	async componentDidMount() {
		document.title = "Community Finder - GCOrg";

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
			.get('http://localhost:9000/api/communities/', {
				headers: { Authorization: `JWT ${accessString}` }
			}).then(response => {
				console.log(response.data);
				this.setState({
					communities: response.data,
				});
			}).catch(error => {
				this.setState({
					error: true,
					errorMessage: `Unable to retrieve community data`,
					loading: false,
				});
			})
	}

	async handleSearch() {

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
			.get(`http://localhost:9000/api/communities/?communityName=${this.state.communityName}`, {
				headers: { Authorization: `JWT ${accessString}` }
			}).then(response => {
				this.setState({
					communityID: response.data.communityID,
				});
			}).catch(error => {
				this.setState({
					error: true,
					errorMessage: `Unable to retrieve community data`,
				});
			})
	}

	render() {
		if (this.state.loading === true) {
			return (<Loading />)
		} else if (this.state.error === true) {
			return (<Error statusCode={this.state.errorStatusCode} message={this.state.errorMessage} />)
		} else {
			if (this.state.communityID !== undefined) {
				const cards = <Row key={this.state.communityID}><CommunityCard communityID={this.state.communityID} /></Row>
			} else {
				const cards = this.state.communities.map((community) =>
					<Row key={community._id} >
						<CommunityCard communityID={community._id} />
					</Row>
				);
			}
			return (
				<Container>
					<Row>
						<Col>
							<Form id="searchCommunity">
								<Form.Group controlId="nameControl">
									<Form.Label>Community Name:</Form.Label>
									<Form.Control name="name" type="text" placeholder="Community Name" value={this.state.communityName} />
								</Form.Group>
								<Button variant="secondary" type="button" onClick={this.handleSearch}>Search Community</Button>
							</Form>
						</Col>
					</Row>
					{cards}
				</Container>
			)

		}
	}

}

export default CommunityFinder;
import React from 'react';
import Login from './Login';
import Register from './Register';
import CommunityCard from './CommunityCard';
import CreateCommunity from './CreateCommunity';
import Error from './Error';
import Axios from 'axios';
import Loading from './Loading';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			communities: null,
			error: false,
			errorMessage: 'Unable to get community data',
			errorStatusCode: 500,
		}
	}

	async componentDidMount() {
		document.title = "Home - GCOrg";

		if(this.props.loggedIn === true) {
			this.setState({loading: true});

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
				.get('http://localhost:9000/api/users/' + uID, {
					headers: { Authorization: `JWT ${accessString}` }
				})
				.then(response => {
					let data = response.data;

					if (data.message === "Found user successfully!") {
						this.setState({
							communities: data.user.communities,
							loading: false,
						});
					}
				})
		}
	}

	render() {
		if(this.state.loading === true) {
			return (<Loading />);
		} else if(this.props.loggedIn === false) {
			return (
				<>
					<Login loggedIn={this.props.loggedIn} updateLogin={this.props.updateLogin} noTitle/>
					<Register loggedIn={this.props.loggedIn} updateLogin={this.props.updateLogin} noTitle/>
				</>
			)
		} else if(this.state.communites !== undefined) {
			const cards = this.state.communities.map((communityID) =>
				<Row>
					<CommunityCard communityID={communityID}/>
				</Row>
			);

			return (
				<Container>
					<Col>
						<Row>
							<Button>Create new Community</Button>
						</Row>
						{cards}
					</Col>
				</Container>
				)
		} else {
			return (
				<Container>
					<Col>
						<Row>
							<Button>Create new Community</Button>
						</Row>
					</Col>
				</Container>
			);
		}
	}
}

export default Home;
import React from 'react';
import Login from './Login';
import Register from './Register';
import CommunityCard from './CommunityCard';
import CreateCommunity from './CreateCommunity';
import Error from './Error';
import Axios from 'axios';
import Loading from './Loading';

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

	componentDidMount() {
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
			<Loading />
		} else if(this.props.loggedIn === false) {
			return (
				<>
					<Login loggedIn={this.props.loggedIn} updateLogin={this.props.updateLogin} noTitle/>
					<Register loggedIn={this.props.loggedIn} updateLogin={this.props.updateLogin} noTitle/>
				</>
			)
		} else {
			const cards = communities.map((communityID) =>
				<Row>
					<CommunityCard communityID={communityID}/>
				</Row>
			);

			return (
				<Container>
					<Col>
						{cards}
					</Col>
				</Container>
				)
		}
	}
}

export default Home;
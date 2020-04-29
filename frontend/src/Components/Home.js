import React from 'react';
import Login from './User/Login';
import Register from './User/Register';
import CommunityCard from './Community/CommunityCard';
import CreateCommunity from './Community/CreateCommunity';
import Error from './Utils/Error';
import Axios from 'axios';
import Loading from './Utils/Loading';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

class Home extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: false,
			communities: [],
			error: false,
			errorMessage: 'Unable to get community data',
			errorStatusCode: 500,
			showModal: false,
			hasFetched: false,
		}

		this.handleOpen = this.handleOpen.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.fetchCommunites = this.fetchCommunites.bind(this);
		this.onCommunityCreation = this.onCommunityCreation.bind(this);
	}

	async componentDidMount() {
		document.title = "Home - GCOrg";
		this.fetchCommunites();
	}

	componentDidUpdate() {
		if (this.props.loggedIn === true && this.state.communities.length <= 0 && this.state.hasFetched === false) {
			this.fetchCommunites();
		}
	}

	async fetchCommunites() {
		this.setState({hasFetched: true}); // stops API spam when user has 0 communities
		let accessString = localStorage.getItem(`JWT`);
		if (accessString === null) {
			this.setState({
				error: true,
				errorMessage: `Unable to load user details from local storage`,
				errorStatusCode: 401,
			});
			return;
		}

		let uID = localStorage.getItem(`UserID`);
		if (uID === null) {
			this.setState({
				error: true,
				errorMessage: `Unable to load user details from local storage`,
				errorStatusCode: 401,
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
					});
				}
			})
	}

	async onCommunityCreation() {
		this.handleClose();
		await this.fetchCommunites();
	}

	handleClose() {
		this.setState({ showModal: false });
	}

	handleOpen(e) {
		e.preventDefault();
		this.setState({ showModal: true });
	}

	render() {
		if (this.state.loading === true) {
			return (<Loading />);
		} else if (this.state.error === true) {
			return (<Error statusCode={this.state.errorStatusCode} message={this.state.errorMessage} />);
		} else if (this.props.loggedIn === false) {
			return (
				<>
					<Login loggedIn={this.props.loggedIn} updateLogin={this.props.updateLogin} noTitle />
					<Register loggedIn={this.props.loggedIn} updateLogin={this.props.updateLogin} noTitle />
				</>
			)
		} else if (this.state.communities.length > 0) {
			const cards = this.state.communities.map((communityID) =>
				<Row key={communityID} >
					<CommunityCard communityID={communityID} />
				</Row>
			);
			return (
				<Container>
					<Modal show={this.state.showModal} onHide={this.handleClose}>
						<Modal.Header closeButton>
							<Modal.Title>Create Community</Modal.Title>
						</Modal.Header>
						<CreateCommunity onComplete={this.onCommunityCreation} />
					</Modal>
					<Col>
						<Row>
							<Button id="createCommunityButton" onClick={this.handleOpen}>Create new Community</Button>
						</Row>
						{cards}
					</Col>
				</Container>
			)
		} else {
			return (
				<Container>
					<Modal show={this.state.showModal} onHide={this.handleClose}>
						<Modal.Header closeButton>
							<Modal.Title>Create Community</Modal.Title>
						</Modal.Header>
						<CreateCommunity onComplete={this.onCommunityCreation} />
					</Modal>
					<Col>
						<Row>
							<Button id="createCommunityButton" onClick={this.handleOpen}>Create new Community</Button>
						</Row>
					</Col>
				</Container>
			);
		}
	}
}

export default Home;
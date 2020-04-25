import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Loading from '../Utils/Loading';
import Error from '../Utils/Error';
import Axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class StaffMember extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			error: false,
			errorMessage: 'Unable to get data',
            errorStatusCode: 500,
            username: '',
		}

	}

	async componentDidMount() {

		//Check the user is logged in
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
			.get('http://localhost:9000/api/users/' + this.props.id, {
				headers: { Authorization: `JWT ${accessString}` }
			}).then(response => {
				let data = response.data;

				this.setState({
                    loading: false,
                    username: data.username,
				});
			}).catch(error => {
				this.setState({
					error: true,
					errorMessage: `Unable to retrieve data`,
					loading: false,
				});
			})
	}

	render() {
		if (this.state.loading === true) {
			return (<Loading />)
		} else if (this.state.error === true) {
			return (<Error statusCode={this.state.errorStatusCode} message={this.state.errorMessage} />)
		} else {
			return (
				<Container style={{borderTop: "0.1rem", borderStyle: "solid", borderColor: "black", }}>
					<Col>
						<Row>
                            <p>{this.state.username}</p>
						</Row>
					</Col>
                    <Col>
                        <Row>
                            <Button id="promoteStaff" onClick={this.props.handlePromote(this.state.username)} variant="primary">Promote</Button> 
                        </Row>
                    </Col>
                    <Col>
                        <Row>
                            <Button id="demoteStaff" onClick={this.props.handleDemote(this.state.username)} variant="danger">Demote</Button> 
                        </Row>
                    </Col>
				</Container>
			)

		}
	}

}

export default StaffMember;
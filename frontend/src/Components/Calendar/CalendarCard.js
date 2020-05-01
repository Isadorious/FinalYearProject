import React from 'react';
import Card from 'react-bootstrap/Card';
import Axios from 'axios';
import Loading from '../Utils/Loading';
import Error from '../Utils/Error';
import { Link } from 'react-router-dom';

class CalendarCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			name: '',
			description: '',
			background: '',
			loading: true,
			error: false,
			errorMessage: 'Unable to load calendar',
			errorStatusCode: 500,
			visible: false,
		}
	}

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

		if (this.props.calendarID === undefined) {
			this.setState({
				error: true,
				errorMessage: 'Calendar ID not supplied',
				loading: false
			});
			return;
		}

		await Axios
			.get(`${process.env.REACT_APP_API_URL}/api/calendars/` + this.props.calendarID, {
				headers: { Authorization: `JWT ${accessString}` }
			}).then(response => {
				let data = response.data;

				if (response.status == 200) {
					if (data.description.length > 100) {
						var res = data.description.substring(0, 96);
						res += "..."
						data.description = res;
					}

					this.setState({
						name: data.calendarName,
						description: data.description,
						background: data.background,
						visible: true,
						loading: false,
					});
				} else if (response.status == 401) {
					this.setState({
						visible: false, 
						loading: false
					});
				}
			}).catch(error => {
				this.setState({
					error: true,
					errorMessage: `Unable to retrieve calendar data`,
					loading: false,
				});
			})
	}

	render() {
		if(this.state.visible === false) {
			return (< >
			</>);
		}
		if (this.state.loading === true) {
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
					<Card.Img variant="top" src={`${process.env.REACT_APP_API_URL}/` + this.state.background} />
					<Card.Body>
						<Card.Title>{this.state.name}</Card.Title>
						<Card.Text>{this.state.description}</Card.Text>
						<Link to={`/calendar/${this.props.calendarID}`} className={"stretched-link"} />
					</Card.Body>
				</Card>
			)
		}
	}
}

export default CalendarCard;
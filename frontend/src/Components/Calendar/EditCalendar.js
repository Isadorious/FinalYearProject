import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Loading from '../Utils/Loading';
import Error from '../Utils/Error';
import Axios from 'axios';

class EditCalendarForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: '',
            loading: true,
            error: false,
            errorMessage: 'Unable to update calendar',
			errorStatus: 500,
			visibility: `Public`,
        }

        this.handleInputChange = this.handleInputChange.bind(this);
		this.handleCreation = this.handleCreation.bind(this);
		this.handleInputChangeSelect = this.handleInputChangeSelect.bind(this);
		this.getCalendar = this.getCalendar.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        
        this.setState({
            [name] : value
        });
	}
	
	handleInputChangeSelect(event) {
		console.log(event.target);
		console.log(event.target.value);
		console.log(event.target.name);
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
        
        await this.getCalendar();
	}
	
	async getCalendar() {
		let accessString = localStorage.getItem(`JWT`);

		await Axios
			.get(`${process.env.REACT_APP_API_URL}/api/calendars/${this.props.id}`, {
				headers: {Authorization : `JWT ${accessString}`}
			})
			.then((response) => {
				if(response.data._id !== undefined) {

					let visibility = `Public`;
					if(response.data.visibility === 0) {
						visibility = `Public`;
					} else if(response.data.visibility === 1) {
						visibility = `Staff`;
					} else if(response.data.visibility === 2) {
						visibility = `Admin`;
					}

					this.setState({
						name: response.data.name,
						description: response.data.description,
						visibility: visibility,
						loading: false,
					});
				}
			})

	}

    async handleUpdate(e) {
        e.preventDefault();

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

        let data = {
            calendarName: this.state.name,
			description: this.state.description,
		}
		
		if(this.state.visibility == `Public`) {
			data.visibility = 0;
		} else if(this.state.visibility == `Staff`) {
			data.visibility = 1;
		} else if(this.state.visibility == `Admin`) {
			data.visibility = 2;
		}

        await Axios
            .put(`${process.env.REACT_APP_API_URL}/api/calendars`, data, {
                headers: {Authorization: `JWT ${accessString}`},
            })
            .then(response => {
                if(response.data.message === `Calendar updated successfully!`) {                 
                    alert(`Calendar updated!`);
                } else {
                    console.log(response);
                    this.setState({error: true, errorMessage: response.data});
                }
            })
    }

    render() {
        if(this.state.loading === true)
        {
            return(<Loading />)
        } else if (this.state.error === true) {
            return(<Error />)
        } else {
            return (
                <Form id="editCalendar" className={"modalForm"}>
                    <Form.Group controlId="nameControl">
                        <Form.Label>Calendar Name:</Form.Label>
                        <Form.Control name="name" type="text" placeholder="Calendar Name" value={this.state.name} onChange={this.handleInputChange} />
                    </Form.Group>

                    <Form.Group controlId="descriptionControl">
                        <Form.Label>Calendar Description:</Form.Label>
                        <Form.Control name="description" as="textarea" placeholder="Enter a description for your calendar" value={this.state.description} onChange={this.handleInputChange} />
                    </Form.Group>

					<Form.Group>
						<Form.Label>Calendar Visbility:</Form.Label>
						<Form.Control name="visibility" as="select" onChange={this.handleInputChange} value={this.state.visibility} custom>
							<option>Public</option>
							<option>Staff</option>
							<option>Admin</option>
						</Form.Control>
					</Form.Group>

                    <Button variant="secondary" type="submit" onClick={this.handleUpdate}>Update Calendar</Button>
                </Form>
            )
        }
    }
}

EditCalendarForm.defaultProps = {
	calendarID: false,
}

export default EditCalendarForm;
import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Loading from '../Utils/Loading';
import Error from '../Utils/Error';
import Axios from 'axios';

class CreateCommunityForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            description: '',
            loading: true,
            error: false,
            errorMessage: 'Unable to create community',
            errorStatus: 500,
            bannerFile: null,
            logoFile: null,
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleCreation = this.handleCreation.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        
        this.setState({
            [name] : value
        });
    }

    componentDidMount() {
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
        
        this.setState({loading: false});
    }

    async handleCreation(e) {
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
            communityName: this.state.name,
            description: this.state.description,
            ownerID: localStorage.getItem(`UserID`),
        }

        await Axios
            .post(`http://localhost:9000/api/communities`, data, {
                headers: {Authorization: `JWT ${accessString}`},
            })
            .then(response => {
                if(response.data.message === `Community added successfully!`) {
                    alert(`Community created`);
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
                <Form id="createCommunity" className={"modalForm"}>
                    <Form.Group controlId="nameControl">
                        <Form.Label>Community Name:</Form.Label>
                        <Form.Control name="name" type="text" placeholder="Community Name" value={this.state.name} onChange={this.handleInputChange} />
                    </Form.Group>

                    <Form.Group controlId="descriptionControl">
                        <Form.Label>Community Description:</Form.Label>
                        <Form.Control name="description" as="textarea" placeholder="Enter a description of your community" value={this.state.description} onChange={this.handleInputChange} />
                    </Form.Group>

                    <Button variant="secondary" type="submit" onClick={this.handleCreation}>Create Community</Button>
                </Form>
            )
        }
    }
}

export default CreateCommunityForm;
import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Loading from '../Utils/Loading';
import Error from '../Utils/Error';
import Axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import UploadBanner from './UploadBanner';
import UploadLogo from './UploadLogo';

class EditCommunityForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true,
			error: false,
			errorMessage: 'Unable to get data',
            errorStatusCode: 500,
            communityName: '',
            communityDescription: '',
		}

        this.handleInputChange = this.handleInputChange.bind(this);
		this.handleSave = this.handleSave.bind(this);
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
			.get('http://localhost:9000/api/communities/' + this.props.id, {
				headers: { Authorization: `JWT ${accessString}` }
			}).then(response => {
				let data = response.data;

                if(response.status == 200) {
                    this.setState({
                        loading: false,
                        communityName: data.communityName,
                        communityDescription: data.description,
                    });
                } else {
                    this.setState({
                        error: true,
                        errorStatusCode: response.status,
                        errorMessage: response.data.message,
                        loading: false,
                    })
                }
			}).catch(error => {
				this.setState({
					error: true,
					errorMessage: `Unable to retrieve data`,
					loading: false,
				});
			})
    }
    
    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        
        this.setState({
            [name] : value
        });
    }

    handleSave() {
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
            description: this.state.description,
        }

        await Axios
            .put(`http://localhost:9000/api/communities/${this.props.id}`, data, {
                headers: {Authorization: `JWT ${accessString}`},
            })
            .then(response => {
                if(response.data.message === `Community updated!`) {
                    alert(`Community updated`);
                } else {
                    console.log(response);
                    this.setState({error: true, errorMessage: response.data});
                }
            })
    }

	render() {
		if (this.state.loading === true) {
			return (<Loading />)
		} else if (this.state.error === true) {
			return (<Error statusCode={this.state.errorStatusCode} message={this.state.errorMessage} />)
		} else {
			return (
				<>
                <Form id="createCommunity" className={"modalForm"}>
                    <Form.Group controlId="nameControl">
                        <Form.Label>Community Name:</Form.Label>
                        <Form.Control name="name" type="text" placeholder="Community Name" value={this.state.name} readOnly />
                    </Form.Group>

                    <Form.Group controlId="descriptionControl">
                        <Form.Label>Community Description:</Form.Label>
                        <Form.Control name="description" as="textarea" placeholder="Enter a description of your community" value={this.state.description} onChange={this.handleInputChange} />
                    </Form.Group>

                    <Button variant="secondary" type="button" onClick={this.handleSave}>Update Community</Button>
                </Form>
				<UploadBanner id={this.props.id}/>
				<UploadLogo id={this.props.id}/>
				</>
			)

		}
	}

}

export default EditCommunityForm;
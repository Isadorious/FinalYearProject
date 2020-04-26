import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Axios from 'axios';
import bsCustomFileInput from 'bs-custom-file-input';


class ProfilePictureUploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            alertShown: false,
            alertMessage: 'Unable to update profile picture',
            selectedFile: null
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFileUpload = this.handleFileUpload.bind(this);
    }

    componentDidMount() {
        bsCustomFileInput.init();
    }

    handleInputChange(event) {
        this.setState({
            selectedFile: event.target.files[0],
        })
    }

    handleFileUpload(e) {
        e.preventDefault();
        const data = new FormData();
        data.append('profilePicture', this.state.selectedFile);

        let accessString = localStorage.getItem(`JWT`);
		if (accessString === null) {
			this.setState({
				error: true,
			});
		}

		let uID = localStorage.getItem(`UserID`);
		if (uID === null) {
			this.setState({
				error: true,
			});
		}
        
        Axios.post(`http://localhost:9000/api/users/uploadProfilePicture/${uID}`, data, {
            headers: {Authorization: `JWT ${accessString}`},
        })
        .then(response => {
            if(response.data.message === `Profile Picture uploaded!`) {
                alert(`Profile picture updated!`);
            } else {
                this.setState({ alertShown: true});
                console.log(response);
            }
        })
    }

    render() {
        return (
            <Form id="registerLoginForm">
                <Alert variant="danger" show={this.state.alertShown}>
                    Error: {this.state.alertMessage}
                </Alert>
                <Form.Group>
                    <Form.File id="profilePicture" name="profilePicture" label="Profile Picture" custom onChange={this.handleInputChange} />
                </Form.Group>
                <Button variant="secondary" type="submit" onClick={this.handleFileUpload}>Upload profile picture</Button>
            </Form>
        )
    }
}

export default ProfilePictureUploader;
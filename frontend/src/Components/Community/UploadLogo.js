import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Axios from 'axios';
import bsCustomFileInput from 'bs-custom-file-input';


class BannerUploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            alertShown: false,
            alertMessage: 'Unable to update logo',
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
        data.append('logo', this.state.selectedFile);

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
        
        Axios.post(`${process.env.REACT_APP_API_URL}/api/community/uploadBanner/${this.props.id}`, data, {
            headers: {Authorization: `JWT ${accessString}`},
        })
        .then(response => {
            if(response.data.message === `Logo uploaded!`) {
                alert(`Logo updated!`);
            } else {
                this.setState({ alertShown: true});
                console.log(response);
            }
        })
    }

    render() {
        return (
            <Form className="modalForm">
                <Alert variant="danger" show={this.state.alertShown}>
                    Error: {this.state.alertMessage}
                </Alert>
                <Form.Group>
                    <Form.File id="logo" name="logo" label="Community Logo" custom onChange={this.handleInputChange} />
                </Form.Group>
                <Button variant="secondary" type="submit" onClick={this.handleFileUpload}>Upload banner</Button>
            </Form>
        )
    }
}

export default BannerUploader;
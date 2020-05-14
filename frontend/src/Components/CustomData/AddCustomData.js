import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import AddCustomDataField from './AddCustomDataField';

class AddCustomDataForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            customData: {},
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.submitData = this.submitData.bind(this);
    }

    handleInputChange(event) {
        // N.B. This is different to other input change methods used. This only sets the state of properties of the data object
        const target = event.target;
        const value = target.value;
        const name = target.name;
        this.setState({
            customData: {
                [name]: value
            }
        });
    }

    async submitData() {
        let accessString = localStorage.getItem(`JWT`);

        const data = {
            authorID: localStorage.getItem(`UserID`),
            structureID: this.props.structure._id,
            communityID: this.props.communityID,
            content: this.state.customData,
            date: new Date(),
        }

        await Axios
            .post(`${process.env.REACT_APP_API_URL}/api/customData`, data, {
                headers: { Authorization: `JWT ${accessString}` }
            })
            .then((response) => {
                let data = response.data;
                console.log(data.message);
                if (data.message == "CustomData added successfully!") {
                    if (this.props.onComplete) {
                        this.props.onComplete();
                        return;
                    }
                    alert(`Data added!`)
                } else {
                    console.log(`then if failed`);
                    console.log(response.data);
                    this.setState({ error: true, errorMessage: response.data });
                }
            }).catch((error) => {
                console.log(error);
                this.setState({ error: true, errorMessage: error.data });
            });

    }

    render() {
        let fields = this.props.structure.DisplayKeyPairs.map((pair, index) =>
            <AddCustomDataField key={index} keyValuePair={pair} handleInputChange={this.handleInputChange} data={this.state.customData} />
        );

        return (
            <Container fluid>
                <Form id="createCustomData" className={"modalForm"}>
                    {fields}
                    <Button variant="danger" className={"float-right dashboardButton"} onClick={this.props.onCancel}>Cancel</Button>
                    <Button variant="success" className={"float-right dashboardButton"} onClick={this.submitData}>Save</Button>
                </Form>
            </Container>
        )
    }
}

AddCustomDataForm.defaultProps = {
    onComplete: false,
    communityID: false,
    onCancel: false,
    structure: false,
}

export default AddCustomDataForm;
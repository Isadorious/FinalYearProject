import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Axios from 'axios';
import CreateKeyValuePair from './CreateKeyValuePair';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';

class CreateStructureForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            customDataName: '',
            DisplayKeyPairs: [],
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.addDisplayKeyPair = this.addDisplayKeyPair.bind(this);
        this.handleKeyPairChange = this.handleKeyPairChange.bind(this);
        this.removeDisplayKeyPair = this.removeDisplayKeyPair.bind(this);
        this.createStructure = this.createStructure.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    addDisplayKeyPair() {
        let displayKeyPairs = this.state.DisplayKeyPairs;
        const displayKeyPair = { displayName: '', key: '', dataType: 'Short Text' };
        displayKeyPairs.push(displayKeyPair);
        this.setState({ DisplayKeyPairs: displayKeyPairs });
    }

    handleKeyPairChange(event, index) {
        let keyValuePairs = this.state.DisplayKeyPairs;
        const target = event.target;
        const value = target.value;
        const name = target.name;
        keyValuePairs[index][name] = value;

        // Update the key value based on a fields display name, removes whitespacing from display name
        if (name == `displayName`) {
            const keyValue = value.replace(/\s+/g, '');
            keyValuePairs[index].key = keyValue;
        }

        this.setState({
            DisplayKeyPairs: keyValuePairs,
        });
    }

    removeDisplayKeyPair(index) {
        let displayKeyPairs = this.state.DisplayKeyPairs;
        displayKeyPairs.splice(index, 1);
        this.setState({ DisplayKeyPairs: displayKeyPairs });
    }

    async createStructure() {
        let accessString = localStorage.getItem(`JWT`);

        let data = {
            customDataName: this.state.customDataName,
            DisplayKeyPairs: this.state.DisplayKeyPairs,
        }

        await Axios
            .post(`${process.env.REACT_APP_API_URL}/api/communities/${this.props.communityID}/structures`, data, {
                headers: { Authorization: `JWT ${accessString}` }
            })
            .then((response) => {
                let data = response.data;
                console.log(data.message);
                if (data.message == "Custom Structure added successfully!") {
                    if (this.props.onComplete) {
                        this.props.onComplete();
                        return;
                    }
                    alert(`Structure added!`)
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
        let displayKeyPairs = this.state.DisplayKeyPairs.map((pair, index) =>
            <CreateKeyValuePair key={index} keyValuePair={pair} handleInputChange={this.handleKeyPairChange} handleRemove={this.removeDisplayKeyPair} index={index} />
        );

        return (
            <Container fluid>
                <Form id="createCustomStructure" className={"modalForm"}>
                    <Form.Group controlId="customDataNameControl">
                        <Form.Label>Data Structure Name:</Form.Label>
                        <Form.Control name="customDataName" type="text" placeholder="Data Structure Name" value={this.state.customDataName} onChange={this.handleInputChange} />
                    </Form.Group>
                    <hr />
                    <Form.Group controlId="displayKeyPairsControl">
                        <Row>
                            <Col><Form.Label>Fields</Form.Label></Col>
                            <Col><Button variant="secondary" onClick={this.addDisplayKeyPair} className={"float-right"}>Add Extra Field</Button></Col>
                        </Row>
                        <hr />
                        {displayKeyPairs}
                    </Form.Group>

                    <Button variant="danger" className={"float-right dashboardButton"} onClick={this.props.onCancel}>Cancel</Button>
                    <Button variant="success" className={"float-right dashboardButton"} onClick={this.createStructure}>Save</Button>
                </Form>
            </Container>
        )
    }
}

CreateStructureForm.defaultProps = {
    onComplete: false,
    communityID: false,
    onCancel: false,
}

export default CreateStructureForm;
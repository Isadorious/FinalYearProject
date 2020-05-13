import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';

class AddCustomDataField extends React.Component {
    constructor(props) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        this.props.handleInputChange(event);
    }

    render() {

        let control;

        if (this.props.keyValuePair.dataType === `Short Text`) {
            control = <Form.Control name={this.props.keyValuePair.key} type="text" value={this.props.data[this.props.keyValuePair.key]} onChange={this.handleInputChange} />
        }

        if (this.props.keyValuePair.dataType === `Long Text`) {
            control = <Form.Control name={this.props.keyValuePair.key} as="textarea" value={this.props.data[this.props.keyValuePair.key]} onChange={this.handleInputChange} />
        }

        return (
            <Container fluid>
                <Form.Row>
                    <Form.Group as={Col} controlId="displayNameControl">
                        <Form.Label>{this.props.keyValuePair.displayName}</Form.Label>
                    </Form.Group>
                    <Form.Group as={Col} controlId={`${this.props.keyValuePair.key}Control`}>
                        {control}
                    </Form.Group>
                </Form.Row>
            </Container >
        )
    }
}

AddCustomDataField.defaultProps = {
    keyValuePair: false,
    handleInputChange: false,
    data: false,
}

export default AddCustomDataField;
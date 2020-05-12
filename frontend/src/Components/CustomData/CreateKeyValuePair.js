import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';

class CreateKeyValuePair extends React.Component {
    constructor(props) {
        super(props);

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleRemove = this.handleRemove.bind(this)
    }

    handleInputChange(event) {
        this.props.handleInputChange(event, this.props.index);
    }

    handleRemove() {
        this.props.handleRemove(this.props.index);
    }

    render() {
        return (
            <Container fluid>
            <Form.Row>
                <Form.Group as={Col} controlId="displayNameControl">
                    <Form.Control name="displayName" type="text" placeholder="Field Name" value={this.props.keyValuePair.displayName} onChange={this.handleInputChange} />
                </Form.Group>
                <Form.Group as={Col} controlId="dataTypeControl">
                    <Form.Control name="dataType" as="select" value={this.props.subTask.subTaskDue} onChange={this.handleInputChange}>
                        <option>Short Text</option>
                        <option>Long Text</option>
                    </Form.Control>
                </Form.Group>
                <Form.Group as={Col} controlId="removeControl">
                    <Button className={"float-right"} variant="danger" onClick={this.handleRemove}>Delete</Button>
                </Form.Group>
            </Form.Row>
        </Container>
        )
    }
}

CreateKeyValuePair.defaultProps = {
    keyValuePair: false,
    handleInputChange: false,
    handleRemove: false,
    index: false,
}

export default CreateKeyValuePair;
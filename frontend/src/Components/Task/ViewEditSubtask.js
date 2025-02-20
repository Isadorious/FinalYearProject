import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Loading from '../Utils/Loading';
import Error from '../Utils/Error';
import Axios from 'axios';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import StaffSelect from './StaffSelect';
import InlineUsers from '../User/InlineUsers';

class ViewEditSubtask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            error: false,
            errorMessage: 'Unable to create task',
            errorStatus: 500,
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.updateAssignedStaff = this.updateAssignedStaff.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
        this.handleSwitchChange = this.handleSwitchChange.bind(this);
    }

    handleInputChange(event) {
        this.props.onChange(event, this.props.index);
    }

    handleSwitchChange(event) {
        this.props.handleSwitchChange(event, this.props.index);
    }

    updateAssignedStaff(staff) {
        this.props.updateAssignedStaff(staff, this.props.index);
    }

    handleRemove() {
        this.props.handleRemove(this.props.index);
    }

    render() {
        if (this.props.editMode) {
            return (
                <Container fluid>
                    <Form.Row>
                        <Form.Group as={Col} controlId="subTaskNameControl">
                            <Form.Control name="subTaskName" type="text" placeholder="Subtask Name" value={this.props.subTask.subTaskName} onChange={this.handleInputChange} />
                        </Form.Group>
                        <Form.Group as={Col} controlId="assignedUsersControl">
                            <StaffSelect ownerID={this.props.OwnerID} staffID={this.props.StaffID} AdminID={this.props.AdminID} updateSelectedStaff={this.updateAssignedStaff} initialStaffID={this.props.subTask.subTaskAssignedUsers} />
                        </Form.Group>
                        <Form.Group as={Col} controlId={`completedSubtaskControl${this.props.index}`}>
                            <Form.Check type="switch" name="complete" label="Completed?" checked={this.props.subTask.complete} onChange={this.handleSwitchChange} />
                        </Form.Group>
                        <Form.Group as={Col} controlId="dueDateControl">
                            <Form.Control name="subTaskDue" type="date" value={new Date(this.props.subTask.subTaskDue).toLocaleDateString('en-CA')} onChange={this.handleInputChange} />
                        </Form.Group>
                        <Form.Group as={Col} controlId="removeControl">
                            <Button className={"float-right"} variant="danger" onClick={this.handleRemove}>Delete</Button>
                        </Form.Group>
                    </Form.Row>
                </Container>
            )
        } else {
            return (
                <Container fluid>
                    <Form.Row>
                        <Form.Group as={Col} controlId="subTaskNameControl">
                            <p>{this.props.subTask.subTaskName}</p>
                        </Form.Group>
                        <Form.Group as={Col} controlId="assignedUsersControl">
                            <p><InlineUsers users={this.props.subTask.subTaskAssignedUsers} /></p>
                        </Form.Group>
                        <Form.Group as={Col} controlId={`completedSubtaskControl${this.props.index}`}>
                            <p>{this.props.subTask.complete ? `Complete` : `Incomplete`}</p>
                        </Form.Group>
                        <Form.Group as={Col} controlId="dueDateControl">
                            <Form.Control name="subTaskDue" type="date" value={new Date(this.props.subTask.subTaskDue).toLocaleDateString('en-CA')} onChange={this.handleInputChange} disabled />
                        </Form.Group>
                    </Form.Row>
                </Container>
            )
        }
    }
}

ViewEditSubtask.defaultProps = {
    OwnerID: undefined,
    StaffID: undefined,
    AdminID: undefined,
    subTask: {},
    index: undefined,
    onChange: undefined,
    updateAssignedStaff: undefined,
    editMode: false,
}

export default ViewEditSubtask;
import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Loading from '../Utils/Loading';
import Error from '../Utils/Error';
import Axios from 'axios';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import StaffSelect from './StaffSelect';

class CreateSubtask extends React.Component {
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
	}

	handleInputChange(event) {
        this.props.onChange(event, this.props.index);
	}

	updateAssignedStaff(staff) {
        this.props.updateAssignedStaff(staff, this.props.index);
	}
	
	render() {
		return(
			<Container fluid>
                    <Form.Row>
					<Form.Group as={Col} controlId="subTaskNameControl">
						<Form.Control name="subTaskName" type="text" placeholder="Task Name" value={this.props.subTask.subTaskName} onChange={this.handleInputChange}/>
					</Form.Group>
					<Form.Group as={Col} controlId="assignedUsersControl">
						<StaffSelect ownerID={this.props.OwnerID} staffID={this.props.StaffID} AdminID={this.props.AdminID} updateSelectedStaff={this.updateAssignedStaff}/>
					</Form.Group>
					<Form.Group as={Col} controlId="completedControl">
						<Form.Check type="switch" name="completed" label="Completed?" value={this.props.subTask.complete} onChange={this.handleInputChange} />
					</Form.Group>
					<Form.Group as={Col} controlId="dueDateControl">
						<Form.Control name="subTaskDue" type="date" value={this.props.subTask.subTaskDue} onChange={this.handleInputChange} />
					</Form.Group>
                    </Form.Row>
			</Container>
		)
	}
}

CreateSubtask.defaultProps = {
	OwnerID: undefined,
	StaffID: undefined,
    AdminID: undefined,
    subTask: {},
    index: undefined,
    onChange: undefined,
    updateAssignedStaff: undefined,
}

export default CreateSubtask;
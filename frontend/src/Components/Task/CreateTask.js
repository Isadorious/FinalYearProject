import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Loading from '../Utils/Loading';
import Error from '../Utils/Error';
import Axios from 'axios';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';

class CreateTaskForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			taskName: '',
			taskDescription: '',
			taskCategory: '',
			taskAssignedUser: [],
			taskDue: '',
			taskComments: [],
			subTasks: [],
			complete: false,
            loading: true,
            error: false,
            errorMessage: 'Unable to create community',
            errorStatus: 500,
		}

		this.handleInputChange = this.handleInputChange.bind(this);
	}

	handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        
        this.setState({
            [name] : value
        });
	}
	
	render() {
		return(
			<Container fluid>
				<Form id="createTask" className={"modalForm"}>
					<Form.Group controlId="taskNameControl">
						<Form.Control name="taskName" type="text" placeholder="Task Name" value={this.state.taskName} onChange={this.handleInputChange}/>
					</Form.Group>
					<hr />
					<Form.Group controlId="taskDescriptionControl">
						<Form.Label>Task Description</Form.Label>
						<Form.Control name="taskDescription" as="textarea" value={this.state.taskDescription} onChange={this.handleInputChange} />
					</Form.Group>
					<Form.Group controlId="assignedUsersPlaceholder">
						<Form.Label>Assigned Users</Form.Label>
						<Form.Control name="assignedUsers" type="text" placeholder="assigned staff placeholder element"/>
					</Form.Group>
					<Form.Group as={Col} controlId="completedControl">
						<Form.Check type="switch" name="completed" label="Task Completed?" onChange={this.handleInputChange} />
					</Form.Group>
					<Form.Group as={Col} controlId="dueDateControl">
						<Form.Label>Due Date:</Form.Label>
						<Form.Control name="taskDue" type="date" value={this.state.taskDue} onChange={this.handleInputChange} />
					</Form.Group>

					<Button variant="success">Save</Button>
					<Button variant= "danger">Cancel</Button>
				</Form>
			</Container>
		)
	}
}

CreateTaskForm.defaultProps = {
	onComplete: undefined,
	categories: undefined,
}

export default CreateTaskForm;
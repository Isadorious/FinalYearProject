import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Loading from '../Utils/Loading';
import Error from '../Utils/Error';
import Axios from 'axios';
import Col from 'react-bootstrap/Col';
import Container from 'react-bootstrap/Container';
import StaffSelect from './StaffSelect';
import CreateSubtask from './CreateSubtask';
import Row from 'react-bootstrap/Row';

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
			errorMessage: 'Unable to create task',
			errorStatus: 500,
		}

		this.handleInputChange = this.handleInputChange.bind(this);
		this.updateAssignedStaff = this.updateAssignedStaff.bind(this);
		this.updateSubtask = this.updateSubtask.bind(this);
		this.updateSubtaskAssignedStaff = this.updateSubtaskAssignedStaff.bind(this);
		this.addSubTask = this.addSubTask.bind(this);
		this.createTask = this.createTask.bind(this);
		this.removeSubtask = this.removeSubtask.bind(this);
	}

	handleInputChange(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		this.setState({
			[name]: value
		});
	}

	updateAssignedStaff(staff) {
		this.setState({ taskAssignedUser: staff });
	}

	updateSubtask(event, index) {
		let subtasks = this.state.subTasks;
		const target = event.target;
		const value = target.value;
		const name = target.name;
		subtasks[index][name] = value;
		this.setState({ subTasks: subtasks });
	}

	updateSubtaskAssignedStaff(staff, index) {
		let subtasks = this.state.subTasks;
		subtasks[index].subTaskAssignedUsers = staff;
		this.setState({ subTasks: subtasks });
	}

	removeSubtask(index) {
		let subtasks = this.state.subTasks;
		subtasks.splice(index, 1);
		this.setState({ subTasks: subtasks });
	}

	addSubTask() {
		let subtask = { subTaskName: '', subTaskAssignedUsers: [], subTaskDue: '', complete: false, };
		let subtasks = this.state.subTasks;

		subtasks.push(subtask);
		this.setState({subTasks: subtasks});
	}

	async createTask() {
		// Post task /:id/tasks
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
			taskName: this.state.taskName,
			taskDescription: this.state.taskDescription,
			taskAssignedUsers: this.state.taskAssignedUser,
			taskDue: this.state.taskDue,
			subTasks: this.state.subTasks,
		}

		await Axios
			.post(`${process.env.REACT_APP_API_URL}/api/calendars/${this.props.calendarID}/tasks`, data, {
				headers: {Authorization: `JWT ${accessString}`},
			})
			.then(response => {
				if(response.data.message === `Task added successfully!`) {
					if(this.props.onComplete !== undefined) {
						this.props.onComplete();
						return;
					}

					alert(`Task created`);
				} else {
					console.log(response);
                    this.setState({error: true, errorMessage: response.data});
				}
			})
			.catch(error => {
				console.log(error);
				this.setState({error: true, errorMessage: error.data});
			});
	}

	render() {
		let subtasks;
		if (this.state.subTasks.length > 0) {
			subtasks = this.state.subTasks.map((subtask, index) =>
				<React.Fragment key={index}><Row><CreateSubtask OwnerID={this.props.OwnerID} StaffID={this.props.StaffID} AdminID={this.props.AdminID} updateAssignedStaff={this.updateSubtaskAssignedStaff} onChange={this.updateSubtask} subTask={subtask} index={index} handleRemove={this.removeSubtask}/></Row></React.Fragment>
			);
		}
		return (
			<Container fluid>
				<Form id="createTask" className={"modalForm"}>
					<Form.Group controlId="taskNameControl">
						<Form.Control name="taskName" type="text" placeholder="Task Name" value={this.state.taskName} onChange={this.handleInputChange} />
					</Form.Group>
					<hr />
					<Form.Group controlId="taskDescriptionControl">
						<Form.Label>Task Description</Form.Label>
						<Form.Control name="taskDescription" as="textarea" value={this.state.taskDescription} onChange={this.handleInputChange} />
					</Form.Group>
					<hr />
					<Form.Group controlId="assignedUsersControl">
						<Form.Label>Assigned Users</Form.Label>
						<StaffSelect ownerID={this.props.OwnerID} StaffID={this.props.StaffID} AdminID={this.props.AdminID} updateSelectedStaff={this.updateAssignedStaff} />
					</Form.Group>
					<hr />
					<Form.Group controlId="subTasksControl">
						<Row>
							<Col><Form.Label>Subtasks</Form.Label></Col>
							<Col><Button variant="secondary" onClick={this.addSubTask} className={"float-right"}>Add subtasks</Button></Col>
						</Row>
						<hr />
						{subtasks}
					</Form.Group>
					<hr />
					<Form.Group as={Col} controlId="completedControl">
						<Form.Check type="switch" name="completed" label="Task Completed?" onChange={this.handleInputChange} disabled/>
					</Form.Group>
					<hr />
					<Form.Group as={Col} controlId="dueDateControl">
						<Form.Label>Due Date:</Form.Label>
						<Form.Control name="taskDue" type="date" value={this.state.taskDue} onChange={this.handleInputChange} />
					</Form.Group>
					<hr />

					<Button variant="danger" className={"float-right dashboardButton"} onClick={this.props.onCancel}>Cancel</Button>
					<Button variant="success" className={"float-right dashboardButton"} onClick={this.createTask}>Save</Button>
				</Form>
			</Container>
		)
	}
}

CreateTaskForm.defaultProps = {
	onComplete: undefined,
	categories: undefined,
	OwnerID: undefined,
	StaffID: undefined,
	AdminID: undefined,
	onCancel: undefined,
	calendarID: undefined,
}

export default CreateTaskForm;
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

class ViewEditTask extends React.Component {
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
			hideButton: true,
			editMode: false,
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
		this.removeSubtask = this.removeSubtask.bind(this);
		this.toggleEditMode = this.toggleEditMode.bind(this);
		this.getTask = this.getTask.bind(this);
		this.updateTask = this.updateTask.bind(this);

	}

	async componentDidMount() {
		await this.getTask();
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
		this.setState({ subTasks: subtasks });
	}

	toggleEditMode() {
		this.setState({ editMode: !this.state.editMode });
	}

	async getTask() {
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

		await Axios
			.get(`${process.env.REACT_APP_API_URL}/api/calendars/${this.props.calendarID}/tasks/${this.props.id}`, {
				headers: { Authorization: `JWT ${accessString}` },
			})
			.then(response => {
				let data = response.data;

				if (data._id !== undefined) {
					this.setState({
						taskName: data.taskName,
						taskDescription: data.taskDescription,
						taskCategory: data.taskCategory,
						taskAssignedUser: data.taskAssignedUsers,
						taskDue: new Date(data.taskDue),
						taskComments: data.taskComments,
						subTasks: data.subTasks,
						loading: false,
					})

					if(this.props.userPermission > 0) {
						this.setState({hideButton: false});
					}
				} else {
					this.setState({
						error: true,
						errorMessage: `Unable to find task`,
						loading: false
					});
				}
			})
			.catch(error => {
				console.log(error);
				this.setState({
					error: true,
					errorMessage: error.data,
					loading: false
				});
			});
	}

	async updateTask() {
		// Put task /:id/tasks/:taskID
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
			.put(`${process.env.REACT_APP_API_URL}/api/calendars/${this.props.calendarID}/tasks/${this.props.id}`, data, {
				headers: { Authorization: `JWT ${accessString}` },
			})
			.then(response => {
				if (response.data.message === `Task updated successfully!`) {
					alert(`Task updated`);
				} else {
					console.log(response);
					this.setState({ error: true, errorMessage: response.data });
				}
			})
			.catch(error => {
				console.log(error);
				this.setState({ error: true, errorMessage: error.data });
			});
	}

	render() {

		if (this.state.loading === true) {
			return ( <Loading />)
		} else if (this.state.error === true) {
			return (<Error statusCode={this.state.errorStatus} message={this.state.errorMessage}/>)
		} else if(this.state.editMode === true) {
			let subtasks;
			if (this.state.subTasks.length > 0) {
				subtasks = this.state.subTasks.map((subtask, index) =>
					<React.Fragment key={index}><Row><CreateSubtask OwnerID={this.props.OwnerID} StaffID={this.props.StaffID} AdminID={this.props.AdminID} updateAssignedStaff={this.updateSubtaskAssignedStaff} onChange={this.updateSubtask} subTask={subtask} index={index} handleRemove={this.removeSubtask} /></Row></React.Fragment>
				);
			}
			return (
				<Container fluid>
					{!this.state.hideButton && <div><Button className={"dashboardButton float-right"} onClick={this.toggleEditMode}>Toggle Edit Mode</Button> <br/></div>}
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
							<StaffSelect ownerID={this.props.OwnerID} staffID={this.props.StaffID} AdminID={this.props.AdminID} updateSelectedStaff={this.updateAssignedStaff} value={this.state.taskAssignedUser}/>
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
							<Form.Check type="switch" name="completed" label="Task Completed?" onChange={this.handleInputChange} />
						</Form.Group>
						<hr />
						<Form.Group as={Col} controlId="dueDateControl">
							<Form.Label>Due Date:</Form.Label>
							<Form.Control name="taskDue" type="date" value={new Date(this.state.taskDue).toLocaleDateString('en-CA')} onChange={this.handleInputChange} />
						</Form.Group>
						<hr />

						<Button variant="success" className={"float-right dashboardButton"} onClick={this.updateTask}>Update</Button>
					</Form>
				</Container>
			)
		} else {
			let subtasks;
			if (this.state.subTasks.length > 0) {
				subtasks = this.state.subTasks.map((subtask, index) =>
					<React.Fragment key={index}><Row><CreateSubtask OwnerID={this.props.OwnerID} StaffID={this.props.StaffID} AdminID={this.props.AdminID} updateAssignedStaff={this.updateSubtaskAssignedStaff} onChange={this.updateSubtask} subTask={subtask} index={index} handleRemove={this.removeSubtask} /></Row></React.Fragment>
				);
			}
			return (
				<Container fluid>
					{!this.state.hideButton && <div><Button className={"dashboardButton float-right"} onClick={this.toggleEditMode}>Toggle Edit Mode</Button> <br/></div>}
					<Form id="createTask" className={"modalForm"}>
						<Form.Group controlId="taskNameControl">
							<h2>{this.state.taskName}</h2>
						</Form.Group>
						<hr />
						<Form.Group controlId="taskDescriptionControl">
							<Form.Label>Task Description</Form.Label>
							<p>{this.state.taskDescription}</p>
						</Form.Group>
						<hr />
						<Form.Group controlId="assignedUsersControl">
							<Form.Label>Assigned Users</Form.Label>
							<StaffSelect ownerID={this.props.OwnerID} staffID={this.props.StaffID} AdminID={this.props.AdminID} updateSelectedStaff={this.updateAssignedStaff} value={this.state.taskAssignedUser}/>
						</Form.Group>
						<hr />
						<Form.Group controlId="subTasksControl">
							<Row>
								<Col><Form.Label>Subtasks</Form.Label></Col>
							</Row>
							<hr />
							{subtasks}
						</Form.Group>
						<hr />
						<Form.Group as={Col} controlId="completedControl">
							<p>{this.state.complete ? `Complete` : `Incomplete`}</p>
						</Form.Group>
						<hr />
						<Form.Group as={Col} controlId="dueDateControl">
							<Form.Label>Due Date:</Form.Label>
							<p>{new Date(this.state.taskDue).toLocaleDateString('en-GB')}</p>
						</Form.Group>
						<hr />
					</Form>
				</Container>
			)
		}
	}
}

ViewEditTask.defaultProps = {
	OwnerID: undefined,
	StaffID: undefined,
	AdminID: undefined,
	calendarID: undefined,
	id: undefined,
	userPermission: 0,
}

export default ViewEditTask;
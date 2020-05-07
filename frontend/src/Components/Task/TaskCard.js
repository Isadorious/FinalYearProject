import React from 'react';
import Card from 'react-bootstrap/Card';
import Axios from 'axios';
import Loading from '../Utils/Loading';
import Error from '../Utils/Error';
import { Link } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import UserListItem from '../User/ListItem';

class TaskCard extends React.Component {
	constructor(props) {
		super(props);

		this.handleShow = this.handleShow.bind(this);
	}

	handleShow() {
		if(this.props.showTask) {
			this.props.showTask(this.props.task._id);
		}
	}

	render() {
		let assignedUsers = '';

		if (Array.isArray(this.props.task.taskAssignedUsers)) {
			assignedUsers = this.props.task.taskAssignedUsers.map((userID, index) =>
				<UserListItem key={userID} id={userID}/>
			);
		}

		return (
			<Card id={this.props.task._id} style={{width: "15rem", cursor: "pointer"}} onClick={this.handleShow}>
				<Card.Body>
					<Card.Title style={{textAlign: "center"}}>{this.props.task.taskName}</Card.Title>
					<ListGroup variant="flush">
						{assignedUsers}
						<ListGroup.Item>{new Date(this.props.task.taskDue).toLocaleDateString('en-CA')}</ListGroup.Item>
						<ListGroup.Item>{this.props.task.complete ? `Complete` : `Incomplete`}</ListGroup.Item>
					</ListGroup>
					</Card.Body>
			</Card>
		)
	}
}

TaskCard.defaultProps = {
	task: undefined,
	showTask: false,
}

export default TaskCard;
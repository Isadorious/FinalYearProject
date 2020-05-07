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
	}

	render() {
		let assignedUsers = '';

		if (Array.isArray(this.props.task.taskAssignedUsers)) {
			assignedUsers = this.props.task.taskAssignedUsers.map((userID, index) =>
				<UserListItem key={userID} id={userID}/>
			);
		}

		console.log(this.props.task.complete);
		return (
			<Card id={this.props.task._id}>
				<Card.Body>
					<Card.Title style={{textAlign: "center"}}>{this.props.task.taskName}</Card.Title>
					<ListGroup variant="flush">
						{assignedUsers}
						<ListGroup.Item>{this.props.task.taskDue}</ListGroup.Item>
						<ListGroup.Item>{String(this.props.task.complete)}</ListGroup.Item>
					</ListGroup>
					</Card.Body>
			</Card>
		)
	}
}

TaskCard.defaultProps = {
	task: undefined,
}

export default TaskCard;
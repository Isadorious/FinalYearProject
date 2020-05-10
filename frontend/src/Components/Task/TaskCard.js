import React from 'react';
import Card from 'react-bootstrap/Card';
import Axios from 'axios';
import Loading from '../Utils/Loading';
import Error from '../Utils/Error';
import { Link } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import InlineUsers from './InlineUsers';

class TaskCard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			visible: true,
			category: '',
		}

		this.handleShow = this.handleShow.bind(this);
	}

	componentDidMount() {
		if(this.props.hideComplete === true && this.props.task.complete === true) {
			this.setState({visible: false});
		}

		if(this.props.onlyAssigned === true) {
			// Get the users ID
			// Compare it to assigned users, if the user isn't assigned hide the card
			const userID = localStorage.getItem(`UserID`);
			if(this.props.task.taskAssignedUsers.includes(userID) === false) {
				this.setState({visible: false});
			}
		}

		if(this.props.categories) {
			const cat = this.props.categories.find(element => element._id == this.props.task.taskCategory);
			if(cat !== undefined) {
				this.setState({category: cat.categoryName});
			}
		}

		if(this.props.filterCategories) {
			if(categoryToFilter) {
				if(this.state.category !== categoryToFilter) {
					this.setState({visible: false});
				}
			}
		}
	}

	handleShow() {
		if(this.props.showTask) {
			this.props.showTask(this.props.task._id);
		}
	}

	render() {

		if(this.state.visible === false) {
			return(<></>)
		} else {
			return (
				<Card id={this.props.task._id} style={{width: "15rem", cursor: "pointer"}} onClick={this.handleShow}>
					<Card.Body>
						<Card.Title style={{textAlign: "center"}}>{this.props.task.taskName}</Card.Title>
						<Card.Subtitle className="mb-2 text-muted" style={{textAlign: "center"}}>{this.state.category}</Card.Subtitle>
						<ListGroup variant="flush">
							<ListGroup.Item>Users: <InlineUsers users={this.props.task.taskAssignedUsers}/></ListGroup.Item>
							<ListGroup.Item>{new Date(this.props.task.taskDue).toLocaleDateString('en-GB')}</ListGroup.Item>
							<ListGroup.Item>{this.props.task.complete ? `Complete` : `Incomplete`}</ListGroup.Item>
						</ListGroup>
						</Card.Body>
				</Card>
			)
		}
	}
}

TaskCard.defaultProps = {
	task: undefined,
	showTask: false,
	hideComplete: false,
	onlyAssigned: false,
	categories: false,
	filterCategories: false,
	categoryToFilter: false,
}

export default TaskCard;
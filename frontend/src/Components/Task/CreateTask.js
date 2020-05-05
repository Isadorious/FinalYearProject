import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Loading from '../Utils/Loading';
import Error from '../Utils/Error';
import Axios from 'axios';
import Col from 'react-bootstrap/Col';

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
}

CreateTaskForm.defaultProps = {
	onComplete: undefined,
}

export default CreateTaskForm;
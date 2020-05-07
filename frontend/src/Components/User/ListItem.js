import React from 'react';
import Card from 'react-bootstrap/Card';
import Axios from 'axios';
import Loading from '../Utils/Loading';
import Error from '../Utils/Error';
import ListGroup from 'react-bootstrap/ListGroup';

class UserListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: '',
        }
    }

    componentDidMount() {
        let accessString = localStorage.getItem(`JWT`);
        Axios
            .get(`${process.env.REACT_APP_API_URL}/api/users/` + this.props.id, {
                headers: { Authorization: `JWT ${accessString}` }
            })
            .then(response => {
                let data = response.data;
                if (data.message === "Found user successfully!") {
                    this.setState({
                        username: data.user.username,
                    });
                }
            })
    }

    render() {
        return (
            <ListGroup.Item>{this.state.username}</ListGroup.Item>
        )
    }
}

UserListItem.defaultProps = {
    id: undefined,
}

export default UserListItem;
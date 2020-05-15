import React from 'react';
import Axios from 'axios';
import Loading from '../Utils/Loading';

class InlineUsers extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
			usernames: [],
        }
    }

    componentDidMount() {
		this.mounted = true;
		let accessString = localStorage.getItem(`JWT`);
		
        this.props.users.forEach((id) => {
			Axios
            .get(`${process.env.REACT_APP_API_URL}/api/users/` + id, {
                headers: { Authorization: `JWT ${accessString}` }
            })
            .then(response => {
                let data = response.data;
                if (data.message === "Found user successfully!") {

					let username = data.user.username;
					let usernames = this.state.usernames;

					usernames.push(username);
					if(this.mounted) {
						this.setState({
							usernames: usernames,
						});
					}
                }
            })
		})
	}
	
	componentWillUnmount() {
		this.mounted = false;
	}

    render() {

		const users = this.state.usernames.map((username) => `${username} `)

        return (
            <>{users}</>
        )
    }
}

InlineUsers.defaultProps = {
    users: undefined,
}

export default InlineUsers;
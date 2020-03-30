import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

class Loading extends React.Component {
	render() {
		return (
			<Spinner animation="border" role="status">
			</Spinner>
		)
	}
}

export default Loading;
import React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

class Loading extends React.Component {
	render() {
		return (
			<Container>
				<Row>
					<Col></Col>
					<Col>
						<Spinner animation="border" role="status" className={"justifyContentCentre"} />
					</Col>
					<Col></Col>
				</Row>
			</Container>
		)
	}
}

export default Loading;
import React from 'react';
import Alert from 'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

class ErrorComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return(
            <Container>
                <Col>
                    <Row>
                        <Alert variant="danger" className="errorAlert">
                            <Alert.Heading>Warning - Error</Alert.Heading>
                            Error: {this.props.statusCode || `500`} - {this.props.message || `Application encounterd a critical error. Please go back to the home page`}
                        </Alert>
                    </Row>
                </Col>
            </Container>
        )
    }
}

export default ErrorComponent;
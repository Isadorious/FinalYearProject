import React from 'react';
import Error from '../Utils/Error';
import Loading from '../Utils/Loading';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class CalendarInfo extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <>
                <h2>{this.props.name}</h2>
                <hr />
                <p>{this.props.description}</p>
            </>
        )
    }

}

export default CalendarInfo;
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
        let visibility = '';
        if(this.props.visibility === 0) {
            visibility = 'Public';
        } else if(this.props.visibility === 1) {
            visibility = `Staff`;
        } else if(this.props.visibility === 2) {
            visibility = 'Admin';
        }
        return (
            <>
                <div style={{marginTop: "1.25rem", marginLeft: "1.0rem", marginRight: "1.0rem",}}>
                    <h2>{this.props.name}</h2>
                    <hr />
                    <p>{this.props.description}</p>
                    <hr />
                    <p>Visibility: {visibility}</p>
                </div>
            </>
        )
    }

}

export default CalendarInfo;
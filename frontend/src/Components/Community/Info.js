import React from 'react';
import Error from '../Utils/Error';
import Loading from '../Utils/Loading';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

class CommunityInfo extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <>
                <div style={{marginTop: "1.25rem", marginLeft: "1.0rem", marginRight: "1.0rem",}}>
                    <h2>{this.props.name}</h2>
                    <hr />
                    <p>{this.props.description}</p>
                    <hr />
                </div>
            </>
        )
    }

}

export default CommunityInfo;
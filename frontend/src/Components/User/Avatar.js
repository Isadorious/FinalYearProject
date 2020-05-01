import React from 'react';
import Image from 'react-bootstrap/Image';

class AvatarComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if(this.props.avatar === `${process.env.REACT_APP_API_URL}` || this.props.avatar === `${process.env.REACT_APP_API_URL}/undefined`) {
            return (
                <Image src={`${process.env.REACT_APP_API_URL}/uploads/default/avatar.png`} roundedCircle style={{width: this.props.size || 100, height: this.props.size || 100, backgroundColor: "white", borderStyle: "solid", borderWidth: "2px", marginTop: "10px",}} />
            )
        } else {
            return (
                <Image src={this.props.avatar} roundedCircle style={{width: this.props.size || 100, height: this.props.size || 100, backgroundColor: "white", borderStyle: "solid", borderWidth: "2px", marginTop: "10px",}} />
            )
        }

    }
}

export default AvatarComponent;
import React from 'react';
import Image from 'react-bootstrap/Image';

class AvatarComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        if(this.props.avatar === 'http://localhost:9000/' || this.props.avatar === 'http://localhost:9000/undefined') {
            return (
                <Image src='http://localhost:9000/uploads/default/avatar.png' roundedCircle style={{width: this.props.size || 100, height: this.props.size || 100, backgroundColor: "white", borderStyle: "solid", borderWidth: "2px",}} />
            )
        } else {
            return (
                <Image src={this.props.avatar} roundedCircle style={{width: this.props.size || 100, height: this.props.size || 100, backgroundColor: "white", borderStyle: "solid", borderWidth: "2px",}} />
            )
        }

    }
}

export default AvatarComponent;
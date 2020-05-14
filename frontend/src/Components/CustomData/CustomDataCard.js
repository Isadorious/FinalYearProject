import React from 'react';
import Card from 'react-bootstrap/Card';
import Axios from 'axios';
import Loading from '../Utils/Loading';
import Error from '../Utils/Error';
import { Link } from 'react-router-dom';
import ListGroup from 'react-bootstrap/ListGroup';
import InlineUsers from '../Task/InlineUsers';
import equal from 'fast-deep-equal';

class CustomDataCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: true,
            title: '',
        }

        this.handleShow = this.handleShow.bind(this);
        this.setVisibility = this.setVisibility.bind(this);
        this.setCardTitle = this.setCardTitle.bind(this)
    }

    componentDidMount() {
        this.setVisibility();
        this.setCardTitle();
    }

    componentDidUpdate(prevProps) {
        if (!equal(this.props, prevProps)) {
            this.setVisibility();
        }
    }

    setVisibility() {
    }

    handleShow() {
        if (this.props.showTask) {
            this.props.showTask(this.props.customData._id);
        }
    }

    setCardTitle() {
        const key = this.props.displayKeyPairs[0].key;
        this.setState({ title: this.customData[key] });
    }

    render() {

        if (this.state.visible === false) {
            return (<></>)
        } else {
            return (
                <Card id={this.props.customData._id} className={"infoCard"} style={{ cursor: "pointer" }} onClick={this.handleShow}>
                    <Card.Body>
                        <Card.Title style={{ textAlign: "center" }}>{this.state.title}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted" style={{ textAlign: "center" }}><InlineUsers users={new Array(this.props.customData.authorID)} /></Card.Subtitle>
                        <ListGroup variant="flush">
                            <ListGroup.Item>{new Date(this.props.task.taskDue).toLocaleDateString('en-GB')}</ListGroup.Item>
                        </ListGroup>
                    </Card.Body>
                </Card>
            )
        }
    }
}

CustomDataCard.defaultProps = {
    customData: false,
    displayKeyPairs: false,
    showData: false,
}

export default CustomDataCard;
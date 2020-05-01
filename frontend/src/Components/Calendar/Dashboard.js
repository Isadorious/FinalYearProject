import React from 'react';
import Error from '../Utils/Error';
import Axios from 'axios';
import Loading from '../Utils/Loading';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Info from './Info';

class CalendarDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            error: false,
            errorMessage: 'Unable to get calendar data',
            errorStatusCode: 500,
            name: '',
            tasks: [],
            categories: [],
            description: '',
            background: '',
            visibility: '',
            showInfoModal: false,
        }

        this.handleCalendarDelete = this.handleCalendarDelete.bind(this);
        this.handleInfoOpen = this.handleInfoOpen.bind(this);
        this.handleInfoClose = this.handleInfoClose.bind(this);
    }

    async componentDidMount() {
        document.title = "Calendar - GCOrg";

        // Load community data, check the user is logged in
        let accessString = localStorage.getItem(`JWT`);
        if (accessString === null) {
            this.setState({
                error: true,
                errorMessage: `Unable to load user details from local storage`,
                errorStatusCode: 401,
                loading: false,
            });
            return;
        }

        let uID = localStorage.getItem(`UserID`);
        if (uID === null) {
            this.setState({
                error: true,
                errorMessage: `Unable to load user details from local storage`,
                errorStatusCode: 401,
                loading: false,
            });
            return;
        }

        await Axios
            .get(`${process.env.REACT_APP_API_URL}/api/calendars/` + this.props.match.params.id, {
                headers: { Authorization: `JWT ${accessString}` }
            }).then(response => {
                let data = response.data;

                document.title = `${data.calendarName} - GCOrg`;
                this.setState({
                    name: data.calendarName,
                    description: data.description,
                    background: data.background,
                    categories: data.categories,
                    tasks: data.tasks,
                    loading: false,
                });
            }).catch(error => {
                if (error.response !== undefined) {
                    this.setState({
                        error: true,
                        errorMessage: `Unable to retrieve calendar data`,
                        loading: false,
                    });
                } else {
                    this.setState({
                        error: true,
                        errorMessage: `Unable to retrieve calendar data`,
                        loading: false,
                    });
                }
            })
    }

    async handleCalendarDelete() {
        let accessString = localStorage.getItem(`JWT`);
        if (accessString === null) {
            this.setState({
                error: true,
                errorMessage: `Unable to load user details from local storage`,
                errorStatusCode: 401,
                loading: false,
            });
            return;
        }

        let uID = localStorage.getItem(`UserID`);
        if (uID === null) {
            this.setState({
                error: true,
                errorMessage: `Unable to load user details from local storage`,
                errorStatusCode: 401,
                loading: false,
            });
            return;
        }

        await Axios
            .delete(`${process.env.REACT_APP_API_URL}/api/calendars/${this.props.match.params.id}`, {
                headers: { Authorization: `JWT ${accessString}` }
            }).then((response) => {
                console.log(response.status);
                console.log(response.data);
                if (response.status == 401) {
                    this.setState({
                        error: true,
                        errorMessage: `Unable to delete calendar`,
                        loading: false,
                    });
                } else if (response.status == 200) {
                    this.props.history.push(`/`);
                }
            }).catch((error) => {
                this.setState({
                    error: true,
                    errorMessage: `Unable to delete calendar`,
                    loading: false,
                });
            })
    }

    handleInfoOpen() {
        this.setState({showInfoModal: true});
    }

    handleInfoClose() {
        this.setState({showInfoModal: false});
    }

    render() {
        if (this.state.loading === true) {
            return (<Loading />)
        } else if (this.state.error === true) {
            return (<Error statusCode={this.state.errorStatusCode} message={this.state.errorMessage} />)
        } else {
            let buttons;
            if (this.props.userPermission === 3) {
                buttons =
                    <>
                        <Button id="calendarInfo" className={"dashboardButton"} onClick={this.handleInfoOpen}>Calendar Info</Button>
                        <Button id="editCalendar" className={"dashboardButton"}>Edit Calendar</Button>
                        <Button id="createTask" className={"dashboardButton"}>Create Task</Button>
                        <Button id="deleteCalendar" className={"dashboardButton float-right"} variant={"danger"} onClick={this.handleCalendarDelete}>Delete Calendar</Button>
                    </>
            }

            if (this.props.userPermission === 2) {
                buttons =
                    <>
                        <Button id="calendarInfo" className={"dashboardButton"} onClick={this.handleInfoOpen}>Calendar Info</Button>
                        <Button id="editCalendar" className={"dashboardButton"}>Edit Calendar</Button>
                        <Button id="createTask" className={"dashboardButton"}>Create Task</Button>
                    </>
            }

            if (this.props.userPermission == 1) {
                buttons =
                    <>
                        <Button id="calendarInfo" className={"dashboardButton"} onClick={this.handleInfoOpen}>Calendar Info</Button>
                        <Button id="createTask" className={"dashboardButton"}>Create Task</Button>
                    </>
            }

            if (this.props.userPermission == 0) {
                buttons =
                    <>
                        <Button id="calendarInfo" className={"dashboardButton"} onClick={this.handleInfoOpen}>Calendar Info</Button>
                    </>
            }

            let cards = <></>

            if (this.state.tasks.length > 0) {
                cards = this.state.tasks.map((task) =>
                    <Row key={task._id} >
                    </Row>
                );
            }

            return (
                <Container>
                    <Modal show={this.state.showInfoModal} onHide={this.handleInfoClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Calendar Info</Modal.Title>
                        </Modal.Header>
                        <Info name={this.state.name} description={this.state.description} />
                    </Modal>
                    <Row>
                        <Col>
                            {buttons}
                        </Col>
                    </Row>
                    {cards}
                </Container>
            )

        }
    }

}

CalendarDashboard.defaultProps = {
    userPermission: 0,
}

export default CalendarDashboard;
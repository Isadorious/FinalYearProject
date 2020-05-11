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
import CreateTask from '../Task/CreateTask';
import TaskCard from '../Task/TaskCard';
import ViewEditTask from '../Task/ViewEditTask';
import CategoryManager from '../Category/CategoryManager';
import EditCalendar from './EditCalendar';
import CardColumns from 'react-bootstrap/CardColumns';
import Form from 'react-bootstrap/Form';

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
            userPermission: 0,
            communityStaffID: [],
            communityAdminsID: [],
            ownerID: [],
            showCreateModal: false,
            showTaskModal: false,
            shownTaskID: '',
            showCategoryManager: false,
            showEditModal: false,
            hideCompletedTasks: true,
            onlyAssigned: false,
            filterCategories: false,
            categoryToFilter: '',
        }

        this.handleCalendarDelete = this.handleCalendarDelete.bind(this);
        this.handleInfoOpen = this.handleInfoOpen.bind(this);
        this.handleInfoClose = this.handleInfoClose.bind(this);
        this.handleCreateOpen = this.handleCreateOpen.bind(this);
        this.handleCreateClose = this.handleCreateClose.bind(this);
        this.handleShowTask = this.handleShowTask.bind(this);
        this.handleHideTask = this.handleHideTask.bind(this);
        this.handleCategoriesUpdate = this.handleCategoriesUpdate.bind(this);
        this.handleCategoryManagerOpen = this.handleCategoryManagerOpen.bind(this);
        this.handleCategoryManagerClose = this.handleCategoryManagerClose.bind(this);
        this.handleEditOpen = this.handleEditOpen.bind(this);
        this.handleEditClose = this.handleEditClose.bind(this);
        this.fetchTasks = this.fetchTasks.bind(this);
        this.handleSwitchChange = this.handleSwitchChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.createTaskOnComplete = this.createTaskOnComplete.bind(this);
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


                if(Array.isArray(data.tasks)) {
                    data.tasks.sort((a,b)=>new Date(a.taskDue).getTime() - new Date(b.taskDue).getTime());
                }

                document.title = `${data.calendarName} - GCOrg`;
                this.setState({
                    name: data.calendarName,
                    description: data.description,
                    background: data.background,
                    categories: data.categories,
                    tasks: data.tasks,
                    userPermission: data.permission,
                    communityStaffID: data.communityStaffID,
                    communityAdminsID: data.communityAdminsID,
                    ownerID: data.ownerID,
                    loading: false,
                    visbility: data.visibility,
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
        this.setState({ showInfoModal: true });
    }

    handleInfoClose() {
        this.setState({ showInfoModal: false });
    }

    handleCreateOpen() {
        this.setState({ showCreateModal: true });
    }

    handleCreateClose() {
        this.setState({ showCreateModal: false });
    }

    handleShowTask(id) {
        this.setState({ shownTaskID: id, showTaskModal: true });
    }

    handleHideTask() {
        this.setState({ showTaskModal: false });
    }

    handleCategoriesUpdate(categories) {
        this.state.categories = categories;
    }

    handleCategoryManagerOpen() {
        this.setState({ showCategoryManager: true });
    }

    handleCategoryManagerClose() {
        this.setState({ showCategoryManager: false });
    }

    handleEditOpen() {
        this.setState({ showEditModal: true });
    }

    handleEditClose() {
        this.setState({ showEditModal: false });
    }

    async fetchTasks() {
        let accessString = localStorage.getItem(`JWT`);
        await Axios
            .get(`${process.env.REACT_APP_API_URL}/calendars/${this.props.match.params.id}/tasks`, {
                headers: { Authorization: `JWT ${accessString}` }
            })
            .then((response) => {
                let data = response.data;
                if(Array.isArray(data)) {
                    data.sort((a,b)=>new Date(a.taskDue).getTime() - new Date(b.taskDue).getTime());
                }
                this.setState({ tasks: data});
            }).catch((error) => {
                this.setState({ error: true, errorStatusCode: 500, errorMessage: `Unable to fetch tasks` });
            })
    }

	handleSwitchChange(event) {
		const target = event.target;
		const checked = target.checked;
		const name = target.name;

		this.setState({[name]: checked });
    }
    
    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        
        this.setState({
            [name] : value
        });
    }
    
    async createTaskOnComplete() {
        await this.fetchTasks();
        this.handleHideTask();
    }

    render() {
        if (this.state.loading === true) {
            return (<Loading />)
        } else if (this.state.error === true) {
            return (<Error statusCode={this.state.errorStatusCode} message={this.state.errorMessage} />)
        } else {
            let buttons;
            if (this.state.userPermission === 3) {
                buttons =
                    <>
                        <Button id="calendarInfo" className={"dashboardButton"} variant="info" onClick={this.handleInfoOpen}>Calendar Info</Button>
                        <Button id="editCalendar" className={"dashboardButton"} onClick={this.handleEditOpen}>Edit Calendar</Button>
                        <Button id="createTask" className={"dashboardButton"} onClick={this.handleCreateOpen}>Create Task</Button>
                        <Button id="manageCategories" className={"dashboardButton"} onClick={this.handleCategoryManagerOpen}>Manage Categories</Button>
                        <Button id="deleteCalendar" className={"dashboardButton float-right"} variant={"danger"} onClick={this.handleCalendarDelete}>Delete Calendar</Button>
                    </>
            }

            if (this.state.userPermission === 2) {
                buttons =
                    <>
                        <Button id="calendarInfo" className={"dashboardButton"} variant="info" onClick={this.handleInfoOpen}>Calendar Info</Button>
                        <Button id="editCalendar" className={"dashboardButton"} onClick={this.handleEditOpen}>Edit Calendar</Button>
                        <Button id="createTask" className={"dashboardButton"} onClick={this.handleCreateOpen}>Create Task</Button>
                        <Button id="manageCategories" className={"dashboardButton"} onClick={this.handleCategoryManagerOpen}>Manage Categories</Button>
                    </>
            }

            if (this.state.userPermission == 1) {
                buttons =
                    <>
                        <Button id="calendarInfo" className={"dashboardButton"} variant="info" onClick={this.handleInfoOpen}>Calendar Info</Button>
                        <Button id="createTask" className={"dashboardButton"} onClick={this.handleCreateOpen}>Create Task</Button>
                    </>
            }

            if (this.props.userPermission == 0) {
                buttons =
                    <>
                        <Button id="calendarInfo" className={"dashboardButton"} variant="info" onClick={this.handleInfoOpen}>Calendar Info</Button>
                    </>
            }

            let cards = <></>

            if (this.state.tasks.length > 0) {
                cards = this.state.tasks.map((task) =>
                    <TaskCard key={task._id} task={task} showTask={this.handleShowTask} hideComplete={this.state.hideCompletedTasks} onlyAssigned={this.state.onlyAssigned} categories={this.state.categories} filterCategories={this.state.filterCategories} categoryToFilter={this.state.categoryToFilter}/>
                );
            }

            let cardColumn = <CardColumns>{cards}</CardColumns>

            let select = <></>

            if(this.state.categories.length > 0) {
                select = this.state.categories.map((category) => 
                    <option key={category._id}>{category.categoryName}</option>  
                );
            }

            return (
                <Container>
                    <Modal show={this.state.showInfoModal} onHide={this.handleInfoClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Calendar Info</Modal.Title>
                        </Modal.Header>
                        <Info name={this.state.name} description={this.state.description} visibility={this.state.visibility} />
                    </Modal>
                    <Modal show={this.state.showCreateModal} onHide={this.handleCreateClose} size="lg">
                        <Modal.Header closeButton>
                            <Modal.Title>Create Task</Modal.Title>
                        </Modal.Header>
                        <CreateTask OwnerID={this.state.ownerID} StaffID={this.state.communityStaffID} AdminID={this.state.communityAdminsID} onCancel={this.handleCreateClose} calendarID={this.props.match.params.id} categories={this.state.categories} onComplete={this.createTaskOnComplete} />
                    </Modal>
                    <Modal show={this.state.showTaskModal} onHide={this.handleHideTask} size="lg">
                        <Modal.Header closeButton />
                        <ViewEditTask OwnerID={this.state.ownerID} StaffID={this.state.communityStaffID} AdminID={this.state.communityAdminsID} calendarID={this.props.match.params.id} id={this.state.shownTaskID} userPermission={this.state.userPermission} categories={this.state.categories} />
                    </Modal>
                    <Modal show={this.state.showCategoryManager} onHide={this.handleCategoryManagerClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Category Manager</Modal.Title>
                        </Modal.Header>
                        <CategoryManager categories={this.state.categories} updateCategories={this.handleCategoriesUpdate} calendarID={this.props.match.params.id} />
                    </Modal>
                    <Modal show={this.state.showEditModal} onHide={this.handleEditClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Calendar</Modal.Title>
                        </Modal.Header>
                        <EditCalendar calendarID={this.props.match.params.id} />
                    </Modal>
                    <Row>
                        <Col>
                            {buttons}
                        </Col>
                    </Row>
                    <Form>
                        <Form.Row>
                            <Form.Group as={Col} controlId="hideCompleteControl"><Form.Check type="switch" name="hideCompletedTasks" label="Hide completed tasks?" onChange={this.handleSwitchChange} checked={this.state.hideCompletedTasks} /></Form.Group>
                            <Form.Group as={Col} controlId="onlyAssignedTasksControl"><Form.Check type="switch" name="onlyAssigned" label="Only show my tasks?" onChange={this.handleSwitchChange} checked={this.state.onlyAssigned} /></Form.Group>
                            <Form.Group as={Col} controlId="filterCategoriesControl"><Form.Check type="switch" name="filterCategories" label="Filter by category?" onChange={this.handleSwitchChange} checked={this.state.filterCategories} /></Form.Group>
                            <Form.Group as={Col} controlId="categorySelect"><Form.Control as="select" custom disabled={!this.state.filterCategories} onChange={this.handleInputChange} name="categoryToFilter">{select}</Form.Control></Form.Group>
                        </Form.Row>
                    </Form>
                    {cardColumn}
                </Container>
            )

        }
    }

}

export default CalendarDashboard;
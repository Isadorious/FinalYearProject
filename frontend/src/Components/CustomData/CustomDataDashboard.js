import React from 'react';
import Error from '../Utils/Error';
import Axios from 'axios';
import Loading from '../Utils/Loading';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import CardColumns from 'react-bootstrap/CardColumns';
import Form from 'react-bootstrap/Form';
import CustomDataCard from './CustomDataCard';
import CreateCustomData from './AddCustomData';

class CustomDataDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            error: false,
            errorMessage: 'Unable to get custom data',
            errorStatusCode: 500,
            name: '',
            customData: [],
            customStructure: {},
            userPermission: 0,
            showCreateModal: false,
            showDataModal: false,
            shownDataID: '',
        }

        this.fetchCustomData = this.fetchCustomData.bind(this);
        this.handleStructureDelete = this.handleStructureDelete.bind(this);
        this.handleCreateOpen = this.handleCreateOpen.bind(this);
        this.handleCreateClose = this.handleCreateClose.bind(this);
        this.handleShowData = this.handleShowData.bind(this);
        this.handleHideData = this.handleHideData.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.createDataOnComplete = this.createDataOnComplete.bind(this);
    }

    async componentDidMount() {
        // Load custom data, check the user is logged in
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
            .get(`${process.env.REACT_APP_API_URL}/api/communities/${this.props.match.params.communityID}?permission`, {
                headers: { Authorization: `JWT ${accessString}` }
            }).then(response => {
                let data = response.data;
                this.setState({
                    userPermission: data.permission,
                });
            }).catch(error => {
                this.setState({
                    error: true,
                    errorMessage: `Unable to retrieve permission`,
                    loading: false,
                });
            });

        await Axios
            .get(`${process.env.REACT_APP_API_URL}/api/communities/${this.props.match.params.communityID}/structures/${this.props.match.params.structureID}`, {
                headers: { Authorization: `JWT ${accessString}` }
            }).then(response => {
                let data = response.data;
                this.setState({
                    customStructure: data,
                    loading: false,
                });
            }).catch(error => {
                this.setState({
                    error: true,
                    errorMessage: `Unable to retrieve structure data`,
                    loading: false,
                });
            });

        await this.fetchCustomData();
    }

    async fetchCustomData() {
        let accessString = localStorage.getItem(`JWT`);
        await Axios
            .get(`${process.env.REACT_APP_API_URL}/api/customData/${this.props.match.params.communityID}/structure/${this.props.match.params.structureID}`, {
                headers: { Authorization: `JWT ${accessString}` }
            })
            .then((response) => {
                let data = response.data;
                if (Array.isArray(data)) {
                    data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
                }
                this.setState({ customData: data });
            }).catch((error) => {
                this.setState({ error: true, errorStatusCode: 500, errorMessage: `Unable to fetch data` });
            })
    }

    async handleStructureDelete() {
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
            .delete(`${process.env.REACT_APP_API_URL}/api/community/${this.props.match.params.communityID}/structures/${this.props.match.params.structureID}`, {
                headers: { Authorization: `JWT ${accessString}` }
            }).then((response) => {
                console.log(response.status);
                console.log(response.data);
                if (response.status == 401) {
                    this.setState({
                        error: true,
                        errorMessage: `Unable to delete custom structure`,
                        loading: false,
                    });
                } else if (response.status == 200) {
                    this.props.history.push(`/`);
                }
            }).catch((error) => {
                this.setState({
                    error: true,
                    errorMessage: `Unable to delete structure`,
                    loading: false,
                });
            })
    }

    handleCreateOpen() {
        this.setState({ showCreateModal: true });
    }

    handleCreateClose() {
        this.setState({ showCreateModal: false });
    }

    handleShowData(id) {
        this.setState({ shownDataID: id, showDataModal: true });
    }

    handleHideData() {
        this.setState({ showDataModal: false });
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    async createDataOnComplete() {
        await this.fetchCustomData();
        this.handleCreateClose();
    }

    render() {
        if (this.state.loading === true) {
            return (<Loading />)
        } else if (this.state.error === true) {
            return (<Error statusCode={this.state.errorStatusCode} message={this.state.errorMessage} />)
        } else if (this.state.userPermission >= 1) {
            let buttons;
            if (this.state.userPermission === 3) {
                buttons =
                    <>
                        <Button id="createEntry" className={"dashboardButton"} onClick={this.handleCreateOpen}>Create entry</Button>
                        <Button id="deleteStructure" className={"dashboardButton float-right"} variant={"danger"} onClick={this.handleStructureDelete}>Delete Structure</Button>
                    </>
            }

            if (this.state.userPermission === 2) {
                buttons =
                    <>
                        <Button id="createEntry" className={"dashboardButton"} onClick={this.handleCreateOpen}>Create entry</Button>
                    </>
            }

            if (this.state.userPermission == 1) {
                buttons =
                    <>
                        <Button id="createEntry" className={"dashboardButton"} onClick={this.handleCreateOpen}>Create entry</Button>
                    </>
            }

            let cards = <></>

            if (this.state.customData.length > 0) {
                cards = this.state.customData.map((customData) =>
                    <CustomDataCard key={customData._id} customData={customData} displayKeyPairs={this.state.customStructure.DisplayKeyPairs} showData={this.handleShowData} />
                );
            }

            return (
                <Container>
                    <Modal show={this.state.showCreateModal} onHide={this.handleCreateClose} size="lg">
                        <Modal.Header closeButton>
                            <Modal.Title>Create entry</Modal.Title>
                        </Modal.Header>
                        <CreateCustomData communityID={this.props.match.params.communityID} onComplete={this.createDataOnComplete} onCancel={this.handleCreateClose} structure={this.state.customStructure} />
                    </Modal>
                    <Modal show={this.state.showDataModal} onHide={this.handleHideData} size="lg">
                        <Modal.Header closeButton />
                    </Modal>
                    <Row>
                        <Col>
                            {buttons}
                        </Col>
                    </Row>
                    {cards}
                </Container>
            )

        } else {
            return (<Error statusCode={401} message={"Unauthorized"} />)
        }
    }

}

//

export default CustomDataDashboard;
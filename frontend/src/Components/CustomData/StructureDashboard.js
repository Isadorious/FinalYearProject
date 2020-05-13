import React from 'react';
import Error from '../Utils/Error';
import Axios from 'axios';
import Loading from '../Utils/Loading';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import StructureCard from './StructureCard';
import CreateStructure from './CreateStructure';

class CustomStructureDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            error: false,
            errorMessage: 'Unable to get structure data',
            errorStatusCode: 500,
            hasFetched: false,
            dataStructures: [],
            showCreateModal: false,
        }

        this.fetchStructures = this.fetchStructures.bind(this);
        this.handleStructureCreate = this.handleStructureCreate.bind(this);
        this.handleCreateOpen = this.handleCreateOpen.bind(this);
        this.handleCreateClose = this.handleCreateClose.bind(this);
    }

    async componentDidMount() {
        // Load custom data structures, check the user is logged in
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

        await this.fetchStructures();
    }

    async componentDidUpdate() {
        if (this.state.dataStructures.length <= 0 && this.state.hasFetched === false) {
            await this.fetchStructures();
        }
    }

    async fetchStructures() {
        this.setState({ hasFetched: true }); // Stops API spam when community has 0 custom structures

        let accessString = localStorage.getItem(`JWT`);
        if (accessString === null) {
            this.setState({
                error: true,
                errorMessage: `Unable to load user details from local storage`,
                errorStatusCode: 401,
            });
            return;
        }

        let uID = localStorage.getItem(`UserID`);
        if (uID === null) {
            this.setState({
                error: true,
                errorMessage: `Unable to load user details from local storage`,
                errorStatusCode: 401,
            });
            return;
        }

        await Axios
            .get(`${process.env.REACT_APP_API_URL}/api/communities/${this.props.communityID}/structures`, {
                headers: { Authorization: `JWT ${accessString}` }
            }).then(response => {
                let data = response.data;
                this.setState({
                    dataStructures: data,
                    loading: false,
                });
            }).catch(error => {
                this.setState({
                    error: true,
                    errorMessage: `Unable to retrieve community data`,
                    loading: false,
                });
            })
    }

    async handleStructureCreate() {
        this.handleCreateClose();
        await this.fetchStructures();
    }

    handleCreateOpen() {
        this.setState({ showCreateModal: true });
    }

    handleCreateClose() {
        this.setState({ showCreateModal: false });
    }

    render() {
        if (this.state.loading === true) {
            return (<Loading />)
        } else if (this.state.error === true) {
            return (<Error statusCode={this.state.errorStatusCode} message={this.state.errorMessage} />)
        } else {
            let buttons;
            if (this.props.userPermission >= 2) {
                buttons =
                    <>
                        <Button id="createStructureButton" className={"float-right"} onClick={this.handleCreateOpen}>Create Structure</Button>
                    </>
            }

            let cards = <></>

            if (this.state.dataStructures.length > 0) {
                cards = this.state.dataStructures.map((dataStructure) =>
                    <Row key={dataStructure._id} >
                        <StructureCard structureID={dataStructure._id} communityID={this.props.communityID} />
                    </Row>
                );
            }

            return (
                <Container>
                    <Modal show={this.state.showCreateModal} onHide={this.handleCreateClose}>
                        <Modal.Header closeButton>
                            <Modal.Title>Create Custom Structure</Modal.Title>
                        </Modal.Header>
                        <CreateStructure communityID={this.props.communityID} onComplete={this.handleStructureCreate} onCancel={this.handleCreateClose} />
                    </Modal>
                    <hr />
                    <Row>
                        <Col>
                            <h2>Custom Data</h2>
                        </Col>
                        <Col>
                            {buttons}
                        </Col>
                    </Row>
                    <hr />
                    {cards}
                </Container>
            )

        }
    }

}

CustomStructureDashboard.defaultProps = {
    communityID: false,
    userPermission: false,
}

export default CustomStructureDashboard;
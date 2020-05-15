import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import CustomDataFieldViewEdit from './CustomDataFieldViewEdit';
import Error from '../Utils/Error';

class CustomDataViewEditForm extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            customData: {},
            editMode: false,
            authorID: '',
            creationDate: '',
            loading: true,
            error: false,
            errorMessage: `Unable to retrieve data`,
            hideButton: true,
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.updateData = this.updateData.bind(this);
        this.toggleEditMode = this.toggleEditMode.bind(this)
    }

    async componentDidMount() {
        let accessString = localStorage.getItem(`JWT`);

        await Axios
            .get(`${process.env.REACT_APP_API_URL}/api/customData/${this.props.communityID}/structure/${this.props.structure._id}/data/${this.props.dataID}`, {
                headers: { Authorization: `JWT ${accessString}` }
            }).then((response) => {
                let data = response.data;

                this.setState({
                    creationDate: new Date(data.date),
                    authorID: data.authorID,
                    customData: data.content,
                    loading: false,
                });

                if (this.props.userPermission > 0) {
                    this.setState({ hideButton: false });
                }
            }).catch((error) => {
                if (error.response !== undefined) {
                    this.setState({
                        error: true,
                        errorMessage: `Unable to retrieve data`,
                        loading: false,
                    });
                } else {
                    this.setState({
                        error: true,
                        errorMessage: `Unable to retrieve data`,
                        loading: false,
                    });
                }
            })
    }

    handleInputChange(event) {
        // N.B. This is different to other input change methods used. This only sets the state of properties of the data object
        const target = event.target;
        const value = target.value;
        const name = target.name;
        let customData = this.state.customData;
        customData[name] = value;
        this.setState({
            customData: customData
        });
    }

    async updateData() {
        let accessString = localStorage.getItem(`JWT`);

        const data = {
            content: this.state.customData,
        }

        await Axios
            .put(`${process.env.REACT_APP_API_URL}/api/customData`, data, {
                headers: { Authorization: `JWT ${accessString}` }
            })
            .then((response) => {
                let data = response.data;
                console.log(data.message);
                if (data.message == "CustomData updated successfully!") {
                    alert(`Data updated!`)
                } else {
                    console.log(`then if failed`);
                    console.log(response.data);
                    this.setState({ error: true, errorMessage: response.data });
                }
            }).catch((error) => {
                console.log(error);
                this.setState({ error: true, errorMessage: error.data });
            });

    }

    toggleEditMode() {
        this.setState({ editMode: !this.state.editMode });
    }

    render() {
        let fields = this.props.structure.DisplayKeyPairs.map((pair, index) =>
            <CustomDataFieldViewEdit key={index} keyValuePair={pair} handleInputChange={this.handleInputChange} data={this.state.customData} editMode={this.state.editMode} />
        );

        if (this.state.editMode) {
            return (
                <Container fluid>
                    {!this.state.hideButton && <Row><Col><Button className={"dashboardButton float-right"} onClick={this.toggleEditMode}>Toggle Edit Mode</Button></Col></Row>}
                    <Form id="modifyCustomData" className={"modalForm"}>
                        {fields}
                        <Button variant="success" className={"float-right dashboardButton"} onClick={this.updateData}>Update</Button>
                    </Form>
                </Container>
            )
        }
        else {
            return (
                <Container fluid>
                    {!this.state.hideButton && <Row><Col><Button className={"dashboardButton float-right"} onClick={this.toggleEditMode}>Toggle Edit Mode</Button></Col></Row>}
                    <Form id="modifyCustomData" className={"modalForm"}>
                        {fields}
                    </Form>
                </Container>
            )
        }
    }
}

CustomDataViewEditForm.defaultProps = {
    communityID: false,
    structure: false,
    dataID: false,
    userPermission: 0,
}

export default CustomDataViewEditForm;
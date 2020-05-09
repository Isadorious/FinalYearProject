import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';

class ViewEditCategory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editMode: false,
            categoryName: '',
        }
        this.toggleEditMode = this.toggleEditMode.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
    }

    componentDidMount() {
        this.setState({ categoryName: this.props.categoryName});
    }

    handleInputChange(event) {
		const target = event.target;
		const value = target.value;
		const name = target.name;

		this.setState({
			[name]: value
		});
	}

    toggleEditMode() {
        this.setState({ editMode: !this.state.editMode });
    }

    handleSave() {
        this.props.editCategory(this.state.categoryName, this.props.index);
    }

    handleRemove() { 
        this.props.removeCategory(this.props.index);
    }

    render() {
        if (this.state.editMode) {
            return (
                <Container fluid>
                    <Form.Row>
                        <Form.Group as={Col} controlId="categoryNameControl">
                            <Form.Control name="categoryName" type="text" placeholder="Category Name" value={this.state.categoryName} onChange={this.handleInputChange} />
                        </Form.Group>
                        <Form.Group as={Col} controlId="saveControl">
                            <Button className={"float-right"} variant="success" onClick={this.handleSave}>Save</Button>
                        </Form.Group>
                        <Form.Group as={Col} controlId="removeControl">
                            <Button className={"float-right"} variant="danger" onClick={this.handleRemove}>Delete</Button>
                        </Form.Group>
                    </Form.Row>
                </Container>
            )
        } else {
            return (
                <Container fluid>
                    <Form.Row>
                        <Form.Group as={Col} controlId="categoryNameControl">
                            <p>{this.props.category.categoryName}</p>
                        </Form.Group>
                        <Form.Group as={Col} controlId="emptyCol">
                        </Form.Group>
                        <Form.Group as={Col} controlId="editControl">
                            <Button className={"float-right"} variant="primary" onClick={this.toggleEditMode}>Edit</Button>
                        </Form.Group>
                    </Form.Row>
                </Container>
            )
        }
    }
}

ViewEditCategory.defaultProps = {
    category: false,
    index: false,
    editCategory: false,
    removeCategory: false,
}

export default ViewEditCategory
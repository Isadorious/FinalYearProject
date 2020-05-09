import React from 'react';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import ViewEditCategory from './ViewEditCategory';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Axios from 'axios';

class CategoryManager extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            categoryName: '',
            alertShown: false,
            alertMessage: '',
            alertVariant: '',
        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.addCategory = this.addCategory.bind(this);
        this.updateCategory = this.updateCategory.bind(this);
        this.removeCategory = this.removeCategory.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        this.setState({
            [name]: value
        });
    }

    addCategory() {
        let accessString = localStorage.getItem(`JWT`);

        let data = {
            categoryName: this.state.categoryName,
        }

        Axios
            .post(`${process.env.REACT_APP_API_URL}/api/calendars/${this.props.calendarID}/categories`, data, {
                headers: { Authorization: `JWT ${accessString}` }
            }).then((response) => {
                if (response.data.message === `Category added successfully!`) {
                    let category = response.data.category;
                    let categories = this.props.categories;
                    categories.push(category);
                    this.props.updateCategories(categories);
                    this.setState({ alertVariant: "success", alertShown: true, alertMessage: `Category added` });
                }
            }).catch((error) => {
                this.setState({ alertVariant: "error", alertShown: true, alertMessage: 'Unable to add category' });
            })
    }

    updateCategory(categoryName, index) {
        let accessString = localStorage.getItem(`JWT`);
        let category = this.props.categories[index];
        category.categoryName = categoryName;

        Axios.put(`${process.env.REACT_APP_API_URL}/api/calendars/${this.props.calendarID}/categories/${category._id}`, category, {
            headers: { Authorization: `JWT ${accessString}` }
        }).then(response => {
            if (response.data.message === `Category updated successfully!`) {
                let categories = this.props.categories;
                categories[index] = category;
                this.props.updateCategories(categories);
                this.setState({ alertVariant: "success", alertShown: true, alertMessage: `Category updated` });
            }
        }).catch((error) => {
            this.setState({ alertVariant: "error", alertShown: true, alertMessage: 'Unable to update category' });
        })
    }

    removeCategory(index) {
        let category = this.props.categories[index];
        let accessString = localStorage.getItem(`JWT`);

        Axios
            .delete(`${process.env.REACT_APP_API_URL}/api/calendars/${this.props.calendarID}/categories/${category._id}`, {
                headers: { Authorization: `JWT ${accessString}` },
            }).then((response) => {
                if(response.data.message === `Category successfully deleted!`) {
                    let categories = this.props.categories;
                    categories.splice(index, 1);
                    this.props.updateCategories(categories);
                    this.setState({alertVariant: "success", alertShown: true, alertMessage: `Category deleted`});
                }
            }).catch((error) => {
                this.setState({ alertVariant: "error", alertShown: true, alertMessage: 'Unable to delete category' });
            })
    }

    render() {
        const categories = this.props.categories.map((category, index) =>
            <React.Fragment key={category._id}><ViewEditCategory category={category} index={index} editCategory={this.updateCategory} removeCategory={this.removeCategory} /><hr /></React.Fragment>
        );
        return (
            <Form id="categoryManager" className={"modalForm"}>
                <Alert variant={this.state.alertVariant} show={this.state.alertShown}>
                    {this.state.alertMessage}
                </Alert>
                <Form.Row>
                    <Form.Group as={Col}>
                        <Form.Label>Add Category</Form.Label>
                        <Form.Control name="categoryName" type="text" placeholder="Category Name" value={this.state.categoryName} onChange={this.handleInputChange} />
                    </Form.Group>
                    <Form.Group as={Col}>
                        <Button onClick={this.addCategory}>Add Category</Button>
                    </Form.Group>
                </Form.Row>
                <hr />
                {categories}
            </Form>
        )
    }
}

CategoryManager.defaultProps = {
    categories: false,
    updateCategories: false,
    calendarID: false,
}

export default CategoryManager;
import React from 'react';
import Loading from '../Utils/Loading';
import Error from '../Utils/Error';
import Axios from 'axios';
import ReactSuperSelect from 'react-super-select';

class CategorySelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataSource: [],
            initialSelection: [],
            loading: true,
            error: false,
            errorMessage: 'Unable to get categories',
            errorStatus: 500,
        }

        this.handleSelectionChanged = this.handleSelectionChanged.bind(this);
        this.generateDataSource = this.generateDataSource.bind(this);
        this.generateInitialData = this.generateInitialData.bind(this);
    }

    handleSelectionChanged(option) {
        if (option !== undefined) {
            this.props.updateCategory(option.id);
        }
    }

    componentDidMount() {
        this.generateDataSource();

        if (this.props.initialCategory) {
            this.generateInitialData();
        }
    }

    generateDataSource() {
        let categoryOptions = [];

        this.props.categories.forEach((category) => {
            let dataItem = {
                "id": category._id,
                "name": category.categoryName,
                "size": "Medium",
            }

            categoryOptions.push(dataItem);
        });

        this.setState({ dataSource: categoryOptions, loading: this.props.initialCategory ? true : false });
    }

    generateInitialData() {
        const category = this.props.categories.find(element => element._id == this.props.initialCategory);
        const option = {
            "id": category._id,
            "name": category.categoryName,
            "size": "Medium",
        };

        this.setState({ initialSelection: option, loading: false });
    }

    render() {
        if (this.state.loading === true) {
            return (<Loading />)
        } else {
            return (
                <ReactSuperSelect onChange={this.handleSelectionChanged} dataSource={this.state.dataSource} disabled={this.props.disabled} initialValue={this.props.initialCategory ? this.state.initialSelection : null} placeholder="Category" />
            )
        }
    }
}

CategorySelect.defaultProps = {
    categories: false,
    initialCategory: false,
}

export default CategorySelect;
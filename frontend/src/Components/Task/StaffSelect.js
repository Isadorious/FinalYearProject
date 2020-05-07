import React from 'react';
import Loading from '../Utils/Loading';
import Error from '../Utils/Error';
import Axios from 'axios';
import ReactSuperSelect from 'react-super-select';

class StaffSelect extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			initialSelection: [],
            loading: true,
            error: false,
            errorMessage: 'Unable to get staff',
            errorStatus: 500,
		}

		this.handleSelectionChanged = this.handleSelectionChanged.bind(this);
		this.generateDataSource = this.generateDataSource.bind(this);
	}

	handleSelectionChanged(options) {
		let selectedStaff = [];

		if(options !== undefined) {
			options.map((option) =>{
				selectedStaff.push(option.id);
			});
		}

		this.props.updateSelectedStaff(selectedStaff);
	}

	componentDidMount() {
		this.generateDataSource();

		if(this.props.initialStaffID) {
			let selection = [];
			this.props.initialStaffID.map((id) => {
				const option = this.state.dataSource.find((option => option.id == id));
			});

			this.setState({initialSelection: selection});
		}
	}

	generateDataSource() {
		let staffIDs = [];
		let staffData = [];

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

		if(this.props.ownerID !== undefined) {
			staffIDs.push(this.props.ownerID);
		}

		if(this.props.AdminID !== undefined) {
			staffIDs = staffIDs.concat(this.props.AdminID);
		}

		if(this.props.StaffID !== undefined) {
			staffIDs = staffIDs.concat(this.props.StaffID);
		}

		staffIDs.forEach((staffID) => {
			Axios
			.get(`${process.env.REACT_APP_API_URL}/api/users/` + staffID, {
				headers: { Authorization: `JWT ${accessString}` }
			})
			.then(response => {
				let data = response.data;
				if (data.message === "Found user successfully!") {
					let dataItem = {
						"id": data.user._id,
						"name": data.user.username,
						"size": "Medium",
					}
					staffData.push(dataItem);
				}
			});
		});

		this.setState({dataSource: staffData, loading: false});
	}
	
	render() {
		if(this.state.loading === true) {
			return (<Loading />)
		} else {
			return(
				<ReactSuperSelect multiple={true} onChange={this.handleSelectionChanged} dataSource={this.state.dataSource} keepOpenOnSelection={true} disabled={this.props.disabled} />
			)
		} 
	}
}

StaffSelect.defaultProps = {
	ownerID: undefined,
	StaffID: undefined,
	AdminID: undefined,
	updateSelectedStaff: undefined,
	initialStaffID: false,
}

export default StaffSelect;
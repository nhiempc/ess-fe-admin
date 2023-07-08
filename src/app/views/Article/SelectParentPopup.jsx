import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Grid,
	Paper,
	Radio, TextField
} from "@material-ui/core";
import MaterialTable from "material-table";
import React from "react";
import Draggable from "react-draggable";
import NicePagination from "../Component/Pagination/NicePagination";


function PaperComponent(props) {
	return (
		<Draggable
			handle="#draggable-dialog-title"
			cancel={'[class*="MuiDialogContent-root"]'}
		>
			<Paper {...props} />
		</Draggable>
	);
}

class SelectParentPopup extends React.Component {
	constructor(props) {
		super(props);
		this.handleChange = this.handleChange.bind(this);
	}

	state = {
		rowsPerPage: 5,
		page: 0,
		totalElements: 0,
		totalPage: 0,
		itemList: [],
		shouldOpenEditorDialog: false,
		shouldOpenConfirmationDialog: false,
		selectedItem: {},
		keyword: "",
		shouldOpenProductDialog: false,
		item: null,
		loading: true,
	};

	setPage = page => {
		this.setState({ page }, function () {
			this.updatePageData();
		});
	};

	setRowsPerPage = event => {
		this.setState(
			{ rowsPerPage: event.target.value, page: 0 },
			function () {
				this.updatePageData();
			}
		);
	};

	handleChangePage = (event, newPage) => {
		this.setPage(newPage);
	};

	updatePageData = () => {
		var searchObject = {};
		this.setState({
			loading: true,
		});
		searchObject.keyword = this.state.keyword;
		searchObject.pageIndex = this.state.page + 1;
		searchObject.pageSize = this.state.rowsPerPage;
		// searchByPage(searchObject)
		// 	.then(({ data }) => {
		// 		this.setState({
		// 			itemList: [...data.data.content],
		// 			totalElements: data.data.totalElements,
		// 			totalPage: data.totalPages,
		// 			loading: false,
		// 		});
		// 	})
		// 	.catch(() => {
		// 		this.setState({
		// 			itemList: [],
		// 			loading: false,
		// 		});
		// 	});
	};

	componentDidMount() {
		this.updatePageData();
		let { selectedItem } = this.props;
		this.setState({ selectedValue: selectedItem.id });
	}

	handleClick = (event, item) => {
		if (item.id != null) {
			this.setState({ selectedValue: item.id, selectedItem: item });
		} else {
			this.setState({ selectedValue: null, selectedItem: null });
		}
	};

	handleKeyDownEnterSearch = e => {
		if (e.key === "Enter") {
			this.search();
		}
	};

	search() {
		this.setPage(0, function () {
			var searchObject = {};
			this.setState({
				loading: true,
			});
			searchObject.title = this.state.keyword;
			searchObject.pageIndex = this.state.page;
			searchObject.pageSize = this.state.rowsPerPage;
			// searchByPage(searchObject)
			// 	.then(({ data }) => {
			// 		this.setState({
			// 			itemList: [...data.data.content],
			// 			totalElements: data.totalElements,
			// 			totalPage: data.totalPages,
			// 			loading: false,
			// 		});
			// 	})
			// 	.catch(() => {
			// 		this.setState({
			// 			itemList: [],
			// 			loading: false,
			// 		});
			// 	});
		});
	}

	handleChange = event => {
		event.persist();
		this.setState(
			{
				[event.target.name]: event.target.value,
			},
			function () {
				this.search();
			}
		);
	};

	handleOpenProductDialog = () => {
		this.setState({
			shouldOpenProductDialog: true,
		});
	};

	handleDialogProductClose = () => {
		this.setState({
			shouldOpenProductDialog: false,
		});
	};

	handleOKEditClose = () => {
		this.setState({
			shouldOpenProductDialog: false,
		});
		this.updatePageData();
	};

	onClickRow = selectedRow => {
		document.querySelector(`#radio${selectedRow.id}`).click();
	};

	render() {
		const { t, handleClose, handleSelect, open, itemId } = this.props;
		let {
			keyword,
			itemList,
			page,
			rowsPerPage,
			totalElements,
			totalPage,
			loading,
		} = this.state;
		let columns = [
			{
				title: t("general.select"),
				field: "custom",
				align: "left",
				render: rowData => (
					<Radio
						id={`radio${rowData.id}`}
						name="radSelected"
						value={rowData.id}
						checked={this.state.selectedValue === rowData.id}
						onClick={event => this.handleClick(event, rowData)}
						disabled={rowData.id === itemId}
					/>
				),
			},
			{
				title: t("category.code"),
				field: "code",
				align: "left",
				width: "150",
			},
			{ title: t("category.title"), field: "title", width: "150" },
		];

		return (
			<Dialog
				onClose={handleClose}
				open={open}
				PaperComponent={PaperComponent}
				maxWidth={"md"}
				fullWidth
			>
				<DialogTitle
					style={{ cursor: "move" }}
					id="draggable-dialog-title"
				>
					<span className="mb-20">
						{t("component.product.title")}
					</span>
				</DialogTitle>
				<DialogContent>
					<Grid item xs={12} sm={4}>
						<TextField
							label={t("general.enterSearch")}
							type="text"
							name="keyword"
							value={keyword}
							onChange={this.handleChange}
							onKeyDown={this.handleKeyDownEnterSearch}
							id="search_box"
							className="mb-16"
						/>
					</Grid>
					<Grid item xs={12}>
						<MaterialTable
							title={t("List")}
							data={itemList}
							columns={columns}
							isLoading={loading}
							options={{
								showEmptyDataSourceMessage: true,
								selection: false,
								actionsColumnIndex: -1,
								paging: false,
								search: false,
								rowStyle: (rowData, index) => ({
									backgroundColor:
										index % 2 === 1 ? "#EEE" : "#FFF",
								}),
								maxBodyHeight: "450px",
								minBodyHeight: "370px",
								headerStyle: {
									backgroundColor: "#2a80c8",
									color: "#fff",
									height: "50px",
								},
								padding: "dense",
								toolbar: false,
							}}
							onSelectionChange={rows => {
								this.data = rows;
							}}
							localization={{
								body: {
									emptyDataSourceMessage: `${t(
										"general.emptyDataMessageTable"
									)}`,
								},
							}}
						/>
						<NicePagination
							totalPages={totalPage}
							handleChangePage={this.handleChangePage}
							setRowsPerPage={this.setRowsPerPage}
							pageSize={rowsPerPage}
							pageSizeOption={[1, 2, 3, 5, 10, 25]}
							t={t}
							totalElements={totalElements}
							page={page}
						/>
					</Grid>
				</DialogContent>

				<DialogActions>
					<Button
						className="mb-16 mr-12 align-bottom"
						variant="contained"
						color="secondary"
						onClick={() => handleClose()}
					>
						{t("general.cancel")}
					</Button>
					<Button
						className="mb-16 mr-16 align-bottom"
						variant="contained"
						color="primary"
						onClick={() => handleSelect(this.state.selectedItem)}
					>
						{t("general.select")}
					</Button>
				</DialogActions>
			</Dialog>
		);
	}
}
export default SelectParentPopup;

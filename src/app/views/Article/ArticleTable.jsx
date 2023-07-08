import {
	Button,
	FormControl,
	Grid,
	Icon,
	IconButton,
	Input,
	InputAdornment,
	InputLabel,
	Tooltip,
	Collapse,
	TextField,
	Checkbox,
	Card,
	CardContent,
	CardHeader,
} from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import { withStyles } from "@material-ui/core/styles";
import { Add, Search, Tune, ArrowDropDown } from "@material-ui/icons";
import { Breadcrumb, ConfirmationDialog } from "egret";
import MaterialTable from "material-table";
import moment from "moment";
import React, { Component } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NicePagination from "../Component/Pagination/NicePagination";
import ArticleEditorDialog from "./ArticleEditorDialog";
import SelectCategoryPopup from './SelectCategoryPopup';
import { deleteArticle, getById, searchByDto } from "./ArticleService";
import AppConst from '../../AppConst';
import ArticleFilter from "./ArticleFilter";
import { Helmet } from "react-helmet";
import ConstantList from '../../appConfig'
import AddIcon from '@material-ui/icons/Add';

toast.configure({
	autoClose: 2000,
	draggable: false,
	limit: 3,
});
const LightTooltip = withStyles(theme => ({
	arrow: {
		color: theme.palette.common.black,
	},
	tooltip: {
		backgroundColor: theme.palette.common.black,
	},
}))(Tooltip);

function MaterialButton(props) {
	const { t } = useTranslation();
	const item = props.item;
	return (
		<div className="none_wrap">
			<LightTooltip
				title={t("general.editIcon")}
				placement="bottom"
				enterDelay={100}
				leaveDelay={100}
				arrow
			>
				<IconButton
					size="medium"
					onClick={() => props.onSelect(item, 0)}
				>
					<Icon fontSize="medium" color="primary">
						edit
					</Icon>
				</IconButton>
			</LightTooltip>
			<LightTooltip
				title={t("general.deleteIcon")}
				placement="bottom"
				enterDelay={100}
				leaveDelay={100}
				arrow
			>
				<IconButton
					size="medium"
					onClick={() => props.onSelect(item, 1)}
				>
					<Icon fontSize="medium" color="error">
						delete
					</Icon>
				</IconButton>
			</LightTooltip>
		</div>
	);
}

class ArticleTable extends Component {
	constructor(props) {
		super(props);

		this.state = {
			rowsPerPage: 5,
			page: 1,
			articleList: [],
			item: {},
			totalElements: 0,
			totalPage: 0,
			loading: true,
			text: "",
			id: "",
			keyword: "",
			itemEdit: {},
			itemList: [],
			categoryDto: null,
			checkedFilter: false,
			shouldOpenEditorDialog: false,
			shouldOpenConfirmationDialog: false,
			shouldOpenCategoryPopup: false,
			language: "",
			selectedList: [],
			shouldOpenConfirmationDeleteAllDialog: false
		};
	}

	componentDidMount() {
		this.updatePageData();
		this.setState({
			language: this.props.i18n.language,
		});
	}

	componentDidUpdate(prevProps) {
		if (prevProps.i18n.language !== this.state.language) {
			this.setState(
				{
					language: this.props.i18n.language,
				},
				() => this.updatePageData()
			);
		}
	}

	handleChangeRowsPerPage = event => {
		this.setState(
			{
				rowsPerPage: parseInt(event.target.value, 10),
				page: 1,
			},
			() => this.updatePageData()
		);
	};

	handleChangePage = (event, newPage) => {
		this.setState(
			{
				page: newPage,
			},
			() => this.updatePageData()
		);
	};

	handleDialogClose = () => {
		this.data = []
		this.setState({
			shouldOpenEditorDialog: false,
			shouldOpenConfirmationDialog: false,
			shouldOpenCategoryPopup: false,
			shouldOpenConfirmationDeleteAllDialog: false
		});
		this.updatePageData()
	};
	handleOKDialog = () => {
		this.setState(
			{
				shouldOpenEditorDialog: false,
				shouldOpenConfirmationDialog: false,
			},
			() => {
				this.updatePageData();
			}
		);
	};

	handleDeleteArticle = id => {
		this.setState({
			id,
			shouldOpenConfirmationDialog: true,
		});
	};

	handleEditArticle = item => {
		this.setState({
			item: item,
			shouldOpenEditorDialog: true,
		});
	};

	handleConfirmationResponse = () => {
		const { t } = this.props;
		deleteArticle(this.state.id)
			.then(() => {
				toast.success(t("general.deleteSuccess"));
				this.handleOKDialog();
			})
			.catch(() => toast.error(t("general.error")));
	};

	updatePageData = (category) => {
		const { t } = this.props;
		let searchObject = {};
		this.setState({
			selectedList: [],
			loading: true,
		});
		searchObject.text = this.state.text;
		searchObject.category = this.state.category;
		searchObject.publishDate = this.state.publishDate;
		searchObject.status = this.state.status;
		searchObject.pageIndex = this.state.page;
		searchObject.pageSize = this.state.rowsPerPage;
		searchObject.checkLanguage = this.props.i18n.language === "vi" ? 1 : 0;
		if (category) {
			searchObject.checkCode = category?.code;
		}
		searchByDto(searchObject)
			.then(({ data }) => {
				this.setState({
					articleList: [...data.content],
					totalElements: data.totalElements,
					totalPage: data.totalPages,
					loading: false,
				});
			})
			.catch(() => {
				this.setState({
					articleList: [],
					loading: false,
				});
				toast.error(t("general.error"));
			});
	};

	handleDeleteButtonClick = () => {
		let { t } = this.props
		if (!this.data || this.data?.length === 0) {
			toast.warning(t("general.noti_check_data"));

		} else if (this.data.length === this.state.itemList.length) {
			this.setState({ shouldOpenConfirmationDeleteAllDialog: true });
		} else {
			this.setState({ shouldOpenConfirmationDeleteAllDialog: true });
		}
	};

	handleDeleteAll = async () => {
		let listAlert = [];
		let { t } = this.props;
		for (let i = 0; i < this.data.length; i++) {
			try {
				await deleteArticle(this.data[i].id)
					.then(({ data }) => {
						if (data.data === false) {
							listAlert.push(this.data[i].name);
						}
					})
			} catch (error) {
				listAlert.push(this.data[i].name);
			}
		}
		if (listAlert.length === this.data.length) {
			toast.warning(t("general.isUsed"));
		} else if (listAlert.length > 0) {
			toast.warning(t("general.deleteUsed"));
		} else {
			toast.success(t("general.deleteSuccess"))
		}
		this.handleDialogClose();
	};

	handleCollapseFilter = () => {
		let { checkedFilter } = this.state;
		this.setState({ checkedFilter: !checkedFilter });
	};

	handleEditItem = item => {
		this.setState({
			itemEdit: item,
			shouldOpenEditorDialog: true,
		});
	};

	handleSearchInputChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		});
		if (event.target.value === "") {
			this.setState({
				loading: true,
			});
			this.updatePageData();
		}
	};

	handleKeyDownEnterSearch = e => {
		if (e.key === "Enter") {
			this.updatePageData();
		}
	};


	filter = option => {
		let { publishDate, status, category } = option;
		this.setState({
			page: 1,
			loading: true,
			publishDate,
			status,
			category,
		});
		const { t } = this.props;
		let searchObject = {};

		searchObject.text = this.state.text;
		searchObject.category = category;
		searchObject.publishDate = publishDate;
		searchObject.status = status;
		searchObject.pageIndex = this.state.page;
		searchObject.pageSize = this.state.rowsPerPage;
		searchObject.checkLanguage = this.props.i18n.language === "vi" ? 1 : 0;
		searchByDto(searchObject)
			.then(({ data }) => {
				this.setState({
					articleList: data.content,
					totalElements: data.totalElements,
					totalPage: data.totalPages,
					loading: false,
				});
			})
			.catch(() => {
				this.setState({
					articleList: [],
					loading: false,
				});
				toast.error(t("general.error"));
			});
	};

	openCategoryPopup = () => {
		this.setState({
			shouldOpenCategoryPopup: true
		})
	}

	handleSelectCategory = category => {
		this.setState({
			...this.state,
			categoryDto: category,
			shouldOpenCategoryPopup: false,
		});
		this.updatePageData(category);
	};

	handleClearCategory = () => {
		this.setState({ categoryDto: null });
		this.updatePageData();
	}

	render() {
		const { t, i18n } = this.props;
		const {
			rowsPerPage,
			page,
			articleList,
			shouldOpenConfirmationDialog,
			shouldOpenEditorDialog,
			shouldOpenCategoryPopup,
			checkedFilter,
			totalElements,
			totalPage,
			loading,
			text,
			keyword,
			categoryDto,
		} = this.state;

		let columns = [
			{
				title: t("general.action"),
				field: "custom",
				align: "center",
				minWidth: 80,
				maxWidth: 120,
				headerStyle: {
					...ConstantList.styleTable.columnFirst,

				},
				cellStyle: {
					...ConstantList.styleTable.columnFirst
				},
				render: rowData => (
					<MaterialButton
						item={rowData}
						onSelect={(rowData, method) => {
							if (method === 0) {
								getById(rowData.id).then(({ data }) => {
									this.setState({
										item: data,
										shouldOpenEditorDialog: true,
									});
								});
							} else if (method === 1) {
								this.handleDeleteArticle(rowData.id);
							} else {
								alert("Call Selected Here:" + rowData.id);
							}
						}}
					/>
				),
			},
			{
				title: t("article.title"),
				field: "title",
				minWidth: 300,
				align: "center",
				headerStyle: {
					...ConstantList.styleTable.columnFirst,

				},
				cellStyle: {
					...ConstantList.styleTable.columnFirst
				},
			},
			{
				title: t("article.realAuthor"),
				field: "realAuthor",
				align: "center",
				minWidth: 300,
				headerStyle: {
					...ConstantList.styleTable.columnFirst,

				},
				cellStyle: {
					...ConstantList.styleTable.columnFirst
				},
			},
			{
				title: t("article.publishDate"),
				field: "publishDate",
				align: "center",
				minWidth: 200,
				headerStyle: {
					...ConstantList.styleTable.columnFirst,

				},
				cellStyle: {
					...ConstantList.styleTable.columnFirst
				},
				render: rowData =>
					rowData.publishDate ? (
						<span>
							{moment(rowData.publishDate).format("DD/MM/YYYY")}
						</span>
					) : (
						""
					),
			},
			{
				title: t("Dashboard.subcategory.article"),
				field: "category",
				align: "center",
				minWidth: 300,
				headerStyle: {
					...ConstantList.styleTable.columnFirst,

				},
				cellStyle: {
					...ConstantList.styleTable.columnFirst
				},
				render: rowData =>
					rowData.category ? (
						<span>
							{rowData.category == "NEWS" ? "Tin tức" : "Hoạt động"}

						</span>
					) : (
						""
					),
			}
		];

		return (
			<div className="m-50">
				<Helmet>
					<title>
						{t("article.articleTitle")} | {t("web_site")}
					</title>
				</Helmet>
				<div className="mb-sm-30 pb-16" style={{ borderBottom: '1px solid #ccc' }}>
					<Breadcrumb
						routeSegments={[
							{ name: t("Dashboard.manage") },
							{ name: t("article.articleTitle") }
						]}
					/>
				</div>
				<Card elevation={2} className="mb-16 w-100" >
					<CardHeader
						title={t('general.search')}
					>
					</CardHeader>
					<CardContent>
						{this.state.shouldOpenConfirmationDeleteAllDialog && (
							<ConfirmationDialog
								open={this.state.shouldOpenConfirmationDeleteAllDialog}
								onConfirmDialogClose={this.handleDialogClose}
								onYesClick={this.handleDeleteAll}
								text={t("DeleteAllConfirm")}
								cancel={t("general.cancel")}
								agree={t("general.agree")}
							/>
						)}
						<Grid
							item
							md={5}
							lg={4}
							sm={5}
							xs={12}
							className="flex flex-align-end mb-12"
						>
							<FormControl size="small" className="flex-grow-1 mr-8">
								<InputLabel htmlFor="standard-adornment">
									{t("EnterSearch")}
								</InputLabel>
								<Input
									id="standard-basic"
									type="text"
									name="text"
									value={text}
									label={t("EnterSearch")}
									onChange={this.handleSearchInputChange}
									onKeyDown={this.handleKeyDownEnterSearch}
									endAdornment={
										<InputAdornment position="end">
											<IconButton
												edge="end"
												onClick={() => this.updatePageData()}
											>
												<Search />
											</IconButton>
										</InputAdornment>
									}
								/>
							</FormControl>
							<Button
								variant="contained"
								className="ml-16"
								color="primary"
								onClick={() => this.updatePageData()}
							>
								{t("general.search")}
							</Button>
						</Grid>

					</CardContent>
				</Card>

				<Card elevation={2} className="mb-16 w-100" >
					<CardHeader
						titleTypographyProps={{ variant: 'h6' }}
						className="cardHeader-table"
						title={t("general.selected") + this.state.selectedList.length}
						action={
							<Grid container className="space-between">
								<Button
									variant="contained"
									className="ml-16 delete-button"
									onClick={() => this.handleDeleteButtonClick()}
								>
									{t("general.deleteSelected")}
								</Button>
								<Button
									style={{ borderRadius: '8px' }}
									variant="contained"
									className="ml-16"
									color="primary"
									onClick={() => { this.handleEditItem(null) }}
								>

									<AddIcon /> {t("general.add")}
								</Button>
							</Grid>
						}
					>
					</CardHeader>
					<CardContent deviders>
						<Grid
							container
							alignItems="flex-end"
							justifyContent="space-between"
						>
							<Grid item md={3} sm={4} className="pl-10 mb-12">
								<Button
									size="medium"
									className="mt-10"
									variant="contained"
									color="primary"
									onClick={this.openCategoryPopup}
								>
									{t('general.select')}
								</Button>
							</Grid>
							<Grid item xs={12}>
								<MaterialTable
									title={t("List")}
									data={articleList}
									columns={columns}
									isLoading={loading}
									options={{
										selection: true,
										showEmptyDataSourceMessage: true,
										loadingType: "overlay",
										actionsColumnIndex: 0,
										paging: false,
										search: false,
										toolbar: false,
										draggable: false,
										sorting: false,
										toolbar: false,
										rowStyle: (rowData, index) => ({
											backgroundColor:
												index % 2 === 1 ? "#EEE" : "#FFF",
										}),
										maxBodyHeight: "450px",
										minBodyHeight: "370px",
										headerStyle: ConstantList.styleTable.header,
										padding: "dense",
										toolbar: false,
									}}
									onSelectionChange={(rows) => {
										this.setState({ selectedList: [...rows] })
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
									setRowsPerPage={this.handleChangeRowsPerPage}
									pageSize={rowsPerPage}
									pageSizeOption={[1, 2, 3, 5, 10, 25]}
									t={t}
									totalElements={totalElements}
									page={page}
								/>
							</Grid>

							{shouldOpenCategoryPopup &&
								<SelectCategoryPopup
									t={t}
									i18n={i18n}
									open={shouldOpenCategoryPopup}
									handleSelect={this.handleSelectCategory}
									selectedItem={categoryDto != null ? categoryDto : {}}
									handleClose={this.handleDialogClose}
								/>
							}

							{shouldOpenEditorDialog && (
								<ArticleEditorDialog
									t={t}
									i18n={i18n}
									handleClose={this.handleDialogClose}
									open={shouldOpenEditorDialog}
									item={this.state.item}
									handleOKDialog={this.handleOKDialog}
								/>
							)}

							{shouldOpenConfirmationDialog && (
								<ConfirmationDialog
									open={shouldOpenConfirmationDialog}
									onConfirmDialogClose={this.handleDialogClose}
									onYesClick={this.handleConfirmationResponse}
									title={t("confirm_dialog.delete.title")}
									text={t("confirm_dialog.delete.text")}
									agree={t("confirm_dialog.delete.agree")}
									cancel={t("confirm_dialog.delete.cancel")}
								/>
							)}
						</Grid>
					</CardContent>
				</Card>
			</div>
		);
	}
}

export default ArticleTable;

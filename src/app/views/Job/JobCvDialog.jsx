import {
	AppBar,
	Button,
	Dialog,
	DialogContent,
	Grid,
	DialogTitle,
	Slide,
	TextField,
	Toolbar,
	DialogActions,
	Icon,
	Tab,
	Paper,
	Typography,
	Box
} from "@material-ui/core";
import moment from "moment";
import { Block, Save, CloudUpload } from "@material-ui/icons";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import ConstantList from "../../appConfig";
import React, { Component } from "react";
import { saveItem, updateItem } from "./JobService";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import ValidatePicker from "../Component/ValidateSelect/ValidatePicker";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import "../../../styles/views/_dengueLocation.scss";
import { addJobCv, updateJobCv, deleteJobCv, uploadFileCv, getFileCv } from "./JobCvService";
import Fab from "@material-ui/core/Fab";
const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});
function TabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			role="tabpanel"
			hidden={value !== index}
			id={`wrapped-tabpanel-${index}`}
			{...other}
		>
			{value === index && (
				<Box p={3}>
					<Typography component="span">{children}</Typography>
				</Box>
			)}
		</div>
	);
}

class JobCvDialog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			firstName: "",
			surname: "",
			dateOfBirth: null,
			email: "",
			phoneNumber: "",
			fileDescription: {},
		};
	}

	componentDidMount() {
		if (this.props.item) {
			this.setState({
				...this.props.item,
			});
		}
		if (this.props.parent) {
			this.setState({
				job: this.props.parent,
			});
		}
	}
	handleFileSelect = (event) => {
		event.preventDefault();
		let files = event.target.files;
		let file = files[0];
		let list = [];
		if (
			file.type !== "image/jpg" &&
			file.type !== "image/jpeg" &&
			file.type !== "image/png"
		) {
			toast.error("File incorrect format!");
		} else {
			if (file.size >= 7097152) {
				toast.error("File can't be larger than 7mb!");
			} else {
				for (const iterator of files) {
					list.push({
						file: iterator,
						uploading: false,
						error: false,
						progress: 0,
					});
				}
				this.setState(
					{
						files: list,
					},
					() => {
						let file = list[0];
						const formData = new FormData();
						if (file != null) {
							formData.append("uploadfile", file.file);
							uploadFileCv(formData).then(({ data }) => {

								this.setState({ fileDescription: data });
							});
						}
					}
				);
			}
		}
	};
	handleChangeDate = (value, even) => {
		console.log(value);
		this.setState({ dateOfBirth: value })
	}
	handleFormSubmit = () => {
		const { t } = this.props;
		if (this.state.job?.id) {
			if (this.state?.id) {
				updateJobCv(this.state)
					.then(() => {
						toast.success(t("general.updateSuccess"));
						this.props.handleOKDialog();
					})
					.catch(() => {
						toast.error(t("general.error"));
						this.props.handleClose();
					});
			} else {
				addJobCv(this.state)
					.then(() => {
						toast.success(t("general.updateSuccess"));
						this.props.handleOKDialog();
					})
					.catch(() => {
						toast.error(t("general.error"));
						this.props.handleClose();
					});
			}
		}
	};

	search = (keyword) => {
		var searchObject = {};
		searchObject.text = keyword;
		searchObject.pageIndex = this.state.page;
		searchObject.pageSize = this.state.rowsPerPage;
	};

	handleChange = (event) => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	};

	handleDialogClose = () => {
		this.setState({ shouldOpenNotificationPopup: false });
	};

	onCloseMap = (geo) => {
		const { longitude, latitude, itemAddress } = geo;
		this.setState({
			longitude,
			latitude,
			address: itemAddress,
		});
	};
	handleChangeContent = (value) => {
		this.setState({
			description: value,
		});
	}


	render() {

		const { t, open, handleClose } = this.props;
		const {
			firstName,
			surname,
			phoneNumber,
			email,
			dateOfBirth
		} = this.state;

		let isEmpty = true;


		return (
			<Dialog
				open={open}
				onClose={() => handleClose()}
				fullWidth
				maxWidth="xs"
			>
				<DialogTitle>
					{this.props.item ? t("general.update") : t("general.add")}
				</DialogTitle>

				<ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
					<DialogContent >

						<Grid container spacing={2} justifyContent="center" >
							<Grid item md={12} sm={12} xs={12}>
								<TextValidator
									className="w-100"
									label={t("JobCv.firstName")}
									onChange={this.handleChange}
									type="text"
									name="firstName"
									value={firstName}
									validators={["required"]}
									errorMessages={[
										t("general.required"),
									]}
								/>
							</Grid>
							<Grid item md={12} sm={12} xs={12}>
								<TextValidator
									className="w-100"
									label={t("JobCv.surname")}
									onChange={this.handleChange}
									type="text"
									name="surname"
									value={surname}
									validators={["required"]}
									errorMessages={[
										t("general.required"),
									]}
								/>
							</Grid>
							<Grid item sm={12} xs={12}>
								<ValidatePicker
									type="da]"
									format="dd/MM/yyyy"
									className="w-100"
									id="date-picker-inline"
									label={
										<span>
											<span style={{ color: "red" }}>*</span>
											{t("JobCv.dateOfBirth")}
										</span>
									}
									name="dateOfBirth"
									value={
										dateOfBirth ? dateOfBirth : null
									}
									onChange={
										this.handleChangeDate
									}
								/>
							</Grid>
							<Grid item md={12} sm={12} xs={12}>
								<TextValidator
									className="w-100"
									label={
										<span>
											<span style={{ color: "red" }}>*</span>
											{t("JobCv.phoneNumber")}
										</span>
									}
									onChange={this.handleChange}
									type="text"
									name="phoneNumber"
									value={phoneNumber}
									validators={["required"]}
									errorMessages={[
										t("general.required"),
									]}
								/>
							</Grid>
							<Grid item md={12} sm={12} xs={12}>
								<TextValidator
									className="w-100"
									label={t("JobCv.email")}
									onChange={this.handleChange}
									type="text"
									name="email"
									value={email}
									validators={["required"]}
									errorMessages={[
										t("general.required"),
									]}
								/>
							</Grid>

						</Grid>

					</DialogContent>
					<DialogActions>
						<div className="flex flex-middle">
							<Button
								startIcon={<Block />}
								variant="contained"
								className="mr-12"
								color="secondary"
								onClick={() => this.props.handleClose()}
							>
								{t("general.cancel")}
							</Button>
							<Button
								startIcon={<Save />}
								className="mr-8"
								variant="contained"
								color="primary"
								type="submit"
							>
								{t("general.save")}
							</Button>
						</div>
					</DialogActions>
				</ValidatorForm>
			</Dialog>
		);
	}
}

export default JobCvDialog;

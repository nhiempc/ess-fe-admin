import {
	Avatar,
	Button,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Paper,
	Select,
	withStyles,
} from "@material-ui/core";
import { Block, Save } from "@material-ui/icons";
import React, { Component } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConstantList from "../../appConfig";
import authService from "../../services/jwtAuthService";
import localStorageService from "../../services/localStorageService";
import ValidatePicker from "../Component/ValidateSelect/ValidatePicker";
import ChangePasswordDiaglog from "./ChangePasswordPopup";
import UploadCropImagePopup from "./UploadCropImagePopup";
import {
	getCurrentUser,
	updateProfile,
	updateUserAvatar,
} from "./UserProfileService";

const API_PATH = ConstantList.API_ENPOINT + "/api/fileUpload/";

class UserProfile extends Component {
	state = {
		open: true,
		user: {
			person: {},
		},
		shouldOpenImageDialog: false,
		shouldOpenPasswordDialog: false,
		isUpdate: false,
	};
	windowResizeListener;

	toggleSidenav = () => {
		this.setState({
			open: !this.state.open,
		});
	};

	handleWindowResize = () => {
		return event => {
			if (event.target.innerWidth < 768) {
				this.setState({ mobile: true });
			} else this.setState({ mobile: false });
		};
	};

	componentDidMount() {
		getCurrentUser().then(({ data }) => {
			this.setState({ user: data });
		});
		//let user = localStorageService.getLoginUser();
		if (window.innerWidth < 768) {
			this.setState({ open: false });
		}
		if (window)
			this.windowResizeListener = window.addEventListener(
				"resize",
				event => {
					if (event.target.innerWidth < 768) {
						this.setState({ open: false });
					} else this.setState({ open: true });
				}
			);
	}

	componentWillUnmount() {
		let user = localStorageService.getLoginUser();
		getCurrentUser();
		this.setState({ user: user });
		if (window)
			window.removeEventListener("resize", this.windowResizeListener);
	}

	handleOpenUploadDialog = () => {
		this.setState({
			shouldOpenImageDialog: true,
		});
	};

	handleDialogClose = () => {
		this.setState({
			shouldOpenImageDialog: false,
		});
	};

	handleOpenPasswordDialog = () => {
		this.setState({
			shouldOpenPasswordDialog: true,
		});
	};

	handleDialogPasswordClose = () => {
		this.setState({
			shouldOpenPasswordDialog: false,
		});
	};

	openPasswordDialog = () => {
		this.setState({
			shouldOpenPasswordDialog: true,
		});
	};

	handleUpdate = blobValue => {
		let formData = new FormData();
		formData.set("uploadfile", blobValue);
		updateUserAvatar(formData).then(response => {
			const user = response.data;
			this.setState({ user: user });
			authService.setLoginUser(user);
			this.handleDialogClose();
		});
	};

	handleUserChange = e => {
		this.setState({
			user: {
				...this.state.user,
				[e.target.name]: e.target.value,
			},
		});
	};

	handlePersonChange = e => {
		this.setState({
			user: {
				...this.state.user,
				person: {
					...this.state.user.person,
					[e.target.name]: e.target.value,
				},
			},
		});
	};

	handleDateChange = date => {
		this.setState({
			user: {
				...this.state.user,
				person: {
					...this.state.user.person,
					birthDate: date,
				},
			},
		});
	};

	handleFormSubmit = () => {
		const { t } = this.props;
		updateProfile(this.state.user)
			.then(() => {
				this.setState({
					isUpdate: false,
				});
				toast.success(t("general.updateSuccess"));
			})
			.catch(() => toast.error(t("general.error")));
	};

	render() {
		let { t, i18n } = this.props;

		const genders = [
			{ id: "M", name: "Nam" },
			{ id: "F", name: "Nữ" },
			{ id: "U", name: "Không rõ" },
		];

		const user = this.state.user;
		const person = this.state.user.person;
		const { isUpdate, shouldOpenImageDialog, shouldOpenPasswordDialog } =
			this.state;

		return (
			<div className="m-50 " t={t} i18n={i18n}>
				{shouldOpenImageDialog && (
					<UploadCropImagePopup
						t={t}
						i18n={i18n}
						handleClose={this.handleDialogClose}
						handleUpdate={this.handleUpdate}
						open={shouldOpenImageDialog}
						uploadUrl={API_PATH + "avatarUpload"}
						acceptType="png;jpg;gif;jpeg"
					/>
				)}

				{shouldOpenPasswordDialog && (
					<ChangePasswordDiaglog
						t={t}
						i18n={i18n}
						handleClose={this.handleDialogPasswordClose}
						open={shouldOpenPasswordDialog}
						user={user}
					/>
				)}

				<h4>{t("user.person_info")}</h4>
				<ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
					<Grid container spacing={4} className="mt-16">
						<Grid item xs={12} sm={4}>
							<Paper
								elevation={3}
								className="px-12 py-30 flex-column flex-center flex-middle"
								style={{ minHeight: "50vh" }}
							>
								<Avatar
									className="mb-30"
									style={{
										width: "150px",
										height: "150px",
										cursor: "pointer",
									}}
									src={
										this.state.user
											? ConstantList.API_ENPOINT +
											  this.state.user.imagePath
											: ConstantList.ROOT_PATH +
											  "assets/images/blank.jpg"
									}
									onClick={this.handleOpenUploadDialog}
								/>

								<h4>{person?.displayName ?? ""}</h4>
								<small><em>*Ấn vào ảnh đại diện để thay đổi</em></small>
							</Paper>
						</Grid>

						<Grid item xs={12} sm={8}>
							<Paper
								elevation={3}
								className="px-12 py-30 flex-column flex-center flex-middle"
								style={{ minHeight: "50vh" }}
							>
								<Grid
									item
									container
									xs={12}
									spacing={3}
									alignItems="center"
									className="ml-16"
								>
									<Grid item sm={6}>
										<TextValidator
											className="w-100 mb-16"
											disabled={!isUpdate}
											label={t("user.firstName")}
											name="firstName"
											value={person?.firstName ?? ""}
											onChange={this.handlePersonChange}
										/>
									</Grid>
									<Grid item sm={6}>
										<TextValidator
											disabled={!isUpdate}
											className="w-100 mb-16"
											label={t("user.lastName")}
											value={person?.lastName ?? ""}
											name="lastName"
											onChange={this.handlePersonChange}
										/>
									</Grid>
									<Grid item sm={6}>
										<TextValidator
											disabled={!isUpdate}
											className="w-100 mb-16"
											label={t("user.displayName")}
											value={person?.displayName ?? ""}
											name="displayName"
											onChange={this.handlePersonChange}
										/>
									</Grid>
									<Grid item sm={6}>
										<TextValidator
											className="w-100 mb-16"
											disabled
											label={t("user.username")}
											value={user.username ?? ""}
										/>
									</Grid>
									<Grid item sm={6}>
										<ValidatePicker
											disableToolbar
											className="w-100"
											autoOk
											disabled={!isUpdate}
											label={t("user.birthdate")}
											variant="inline"
											format="dd/MM/yyyy"
											id="date-picker-inline"
											value={
												person?.birthDate ?? Date.now()
											}
											onChange={this.handleDateChange}
										/>
									</Grid>
									<Grid item sm={6}>
										<FormControl
											disabled={!isUpdate}
											className="w-50"
										>
											<InputLabel htmlFor="gender-simple">
												{t("user.gender")}
											</InputLabel>
											<Select
												value={person?.gender ?? ""}
												onChange={
													this.handlePersonChange
												}
												name="gender"
											>
												{genders.map(item => {
													return (
														<MenuItem
															key={item.id}
															value={item.id}
														>
															{item.name}
														</MenuItem>
													);
												})}
											</Select>
										</FormControl>
									</Grid>
									<Grid item sm={6}>
										<TextValidator
											className="w-100 mb-16"
											disabled={!isUpdate}
											label={t("user.email")}
											value={user?.email ?? ""}
											name="email"
											onChange={this.handleUserChange}
											validators={["isEmail"]}
											errorMessages={[
												"Email không hợp lệ",
											]}
										/>
									</Grid>
									<Grid item sm={6}>
										<TextValidator
											disabled={!isUpdate}
											className="w-100 mb-16"
											label={t("user.address")}
											value={person?.birthPlace ?? ""}
											name="birthPlace"
											onChange={this.handlePersonChange}
										/>
									</Grid>
								</Grid>
							</Paper>
						</Grid>

						<Grid item md={4} lg={3} className="flex">
							<Button
								variant="contained"
								color="secondary"
								className="mr-16"
								onClick={() =>
									this.setState({
										isUpdate: true,
									})
								}
							>
								{t("general.update")}
							</Button>
							<Button
								variant="contained"
								color="primary"
								type="button"
								onClick={() => this.openPasswordDialog()}
							>
								{t("user.changePass")}
							</Button>
						</Grid>

						<Grid item md={6}></Grid>

						{isUpdate && (
							<Grid item sm={3} style={{ position: "relative" }}>
								<div
									style={{
										position: "absolute",
										right: "16px",
									}}
								>
									<Button
										variant="contained"
										color="secondary"
										startIcon={<Block />}
										className="mr-12"
										onClick={() =>
											this.setState({
												isUpdate: false,
											})
										}
									>
										{t("general.cancel")}
									</Button>
									<Button
										variant="contained"
										color="primary"
										type="submit"
										startIcon={<Save />}
									>
										{t("general.save")}
									</Button>
								</div>
							</Grid>
						)}
					</Grid>
				</ValidatorForm>
			</div>
		);
	}
}

export default withStyles({}, { withTheme: true })(UserProfile);

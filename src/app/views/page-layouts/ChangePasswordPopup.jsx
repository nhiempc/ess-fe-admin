import {
	Button,
	Dialog,
	DialogActions,
	Grid,
	Paper,
	DialogContent,
	DialogTitle,
	FormControl,
} from "@material-ui/core";
import React, { Component } from "react";
import Draggable from "react-draggable";
import "react-image-crop/dist/ReactCrop.css";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import JwtAuthService from "../../services/jwtAuthService";
import { changePassword } from "./UserProfileService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

class ChangePasswordPopup extends Component {
	state = {
		oldPassword: "",
		password: "",
		confirmPassword: "",
	};

	componentDidMount() {
		ValidatorForm.addValidationRule("isPasswordMatch", value => {
			if (value !== this.state.password) {
				return false;
			}
			return true;
		});
		if (this.props.user) {
			this.setState({
				...this.props.user,
			});
		}
	}

	handleChangePassword = () => {
		changePassword(this.state)
			.then(() => {
				toast.success("Bạn đã đối mật khẩu thành công");
				setTimeout(() => {
					JwtAuthService.logout();
				}, 2000);
			})
			.catch(() => {
				toast.error("Đã có lỗi khi đổi mật khẩu");
				this.props.handleClose();
			});
	};

	handleChange = name => event => {
		this.setState({
			[name]: event.target.value,
		});
	};

	render() {
		const { t, handleClose, open, user } = this.props;

		return (
			<Dialog
				onClose={handleClose}
				open={open}
				PaperProps={{
					style: {
						width: 500,
						maxHeight: 800,
						alignContent: "center",
						//backgroundColor: 'Blue',
						//color:'black'
					},
				}}
				PaperComponent={PaperComponent}
				maxWidth={"md"}
				fullWidth={true}
			>
				<DialogTitle
					style={{ cursor: "move" }}
					id="draggable-dialog-title"
				>
					{t("user.changePass")}
				</DialogTitle>

				<ValidatorForm
					ref="form"
					onSubmit={() => this.handleChangePassword()}
				>
					<DialogContent dividers>
						<Grid container spacing={1}>
							<Grid item md={12} sm={12} xs={12}>
								<FormControl fullWidth margin="dense">
									<TextValidator
										label={
											<span>
												<span style={{ color: "red" }}>
													*
												</span>
												{t("user.current_password")}
											</span>
										}
										id="password-current"
										className="w-100"
										name="oldPassword"
										type="password"
										value={this.state.oldPassword}
										onChange={this.handleChange(
											"oldPassword"
										)}
										validators={["required"]}
										errorMessages={[t("general.required")]}
									/>
								</FormControl>
							</Grid>

							<Grid item md={12} sm={12} xs={12}>
								<FormControl fullWidth margin="dense">
									<TextValidator
										label={
											<span>
												<span style={{ color: "red" }}>
													*
												</span>
												{t("user.pass")}
											</span>
										}
										id="password-current"
										className="w-100"
										name="password"
										type="password"
										value={this.state.password}
										onChange={this.handleChange("password")}
										validators={["required"]}
										errorMessages={[t("general.required")]}
									/>
								</FormControl>
							</Grid>

							<Grid item md={12} sm={12} xs={12}>
								<FormControl fullWidth margin="dense">
									<TextValidator
										label={
											<span>
												<span style={{ color: "red" }}>
													*
												</span>
												{t("user.re_pass")}
											</span>
										}
										id="confirm-password"
										className="w-100"
										name="confirmPassword"
										type="password"
										value={this.state.confirmPassword}
										onChange={this.handleChange(
											"confirmPassword"
										)}
										validators={[
											"required",
											"isPasswordMatch",
										]}
										errorMessages={[
											t("general.required"),
											t("user.passwordMatchMessage"),
										]}
									/>
								</FormControl>
							</Grid>
						</Grid>
					</DialogContent>

					<DialogActions>
						<Button
							className="mr-12 align-bottom"
							variant="contained"
							color="secondary"
							onClick={() => handleClose()}
						>
							{t("general.cancel")}
						</Button>
						<Button
							className="mr-16"
							variant="contained"
							color="primary"
							type="submit"
						>
							{t("general.update")}
						</Button>
					</DialogActions>
				</ValidatorForm>
			</Dialog>
		);
	}
}
export default ChangePasswordPopup;

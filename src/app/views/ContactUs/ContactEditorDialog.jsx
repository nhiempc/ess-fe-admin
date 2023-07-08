import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Paper, FormControlLabel, Checkbox
} from "@material-ui/core";
import React, { Component } from "react";
import Draggable from "react-draggable";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { saveItem, updateItem } from "./ContactService";
toast.configure({
  autoClose: 2000,
  draggable: false,
  limit: 3,
});

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

class ContactDialog extends Component {
  state = {
    id: "",
    fullName: "",
    email: "",
    phone: "",
    address: "",
    required: "",
    shouldOpenNotificationPopup: false,
    Notification: "",
  };

  handleDialogClose = () => {
    this.setState({ shouldOpenNotificationPopup: false });
  };

  handleChange = (event, source) => {
    event.persist();
    if (source === "switch") {
      this.setState({ isActive: event.target.checked });
      return;
    }
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleFormSubmit = () => {
    let { id } = this.state;
    var { t } = this.props;
    if (id) {
      updateItem({
        ...this.state,
      }).then(() => {
        toast.success(t("general.updateSuccess"));
        this.props.handleOKEditClose();
      });
    } else {
      saveItem({
        ...this.state,
      }).then(() => {
        toast.success(t("general.addSuccess"));
        this.props.handleOKEditClose();
      });
    }
  };

  componentWillMount() {
    let { item } = this.props;
    this.setState({ ...item });
  };

  render() {
    let {
      id,
      fullName,
      phone,
      email,
      address,
      required,
    } = this.state;
    let { open, t } = this.props;
	const a = required.split(';')[0];

    return (
		<Dialog
			open={open}
			PaperComponent={PaperComponent}
			maxWidth="sm"
			fullWidth
		>
			<DialogTitle
				style={{ cursor: "move", paddingBottom: "0px" }}
				id="draggable-dialog-title"
			>
				<h4 className="">
					{id ? t("general.update") : t("general.add")}
				</h4>
			</DialogTitle>

			<ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
				<DialogContent>
					<Grid container spacing={2}>
						<Grid item sm={6} xs={12}>
							<TextValidator
								className="w-100 "
								label={
									<span>
										<span style={{ color: "red" }}>*</span>
										{t("user.displayName")}
									</span>
								}
								onChange={this.handleChange}
								type="text"
								name="fullName"
								value={fullName}
								validators={["required"]}
								errorMessages={[t("general.required")]}
							/>
						</Grid>
						
						<Grid item sm={6} xs={12}>
							<TextValidator
								className="w-100 "
								label={
									<span>
										<span style={{ color: "red" }}>*</span>
										{t("user.phone")}
									</span>
								}
								onChange={this.handleChange}
								type="text"
								name="phone"
								value={phone}
								validators={["required"]}
								errorMessages={[t("general.required")]}
							/>
						</Grid>

						<Grid item sm={6} xs={12}>
							<TextValidator
								className="w-100 "
								label={
									<span>
										{/* <span style={{ color: "red" }}>*</span> */}
										{t("general.email")}
									</span>
								}
								onChange={this.handleChange}
								type="text"
								name="email"
								value={email}
							/>
						</Grid>
						
						<Grid item sm={12} xs={12}>
							<TextValidator
								className="w-100 "
								label={
									<span>
										<span style={{ color: "red" }}>*</span>
										{t("user.address")}
									</span>
								}
								onChange={this.handleChange}
								type="text"
								name="address"
								value={address}
								validators={["required"]}
								errorMessages={[t("general.required")]}
							/>
						</Grid>

						<Grid item sm={12} xs={12}>
							<TextValidator
								className="w-100 "
								label={
									<span>
										<span style={{ color: "red" }}>*</span>
										{t("user.feedback")}
									</span>
								}
								onChange={this.handleChange}
								type="text"
								name="required"
								value={required}
								multiLine
								rows={3}
								validators={["required"]}
								errorMessages={[t("general.required")]}
							/>
						</Grid>
					</Grid>
				</DialogContent>
				<DialogActions>
					<div className="flex flex-space-between flex-middle mt-12">
						<Button
							variant="contained"
							className="mr-12"
							color="secondary"
							onClick={() => this.props.handleClose()}
						>
							{t("general.cancel")}
						</Button>
						<Button
							variant="contained"
							style={{ marginRight: "15px" }}
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

export default ContactDialog;

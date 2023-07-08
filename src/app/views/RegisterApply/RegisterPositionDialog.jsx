import {
	AppBar,
	Button,
	Dialog,
	DialogContent,
	Grid,
	Slide,
	TextField,
	Toolbar,
	DialogActions
} from "@material-ui/core";
import { Block, Save } from "@material-ui/icons";
import React, { Component } from "react";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getAllPosition,addRegisterApplyPosition,updateRegisterApplyPosition } from "./RegisterPositionServices";
const Transition = React.forwardRef(function Transition(props, ref) {
	return <Slide direction="up" ref={ref} {...props} />;
});

class RegisterPoitionDialog extends Component {
	constructor(props) {
		super(props);
		this.state = {
			position: {},
			registerApply: {},
			note: ""
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
				registerApply: this.props.parent,
			});
		}
		getAllPosition().then(({ data }) => {
			this.setState({
				listPosition: data,
			});
		})
	}
	selectPosition = selectedPosition => {
		let { position } = this.state;
		position = selectedPosition;
		this.setState({ position: selectedPosition }, function () { });
	};
	handleFormSubmit = () => {
		const { t } = this.props;
		if (this.state.registerApply?.id) {
		  if (this.state?.id) {
			updateRegisterApplyPosition(this.state)
			  .then(() => {
				toast.success(t("general.updateSuccess"));
				this.props.handleOKDialog();
			  })
			  .catch(() => {
				toast.error(t("general.error"));
				this.props.handleClose();
			  });
		  } else {
			addRegisterApplyPosition(this.state)
			  .then(() => {
				toast.success(t("general.updateSuccess"));
				this.props.handleOKDialog();
			  })
			  .catch(() => {
				toast.error(t("general.error"));
				this.props.handleClose();
			  });
		  }
		} else {
		  this.props.updateTableData(this.state, "position");
		  this.props.handleClose();
		}
	  };

	handleChange = event => {
		this.setState({
			[event.target.name]: event.target.value,
		});
	};

	onCloseMap = geo => {
		const { longitude, latitude, itemAddress } = geo;
		this.setState({
			latitude,
			longitude,
			address: itemAddress,
		});
	};

	render() {
		const { t, open, handleClose } = this.props;
		const { position, note, id } = this.state;

		return (
			<Dialog
				open={open}
				onClose={() => handleClose()}
				maxWidth="sm"
				TransitionComponent={Transition}
			>
				<div className="p-24">
					<h4 className="mb-20">{id ? t("general.update") : t("general.add")}</h4>

					<DialogContent
						className="flex"
						style={{ alignItems: "flex-start", overflowY: "hidden" }}
					>
						<ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
							<Grid className="mb-16" container spacing={2}>

								<Grid item sm={12} xs={12}>
									{this.state.listPosition && (<Autocomplete
										id="combo-box"
										renderInput={(params) => (
											<TextValidator
												{...params}
												value={position ? position : {}}
												label={
													<span>
														<span style={{ color: "red" }}>*</span> Chức danh
													</span>
												}
												fullWidth
												validators={["required"]}
												errorMessages={[
													t("general.required"),
												]}
											/>
										)}
										defaultValue={position}
										options={this.state.listPosition}
										getOptionLabel={(option) => option.name}
										getOptionSelected={(option, value) => option.name === value.name}
										onChange={(event, value) => {
											this.selectPosition(value);
										}}
									/>)}
								</Grid>
								<Grid item sm={12} xs={12}>
									<TextValidator
										label={t("Position.note")}
										className="w-100"
										onChange={this.handleChange}
										type="text"
										name="note"
										value={note}
									/>
								</Grid>
							</Grid>
							<DialogActions>
								<div className="flex flex-middle mr-8">
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
										variant="contained"
										className="mr-8"
										color="primary"
										type="submit"
									>
										{t("general.save")}
									</Button>
								</div>
							</DialogActions>
						</ValidatorForm>
					
					</DialogContent>
					</div>
			</Dialog>
		);
	}
}

export default RegisterPoitionDialog;

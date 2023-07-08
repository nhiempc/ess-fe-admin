import {
  AppBar,
  Button,
  Dialog,
  DialogContent,
  Grid,
  Slide,
  TextField,
  Toolbar,
  DialogActions,
} from "@material-ui/core";
import { Block, Save } from "@material-ui/icons";
import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import Autocomplete from "@material-ui/lab/Autocomplete";

import ValidatePicker from "../Component/ValidateSelect/ValidatePicker";
import ConstantList from "../../appConfig";
import React, { Component } from "react";
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {getAllCertificate,updateRegisterApplyCertificate,addRegisterApplyCertificate} from "./RegisterCertificateServices"
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

class RegisterCertificateDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      issueDate: null,
      level: "",
      note: "",
      name: "",
      certificate:{},
      id:"",
      registerApply:{}
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
    getAllCertificate().then(({ data }) => {
			this.setState({
				listCertificate: data,
			});
		})
  }
  handleDateChange = (selectIssuaDate) => {
    let {issueDate} = this.state;
    issueDate = selectIssuaDate;
    this.setState({issueDate:issueDate})
  }
  handleFormSubmit = () => {
    const { t } = this.props;
    if (this.state.registerApply?.id) {
      if (this.state?.id) {
        updateRegisterApplyCertificate(this.state)
          .then(() => {
            toast.success(t("general.updateSuccess"));
            this.props.handleOKDialog();
          })
          .catch(() => {
            toast.error(t("general.error"));
            this.props.handleClose();
          });
      } else {
        addRegisterApplyCertificate(this.state)
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
      this.props.updateTableData(this.state, "certificate");
      this.props.handleClose();
    }
  };

  search = (keyword) => {
    var searchObject = {};
    searchObject.text = keyword;
    searchObject.pageIndex = this.state.page;
    searchObject.pageSize = this.state.rowsPerPage;
  };
  selectCertificate = certificateSelected => {
		let { certificate } = this.state;
		certificate = certificateSelected;
		this.setState({ certificate: certificateSelected }, function () { });
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
      name,
      level,
      issueDate,
      note,
      certificate,
      id
    } = this.state;



    return (
      <Dialog
        open={open}
        onClose={() => handleClose()}
        TransitionComponent={Transition}
        fullWidth
        maxWidth="sm"
      >
        <div className="p-24">
          <h4 className="mb-20">{id ? t("general.update") : t("general.add")}</h4>
          <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
            <Grid className="mb-16" container spacing={2}>
              <Grid item sm={12} xs={12}>
                <TextValidator
                  label={
                    <span>
                      <span style={{ color: "red" }}>*</span>
                      {t("Certificate.name")}
                    </span>
                  }
                  className="w-100"
                  onChange={this.handleChange}
                  type="text"
                  name="name"
                  value={name}
                  validators={["required"]}
                  errorMessages={[t("general.required")]}
                />
              </Grid>

              <Grid item sm={12} xs={12}>
                {this.state.listCertificate && (<Autocomplete
                  id="combo-box"
                  renderInput={(params) => (
                    <TextValidator
                      {...params}
                      value={certificate?certificate:{}}
                      label={
                        <span>
                          Chứng chỉ
                        </span>
                      }
                      fullWidth
                    />
                  )}
                  defaultValue={certificate}
                  options={this.state.listCertificate}
                  getOptionLabel={(option) => option.name}
                  getOptionSelected={(option, value) => option.name === value.name}
                  onChange={(event, value) => {
                    this.selectCertificate(value);
                  }}
                />)}
              </Grid>
              <Grid item sm={12} xs={12}>
                <TextValidator
                  label={
                    <span>
                      {t("Certificate.level")}
                    </span>
                  }
                  className="w-100"
                  onChange={this.handleChange}
                  type="text"
                  name="level"
                  value={level}
                />
              </Grid>
              <Grid item sm={12} xs={12}>
                <ValidatePicker
                  type="text"
                  format="dd/MM/yyyy"
                  className="w-100"
                  id="date-picker-inline"
                  label={
                    <span>
                      {t("Certificate.issueDate")}
                    </span>
                  }
                  value={
                    issueDate ? issueDate : null
                  }
                  onChange={
                    this.handleDateChange
                  }
                />
              </Grid>
              <Grid item sm={12} xs={12}>
                <TextValidator
                  label={t("Certificate.note")}
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
        </div>
      </Dialog >
    );
  }
}

export default RegisterCertificateDialog;

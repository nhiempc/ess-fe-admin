import React, { Component } from "react";
import {
  Dialog,
  Button,
  Grid,
  DialogActions,
  FormControl,
  Paper,
  DialogTitle,
  DialogContent,
} from "@material-ui/core";
// import Paper from '@material-ui/core/Paper'
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import Draggable from "react-draggable";
import NotificationPopup from "../Component/NotificationPopup/NotificationPopup";
import { saveItem, addItem, updateItem, checkCode } from "./PartnerService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ConstantList from "../../appConfig";
import axios from "axios";
import { Block, Save, CloudUpload } from "@material-ui/icons";

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

class PartnerDialog extends Component {
  state = {
    id: "",
    name: "",
    code: "",
    description: "",
    logo: "",
    shouldOpenNotificationPopup: false,
    Notification: "",
    titleImageUrl: "",
    imagesDto: null,
    imagePath : ""
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

  handleUploadFile = (e) => {
    let url = ConstantList.API_ENPOINT + "/public/api/image/";
    let formData = new FormData();
    formData.append("file", e.target.files[0]);
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };
    axios.post(url, formData, config).then(({ data }) => {
      this.setState({
        imagePath: data.name,
        imagesDto: data,
        titleImageName: data.name,
      });
    });
  };

  handleFormSubmit = () => {
    let { id } = this.state;
    let { code } = this.state;
    var { t } = this.props;
    checkCode(id, code).then((result) => {
      if (result.data) {
        toast.warning(t("general.dupli_code"));
      } else {
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
      }
    });
  };

  componentWillMount() {
    let { open, handleClose, item } = this.props;
    this.setState({ ...item });
  }

  render() {
    let {
      id,
      name,
      code,
      description,
      titleImageUrl,
      shouldOpenNotificationPopup,
      imagePath
    } = this.state;
    let { open, handleClose, handleOKEditClose, t, i18n } = this.props;
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
          <h4 className="">{id ? t("general.update") : t("general.add")}</h4>
        </DialogTitle>

        <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item sm={12} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={
                    <span>
                      <span style={{ color: "red" }}>*</span>
                      {t("general.name")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="text"
                  name="name"
                  value={name}
                  validators={["required"]}
                  errorMessages={[t("general.required")]}
                />
              </Grid>

              <Grid item sm={12} xs={12}>
                <TextValidator
                  className="w-100"
                  label={
                    <span>
                      {t("general.code")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="text"
                  name="code"
                  value={code}
                />
              </Grid>
              <Grid item sm={12} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={
                    <span>
                      {t("general.description")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="text"
                  name="description"
                  value={description}
                />
              </Grid>
              <Grid item sm={12} xs={12}>
                <div
                  className="mb-18 flex flex-column flex-middle"
                >
                  {imagePath && (
                    <span>
                      <img
                        src={ConstantList.API_ENPOINT + "/public/api/image/" + imagePath}
                        alt="logo"
                        style={{
                          objectFit: "contain",
                          width: "100%",
                          height: "200px",
                          aspectRatio : "16/9"
                        }}
                      />
                    </span>
                  )}
                  {!imagePath && (
                    <div
                      style={{
                        border: "1px solid black",
                        width: "100%",
                        height: "200px",
                      }}
                    ></div>
                  )}
                  <label
                    htmlFor="avatarImage"
                    style={{
                      background: "#ffcb89",
                      borderRadius: "999px",
                      padding: "7px 14px",
                      width: "fit-content",
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                    onClick={this.upload}
                    className="mt-16"
                  >
                    <CloudUpload className="mr-10" />
                    {"Upload ảnh"}
                  </label>
                  <input
                    type="file"
                    id="avatarImage"
                    name="avatarImage"
                    accept="image/*"
                    onChange={(e) => {
                      this.handleUploadFile(e);
                    }}
                    style={{ display: "none" }}
                  />
                </div>
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

export default PartnerDialog;

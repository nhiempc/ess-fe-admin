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
import SelectParenPositionPopup from "./SelectParenPositionPopup";
import {
  saveItem,
  addItem,
  updateItem,
  checkCode,
  getAllPositions
} from "./PositionTitleService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

class PositionTitleDialog extends Component {
  state = {
    id: "",
    name: "",
    code: "",
    description: "",
    type: "",
    shouldOpenNotificationPopup: false,
    shouldOpenPositionTitlePopup:false,
    Notification: "",
    parent: {}
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
    let { code } = this.state;
    var { t } = this.props;
    checkCode(id, code).then((result) => {
      //Nếu trả về true là code đã được sử dụng
      if (result.data) {
        toast.warning(t("general.dupli_code"));
        // alert("Code đã được sử dụng");
      } else {
        //Nếu trả về false là code chưa sử dụng có thể dùng
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
  handleSelectParenPosition = (itemParent) => {
    let { t } = this.props;
    let { id } = this.state;
    //let { item } = this.state;
    console.log("itemParent", itemParent );
    if (id) {
              let isCheck = false;
              let parentClone = itemParent;
              let children = this.props.item;
              if(parentClone?.name == null) {

                this.setState({ parent: null }, () => {
                  this.handlePositionTitlePopupClose();
                });
              }

              if (children.parentId === null && children.id == parentClone.id) {
                isCheck = true;
              }
              while (parentClone != null) {
                if (parentClone.id == children.id) {
                  isCheck = true;
                  break;
                } else {
                  parentClone = parentClone.parent;
                }
              }
              
              if (isCheck) {
                toast.warning(t("Project.warning_parent"));
                return;
              }
    }
    this.setState({ parent: itemParent }, () => {
      this.handlePositionTitlePopupClose();
    });
    
  };
  handlePositionTitlePopupClose = () => {
    this.setState({
      shouldOpenPositionTitlePopup: false,
    });
  };
  componentWillMount() {
    //getUserById(this.props.uid).then(data => this.setState({ ...data.data }));
    let { open, handleClose, item } = this.props;
    this.setState({ ...item });
    getAllPositions().then((data) => {
      this.setState({
        listPosition: data.data
      })
    })

  }

  render() {
    let {
      id,
      name,
      code,
      description,
      type,
      parent,
      shouldOpenNotificationPopup,
      shouldOpenPositionTitlePopup
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
                <Button
                  style={{ float: "right" }}
                  //className=" mt-12"
                  variant="contained"
                  color="primary"
                  onClick={() =>
                    this.setState({ shouldOpenPositionTitlePopup: true, item: {} })
                  }
                >
                  {t("general.select")}
                </Button>
                <TextValidator
                  variant="outlined"
                  size="small"
                  InputProps={{
                    readOnly: true,
                  }}
                  label={t("PositionTitle.parent")}
                  className="w-80"
                  value={parent?.name || ""}
                />
                {shouldOpenPositionTitlePopup && (
                  <SelectParenPositionPopup
                    open={shouldOpenPositionTitlePopup}
                    handleSelect={this.handleSelectParenPosition}
                    selectedItem={parent != null ? parent : null}
                    handleClose={this.handlePositionTitlePopupClose}
                    t={t}
                    i18n={i18n}
                  />
                )}
              </Grid>
              <Grid item sm={12} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={
                    <span>
                      <span style={{ color: "red" }}>*</span>
                      {t("PositionTitle.name")}
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
                  className="w-100 "
                  label={
                    <span>
                      <span style={{ color: "red" }}>*</span>
                      {t("PositionTitle.code")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="text"
                  name="code"
                  value={code}
                  validators={["required"]}
                  errorMessages={[t("general.required")]}
                />
              </Grid>
              <Grid item sm={12} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={
                    <span>
                      {t("PositionTitle.type")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="number"
                  name="type"
                  value={type}
                />
              </Grid>
              <Grid item sm={12} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={
                    <span>
                      {t("PositionTitle.description")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="text"
                  name="description"
                  value={description}
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

export default PositionTitleDialog;

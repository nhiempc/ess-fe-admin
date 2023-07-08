import {
  Button, Dialog, DialogActions, DialogContent, DialogTitle, Grid, Paper
} from "@material-ui/core";
import React, { Component } from "react";
import Autocomplete from '@material-ui/lab/Autocomplete';
import Draggable from "react-draggable";
// import Paper from '@material-ui/core/Paper'
import { TextValidator, ValidatorForm } from "react-material-ui-form-validator";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  addShipOwnerRegister,
  updateShipOwnerRegister
} from "./ShipOwnerRegisterService";
import { searchByPage } from '../Nation/NationService'
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

class ShipOwnerRegisterDialog extends Component {
  state = {
    name: "",
    company: "",
    phoneNumber: "",
    type: 2,
    vacancies: "",
    specificRequirements: "",
    moreDetails: "",
    shouldOpenNotificationPopup: false,
    loading: true,
    nationality: null,
    listNation: []
  };

  handleDialogClose = () => {
    this.setState({ shouldOpenNotificationPopup: false });
  };

  handleChange = (event) => {
    event.persist();
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleFormSubmit = () => {
    let { id } = this.state;
    var { t } = this.props;
    if (id) {
      updateShipOwnerRegister({
        ...this.state,
      }).then(() => {
        toast.success(t("general.updateSuccess"));
        this.props.handleOKEditClose();
      });
    } else {
      addShipOwnerRegister({
        ...this.state,
      }).then(() => {
        toast.success(t("general.addSuccess"));
        this.props.handleOKEditClose();
      });
    }
  };

  componentWillMount() {
    //getUserById(this.props.uid).then(data => this.setState({ ...data.data }));
  }


  componentDidMount() {
    let { item } = this.props;
    this.setState({ ...item });
    searchByPage({
      pageSize: 9999,
      pageIndex: 1
    }).then(({ data }) => {
      this.setState({
        listNation: data.content
      })
    }).catch(() => {
      toast.error('Lấy thông tin quốc gia thất bại')
    }).finally(() => {
      this.setState({
        loading: false
      })
    })
  }
  render() {

    let {
      id,
      company,
      name,
      email,
      phoneNumber,
      moreDetails,
      specificRequirements,
      listNation,
      loading
    } = this.state;
    let { open, t } = this.props;
    return (
      loading ? <></> :
        <Dialog
          open={open}
          PaperComponent={PaperComponent}
          maxWidth="md"
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
              <Grid className="" container spacing={2}>
                <Grid item md={6} sm={12} xs={12}>
                  <TextValidator
                    className="w-100 "
                    label={
                      <span>
                        <span style={{ color: "red" }}>*</span>
                        {t("ShipOwnerRegister.name")}
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
                <Grid item md={6} sm={12} xs={12}>
                  <TextValidator
                    className="w-100 "
                    label={
                      <span>
                        <span style={{ color: "red" }}>*</span>
                        {t("ShipOwnerRegister.email")}
                      </span>
                    }
                    onChange={this.handleChange}
                    type="text"
                    name="email"
                    value={email}
                    validators={["required", "isEmail"]}
                    errorMessages={[t("general.required"), t("general.emailInvalid")]}
                  />
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                  <TextValidator
                    className="w-100 "
                    label={
                      <span>
                        <span style={{ color: "red" }}>*</span>
                        {t("ShipOwnerRegister.company")}
                      </span>
                    }
                    onChange={this.handleChange}
                    type="text"
                    name="company"
                    value={company}
                    validators={["required"]}
                    errorMessages={[t("general.required")]}
                  />
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                  <TextValidator
                    className="w-100 "
                    label={
                      <span>
                        <span style={{ color: "red" }}>*</span>
                        {t("ShipOwnerRegister.phoneNumber")}
                      </span>
                    }
                    onChange={this.handleChange}
                    type="text"
                    name="phoneNumber"
                    value={phoneNumber}
                    validators={["required"]}
                    errorMessages={[t("general.required")]}
                  />
                </Grid>
                <Grid item md={6} sm={12} xs={12}>
                  <Autocomplete
                    fullWidth
                    getOptionLabel={(option) => option?.name}
                    options={listNation}
                    value={this.state.nationality}
                    className="w-100"
                    onChange={(event, value) => {
                      console.log(value)
                      this.setState({
                        nationality: value
                      })
                    }}
                    style={{ width: 300 }}
                    renderInput={(params) => <TextValidator
                      {...params}
                      className="w-100 "
                      label={
                        <span>
                          <span style={{ color: "red" }}>*</span>
                          {t("ShipOwnerRegister.country")}
                        </span>
                      }
                    />}
                  />
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <TextValidator
                    className="w-100 "
                    label={
                      <span>

                        {t("ShipOwnerRegister.specificRequirements")}
                      </span>
                    }
                    rows={4}
                    id="outlined-multiline-static"
                    onChange={this.handleChange}
                    type="text"
                    name="specificRequirements"
                    value={specificRequirements}
                  />
                </Grid>
                <Grid item md={12} sm={12} xs={12}>
                  <TextValidator
                    className="w-100 "
                    label={
                      <span>
                        {t("ShipOwnerRegister.moreDetails")}
                      </span>
                    }
                    rows={4}
                    id="outlined-multiline-static"
                    onChange={this.handleChange}
                    type="text"
                    name="moreDetails"
                    value={moreDetails}
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

export default ShipOwnerRegisterDialog;

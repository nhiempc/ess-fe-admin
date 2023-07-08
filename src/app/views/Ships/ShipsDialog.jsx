import React, { Component } from "react";
import {
  Dialog,
  Button,
  Grid,
  DialogActions,
  Paper,
  DialogTitle,
  DialogContent,
} from "@material-ui/core";
// import Paper from '@material-ui/core/Paper'
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { searchByPage as searchNationaly } from '../Nation/NationService'
import { searchByPage as searchTypeOfShip } from '../TypeOfShip/TypeOfShipService'
import Draggable from "react-draggable";
import {
  saveItem,
  updateItem,
} from "./ShipsService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { isSpecialCharacters, isText, isDecimalNumber } from "app/appFunction";
import { appConst } from "app/AppConst";

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

class CertificateDialog extends Component {
  state = {
    id: "",
    name: "",
    code: "",
    description: "",
    type: "",
    shipsFlag: "",
    mEMakeModel: "",
    mEBHP: "",
    iMONumber: "",
    shouldOpenNotificationPopup: false,
    listTypeOfShip: [],
    listNationality: [],
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
    const { id , code, name, typeOfShip, ownerShip, manager, shipsFlag, nationality, captainNationality, dWT, gT, mEMakeModel, mEBHP, iMONumber, comment} = this.state;
    const { t } = this.props;

    const shipInfo = {
      id: id,
      name: name,
      code: code,
      typeOfShip: typeOfShip,
      ownerShip: ownerShip,
      manager: manager,
      shipsFlag: shipsFlag,
      nationality: nationality,
      captainNationality: captainNationality,
      dWT: dWT,
      gT: gT,
      mEMakeModel: mEMakeModel,
      mEBHP: mEBHP, 
      iMONumber: iMONumber,
      comment: comment
    }

    if (id) {
      updateItem(shipInfo)
      .then(({data}) => {
        if(data?.code === appConst.CODE.SUCCESS) {
          toast.success(t("general.updateSuccess"));
        } else {
          toast.warning(data?.message);
        }
        this.props.handleOKEditClose();
      })
      .catch(()=>{ toast.error('general.existShipName')})
    } else {
      saveItem(shipInfo)
      .then(({data}) => {
        if(data?.code === appConst.CODE.SUCCESS) {
          toast.success(t("general.addSuccess"));
        } else {
          toast.warning(data?.message);
        }
        this.props.handleOKEditClose();
      })
      .catch(()=>{toast.error('general.existShipName')})
    }
  };

  onAutocompleteChange = (value, state) => {
    this.setState({
      [state]: value
    })
  }

  componentDidMount() {
    ValidatorForm.addValidationRule('isText', isText);
    ValidatorForm.addValidationRule('isSpecialCharacters', isSpecialCharacters);
    ValidatorForm.addValidationRule('isDecimalNumber', isDecimalNumber)
    let { item } = this.props;
    this.setState({ ...item });
    searchNationaly({ pageSize: 1000, pageIndex: 1 }).then(({ data }) => {
      this.setState({
        listNationality: data.content
      })
    })
    searchTypeOfShip({ pageSize: 1000, pageIndex: 1 }).then(({ data }) => {
      this.setState({
        listTypeOfShip: data.content
      })
    })
  }

  componentWillUnmount() {
    // remove rule when it is not needed
    ValidatorForm.removeValidationRule('isText');
    ValidatorForm.removeValidationRule('isSpecialCharacters');
    ValidatorForm.removeValidationRule('isDecimalNumber');
  }

  render() {
    let {
      id,
      name,
      dWT,
      gT,
      code,
      ownerShip,
      manager,
      captainNationality,
      comment,
      nationality,
      typeOfShip,
      listTypeOfShip,
      listNationality,
      shipsFlag,
      mEMakeModel,
      mEBHP,
      iMONumber,
    } = this.state;
    let { open, t } = this.props;
    const filterAutocomplete = createFilterOptions()

    return (
      <Dialog
        open={open}
        PaperComponent={PaperComponent}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle
          style={{ cursor: "move", paddingBottom: "0px" }}
          id="draggable-dialog-title"
        >
          <h4>{id ? t("general.update") : t("general.add")}</h4>
        </DialogTitle>
        <ValidatorForm ref="form" onSubmit={this.handleFormSubmit}>
          <DialogContent>
            <Grid className="" container spacing={2}>
              <Grid item lg={4} sm={6} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={
                    <span>
                      <span className="colorRed">*</span>
                      {t("general.name")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="text"
                  name="name"
                  value={name ? name : null}
                  validators={[
                    "required",
                    "isText",
                    "matchRegexp:^.{1,255}$"
                  ]}
                  errorMessages={[
                    t("general.required"),
                    t("general.isText"),
                    t("general.isCharactersLength255")
                  ]}
                />
              </Grid>
              <Grid item lg={4} sm={6} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={
                    <span>
                      <span className="colorRed">*</span>
                      {t("general.code")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="text"
                  name="code"
                  value={code ? code : null}
                  validators={[
                    "required",
                    "matchRegexp:^[a-zA-Z0-9-_]*$",
                    "matchRegexp:^.{1,255}$"]}
                  errorMessages={[
                    t("general.required"),
                    "Chỉ bao gồm các ký tự A-Z, a-z, 0-9, -, _",
                    t("general.isCharactersLength255")
                  ]}
                />
              </Grid>
              <Grid item lg={4} sm={6} xs={12}>
                <Autocomplete
                  options={listTypeOfShip ? listTypeOfShip : []}
                  value={typeOfShip ? typeOfShip : null}
                  getOptionLabel={option => option.name}
                  onChange={(event, value) => { this.onAutocompleteChange(value, 'typeOfShip') }}
                  renderInput={(params) =>
                    <TextValidator
                      {...params}
                      label={
                        <span>
                          <span className="colorRed">*</span>
                          {t("fleetOfShip.shipType")}
                        </span>
                      }
                      value={typeOfShip ? typeOfShip : null}
                      validators={["required",]}
                      errorMessages={[t("general.required"),]}
                    />}
                  filterOptions={(options, params) => {
                    params.inputValue = params.inputValue.trim()
                    let filtered = filterAutocomplete(options, params)
                    return filtered
                  }}
                  noOptionsText={t("general.noOption")}
                />
              </Grid>
              <Grid item lg={6} sm={6} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={
                    <span>
                      <span className="colorRed">*</span>
                      {t("fleetOfShip.shipOwner")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="text"
                  name="ownerShip"
                  value={ownerShip ? ownerShip : null}
                  validators={[
                    "required",
                    "isText",
                    "matchRegexp:^.{1,255}$"
                  ]}
                  errorMessages={[
                    t("general.required"),
                    t("general.isText"),
                    t("general.isCharactersLength255")
                  ]}
                />
              </Grid>
              <Grid item lg={6} sm={6} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={
                    <span>
                      <span className="colorRed">*</span>
                      {t("fleetOfShip.managerment")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="text"
                  name="manager"
                  value={manager}
                  validators={[
                    "required",
                    "matchRegexp:^.{1,255}$"
                  ]}
                  errorMessages={[
                    t("general.required"),
                    t("general.isCharactersLength255")
                  ]}
                />
              </Grid>
              <Grid item lg={4} sm={6} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={
                    <span>
                      <span className="colorRed">*</span>
                      {t("fleetOfShip.shipsFlag")}
                    </span>
                  }
                  onChange={this.handleChange}
                  type="text"
                  name="shipsFlag"
                  value={shipsFlag ? shipsFlag : null}
                  validators={[
                    "required",
                    "isText",
                    "matchRegexp:^.{1,255}$"
                  ]}
                  errorMessages={[
                    t("general.required"),
                    t("general.isText"),
                    t("general.isCharactersLength255")
                  ]}
                />
              </Grid>
              <Grid item lg={4} sm={6} xs={12}>
                <Autocomplete
                  options={listNationality ? listNationality : []}
                  value={nationality ? nationality : null}
                  getOptionLabel={option => option.name}
                  onChange={(event, value) => { this.onAutocompleteChange(value, 'nationality') }}
                  renderInput={(params) =>
                    <TextValidator
                      {...params}
                      label={
                        <span>
                          <span className="colorRed">*</span>
                          {t("fleetOfShip.country")}
                        </span>
                      }
                      value={nationality ? nationality : null}
                      validators={["required",]}
                      errorMessages={[t("general.required"),]}
                    />}
                  filterOptions={(options, params) => {
                    params.inputValue = params.inputValue.trim()
                    let filtered = filterAutocomplete(options, params)
                    return filtered
                  }}
                  noOptionsText={t("general.noOption")}
                />
              </Grid>
              <Grid item lg={4} sm={6} xs={12}>
                <Autocomplete
                  options={listNationality ? listNationality : []}
                  value={captainNationality ? captainNationality : null}
                  getOptionLabel={option => option.name}
                  onChange={(event, value) => { this.onAutocompleteChange(value, 'captainNationality') }}
                  renderInput={(params) =>
                    <TextValidator
                      {...params}
                      label={
                        <span>
                          <span className="colorRed">*</span>
                          {t("fleetOfShip.captainNationality")}
                        </span>
                      }
                      value={captainNationality ? captainNationality : null}
                      validators={["required",]}
                      errorMessages={[t("general.required"),]}
                    />}
                  filterOptions={(options, params) => {
                    params.inputValue = params.inputValue.trim()
                    let filtered = filterAutocomplete(options, params)
                    return filtered
                  }}
                  noOptionsText={t("general.noOption")}
                />
              </Grid>
              <Grid item lg={6} sm={6} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={
                    <span>
                      <span className="colorRed">*</span>
                      {t("fleetOfShip.tonnage")}
                    </span>
                  }
                  onChange={this.handleChange}
                  onKeyDown={e => appConst?.isNumberFloat.includes(e.key) && e.preventDefault()}
                  type="number"
                  name="dWT"
                  value={dWT ? dWT : null}
                  validators={["required", "isDecimalNumber"]}
                  errorMessages={[t("general.required"), t("general.isDecimalNumber")]}
                />
              </Grid>
              <Grid item lg={6} sm={6} xs={12}>
                <TextValidator
                  className="w-100 "
                  label={
                    <span>
                      <span className="colorRed">*</span>
                      {t("fleetOfShip.vesselSpaceCapacity")}
                    </span>
                  }
                  onChange={this.handleChange}
                  onKeyDown={e => appConst?.isNumberFloat.includes(e.key) && e.preventDefault()}
                  type="number"
                  name="gT"
                  value={gT ? gT : null}
                  validators={["required", "isDecimalNumber"]}
                  errorMessages={[t("general.required"), t("general.isDecimalNumber")]}
                />
              </Grid>
              <Grid item lg={4} sm={6} xs={12}>
                <TextValidator
                  fullWidth
                  label={
                    <span>
                      <span className="colorRed">*</span>
                      M/E Make/Model
                    </span>
                  }
                  onChange={this.handleChange}
                  type="text"
                  name="mEMakeModel"
                  value={mEMakeModel ? mEMakeModel : null}
                  validators={["required"]}
                  errorMessages={[t("general.required")]}
                />
              </Grid>
              <Grid item lg={4} sm={6} xs={12}>
                <TextValidator
                  fullWidth
                  label={
                    <span>
                      <span className="colorRed">*</span>
                      M/E BHP
                    </span>
                  }
                  onChange={this.handleChange}
                  type="number"
                  name="mEBHP"
                  value={mEBHP ? mEBHP : null}
                  validators={["required", "isDecimalNumber"]}
                  errorMessages={[t("general.required"), t("general.isDecimalNumber")]}
                />
              </Grid>
              <Grid item lg={4} sm={6} xs={12}>
                <TextValidator
                  fullWidth
                  label={
                    <span>
                      <span className="colorRed">*</span>
                      IMO
                    </span>
                  }
                  onChange={this.handleChange}
                  type="text"
                  name="iMONumber"
                  value={iMONumber ? iMONumber : null}
                  validators={[
                    "required",
                    "matchRegexp:^[a-zA-Z0-9]*$",
                  ]}
                  errorMessages={[
                    t("general.required"),
                    "Chỉ bao gồm các ký tự A-Z, a-z, 0-9",
                  ]}
                />
              </Grid>
              <Grid item lg={12} sm={12} xs={12}>
                <TextValidator
                  className="w-100 "
                  multiLine
                  rowsMax={3}
                  label={t("fleetOfShip.comment")}
                  onChange={this.handleChange}
                  type="text"
                  name="comment"
                  value={comment ? comment : null}
                  validators={[
                    "isSpecialCharacters",
                    "matchRegexp:^.{1,255}$"
                  ]}
                  errorMessages={[
                    t("general.isSpecialCharacters"),
                    t("general.isCharactersLength255")
                  ]}
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

export default CertificateDialog;

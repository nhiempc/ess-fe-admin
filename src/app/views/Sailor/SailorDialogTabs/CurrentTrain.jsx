import React, { useEffect, useState } from "react";
import {
  Button,
  Grid,
  FormControl,
  Checkbox,
  FormControlLabel,
  Card,
  CardContent,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { searchByPage as searchPositionTitle } from "app/views/PositionTitle/PositionTitleService";
import {
  deleteCurrentShip,
  editCurrentShip,
  getCurrentShipByID,
  searchByPage as searchSailor
} from "app/views/Sailor/SailorService";
import { searchByPage as searchTypeOfShip } from "app/views/TypeOfShip/TypeOfShipService";
import { searchByPage as searchShip } from "app/views/Ships/ShipsService";
import { searchByPage as searchPositionTitleLevel } from "app/views/PositionTitleLevel/PositionTitleLevelService";
import { addCurrentShip } from "../SailorService";
import { toast } from "react-toastify";
import ValidatedDatePicker from "../../Component/ValidateSelect/ValidatePicker";
import { useTranslation } from "react-i18next";
import { ConfirmationDialog } from "../../../../egret";
import moment from "moment";

function CurrentTrain(props) {
  let { dataSailor } = props;
  let { t } = useTranslation();

  const [shouldOpenConfirmationDialog, setShouldOpenConfirmationDialog] = useState(false)
  const [shouldOpenFinishDialog, setShouldOpenFinishDialog] = useState(false)
  const [page, setPage] = useState(0)
  const [isView, setIsView] = useState(true)
  const [positionTitleLevelList, setPositionTitleLevelList] = useState([])
  const [positionTileList, setPositionTileList] = useState([])
  const [typeOfShipList, setTypeOfShipList] = useState([])
  const [shipList, setShipList] = useState([])
  const [viewOnly, setViewOnly] = useState(true)
  const [loading, setLoading] = useState(false)
  const [listIdShip, setListIdShip] = useState([])
  const [itemSelectWhenBlur, setItemSelectWhenBlur] = useState({})
  const [currentTrain, setCurrentTrain] = useState({
    bhp: '',
    companyName: "",
    dwt: null,
    endShip: null,
    contractExpiryDate: null,
    grt: null,
    id: '',
    imo: '',
    model: '',
    contractName: '',
    ship: '',
    positionTitle: '',
    positionTitleLevel: '',
    sailorId: '',
    shipFlag: '',
    signOffShip: null,
    signOnShip: null,
    contractStartDate: null,
    typeOfShip: '',
  })

  const handleClearDelete = () => {
    setCurrentTrain({
      ...currentTrain,
      bhp: '',
      companyName: '',
      dwt: null,
      endShip: null,
      contractExpiryDate: null,
      grt: null,
      id: '',
      imo: '',
      model: '',
      contractName: '',
      ship: '',
      positionTitle: '',
      positionTitleLevel: '',
      sailorId: '',
      shipFlag: '',
      signOffShip: null,
      signOnShip: null,
      contractStartDate: null,
      typeOfShip: '',
    })
  }

  useEffect(() => {
    setViewOnly(dataSailor.viewOnly)
    if (dataSailor.id) {
      getCurrentTrainByID()
    }
    searchbyPage();
   
    addValidationRule();

    return () => {
        removeValidationRule();
    }

  }, [])

  useEffect(() => {
    let listIdShip = shipList.reduce((list, item) => {
      return list.concat(item.id)
    }, [])

    setListIdShip([...listIdShip])
  }, [shipList])


  const removeValidationRule = () => {
    ValidatorForm.removeValidationRule("isNumber");
}

const addValidationRule = () => {
    let isNumber = new RegExp(/^\d+$/);

    ValidatorForm.addValidationRule('isNumber', (value) => {
      if(value){
        return isNumber.test(value);
      } 
      return true
      });
}
  const searchbyPage = () => {
    let searchObject = {};
    searchObject.keyword = "";
    searchObject.pageIndex = page + 1;
    searchObject.pageSize = 999;
    searchPositionTitle(searchObject).then(({ data }) => {
      setPositionTileList([...data.content])
    });
    searchPositionTitleLevel(searchObject).then(({ data }) => {
      setPositionTitleLevelList([...data.content])
    });
    searchTypeOfShip(searchObject).then(({ data }) => {
      setTypeOfShipList([...data.content])
    });
    searchShip(searchObject).then(({ data }) => {
      setShipList([...data.content])
    });
  };

  const getCurrentTrainByID = () => {
    getCurrentShipByID(dataSailor.id)
      .then(({ data }) => {
        setCurrentTrain({ ...data.data })
      })
  }

  const searchCurrentShipById = (shipId) => {
    let temporaryData = shipList.find(item => {
      return item.id === shipId
    })
    currentTrain.ship = temporaryData
    currentTrain.imo = temporaryData?.iMONumber
    currentTrain.shipFlag = temporaryData?.shipsFlag
    currentTrain.typeOfShip = temporaryData?.typeOfShip || ''
    currentTrain.grt = temporaryData?.gT
    currentTrain.dwt = temporaryData?.dWT
    currentTrain.model = temporaryData?.mEMakeModel
    currentTrain.bhp = temporaryData?.mEBHP

    setCurrentTrain({ ...currentTrain })
  }

  const handleCheck = (event) => {
    setCurrentTrain({ ...currentTrain, [event.target.name]: event.target.checked })
  }

  const handleChange = (event, source) => {
    if (source) {
      if (source === "contractStartDate" || source === "contractExpiryDate" || source === "signOnShip" || source === "signOffShip") {
        setCurrentTrain({ ...currentTrain, [source]: event })
      } else {
        setCurrentTrain({ ...currentTrain, [source]: event.target.value })
      }
    }
    else {
      currentTrain[event?.target?.name] = event?.target?.value;
      setCurrentTrain({ ...currentTrain, [event.target.name]: event.target.value })
    }
  };

  const handleDelete = () => {
    if (currentTrain?.id) {
      deleteCurrentShip(currentTrain.id)
        .then(({ data }) => {
          if (data.code === 200) {
            toast.success(t("general.deleteSuccess"))
            handleClearDelete()
            setShouldOpenConfirmationDialog(false)
          }
          else { toast.warning(data.message) }
        })
        .catch(err => toast.error(err))
    } else {
      handleClearDelete()
      setShouldOpenConfirmationDialog(false)
    }
  }

  const handleResponseSubmit = (data) => {
    if (data.code === 200 && data.data !== null) {
      toast.success(data.message)
      setCurrentTrain({ ...data.data })
    } else {
      if(data.code === 200 && currentTrain.endShip === true && data.data === null){
        handleClearDelete()
        toast.success(data.message)
      }
      else {
        toast.error(data.message)
      }
    }
    setLoading(false)
  }

  const handleAddTrain = () => {
    if (currentTrain?.id) {
      editCurrentShip(currentTrain, currentTrain.id)
        .then(({ data }) => {
          handleResponseSubmit(data)
        })
        .catch((err) => {
          toast.error(err.response.data.message)
          setLoading(false)
        })
    } else {
      addCurrentShip(currentTrain, dataSailor.id)
        .then(({ data }) => {
          handleResponseSubmit(data)
        })
        .catch((err) => {
          toast.error(err.response.data.message)
          setLoading(false)
        })
    }
  }

  const handleChangeAutoComplete = (value, source) => {
    if (value?.name) {
      if (source === 'ship') {
        if (!value?.id) {
          setIsView(false)
          currentTrain.bhp = ''
          currentTrain.dwt = 0
          currentTrain.grt = 0
          currentTrain.imo = null
          currentTrain.model = ''
          currentTrain.typeOfShip = {}
          currentTrain.shipFlag = ''
          setCurrentTrain({
            ...currentTrain,
          })
        } else {
          searchCurrentShipById(value?.id)
        }
      }
      setCurrentTrain({
        ...currentTrain,
        [source]: value
      });
    }
  };

  const handleChangeShip = (event) => {
    let newShip = {name: event.target.value, id: null}
    if (listIdShip.includes(newShip.id)) {
      shipList.forEach((item, index) => {
        if (item.id === newShip.id) {
          shipList.splice(index, 1, newShip)
          setShipList([...shipList])
        }
      })
    } else {
      shipList.push(newShip)
    }
    setItemSelectWhenBlur({...newShip})
    setShipList([...shipList])
  }

  const handleSubmit = () => {
    setLoading(true)
    if (currentTrain.endShip == true) {
      setShouldOpenFinishDialog(true)
    } else {
      handleAddTrain()
    }
  };

  const toggleCurrentPrevious = async () => {
    setShouldOpenFinishDialog(false)
    handleAddTrain()
  }
  return (
    <div>
      <ValidatorForm onSubmit={handleSubmit}>
        <Card elevation={0}>
          {shouldOpenConfirmationDialog && (
            <ConfirmationDialog
              title={t("confirm")}
              open={shouldOpenConfirmationDialog}
              onConfirmDialogClose={() => { setShouldOpenConfirmationDialog(false) }}
              onYesClick={handleDelete}
              text={t("Sailor.deleteConfirm")}
              cancel={"Hủy"}
              agree={"Đồng ý"}
            />
          )}

          {shouldOpenFinishDialog && (
            <ConfirmationDialog
              title={t("confirm")}
              open={shouldOpenFinishDialog}
              onConfirmDialogClose={() => {
                setLoading(false)
                setShouldOpenFinishDialog(false)
              }}
              onYesClick={() => toggleCurrentPrevious()}
              text={t("Xác nhận chuyển sang kinh nghiệm trước đây?")}
              cancel={"Hủy"}
              agree={"Đồng ý"}
            />
          )}
          <CardContent>
            <Grid xs={12} container spacing={1} className="mb-4">
              <Grid item xs={3}>
                <TextValidator
                  fullWidth
                  multiline
                  label={
                    <span>
                      {t("Contract.name")}
                      <span style={{ color: "red" }}>*</span>
                    </span>
                  }
                  type="text"
                  name="contractName"
                  value={currentTrain?.contractName}
                  InputProps={{ readOnly: viewOnly }}
                  onChange={handleChange}
                  validators={["required"]}
                  errorMessages={[t("general.required")]}

                />
              </Grid>
              <Grid item xs={3}>
                <ValidatedDatePicker
                  fullWidth
                  format="dd/MM/yyyy"
                  placeholder="dd/MM/yyyy"
                  id="contractStartDate"
                  name="contractStartDate"
                  label={
                    <span>
                      {t("Contract.startDate")}
                      <span style={{ color: "red" }}>
                        *
                      </span>
                    </span>
                  }
                  InputProps={{ readOnly: viewOnly }}
                  value={currentTrain?.contractStartDate || null}
                  onChange={(e) => handleChange(e, 'contractStartDate')}
                  KeyboardButtonProps={{ "aria-label": "change date", }}
                  maxDate={currentTrain?.contractExpiryDate && new Date(currentTrain?.contractExpiryDate)}
                  maxDateMessage={currentTrain?.contractExpiryDate && t("validateMessage.maxDate") + "hết hạn"}
                  minDateMessage={t("validateMessage.minDate") + "01/01/1900"}
                  minDate={new Date('01/01/1900')}
                  invalidDateMessage={t("validateMessage.invalidDate")}
                  validators={["required"]}
                  errorMessages={[t("general.required")]}
                />

              </Grid>
              <Grid item xs={3}>
                <ValidatedDatePicker
                  fullWidth
                  format="dd/MM/yyyy"
                  placeholder="dd/MM/yyyy"
                  id="contractExpiryDate"
                  label={
                    <span>
                      {t("Contract.expiryDate")}
                      <span style={{ color: "red" }}>*</span>
                    </span>
                  }
                  name="contractExpiryDate"
                  InputProps={{ readOnly: viewOnly }}
                  value={currentTrain?.contractExpiryDate || null}
                  onChange={(e) => handleChange(e, 'contractExpiryDate')}
                  KeyboardButtonProps={{ "aria-label": "change date", }}
                  minDate={new Date(currentTrain?.contractStartDate)}
                  minDateMessage={t("validateMessage.minDate") + "bắt đầu"}
                  invalidDateMessage={t("validateMessage.invalidDate")}
                  validators={["required"]}
                  errorMessages={[t("general.required")]}
                />
              </Grid>
              <Grid item xs={3}>
                <TextValidator
                  fullWidth
                  label={<span>
                    {t("Đơn vị")}
                    <span style={{ color: "red" }}>
                      *
                    </span>
                  </span>}
                  type="text"
                  multiline
                  name="companyName"
                  InputProps={{ readOnly: viewOnly }}
                  value={currentTrain?.companyName}
                  onChange={handleChange}
                  validators={["required",]}
                  errorMessages={[t("general.required"),]}
                />
              </Grid>
            </Grid>
            <Grid xs={12} container spacing={1} className="mb-4">
              <Grid item xs={3}>
                <Autocomplete
                  fullWidth
                  onChange={
                    (e, newOption) => handleChangeAutoComplete(newOption, "ship")
                  }
                  getOptionLabel={(option) => option.name}
                  readOnly={viewOnly}
                  value={currentTrain?.ship}
                  options={shipList}
                  onBlur={() => handleChangeAutoComplete(itemSelectWhenBlur, "ship")}
                  renderInput={(params) =>
                    viewOnly ?
                      <TextValidator
                        {...params}
                        label={
                          <span>
                            {t("Sailor.ship")}
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        onChange={(e)=>handleChangeShip(e)}
                        value={currentTrain?.ship}
                        InputProps={{ readOnly: viewOnly }}
                      />
                      :
                      <TextValidator
                        {...params}
                        label={
                          <span>
                            {t("Sailor.ship")}
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        value={currentTrain?.ship}
                        validators={["required"]}
                        onChange={(e)=>handleChangeShip(e)}
                        errorMessages={[t("general.required")]}
                      />
                  }
                />
              </Grid>
              <Grid item xs={3}>
                <TextValidator
                  fullWidth
                  multiline
                  label={
                    <span>
                      Số IMO
                      <span hidden={isView} style={{ color: "red" }}>*</span>
                    </span>
                  }
                  type="text"
                  name="imo"
                  onChange={(e)=>{handleChange(e)}}
                  disabled={isView}
                  value={currentTrain?.imo || ''}
                  validators={!isView ? ["required", "matchRegexp:^.{1,50}$"] : []}
                  errorMessages={!isView ? [t("general.required"), t("validateMessage.maxIMO")] : []}

                />
              </Grid>
              <Grid item xs={3}>
                <TextValidator
                  fullWidth
                  multiline
                  label={
                    <span>
                      Cờ tàu
                      <span hidden={isView} style={{ color: "red" }}>*</span>
                    </span>
                  }
                  type="text"
                  name="shipFlag"
                  onChange={(e)=>{handleChange(e)}}
                  disabled={isView}
                  value={currentTrain?.shipFlag || ''}
                  validators={!isView ? ["required"] : []}
                  errorMessages={!isView ? [t("general.required")] : []}
                />
              </Grid>
              <Grid item xs={3}>
                <Autocomplete
                  fullWidth
                  onChange={
                    (e, newOption) => handleChangeAutoComplete(newOption, "typeOfShip")
                  }
                  getOptionLabel={(option) => option.name}
                  value={currentTrain?.typeOfShip }
                  disabled={isView}
                  options={typeOfShipList}
                  validators={!isView ? ["required"] : []}
                  errorMessages={!isView ? [t("general.required")] : []}
                  renderInput={(params) =>
                    isView ?
                      <TextValidator
                        {...params}
                        label={
                          <span>
                            {t("Dashboard.typeofship")}
                            <span hidden={isView} style={{ color: "red" }}>*</span>
                          </span>
                        }
                        readOnly={isView}
                        value={currentTrain?.typeOfShip?.name || ''}
                        
                      />
                      :
                      <TextValidator
                        {...params}
                        label={
                          <span>
                            {t("Dashboard.typeofship")}
                            <span hidden={isView} style={{ color: "red" }}>*</span>
                          </span>
                        }
                        value={currentTrain?.typeOfShip?.name || ''}
                        validators={!isView ? ["required"] : []}
                        errorMessages={!isView ? [t("general.required")] : []}
                      />
                  }
                />
              </Grid>
            </Grid>
            <Grid xs={12} container spacing={1} className="mb-4">
              <Grid item xs={3}>
                <Autocomplete
                  fullWidth
                  onChange={
                    (e, newOption) => handleChangeAutoComplete(newOption, "positionTitleLevel")
                  }
                  getOptionLabel={(option) => option.name}
                  readOnly={viewOnly}
                  value={currentTrain?.positionTitleLevel}
                  options={positionTitleLevelList}
                  renderInput={(params) =>
                    viewOnly ?
                      <TextValidator
                        {...params}
                        label={
                          <span>
                            {t("Dashboard.PositionTitleLevelId")}
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        value={currentTrain?.positionTitleLevel}
                        InputProps={{ readOnly: viewOnly }}
                      />
                      :
                      <TextValidator
                        {...params}
                        label={
                          <span>
                            {t("Dashboard.PositionTitleLevelId")}
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        value={currentTrain?.positionTitleLevel}
                        validators={["required"]}
                        errorMessages={[t("general.required")]}
                      />
                  }
                />


              </Grid>
              <Grid item xs={3}>
                <Autocomplete
                  fullWidth
                  onChange={
                    (e, newOption) => handleChangeAutoComplete(newOption, "positionTitle")
                  }
                  getOptionLabel={(option) => option.name}
                  readOnly={viewOnly}
                  value={currentTrain?.positionTitle}
                  options={positionTileList}
                  renderInput={(params) =>
                    viewOnly ?
                      <TextValidator
                        {...params}
                        label={
                          <span>
                            {t("Sailor.positionTileId")}
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        value={currentTrain?.positionTitle}
                        InputProps={{ readOnly: viewOnly }}
                      />
                      :
                      <TextValidator
                        {...params}
                        label={
                          <span>
                            {t("Sailor.positionTileId")}
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        value={currentTrain?.positionTitle}
                        validators={["required"]}
                        errorMessages={[t("general.required")]}
                      />
                  }
                />
              </Grid>
              <Grid item xs={3}>
                <ValidatedDatePicker
                  fullWidth
                  format="dd/MM/yyyy"
                  placeholder="dd/MM/yyyy"
                  label={
                    <span>
                      {t("Sailor.signOn")}
                      <span style={{ color: "red" }}>
                        *
                      </span>
                    </span>
                  }
                  name="signOnShip"
                  InputProps={{ readOnly: viewOnly }}
                  value={currentTrain?.signOnShip || null}
                  InputLabelProps={{ shrink: true }}
                  onChange={(e) => handleChange(e, 'signOnShip')}
                  KeyboardButtonProps={{ "aria-label": "change date", }}
                  minDateMessage={t("validateMessage.minDate") +"01/01/1900"}
                  minDate={new Date('01/01/1900')}
                  maxDate={ currentTrain?.signOffShip && currentTrain?.signOffShip}
                  maxDateMessage={currentTrain?.signOffShip && t("validateMessage.maxDate") + "xuống tàu"}
                  invalidDateMessage={"Ngày không hợp lệ"}
                  validators={["required"]}
                  errorMessages={[t("general.required")]}
                />
              </Grid>
              <Grid item xs={3}>
                <ValidatedDatePicker
                  fullWidth
                  format="dd/MM/yyyy"
                  placeholder="dd/MM/yyyy"
                  id="leaveDate"
                  label={
                    <span>
                      {t("Sailor.signOff")}
                      <span hidden={!currentTrain?.endShip} style={{ color: "red" }}>
                        *
                      </span>
                    </span>
                  }
                  name="signOffShip"
                  InputLabelProps={{ readOnly: viewOnly, shrink: true }}
                  value={currentTrain?.signOffShip || null}
                  defaultValue={""}
                  onChange={(e) => handleChange(e, 'signOffShip')}
                  KeyboardButtonProps={{ "aria-label": "change date", }}
                  minDate={currentTrain?.signOnShip}
                  minDateMessage={t("validateMessage.minDate") +"lên tàu"}
                  invalidDateMessage={t("validateMessage.invalidDate")}
                />
              </Grid>
            </Grid>
            <Grid container xs={12} spacing={1} className="mb-4">
              <Grid item xs={3}>
                <TextValidator
                  fullWidth
                  multiline
                  label={
                    <span>
                      grt
                      <span hidden={isView} style={{ color: "red" }}>*</span>
                    </span>
                  }
                  type="number"
                  onChange={(e)=>{handleChange(e)}}
                  name="grt"
                  disabled={isView}
                  value={currentTrain?.grt || ''}
                  validators={!isView ? ["required", "isNumber"] : []}
                  errorMessages={!isView ? [t("general.required"), "GRT " +t("validateMessage.isNumber")] : []}
                />
              </Grid>
              <Grid item xs={3}>
                <TextValidator
                  fullWidth
                  multiline
                  label={
                    <span>
                      DWT
                      <span hidden={isView} style={{ color: "red" }}>*</span>
                    </span>
                  }
                  type="number"
                  onChange={(e)=>{handleChange(e)}}
                  disabled={isView}
                  name="dwt"
                  value={currentTrain?.dwt || ''}
                  validators={!isView ? ["required", "isNumber"] : []}
                  errorMessages={!isView ? [t("general.required"), "DWT " + t("validateMessage.isNumber")] : []}
                />
              </Grid>
              <Grid item xs={3}>
                <TextValidator
                  fullWidth
                  multiline
                  label={
                    <span>
                      M/E Make/Model
                      <span hidden={isView} style={{ color: "red" }}>*</span>
                    </span>
                  }
                  type="text"
                  onChange={(e)=>{handleChange(e)}}
                  disabled={isView}
                  name="model"
                  value={currentTrain?.model || ''}
                  validators={!isView ? ["required"] : []}
                  errorMessages={!isView ? [t("general.required")] : []}
                />
              </Grid>
              <Grid item xs={3}>
                <TextValidator
                  fullWidth
                  multiline
                  label={
                    <span>
                      M/E BHP
                      <span hidden={isView} style={{ color: "red" }}>*</span>
                    </span>
                  }
                  type="text"
                  onChange={(e)=>{handleChange(e)}}
                  disabled={isView}
                  name="bhp"
                  value={currentTrain?.bhp || ''}
                  validators={!isView ? ["required", "isNumber"] : []}
                  errorMessages={!isView ? [t("general.required"), "M/E BHP "+ t("validateMessage.isNumber")] : []}
                />
              </Grid>
            </Grid>
            <Grid container xs={12} className="mb-30">
              <Grid item xs={3}>
                <FormControl component="fieldset" >
                  <FormControlLabel
                    control={
                      <Checkbox
                        name='endShip'
                        color="primary"
                        onChange={handleCheck}
                        checked={currentTrain?.endShip}
                        disabled={viewOnly}
                      />
                    }
                    label="Kết thúc chuyến tàu"
                    labelPlacement="end"
                  />
                </FormControl>
              </Grid>
            </Grid>

            {viewOnly ? null : <Grid
              container
              xs={12}
              spacing={2}
              justifyContent="center"
              className="mt-10"
            >
              <Button
                variant="contained"
                className="mr-12"
                disabled={loading}
                color="secondary"
                onClick={() => setShouldOpenConfirmationDialog(true)}
              >
                {t("general.delete")}
              </Button>
              <Button
                variant="contained"
                color="primary"
                disabled={loading}
                type="submit">
                {t("general.save")}
              </Button>
            </Grid>}
          </CardContent>
        </Card>
      </ValidatorForm>
    </div>
  )
}

export default CurrentTrain;

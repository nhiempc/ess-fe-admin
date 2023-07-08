import React, { Component } from "react";
import {
  Button,
  Grid,
  Card,
  CardContent,
  CardHeader,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { searchByPage as searchPart } from "app/views/PositionTitle/PositionTitleService";
import { getCurrentShip, getExperienceByIdSailor, removeExperience, searchByPage as searchSailor } from "app/views/Sailor/SailorService";
import { searchByPage as searchPositionTitleLevel } from "app/views/PositionTitleLevel/PositionTitleLevelService";
import { toast } from "react-toastify";
import { addPreviousExperience } from "../SailorService";
import moment from "moment/moment";
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import ValidatedDatePicker from "../../Component/ValidateSelect/ValidatePicker";
import { searchByPage as searchTypeOfShip } from "../../TypeOfShip/TypeOfShipService";
import { searchByPage as searchShip } from "../../Ships/ShipsService";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ConfirmationDialog } from "egret";


function Experience(props) {
  let { t } = useTranslation()
  let { dataSailor } = props
  const [partList, setPartList] = useState([])
  const [positionTitleLevelList, setPositionTitleLevelList] = useState([])
  const [shipList, setShipList] = useState([])
  const [typeOfShipList, setTypeOfShipList] = useState([])
  const [loading, setLoading] = useState(false)
  const [viewOnly, setViewOnly] = useState(dataSailor.viewOnly)
  const [shouldOpenDeleteDialog, setShouldOpenDeleteDialog] = useState(false)
  const [idDelete, setIdDelete] = useState('')
  const [listIdShip, setListIdShip] = useState([])
  const [itemSelectWhenBlur, setItemSelectWhenBlur] = useState({})
  const [isView, setIsView] = useState(true)
  const [preExperience, setPreExperience] = useState({
    itemList: [],
    page: 0,
    rowsPerPage: 5
  })

  useEffect(() => {
    getDataList();
    if (dataSailor?.id) {
      updateTabData(dataSailor.id)
    } else {
      handleAdd()
    }
    addRuleValidation();

    return () => removeValidationRule();
  }, [])

  useEffect(()=>{
    let listIdShip = shipList.reduce((list, item)=>{
      return list.concat(item.id)
    }, [])
    setListIdShip([...listIdShip])
  }, [shipList])

  const getDataList = () => {
    let searchObject = {};
    searchObject.keyword = "";
    searchObject.pageIndex = preExperience.page + 1;
    searchObject.pageSize = 999;

    searchPart(searchObject).then(({ data }) => {
      setPartList([...data.content])
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

  const updateTabData = (id) => {
    getExperienceByIdSailor(id)
      .then(({ data }) => {
        if (data?.data.length === 0) {
          handleAdd();
        } else {
          preExperience.itemList = data.data
          setPreExperience({ ...preExperience, itemList: preExperience.itemList })
        }
      })
      .catch(err => { toast.error(err) })
  }

  const addRuleValidation = () => {
    let isNumber = new RegExp(/^\d+$/);

    ValidatorForm.addValidationRule('isNumber', (value) => {
      if(value){
        return isNumber.test(value);
      } return true
    });
  }

  const removeValidationRule = () => {
    ValidatorForm.removeValidationRule("isNumber");
  }

  const handleAdd = () => {
    let newObj = {
      imo: null,
      ship: '',
      shipFlag: null,
      companyName: null,
      part: null,
      startTime: null,
      endTime: null,
      grt: null,
      dwt: null,
      model: null,
      bhp: null,
      typeOfShip: null,
      positionTitleLevelId: "",
    };
    preExperience.itemList.push(newObj);
    setPreExperience({ ...preExperience, itemList: preExperience.itemList });
  };

  const handleDelete = (idDelete) => {
    setIdDelete(idDelete)
    setShouldOpenDeleteDialog(true)
  };

  const handleChange = (event, index, source) => {
    let item = preExperience.itemList[index];
    if (source) {
      item[source] = event
    }
    item[event?.target?.name] = event?.target?.value;
    setPreExperience({ ...preExperience, itemList: preExperience.itemList });
  };

  const handleChangeNumber = (event, index) => {
    let item = preExperience.itemList[index];
    if ((/^[0-9]*$/).test(event.target?.value))
      item[event.target?.name] = Number(event.target?.value);
    else return;
    setPreExperience({ ...preExperience, itemList: preExperience.itemList });
  };

  const handleChangeSelect = (value, source, index) => {
    if (value.name) {
      let selectedShip = shipList.find(item => {
        return item.id === value?.id
      })
      let item = preExperience.itemList[index];
      if (source === "ship") {
        if (!value?.id) {
          setIsView(false)
          item.bhp = ''
          item.dwt = 0
          item.grt = 0
          item.imo = ''
          item.model = ''
          item.typeOfShip = {}
          item.shipFlag = ''
        } else {
          item.ship = selectedShip
          item.imo = selectedShip?.iMONumber || ''
          item.model = selectedShip?.mEMakeModel
          item.bhp = selectedShip?.mEBHP
          item.grt = selectedShip?.gT
          item.dwt = selectedShip?.dWT
          item.shipFlag = selectedShip?.shipsFlag
          item.typeOfShip = selectedShip?.typeOfShip
        }
      }
      item[source] = value
    }
    setPreExperience({ ...preExperience, itemList: preExperience.itemList });
  };

  const handleChangeShip = (event) => {
    let itemTemporary = {name: event.target.value, id: null}
    if (listIdShip.includes(itemTemporary.id)) {
      shipList.forEach((item, index) => {
        if (item.id === itemTemporary.id) {
          shipList.splice(index, 1, itemTemporary)
          setShipList([...shipList])
        }
      })
    } else {
      shipList.push(itemTemporary)
    }
    setItemSelectWhenBlur({...itemTemporary})
    setShipList([...shipList])
  }

  const handleConfirmDelete = () => {
    if (preExperience.itemList[idDelete]?.id) {
      removeExperience(preExperience.itemList[idDelete].id)
        .then(({ data }) => {
          toast.success(t("general.deleteSuccess"))
          preExperience.itemList.splice(idDelete, 1)
          setShouldOpenDeleteDialog(false)
          updateTabData(dataSailor.id)
        })
        .catch((err) => {
          toast.error(err)
        })
    } else {
      preExperience.itemList.splice(idDelete, 1)
      setShouldOpenDeleteDialog(false)
    }
  };

  const handleSubmit = () => {
    setLoading(true)
    addPreviousExperience(preExperience.itemList, dataSailor.id)
      .then(({ data }) => {
        if (data.code === 200) {
          toast.success(t("general.addSuccess"));
          updateTabData(dataSailor?.id)
        } else {
          toast.error(data.message)
        }
        setLoading(false)
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        setLoading(false)
      });
  };

  return <div>
    {shouldOpenDeleteDialog && (
      <ConfirmationDialog
        title={t("confirm")}
        open={shouldOpenDeleteDialog}
        onConfirmDialogClose={() => setShouldOpenDeleteDialog(false)}
        onYesClick={handleConfirmDelete}
        text={t("Sailor.deleteConfirm")}
        cancel={"Hủy"}
        agree={"Đồng ý"}
      />
    )}
    <ValidatorForm onSubmit={() => handleSubmit()}>
      {
        preExperience.itemList?.map((item, index) => {
          return (
            <div id={index} key={index} className={index !== 0 ? 'mt-10' : ''}>
              <Card elevation={5}>
                <CardHeader
                  className="pb-0"
                  titleTypographyProps={{
                    variant: "subtitle1",
                    className: "text-info",
                    style: { fontWeight: 500 }
                  }}
                  title={"Kinh nghiệm " + (index + 1) + ":"}
                  action={
                    viewOnly ? null :
                      <Grid
                        container
                        xs={12}
                        justifyContent="flex-end">
                        <IconButton
                          size="small"
                          className="mr-8">
                          <CloseIcon
                            inputProps={{ readOnly: viewOnly }}
                            variant="contained"
                            color="error"
                            fontSize="small"
                            onClick={() =>
                              handleDelete(index)
                            }
                          />
                        </IconButton>
                      </Grid>
                  }
                />
                <CardContent >
                  <Grid xs={12} container spacing={1} className="mb-8">

                    <Grid item xs={4}>
                      <Autocomplete
                        fullWidth
                        onChange={
                          (e, newOption) => handleChangeSelect(newOption, "ship", index)
                        }
                        getOptionLabel={(option) => option.name}
                        readOnly={viewOnly}
                        name="ship"
                        value={item?.ship || null}
                        options={shipList}
                        onBlur={() => handleChangeSelect(itemSelectWhenBlur, "ship", index)}
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
                              value={item?.ship || null}
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
                              onChange={(e)=>handleChangeShip(e)}
                              value={item?.ship || null}
                              validators={["required"]}
                              errorMessages={[t("general.required")]}
                            />
                        }
                      />


                    </Grid>
                    <Grid item xs={4}>
                      <TextValidator
                        fullWidth
                        label={
                          <span>
                            IMO
                            <span hidden={isView} style={{ color: "red" }}>*</span>
                          </span>
                        }
                        type="text"
                        name="imo"
                        value={item?.imo || ""}
                        disabled={isView}
                        onChange={(e) => handleChange(e, index)}
                        inputProps={{ readOnly: isView }}
                        validators={!isView ? ["required", "matchRegexp:^.{1,50}$"] : []}
                        errorMessages={!isView ? [t("general.required"), t("validateMessage.maxIMO")] : []}
                      />
                    </Grid>

                    <Grid item xs={4}>
                      <TextValidator
                        fullWidth
                        label={
                          <span>
                            {t("fleetOfShip.shipsFlag")}
                            <span hidden={isView} style={{ color: "red" }}>*</span>
                          </span>
                        }
                        type="text"
                        name="shipFlag"
                        disabled={isView}
                        value={item?.shipFlag || ""}
                        onChange={(e) => handleChange(e, index)}
                        validators={!isView ? ["required"] : []}
                        errorMessages={!isView ? [t("general.required")] : []}  
                      />
                    </Grid>
                  </Grid>
                  <Grid xs={12} container spacing={1} className="mb-8">
                    <Grid item xs={4}>
                      <Autocomplete
                        fullWidth
                        onChange={
                          (e, newOption) => handleChangeSelect(newOption, "typeOfShip", index)
                        }
                        getOptionLabel={(option) => option.name}
                        disabled={isView}
                        value={item?.typeOfShip || null}
                        options={typeOfShipList}
                        renderInput={(params) =>
                          viewOnly ?
                            <TextValidator
                              {...params}
                              label={
                                <span>
                                  {t("Dashboard.typeofship")}
                                  <span hidden={isView} style={{ color: "red" }}>*</span>
                                </span>
                              }
                              validators={!isView ? ["required"] : []}
                              errorMessages={!isView ? [t("general.required")] : []}
                              value={item?.typeOfShip?.name || ''}
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
                              value={item?.typeOfShip?.name || ''}
                              validators={!isView ? ["required"] : []}
                              errorMessages={!isView ? [t("general.required")] : []}
                            />
                        }
                      />
                    </ Grid>
                    <Grid item xs={4}>
                      <TextValidator
                        fullWidth
                        multiline
                        label={t("Sailor.unit")}
                        type="text"
                        name="companyName"
                        value={item?.companyName || ""}
                        onChange={(e) => { handleChange(e, index); }}
                        inputProps={{ readOnly: viewOnly }}
                        validators={item?.companyName && ["maxStringLength:255"]}
                        errorMessages={[t("general.maxLength255")]}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <Autocomplete
                        fullWidth
                        onChange={
                          (e, newOption) => handleChangeSelect(newOption, "positionTitleLevel", index)
                        }
                        getOptionLabel={(option) => option.name}
                        readOnly={viewOnly}
                        value={item?.positionTitleLevel || null}
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
                              value={item?.positionTitleLevel || null}
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
                              value={item?.positionTitleLevel || null}
                              validators={["required"]}
                              errorMessages={[t("general.required")]}
                            />
                        }
                      />

                    </Grid>
                  </Grid>
                  <Grid xs={12} container spacing={1} className="mb-8">
                    <Grid item xs={4}>
                      <ValidatedDatePicker
                        className="m-0"
                        fullWidth
                        format="dd/MM/yyyy"
                        margin="normal"
                        label={
                          <span>
                            {t("Sailor.prevExpStart")}
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        placeholder="dd/mm/yyyy"
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ readOnly: viewOnly }}
                        value={item?.startTime || null}
                        onChange={(e) => handleChange(e, index, "startTime")}
                        KeyboardButtonProps={{ "aria-label": "change date", }}
                        validators={["required"]}
                        errorMessages={[t("general.required")]}
                        minDateMessage={t("validateMessage.minDate") + "01/01/1900"}
                        minDate={new Date('01/01/1900')}
                        maxDate={item?.endTime ? new Date(item?.endTime) : new Date()}
                        maxDateMessage={
                          item?.endTime 
                          ? t('validateMessage.maxDate') + "ngày kết thúc" 
                          : t("validateMessage.maxDate") + "hiện tại"
                        }
                        invalidDateMessage={"Ngày không hợp lệ"}
                      
                      
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <ValidatedDatePicker
                        className="m-0"
                        fullWidth
                        format="dd/MM/yyyy"
                        margin="normal"
                        id="endTime"
                        label={
                          <span>
                            {t("Sailor.prevExpEnd")}
                            <span style={{ color: "red" }}>*</span>
                          </span>
                        }
                        placeholder="dd/mm/yyyy"
                        InputLabelProps={{ shrink: true }}
                        inputProps={{ readOnly: viewOnly }}
                        value={item?.endTime || null}
                        onChange={(e) => { handleChange(e, index, "endTime"); }}
                        KeyboardButtonProps={{ "aria-label": "change date", }}
                        validators={["required"]}
                        errorMessages={[t("general.required")]}
                        minDateMessage={t("validateMessage.minDate") + "bắt đầu"}
                        minDate={new Date(item?.startTime)}
                        maxDate={new Date()}
                        maxDateMessage={t("validateMessage.maxDate") + "hiện tại"}
                        invalidDateMessage={"Ngày không hợp lệ"}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextValidator
                        fullWidth
                        // disabled
                        label={
                          <span>
                            GRT
                            <span hidden={isView} style={{ color: "red" }}>*</span>
                          </span>
                        }
                        type="text"
                        name="grt"
                        value={item?.grt || ''}
                        defaultValue={item?.grt}
                        onChange={(e) => { handleChange(e, index); }}
                        disabled={isView}
                        validators={!isView ? ["required", "isNumber"] : []}
                        errorMessages={!isView ? [t("general.required"), "GRT " + t("validateMessage.isNumber")] : []}
                      />
                    </Grid>
                  </Grid>
                  <Grid xs={12} container spacing={1} className="mb-8">
                    <Grid item xs={4}>
                      <TextValidator
                        fullWidth
                        label={
                          <span>
                            DWT
                            <span hidden={isView} style={{ color: "red" }}>*</span>
                          </span>
                        }
                        type="text"
                        name="dwt"
                        value={item?.dwt || ''}
                        validators={!isView ? ["required", "isNumber"] : []}
                        errorMessages={!isView ? [t("general.required"), "DWT " + t("validateMessage.isNumber")] : []}
                        onChange={(e) => { handleChange(e, index); }}
                        disabled={isView}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextValidator
                        fullWidth
                        label={
                          <span>
                            M/E Make/Model
                            <span hidden={isView} style={{ color: "red" }}>*</span>
                          </span>
                        }
                        type="text"
                        name="model"
                        value={item?.model || ''}
                        onChange={(e) => { handleChange(e, index); }}
                        disabled={isView}
                        validators={!isView ? ["required"] : []}
                        errorMessages={!isView ? [t("general.required")] : []}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextValidator
                        fullWidth
                        label={
                          <span>
                            M/E BHP
                            <span hidden={isView} style={{ color: "red" }}>*</span>
                          </span>
                        }
                        type="text"
                        name="bhp"
                        value={item?.bhp || ''}
                        onChange={(e) => { handleChange(e, index); }}
                        disabled={isView}
                        validators={!isView ? ["required", "isNumber"] : []}
                        errorMessages={!isView ? [t("general.required"), "M/E BHP " + t("validateMessage.isNumber")] : []}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </div>
          );
        })}


      {
        viewOnly ? null :
          <Grid container sm={12} justifyContent="center" className="mt-10 pr-16">
            <Button
              variant="contained"
              className="mb-8 mr-12"
              disabled={loading}
              color="secondary"
              onClick={() => handleAdd()}>
              {t("general.add")}
            </Button>
            <Button
              variant="contained"
              color="primary"
              disabled={loading}
              type="submit"
              className=" mb-8">
              {t("general.save")}
            </Button>
          </Grid>
      }
    </ValidatorForm >
  </div >;
}

export default Experience;

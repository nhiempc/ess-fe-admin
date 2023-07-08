import React, { Component } from "react";
import {
  Button,
  Grid,
  InputLabel,
  FormControl,
  MenuItem,
  Select,
  Card,
  CardHeader,
  CardContent,
  Tooltip,
} from "@material-ui/core";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { toast } from "react-toastify";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import { addNationalUnit, addPreviousUnit, addUnitInfo, deleteNationalUnit, getNationalUnit, getPreviousUnit, removeUnit } from "../SailorService";
import { useTranslation } from "react-i18next";
import { searchByPage as searchNation } from "app/views/Nation/NationService";
import { useState, useEffect } from "react";
import { ConfirmationDialog } from "egret";

function UnitInfor(props) {
  const { dataSailor } = props
  const [idDelete, setIdDelete] = useState('')
  const [shouldOpenDeleteDialog, setShouldOpenDeleteDialog] = useState(false)
  let { t } = useTranslation();
  const [unitInfo, setUnitInfo] = useState({
    itemList: [],
    nationality: {},
    multinationalShip: ''
  })
  const [loading, setLoading] = useState(false)
  const [nationList, setNationList] = useState([])
  const [viewOnly, setViewOnly] = useState(dataSailor.viewOnly)
  const [page, setPage] = useState(0)

  useEffect(() => {
    getNationList()

    if (dataSailor?.id) {
      getPrevUnitList(dataSailor.id);
    } else {
      handleAdd();
    }

    addRuleValidation()

    return (() => removeValidationRule())

  }, [dataSailor?.id])

  const handleAdd = () => {
    let item = {
      name: null,
      personInCharge: null,
      phone: null,
      fax: null,
      email: null,
      sailorId: ''
    };
    unitInfo.itemList.push(item);
    setUnitInfo({ ...unitInfo, itemList: unitInfo.itemList });
  };

  const getPrevUnitList = async () => {
    await getPreviousUnit(dataSailor.id)
      .then(({ data }) => {
        if (data?.data.length === 0) {
          handleAdd()
        }
        else {
          unitInfo.itemList = data?.data
          setUnitInfo({ ...unitInfo, itemList: unitInfo.itemList })
        }
      })
      .catch((err) => {
        toast.error(err)
      })

    await getNationalUnit(dataSailor.id)
      .then(({ data }) => {
        unitInfo.nationality = data.data
        if(data.data != null) {
          setUnitInfo({ ...unitInfo, nationality: unitInfo.nationality, multinationalShip: true })
        }
      })
  };

  const getNationList = () => {
    let searchObject = {};
    searchObject.keyword = "";
    searchObject.pageIndex = page + 1;
    searchObject.pageSize = 999;
    searchNation(searchObject).then(({ data }) => setNationList([...data.content]))
  }

  const addRuleValidation = () => {
    let isPhone = new RegExp(/(84|0[3|5|7|8|9])+([0-9]{8})/);
    let emailValid = new RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
    let isName = new RegExp(/^[a-zA-Z _ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]*$/);
    ValidatorForm.addValidationRule("isName", (value) => {
      return isName.test(value);
    });
    ValidatorForm.addValidationRule("isPhone", (value) => {
      if (value === null) {
        return true;
      }
      return isPhone.test(value);
    });
    ValidatorForm.addValidationRule("emailValid", (value) => {
      if (value === '') {
        return true;
      }
      return emailValid.test(value);
    });
  }

  const removeValidationRule = () => {
    ValidatorForm.removeValidationRule("isName");
    ValidatorForm.removeValidationRule("isPhone");
    ValidatorForm.removeValidationRule("emailValid");
  }

  const handleDelete = (idDelete) => {
    setIdDelete(idDelete)
    setShouldOpenDeleteDialog(true)
  };

  const handleChangeList = (event, index, source) => {
    let item = unitInfo?.itemList[index];
    item[event.target?.name] = event.target?.value;
    setUnitInfo({ ...unitInfo, itemList: unitInfo.itemList })
  }

  const handleChange = (event) => {
    if (event.target.name == 'multinationalShip' && event.target.value === false) {
      unitInfo.nationality = null
      setUnitInfo({ ...unitInfo, nationality: unitInfo.nationality })
    }
    setUnitInfo({ ...unitInfo, [event.target.name]: event.target.value })
  }

  const handleChangeAutoComplete = (value, source) => {
    setUnitInfo({
      ...unitInfo,
      [source]: value
    });
  };

  const handleConfirmDelete = () => {
    if (unitInfo?.itemList[idDelete]?.id) {
      removeUnit(unitInfo.itemList[idDelete].id)
        .then(({ data }) => {
          toast.success(t("general.deleteSuccess"))
          unitInfo.itemList.splice(idDelete, 1)
          setShouldOpenDeleteDialog(false)
          getPrevUnitList(dataSailor.id)
        })
        .catch((err) => {
          toast.error(err)
        })
    } else {
      unitInfo.itemList.splice(idDelete, 1)
      setShouldOpenDeleteDialog(false)
    }
  };

  const handleSubmit = async () => {
    setLoading(true)
    if (unitInfo?.nationality?.id) {
      await addNationalUnit(dataSailor.id, unitInfo.nationality?.id)
    } else {
      await deleteNationalUnit(dataSailor.id)
    }

    await addPreviousUnit(unitInfo.itemList, dataSailor.id)
      .then((res) => {
        if (res.data.code === 200) {
          toast.success(t("general.addSuccess"))
          setUnitInfo({ ...unitInfo, itemList: res.data.data })
        } else toast.error(res.data.message)
        setLoading(false)
      })
      .catch(err => {
        toast.error(err.response.data.message)
        setLoading(false)
      })
    
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
      <Card elevation={5} className="mb-4">
        <CardContent>
          <Grid
            xs={12}
            ms={12}
            container
            spacing={2}
            className="mb-8">
            <Grid item xs={4}>
              <FormControl fullWidth={true}>
                <InputLabel htmlFor="visa-option">
                  Đã làm việc đa quốc gia
                </InputLabel>
                <Select
                  value={unitInfo?.multinationalShip}
                  inputProps={{ name: "multinationalShip", id: "multinational-worked", }}
                  readOnly={viewOnly}
                  onChange={(e) => handleChange(e)}
                >
                  <MenuItem value={true}>
                    {t("Yes")}
                  </MenuItem>
                  <MenuItem value={false}>
                    {t("No")}
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <Autocomplete
                fullWidth
                onChange={
                  (e, newOption) => handleChangeAutoComplete(newOption, "nationality")
                }
                getOptionLabel={(option) => option.name}
                readOnly={viewOnly}
                disabled={!unitInfo?.multinationalShip}
                options={nationList}
                value={unitInfo?.nationality}
                renderInput={(params) =>
                  viewOnly ?
                    <TextValidator
                      {...params}
                      label={
                        <span>
                          "Quốc Gia"
                          <span hidden={!unitInfo?.multinationalShip} style={{ color: "red" }}>*</span>
                        </span>
                      }
                      disabled={!unitInfo?.multinationalShip}
                      value={unitInfo?.nationality}
                      InputProps={{ readOnly: viewOnly }}
                    />
                    :
                    <TextValidator
                      {...params}
                      label={
                        <span>
                          Quốc Gia
                          <span hidden={!unitInfo?.multinationalShip} style={{ color: "red" }}>*</span>
                        </span>
                      }
                      disabled={!unitInfo?.multinationalShip}
                      value={unitInfo?.nationality}
                      validators={unitInfo?.multinationalShip && ["required"]}
                      errorMessages={unitInfo?.multinationalShip && [t("general.required")]}
                    />
                }
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardContent>
          <h5>Thông tin đơn vị trước đây:</h5>
        </CardContent>

      </Card>
      {unitInfo?.itemList?.map((item, index) => {
        return (
          <div
            id={index}
            key={index}
            className={index !== 0 ? "mt-10" : ""}>
            <Card elevation={5}>
              <CardHeader
                className="pb-0"
                titleTypographyProps={{
                  variant: "subtitle1",
                  className: "text-info",
                  style: { fontWeight: 500 }
                }}
                title={"Đơn vị " + (index + 1) + ":"}
                action={
                  viewOnly ? null : (
                    <Grid
                      container
                      xs={12}
                      justifyContent="flex-end">
                      <Tooltip title="Xóa đơn vị" placement="top">
                        <IconButton
                          size="small"
                          className="mr-8">
                          <CloseIcon
                            variant="contained"
                            color="error"
                            fontSize="small"
                            onClick={() => handleDelete(index)}
                          />
                        </IconButton>
                      </Tooltip >
                    </Grid>
                  )
                }
              />
              <CardContent>
                <Grid xs={12} container spacing={1} className="mb-8">
                  <Grid item xs={4}>
                    <TextValidator
                      fullWidth
                      multiline
                      label={
                        <span>
                          Tên đơn vị
                          <span style={{ color: "red" }}>*</span>
                        </span>
                      }
                      type="text"
                      name="name"
                      value={item?.name}
                      onChange={(e) => handleChangeList(e, index)}
                      validators={["required"]}
                      errorMessages={[t("general.required")]}
                      inputProps={{ readOnly: viewOnly, }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextValidator
                      fullWidth
                      multiline
                      label="Người phụ trách"
                      type="text"
                      name="personInCharge"
                      value={item?.personInCharge}
                      onChange={(e) => handleChangeList(e, index)}
                      validators={item?.personInCharge && ["isName", "maxStringLength:255"]}
                      errorMessages={[t("validateMessage.wrongFormat"), t("general.maxLength255")]}
                      inputProps={{ readOnly: viewOnly, }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextValidator
                      fullWidth
                      multiline
                      label="Điện thoại"
                      type="text"
                      name="phone"
                      value={item?.phone || null}
                      onChange={(e) => handleChangeList(e, index)}
                      validators={["isPhone"]}
                      errorMessages={[t("general.phoneRegex"),]}
                      inputProps={{ readOnly: viewOnly, }}
                    />
                  </Grid>
                </Grid>
                <Grid xs={12} container spacing={1}>
                  <Grid item xs={4}>
                    <TextValidator
                      fullWidth
                      multiline
                      label="Fax"
                      type="number"
                      name="fax"
                      value={item?.fax || null}
                      onChange={(e) => handleChangeList(e, index)}
                      inputProps={{ readOnly: viewOnly }}
                    />
                  </Grid>
                  <Grid item xs={4}>
                    <TextValidator
                      fullWidth
                      multiline
                      label="Email"
                      type="text"
                      name="email"
                      value={item?.email || ''}
                      onChange={(e) => handleChangeList(e, index)}
                      validators={["emailValid", "maxStringLength:255"]}
                      errorMessages={[t("general.isEmail"), t("general.maxLength255"),]}
                      inputProps={{ readOnly: viewOnly, }}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </div>
        );
      }
      )}
      {viewOnly ? null : (
        <Grid
          container
          sm={12}
          justifyContent="center"
          className="mt-10 pr-16">
          <Button
            variant="contained"
            color="secondary"
            disabled={loading}
            className="mb-8 mr-12"
            onClick={() => handleAdd()}>
            {t("general.add")}
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={loading}
            type="submit"
            className="mb-8">
            {t("general.save")}
          </Button>
        </Grid>
      )}
    </ValidatorForm>
  </div>;
}

export default UnitInfor;



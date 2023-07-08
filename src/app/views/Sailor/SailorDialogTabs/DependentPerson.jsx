import React, { Component, useEffect } from "react";
import {
  Button,
  Grid,
  MenuItem,
  Card,
  CardHeader,
  IconButton,
  CardContent,
} from "@material-ui/core";
import { ValidatorForm, TextValidator } from "react-material-ui-form-validator";
import { addDependent, getDependentByIdSailor, removeDependent, searchByPage } from "../SailorService";
import { toast } from "react-toastify";
import moment from "moment";
import CloseIcon from "@material-ui/icons/Close";
import ValidatePicker from "../../Component/ValidateSelect/ValidatePicker";
import SelectValidator from "../../Component/ValidateSelect/ValidateSelect";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { ConfirmationDialog } from "egret";

function DependentPerson(props) {
  let { t } = useTranslation();
  let { id, dataSailor } = props
  const [idDelete, setIdDelete] = useState('')
  const [loading, setLoading] = useState(false)
  const [viewOnly, setViewOnly] = useState(dataSailor.viewOnly)
  const [shouldOpenDeleteDialog, setShouldOpenDeleteDialog] = useState(false)
  const [depsPerson, setDepsPerson] = useState({
    itemList: [],
    page: 0,
  })

  useEffect(() => {
    if (dataSailor?.id) {
      getDataList(dataSailor.id);
    } else {
      handleAdd();
    }

    addValidationRule();

    return () => {
      removeValidationRule();
    }
  }, [])

  const addValidationRule = () => {
    let isName = new RegExp(/^[a-zA-Z _ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễếệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ]*$/);
    ValidatorForm.addValidationRule("isName", (value) => {
      return isName.test(value);
    });
  }

  const removeValidationRule = () => {
    ValidatorForm.removeValidationRule("isName");
  }

  let relationShipList = [
    { id: "1", name: "Vợ" },
    { id: "2", name: "Chồng" },
    { id: "3", name: "Con" },
    { id: "4", name: "Bố mẹ" },
    { id: "5", name: "Ông bà" },
    { id: "6", name: "Khác" },
  ]

  const getDataList = (id) => {
    getDependentByIdSailor(id)
      .then(({ data }) => {
        if (data?.data.length === 0) {
          handleAdd();
        } else {
          depsPerson.itemList = data.data
          setDepsPerson({ ...depsPerson, itemList: depsPerson.itemList })
        }
      })
      .catch(err => toast.error(err))
  }
  const handleAdd = () => {
    let item = {
      name: "",
      birthday: null,
      relationship: "",
      error: false,
    };
    depsPerson.itemList.push(item);
    setDepsPerson({ ...depsPerson, itemList: depsPerson.itemList });
  };

  const handleDelete = (idDelete) => {
    setIdDelete(idDelete)
    setShouldOpenDeleteDialog(true)
  };

  const handleChange = (event, index, source) => {
    let item = depsPerson.itemList[index];
    if (source) {
      item[source] = event;
    } else {
      item[event.target?.name] = event.target?.value;
      if (event.target.name === 'name') {
        item.error = !event.target?.value;
      }
    }
    setDepsPerson({ ...depsPerson, itemList: depsPerson.itemList });
  };

  const handleConfirmDelete = () => {
    if (depsPerson?.itemList[idDelete]?.id) {
      removeDependent(depsPerson.itemList[idDelete].id)
        .then(({ data }) => {
          toast.success(t("general.deleteSuccess"))
          depsPerson.itemList.splice(idDelete, 1)
          setShouldOpenDeleteDialog(false)
          getDataList(dataSailor.id)
        })
        .catch((err) => {
          toast.error(err)
        })
    } else {
      depsPerson.itemList.splice(idDelete, 1)
      setShouldOpenDeleteDialog(false)
    }
  };

  const handleSubmit = () => {
    setLoading(true)
    addDependent(depsPerson.itemList, dataSailor.id)
      .then(({ data }) => {
        if (data.code === 200) {
          toast.success(t("general.addSuccess"));
          getDataList(dataSailor.id)
        } else { 
          toast.warning(data.message)
        }
        setLoading(false)
      })
      .catch((err) => {
        toast.error(t("general.error"));
        toast.error(err.response.data.message)
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
      {depsPerson.itemList?.map((item, index) => {
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
                title={"Người phụ thuộc " + (index + 1) + ":"}
                action={viewOnly ? null :
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
              <CardContent>
                <Grid sm={12} container spacing={1}>
                  <Grid item sm={4}>
                    <TextValidator
                      fullWidth
                      label={
                        <span>
                          {t("Sailor.dependentName")}
                          <span style={{ color: "red" }}>
                            *
                          </span>
                        </span>
                      }
                      multiline
                      type="text"
                      name="name"
                      value={item?.name}
                      inputProps={{ readOnly: viewOnly }}
                      onChange={(e) => handleChange(e, index)}
                      validators={["required", "maxStringLength:255", "isName"]}
                      errorMessages={[
                        t("general.required"),
                        t("general.maxLength255"),
                        t("general.stringOnly")]}
                    />
                  </Grid>
                  <Grid item sm={4} >
                    <SelectValidator
                      fullWidth
                      className="pt-4"
                      label={
                        <span>
                          {t("Sailor.relationship")}
                          <span style={{ color: "red" }}>
                            *
                          </span>
                        </span>
                      }
                      name="relationship"
                      id="relationship"
                      value={item.relationship}
                      onChange={
                        (e) =>
                          handleChange(e, index)
                      }
                      inputProps={{ readOnly: viewOnly }}
                      validators={["required",]}
                      errorMessages={[t("general.required"),]}
                      renderInput={(params) =>
                        viewOnly ?
                          <TextValidator
                            {...params}
                            fullWidth
                            label={
                              <span>
                                {t("Sailor.relationship")}
                                <span style={{ color: "red" }}>*</span>
                              </span>
                            }
                            inputProps={{ readOnly: viewOnly }}
                          />
                          :
                          <TextValidator
                            {...params}
                            fullWidth
                            value={item?.relationship}
                            label={
                              <span>
                                {t("Sailor.relationship")}
                                <span style={{ color: "red" }}>*</span>
                              </span>
                            }
                            inputProps={{ readOnly: viewOnly }}
                            validators={["required"]}
                            errorMessages={[t("general.required")]}
                          />
                      }
                    >
                      {relationShipList?.map(
                        (item) => {
                          return (
                            <MenuItem
                              key={item?.id}
                              value={item?.id}>
                              {item?.name}
                            </MenuItem>
                          );
                        }
                      )}
                    </SelectValidator>
                  </Grid>
                  <Grid item sm={4}>
                    <ValidatePicker
                      className="m-0"
                      fullWidth
                      format="dd/MM/yyyy"
                      margin="normal"
                      id="birthday"
                      name="birthday"
                      label="Ngày sinh"
                      placeholder="dd/mm/yyyy"
                      inputProps={{ readOnly: viewOnly }}
                      value={item?.birthday || null}
                      onChange={(e) => handleChange(e, index, "birthday")}
                      readOnly={viewOnly}
                      KeyboardButtonProps={{ "aria-label": "change date", }}
                      minDate={new Date('01/01/1900')}
                      minDateMessage={t('validateMessage.minDate') + '01/01/1900'}
                      maxDate={new Date()}
                      maxDateMessage={t('validateMessage.maxDate') + "hiện tại"}
                      invalidDateMessage={t('validateMessage.invalidDate')}
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </div>
        );
      })}
      {viewOnly ? null :
        <Grid container sm={12} justifyContent="center" className="mt-10 pr-16">
          <Button
            variant="contained"
            disabled={loading}
            color="secondary"
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
        </Grid>}
    </ValidatorForm>

  </div>;
}

export default DependentPerson;
